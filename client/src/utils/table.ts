export type FieldDescriptors = {
    fieldName: string;
    value: string;
    operator: string;
};

export function convertFiltersToDescriptors(data): FieldDescriptors[] {
    const descriptors: FieldDescriptors[] = [];

    for (const [field, filters] of Object.entries(data)) {
        if (Array.isArray(filters)) {
            if (typeof filters[0] === 'object' && filters[0] !== null && 'operator' in filters[0]) {
                for (const f of filters) {
                    descriptors.push({
                        fieldName: field,
                        value: f.input,
                        operator: f.operator,
                    });
                }
            } else {
                // Simple array of values, assume equality
                for (const val of filters) {
                    descriptors.push({
                        fieldName: field,
                        value: val,
                        operator: 'eq',
                    });
                }
            }
        }
    }

    return descriptors;
}
