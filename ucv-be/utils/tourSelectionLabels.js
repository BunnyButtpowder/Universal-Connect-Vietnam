const LEGACY_SEGMENT_LABELS = {
    hanoiHaiDuong: 'Hanoi & Hai Duong',
    hueDaNang: 'Hue & Da Nang',
    hcmc: 'Ho Chi Minh City',
    northern: 'Northern Vietnam',
    central: 'Central Vietnam',
    southern: 'Southern Vietnam',
    grandTotal: 'Full Tour'
};

const LEGACY_KEY_CITIES = {
    northern: ['Hai Phong', 'Hanoi'],
    hanoiHaiDuong: ['Hanoi', 'Hai Duong'],
    central: ['Da Nang', 'Hue'],
    hueDaNang: ['Hue', 'Da Nang'],
    southern: ['Ho Chi Minh City'],
    hcmc: ['Ho Chi Minh City']
};

const LEGACY_CITY_SEGMENT_KEYS = new Set([
    'grandTotal',
    'northern',
    'central',
    'southern',
    'hanoiHaiDuong',
    'hueDaNang',
    'hcmc'
]);

const CITY_NAME_ALIASES = {
    hcmc: 'HCMC',
    'ho chi minh city': 'HCMC',
    'ho chi minh': 'HCMC',
    saigon: 'HCMC',
    hanoi: 'Ha Noi',
    'ha noi': 'Ha Noi',
    'hai duong': 'Hai Duong',
    'hai phong': 'Hai Phong',
    'da nang': 'Da Nang',
    hue: 'Hue'
};

function formatOptionKey(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/[_-]+/g, ' ')
        .replace(/^./, (char) => char.toUpperCase())
        .trim();
}

function isFullTourOption(option) {
    if (!option) return false;
    return (
        option.key === 'grandTotal' ||
        option.key === 'Full' ||
        /^full$/i.test(option.key || '') ||
        /full\s*tour/i.test(option.name || '')
    );
}

function isNorthernCentralOption(option) {
    if (!option) return false;
    return (
        /northern.*central|northern\s*&\s*central/i.test(option.name || '') ||
        option.key === 'northern'
    );
}

function isCentralSouthernOption(option) {
    if (!option) return false;
    return (
        /central.*southern|central\s*&\s*southern/i.test(option.name || '') ||
        option.key === 'Central/South' ||
        (option.key === 'central' && !/counsellor|counselor/i.test(option.name || ''))
    );
}

function isNorthernCentralLegacyOption(option) {
    if (!option) return false;
    return (
        option.key === 'Nothern/Central' ||
        option.key === 'northern' ||
        /northern.*central|northern\s*&\s*central/i.test(option.name || '')
    );
}

function isSouthernRegionalOption(option) {
    if (!option) return false;
    return option.key === 'southern' || /southern vietnam/i.test(option.name || '');
}

function isCounsellorConnectOption(option) {
    if (!option) return false;
    const key = option.key || '';
    const name = option.name || '';
    return (
        /counsellor\s*connect|counselor\s*breakfast/i.test(name) ||
        /counsellor\s*connect|counselor\s*breakfast/i.test(key)
    );
}

/** Chỉ 3 gói thành phố (+ legacy) — không gồm Counsellor Connect */
function isCitySegmentOption(option) {
    if (!option || isCounsellorConnectOption(option)) return false;
    return (
        isFullTourOption(option) ||
        isNorthernCentralOption(option) ||
        isCentralSouthernOption(option) ||
        isNorthernCentralLegacyOption(option) ||
        isSouthernRegionalOption(option)
    );
}

function isLegacyCitySegmentKey(key) {
    return LEGACY_CITY_SEGMENT_KEYS.has(key);
}

function normalizeCityName(raw) {
    if (!raw || typeof raw !== 'string') return '';
    const name = raw.trim().replace(/\s+/g, ' ');
    const alias = CITY_NAME_ALIASES[name.toLowerCase()];
    return alias || name;
}

function canonicalizeAgainstTourCities(name, tourCities) {
    const normalized = normalizeCityName(name);
    if (!normalized || !tourCities?.length) return normalized;

    const lower = normalized.toLowerCase();
    const exact = tourCities.find((c) => (c.name || '').toLowerCase() === lower);
    if (exact?.name) return exact.name;

    const partial = tourCities.find((c) => {
        const tourName = (c.name || '').toLowerCase();
        return tourName.includes(lower) || lower.includes(tourName);
    });
    return partial?.name || normalized;
}

function isPlausibleCityName(name) {
    if (!name || name.length > 40) return false;
    if (/counsellor|network|school|drink|food|event|int'l|international/i.test(name)) {
        return false;
    }
    return true;
}

