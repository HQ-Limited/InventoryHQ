import { FilterDropdownProps } from 'antd/es/table/interface';

export interface FilterCondition<T> {
    operator: ODataOperator;
    value: T | null;
}

export const NumberOperators: { value: ODataOperator; label: string }[] = [
    { value: 'eq', label: '=' },
    { value: 'gt', label: '>' },
    { value: 'ge', label: '>=' },
    { value: 'lt', label: '<' },
    { value: 'le', label: '<=' },
];

export type CustomFilterProps<T> = Omit<FilterDropdownProps, 'setSelectedKeys' | 'selectedKeys'> & {
    setSelectedKeys: (keys: FilterCondition<T>[]) => void;
    selectedKeys: FilterCondition<T>[];
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

// Filter condition with value
export interface FilterCondition<T> {
    operator: ODataOperator;
    value: T | null;
}

// A property may be filtered by a single condition or multiple
type FieldFilter<T> = FilterCondition<T> | FilterCondition<T>[];

// Utility for mapping your fields to filters
export type FilterMap<T extends Record<string, T>> = {
    [P in keyof T]?: FieldFilter<T[P]>;
};
