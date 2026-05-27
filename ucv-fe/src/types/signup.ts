import type { CustomizeOption } from '@/lib/api';

export interface UniversityRepresentative {
    name: string;
    position: string;
    phone: string;
    email: string;
}

export const emptyRepresentative = (): UniversityRepresentative => ({
    name: '',
    position: '',
    phone: '',
    email: ''
});

export function resizeRepresentatives(
    current: UniversityRepresentative[],
    count: number
): UniversityRepresentative[] {
    const result = [...current];
    while (result.length < count) {
        result.push(emptyRepresentative());
    }
    return result.slice(0, count);
}

/** Giới hạn số người đăng ký mỗi trường (theo quy định UCV) */
export const MAX_PARTICIPANTS = 2;

/** Full Tour segment (grandTotal key or name contains "full tour") */
export function isFullTourOption(option: CustomizeOption): boolean {
    return (
        option.key === 'grandTotal' ||
        option.key === 'Full' ||
        /^full$/i.test(option.key) ||
        /full\s*tour/i.test(option.name)
    );
}

export function findFullTourOption(
    options: CustomizeOption[] | undefined
): CustomizeOption | undefined {
    if (!options?.length) return undefined;
    return options.find(isFullTourOption);
}

/** Northern & Central Cities (option thứ 2 trong nhóm loại trừ) */
export function isNorthernCentralOption(option: CustomizeOption): boolean {
    return (
        /northern.*central|northern\s*&\s*central/i.test(option.name) ||
        option.key === 'northern'
    );
}

/** Central & Southern Cities (option thứ 3 trong nhóm loại trừ) */
export function isCentralSouthernOption(option: CustomizeOption): boolean {
    return (
        /central.*southern|central\s*&\s*southern/i.test(option.name) ||
        (option.key === 'central' && !/counsellor/i.test(option.name))
    );
}

/** 3 gói chính: Full Tour, Northern & Central, Central & Southern — chỉ chọn một */
export function isExclusivePackageOption(option: CustomizeOption): boolean {
    return (
        isFullTourOption(option) ||
        isNorthernCentralOption(option) ||
        isCentralSouthernOption(option)
    );
}

/** Counsellor Connect — sự kiện, không phải gói thành phố (chỉ theo tên/key, không theo description) */
export function isCounsellorConnectOption(option: CustomizeOption): boolean {
    return (
        /counsellor\s*connect|counselor\s*breakfast/i.test(option.name) ||
        /counsellor\s*connect|counselor\s*breakfast/i.test(option.key)
    );
}

/**
 * Segment thuộc nhóm chọn thành phố (3 gói chính + legacy regional keys).
 * Dùng cho email Selected Cities — loại trừ Counsellor Connect.
 */
export function isCitySegmentOption(option: CustomizeOption): boolean {
    if (isCounsellorConnectOption(option)) return false;
    return isExclusivePackageOption(option);
}

export function isFullTourSelected(
    cities: Record<string, boolean>,
    options: CustomizeOption[] | undefined
): boolean {
    const fullTour = findFullTourOption(options);
    return fullTour ? !!cities[fullTour.key] : false;
}

/**
 * Thứ tự hiển thị Tour Segments trên form đăng ký (theo thiết kế UCV).
 */
export function sortCustomizeOptionsForSignup(
    options: CustomizeOption[]
): CustomizeOption[] {
    const rank = (option: CustomizeOption): number => {
        if (isFullTourOption(option)) return 0;
        if (/northern.*central|northern\s*&\s*central/i.test(option.name)) return 1;
        if (/central.*southern|central\s*&\s*southern/i.test(option.name)) return 2;
        if (/counsellor connect.*hanoi|connect hanoi/i.test(option.name)) return 3;
        if (/counsellor connect.*hcmc|connect hcmc/i.test(option.name)) return 4;
        if (option.key === 'northern') return 1;
        if (option.key === 'central' || option.key === 'southern') return 2;
        return 50;
    };

    return [...options].sort((a, b) => {
        const diff = rank(a) - rank(b);
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name);
    });
}

/** Mặc định: chỉ tick Full Tour; các segment khác để trống */
export function buildInitialCitySelections(
    options: CustomizeOption[] | undefined
): Record<string, boolean> {
    const selections: Record<string, boolean> = {};
    const fullTour = findFullTourOption(options);

    options?.forEach((option) => {
        selections[option.key] = fullTour ? option.key === fullTour.key : false;
    });

    return selections;
}