function filterToKnownTourCities(cityNames, tourData) {
    const tourCities = tourData?.cities || [];
    if (!tourCities.length) {
        return cityNames.filter(isPlausibleCityName);
    }

    const allowed = new Set(
        tourCities.map((c) => (c.name || '').toLowerCase()).filter(Boolean)
    );

    const result = [];
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

function parseCitiesFromOptionDescription(description) {
    if (!description || typeof description !== 'string') return [];

    let text = description.trim().replace(/\([^)]*\)/g, ' ').trim();
    if (!text) return [];

    if (/^all\s+\d+\s+cities/i.test(text) || /^all\s+cities/i.test(text)) {
        return [];
    }

    return text
        .split(/\s*[-–—]\s*|\s*,\s*|\s+&\s+|\s+and\s+/i)
        .map((part) => part.trim())
        .filter((part) => part.length > 1 && !/^(incl|including|all\s+\d+)/i.test(part));
}

function resolveCitiesForOption(option, tourData) {
    const tourCities = tourData?.cities || [];

    if (isFullTourOption(option)) {
        return tourCities.map((c) => c.name).filter(Boolean);
    }

    const fromDescription = parseCitiesFromOptionDescription(option.description);
    if (fromDescription.length > 0) {
        return filterToKnownTourCities(
            fromDescription.map((city) => canonicalizeAgainstTourCities(city, tourCities)),
            tourData
        );
    }

    return [];
}

function dedupeCityNames(names) {
    const result = [];
    for (const name of names) {
        const normalized = normalizeCityName(name);
        if (!normalized) continue;
        const exists = result.some((c) => c.toLowerCase() === normalized.toLowerCase());
        if (!exists) result.push(normalized);
    }
    return result;
}

function orderSelectedKeys(selectedKeys, customizeOptions) {
    const cityOptions = customizeOptions.filter(isCitySegmentOption);
    const ordered = cityOptions
        .map((opt) => opt.key)
        .filter((key) => selectedKeys.includes(key));
    const remaining = selectedKeys.filter(
        (key) => !ordered.includes(key) && isLegacyCitySegmentKey(key)
    );
    return [...ordered, ...remaining];
}

/**
 * Email: "Hai Phong, Hanoi (Northern & Central Cities), …"
 * Chỉ 3 gói thành phố — không gồm Counsellor Connect.
 */
function buildSelectedCityNamesLabel(formData, tourData) {
    const cities = formData?.cities;
    if (!cities || typeof cities !== 'object') {
        return 'None selected';
    }

    const selectedKeys = Object.keys(cities).filter((key) => cities[key] === true || cities[key] === 'true');
    if (selectedKeys.length === 0) {
        return 'None selected';
    }

    const customizeOptions = tourData?.customizeOptions || [];
    const groups = [];

    for (const key of orderSelectedKeys(selectedKeys, customizeOptions)) {
        const option = customizeOptions.find((opt) => opt.key === key);

        if (option && !isCitySegmentOption(option)) {
            continue;
        }
        if (!option && !isLegacyCitySegmentKey(key)) {
            continue;
        }

        let segmentCities = [];
        let segmentName = '';

        if (option) {
            segmentCities = resolveCitiesForOption(option, tourData);
            segmentName = option.name;
        } else if (LEGACY_KEY_CITIES[key]) {
            segmentCities = filterToKnownTourCities([...LEGACY_KEY_CITIES[key]], tourData);
            segmentName = LEGACY_SEGMENT_LABELS[key] || formatOptionKey(key);
        } else if (key === 'grandTotal' && tourData?.cities?.length) {
            segmentCities = tourData.cities.map((c) => c.name).filter(Boolean);
            segmentName = LEGACY_SEGMENT_LABELS.grandTotal;
        } else {
            continue;
        }

        const cityList = dedupeCityNames(segmentCities);
        if (cityList.length === 0) {
            continue;
        }

        groups.push(`${cityList.join(', ')} (${segmentName})`);
    }

    if (groups.length > 0) {
        return groups.join(', ');
    }

    return buildSelectedTourSegmentsLabel(formData, tourData);
}

function buildSelectedTourSegmentsLabel(formData, tourData) {
    const cities = formData?.cities;
    if (!cities || typeof cities !== 'object') {
        return 'None selected';
    }

    const selectedKeys = Object.keys(cities).filter((key) => cities[key] === true || cities[key] === 'true');
    if (selectedKeys.length === 0) {
        return 'None selected';
    }

    const customizeOptions = tourData?.customizeOptions || [];
    const names = [];

    for (const key of selectedKeys) {
        const option = customizeOptions.find((opt) => opt.key === key);
        if (option) {
            if (!isCitySegmentOption(option)) continue;
            names.push(option.name);
            continue;
        }
        if (LEGACY_SEGMENT_LABELS[key]) {
            names.push(LEGACY_SEGMENT_LABELS[key]);
            continue;
        }
        if (isLegacyCitySegmentKey(key)) {
            names.push(formatOptionKey(key));
        }
    }

    const unique = [...new Set(names.filter(Boolean))];
    return unique.length > 0 ? unique.join(', ') : 'None selected';
}

module.exports = {
    buildSelectedCityNamesLabel,
    buildSelectedTourSegmentsLabel,
    parseCitiesFromOptionDescription,
    resolveCitiesForOption,
    isCitySegmentOption,
    isCounsellorConnectOption
};
