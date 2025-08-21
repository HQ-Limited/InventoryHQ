import { FilterMap } from '../types/FilterTypes';

export function buildODataFilter<T extends Record<string, T>>(
    filters: FilterMap<T>
): Record<string, T> {
    const output: Record<string, T> = {};
    for (const key in filters) {
        const conditions = filters[key];
        if (!conditions) continue;

        const condArray = Array.isArray(conditions) ? conditions : [conditions];

        output[key] = condArray.reduce(
            (acc, cond) => {
                if (cond.value === null) {
                    return acc;
                } else if (cond.operator in acc) {
                    // TODO: merge if same operator, or override—adjust logic if needed
                    return { ...acc, [cond.operator]: cond.value };
                } else {
                    return { ...acc, [cond.operator]: cond.value };
                }
            },
            {} as Record<string, T>
        );
    }
    return output;
}
