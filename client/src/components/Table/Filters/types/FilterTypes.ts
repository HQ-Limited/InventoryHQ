import { FilterDropdownProps } from 'antd/es/table/interface';

export interface FilterCondition<T> {
    operator: ODataOperator;
    value: T | null;
    propertyPath: string[];
}

export const NumberOperators: { value: ODataOperator; label: string }[] = [
    { value: 'eq', label: '=' },
    { value: 'ne', label: '!=' },
    { value: 'gt', label: '>' },
    { value: 'ge', label: '>=' },
    { value: 'lt', label: '<' },
    { value: 'le', label: '<=' },
    { value: 'in', label: 'in' },
];

export const StringOperators: { value: ODataOperator; label: string }[] = [
    { value: 'eq', label: '=' },
    { value: 'ne', label: '!=' },
    { value: 'contains', label: 'contains' },
    { value: 'startswith', label: 'starts with' },
    { value: 'endswith', label: 'ends with' },
];

export type CustomFilterProps<T> = Omit<FilterDropdownProps, 'setSelectedKeys' | 'selectedKeys'> & {
    setSelectedKeys: (keys: FilterCondition<T>[]) => void;
    selectedKeys: FilterCondition<T>[];
    clearFilters: () => void;
};

// Allowed comparison and function operators in odata-query
export type ODataOperator =
    | 'eq'
    | 'ne'
    | 'gt'
    | 'ge'
    | 'lt'
    | 'le'
    | 'in'
    | 'contains'
    | 'startswith'
    | 'endswith'
    | 'matchespattern' // functions that return non-boolean (length, etc.)
    | 'length'
    | 'tolower'
    | 'toupper'
    | 'trim'
    | 'day'
    | 'month'
    | 'year'
    | 'hour'
    | 'minute'
    | 'second'
    | 'round'
    | 'floor'
    | 'ceiling'
    | 'indexof'
    | 'substring';

// A property may be filtered by a single condition or multiple
type FieldFilter<T> = FilterCondition<T> | FilterCondition<T>[];

// Utility for mapping your fields to filters
export type FilterMap<T extends Record<string, T>> = {
    [P in keyof T]?: FieldFilter<T[P]>;
};
