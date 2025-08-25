import { FilterMap } from '../types/FilterTypes';

/**
 * Recursively sets a value at a nested path inside an object.
 */
function setNestedFilter(target: any, path: string[], value: any) {
    const key = path[0];
    if (path.length === 1) {
        target[key] = value;
        return;
    }
    if (!target[key]) target[key] = {};
    setNestedFilter(target[key], path.slice(1), value);
}

/**
 * Converts a flat filter map (with propertyPath in each condition) into a nested OData-ready object.
 * Skips null or undefined values.
 */
export function buildODataFilter(filters: FilterMap<any>): Record<string, any> {
    const nestedFilters: Record<string, any> = {};

    // Step 1: Normalize input and insert into nested structure
    for (const field in filters) {
        const raw = filters[field];
        const condArray = Array.isArray(raw) ? raw : [raw];

        for (const cond of condArray) {
            if (!cond || cond.value === null || cond.value === undefined) continue;

            const { operator, value, propertyPath } = cond;

            // Insert using setNestedFilter
            const leafValue = { [operator]: value };
            const existing = getNestedFilter(nestedFilters, propertyPath) || {};
            setNestedFilter(nestedFilters, propertyPath, { ...existing, ...leafValue });
        }
    }

    return nestedFilters;
}

/**
 * Helper to get existing value at a nested path
 */
function getNestedFilter(obj: any, path: string[]): any {
    let current = obj;
    for (let i = 0; i < path.length; i++) {
        if (!current[path[i]]) return undefined;
        current = current[path[i]];
    }
    return current;
}
