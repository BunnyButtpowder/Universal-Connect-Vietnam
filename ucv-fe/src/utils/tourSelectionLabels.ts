import type { CustomizeOption, TourFull } from '@/lib/api';
import {
    isCitySegmentOption,
    isFullTourOption
} from '@/types/signup';

const LEGACY_KEY_CITIES: Record<string, string[]> = {
    northern: ['Hai Phong', 'Hanoi'],
    hanoiHaiDuong: ['Hanoi', 'Hai Duong'],
    central: ['Da Nang', 'Hue'],
    hueDaNang: ['Hue', 'Da Nang'],
    southern: ['Ho Chi Minh City'],
    hcmc: ['Ho Chi Minh City']
};

const LEGACY_SEGMENT_LABELS: Record<string, string> = {
    hanoiHaiDuong: 'Hanoi & Hai Duong',
    hueDaNang: 'Hue & Da Nang',
    hcmc: 'Ho Chi Minh City',
    northern: 'Northern Vietnam',
    central: 'Central Vietnam',
    southern: 'Southern Vietnam',
    grandTotal: 'Full Tour',
    Full: 'Full Tour'
};

const LEGACY_CITY_SEGMENT_KEYS = new Set([
    'grandTotal',
    'Full',
    'northern',
    'central',
    'southern',
    'hanoiHaiDuong',
    'hueDaNang',
    'hcmc'
]);

const CITY_NAME_ALIASES: Record<string, string> = {
    hcmc: 'HCMC',
    'ho chi minh city': 'HCMC',
    'ho chi minh': 'HCMC',
    saigon: 'HCMC',
    hanoi: 'Ha Noi',
    'ha noi': 'Ha Noi',
    'hai phong': 'Hai Phong',
    'hai duong': 'Hai Duong',
    'da nang': 'Da Nang',
    hue: 'Hue'
};

function normalizeCityName(raw: string): string {
    const name = raw.trim().replace(/\s+/g, ' ');
    return CITY_NAME_ALIASES[name.toLowerCase()] || name;
}

function canonicalizeAgainstTourCities(
    name: string,
    tourCities: TourFull['cities']
): string {
    const normalized = normalizeCityName(name);
    if (!tourCities?.length) return normalized;

    const lower = normalized.toLowerCase();
    const exact = tourCities.find((c) => c.name.toLowerCase() === lower);
    if (exact) return exact.name;

    const partial = tourCities.find((c) => {
        const tourName = c.name.toLowerCase();
        return tourName.includes(lower) || lower.includes(tourName);
    });
    return partial?.name || normalized;
}

function isPlausibleCityName(name: string): boolean {
    if (!name || name.length > 40) return false;
    return !/counsellor|network|school|drink|food|event|int'l|international/i.test(name);
}

function filterToKnownTourCities(
    cityNames: string[],
    tour?: TourFull | null
): string[] {
    const tourCities = tour?.cities ?? [];
    if (!tourCities.length) {
        return cityNames.filter(isPlausibleCityName);
    }

    const allowed = new Set(
        tourCities.map((c) => c.name.toLowerCase())
    );

    const result: string[] = [];
    for (const name of cityNames) {
        const canonical = canonicalizeAgainstTourCities(name, tourCities);
        if (!isPlausibleCityName(canonical)) continue;
        if (!allowed.has(canonical.toLowerCase())) continue;
        if (!result.some((c) => c.toLowerCase() === canonical.toLowerCase())) {
            result.push(canonical);
        }
    }
    return result;
}

export function parseCitiesFromOptionDescription(description?: string): string[] {
    if (!description?.trim()) return [];

    let text = description.trim().replace(/\([^)]*\)/g, ' ').trim();
    if (/^all\s+\d+\s+cities/i.test(text) || /^all\s+cities/i.test(text)) {
        return [];
    }

    return text
        .split(/\s*[-–—]\s*|\s*,\s*|\s+&\s+|\s+and\s+/i)
        .map((part) => part.trim())
        .filter((part) => part.length > 1 && !/^(incl|including|all\s+\d+)/i.test(part));
}

export function resolveCitiesForOption(
    option: CustomizeOption,
    tour?: TourFull | null
): string[] {
    const tourCities = tour?.cities ?? [];

    if (isFullTourOption(option)) {
        return tourCities.map((c) => c.name).filter(Boolean);
    }

    const fromDescription = parseCitiesFromOptionDescription(option.description);
    if (fromDescription.length > 0) {
        return filterToKnownTourCities(
            fromDescription.map((city) => canonicalizeAgainstTourCities(city, tourCities)),
            tour
        );
    }

    return [];
}

function dedupeCityNames(names: string[]): string[] {
    const result: string[] = [];
    for (const name of names) {
        const normalized = normalizeCityName(name);
        if (!normalized) continue;
        if (!result.some((c) => c.toLowerCase() === normalized.toLowerCase())) {
            result.push(normalized);
        }
    }
    return result;
}

function orderSelectedCitySegmentKeys(
    selectedKeys: string[],
    customizeOptions: CustomizeOption[]
): string[] {
    const cityOptions = customizeOptions.filter(isCitySegmentOption);
    const ordered = cityOptions
        .map((opt) => opt.key)
        .filter((key) => selectedKeys.includes(key));
    const remaining = selectedKeys.filter(
        (key) => !ordered.includes(key) && LEGACY_CITY_SEGMENT_KEYS.has(key)
    );
    return [...ordered, ...remaining];
}

function isCitySelectionChecked(value: boolean | string | undefined): boolean {
    return value === true || value === 'true';
}

/**
 * "Hai Phong, Hanoi, … (Northern & Central Cities)" — chỉ 3 gói thành phố.
 */
export function buildSelectedCityNamesLabel(
    citySelections: Record<string, boolean>,
    tour?: TourFull | null
): string {
    const selectedKeys = Object.keys(citySelections).filter((key) =>
        isCitySelectionChecked(citySelections[key] as boolean | string | undefined)
    );
    if (selectedKeys.length === 0) return 'None selected';

    const options = tour?.customizeOptions ?? [];
    const groups: string[] = [];

    for (const key of orderSelectedCitySegmentKeys(selectedKeys, options)) {
        const option = options.find((opt) => opt.key === key);

        if (option && !isCitySegmentOption(option)) {
            continue;
        }
        if (!option && !LEGACY_CITY_SEGMENT_KEYS.has(key)) {
            continue;
        }

        let segmentCities: string[] = [];
        let segmentName = '';

        if (option) {
            segmentCities = resolveCitiesForOption(option, tour);
            segmentName = option.name;
        } else if (LEGACY_KEY_CITIES[key]) {
            segmentCities = filterToKnownTourCities([...LEGACY_KEY_CITIES[key]], tour);
            segmentName = LEGACY_SEGMENT_LABELS[key];
        } else if (
            (key === 'grandTotal' || key === 'Full') &&
            tour?.cities?.length
        ) {
            segmentCities = tour.cities.map((c) => c.name);
            segmentName = LEGACY_SEGMENT_LABELS[key] || 'Full Tour';
        } else {
            continue;
        }

        const cityList = dedupeCityNames(segmentCities);
        if (cityList.length === 0) {
            if (segmentName) {
                groups.push(segmentName);
            }
            continue;
        }

        groups.push(`${cityList.join(', ')} (${segmentName})`);
    }

    if (groups.length > 0) {
        return groups.join(', ');
    }

    return buildSelectedTourSegmentsLabel(citySelections, tour);
}

/** Chỉ tên thành phố (không kèm segment) — dùng trong dòng sản phẩm Invoice .docx */
export function buildFlatSelectedCityNamesForInvoice(
    citySelections: Record<string, boolean>,
    tour?: TourFull | null
): string {
    const selectedKeys = Object.keys(citySelections).filter((key) =>
        isCitySelectionChecked(citySelections[key] as boolean | string | undefined)
    );
    if (selectedKeys.length === 0) return 'None selected';

    const options = tour?.customizeOptions ?? [];
    const cityNames: string[] = [];

    for (const key of orderSelectedCitySegmentKeys(selectedKeys, options)) {
        const option = options.find((opt) => opt.key === key);

        if (option && !isCitySegmentOption(option)) continue;
        if (!option && !LEGACY_CITY_SEGMENT_KEYS.has(key)) continue;

        if (option) {
            const resolved = resolveCitiesForOption(option, tour);
            if (resolved.length === 0 && isFullTourOption(option)) {
                const normalized = normalizeCityName(option.name);
                if (
                    normalized &&
                    !cityNames.some((c) => c.toLowerCase() === normalized.toLowerCase())
                ) {
                    cityNames.push(normalized);
                }
            } else {
                for (const city of resolved) {
                    const normalized = normalizeCityName(city);
                    if (
                        normalized &&
                        !cityNames.some((c) => c.toLowerCase() === normalized.toLowerCase())
                    ) {
                        cityNames.push(normalized);
                    }
                }
            }
        } else if (LEGACY_KEY_CITIES[key]) {
            for (const city of filterToKnownTourCities([...LEGACY_KEY_CITIES[key]], tour)) {
                if (!cityNames.some((c) => c.toLowerCase() === city.toLowerCase())) {
                    cityNames.push(city);
                }
            }
        } else if (
            (key === 'grandTotal' || key === 'Full') &&
            tour?.cities?.length
        ) {
            for (const c of tour.cities) {
                if (!cityNames.some((x) => x.toLowerCase() === c.name.toLowerCase())) {
                    cityNames.push(c.name);
                }
            }
        }
    }

    if (cityNames.length > 0) {
        return cityNames.join(', ');
    }

    return buildSelectedTourSegmentsLabel(citySelections, tour);
}

function toVietnameseSegmentName(option: CustomizeOption): string {
    const key = option.key.toLowerCase();
    const name = option.name.toLowerCase();

    if (/full/.test(key) || /full\s*tour/.test(name)) {
        return 'Trọn gói';
    }
    if (/nothern\/central|northern/.test(key) || /northern.*central|northern\s*&\s*central/.test(name)) {
        return 'Miền Bắc & Miền Trung';
    }
    if (/central\/south/.test(key) || /central.*southern|central\s*&\s*southern/.test(name)) {
        return 'Miền Trung & Miền Nam';
    }
    if (/counsellor\s*connect.*hanoi/.test(key) || /counsellor\s*connect.*hanoi/.test(name)) {
        return 'Kết nối tư vấn viên Hà Nội';
    }
    if (
        /counsellor\s*connect.*hcmc/.test(key) ||
        /counsellor\s*connect.*hcmc/.test(name)
    ) {
        return 'Kết nối tư vấn viên TP.HCM';
    }
    return option.name;
}

function buildSelectedSegmentNames(
    citySelections: Record<string, boolean>,
    tour?: TourFull | null,
    translate?: (option: CustomizeOption) => string
): string {
    const selectedKeys = Object.keys(citySelections).filter((key) =>
        isCitySelectionChecked(citySelections[key] as boolean | string | undefined)
    );
    if (selectedKeys.length === 0) return 'None selected';

    const options = tour?.customizeOptions ?? [];
    const orderedKeys = options
        .map((opt) => opt.key)
        .filter((key) => selectedKeys.includes(key));
    const remaining = selectedKeys.filter((key) => !orderedKeys.includes(key));
    const finalKeys = [...orderedKeys, ...remaining];

    const names: string[] = [];
    for (const key of finalKeys) {
        const option = options.find((opt) => opt.key === key);
        if (option) {
            names.push(translate ? translate(option) : option.name);
            continue;
        }
        names.push(LEGACY_SEGMENT_LABELS[key] || key);
    }

    const unique = [...new Set(names.filter(Boolean))];
    return unique.length > 0 ? unique.join(', ') : 'None selected';
}

/** Danh sách tên segment đã chọn (bao gồm Counsellor Connect), bản tiếng Anh */
export function buildSelectedTourSegmentsLabel(
    citySelections: Record<string, boolean>,
    tour?: TourFull | null
): string {
    return buildSelectedSegmentNames(citySelections, tour);
}

/** Danh sách tên segment đã chọn (bao gồm Counsellor Connect), bản tiếng Việt */
export function buildSelectedTourSegmentsLabelVi(
    citySelections: Record<string, boolean>,
    tour?: TourFull | null
): string {
    return buildSelectedSegmentNames(citySelections, tour, toVietnameseSegmentName);
}
