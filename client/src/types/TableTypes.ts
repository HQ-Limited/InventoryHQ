import type { GetProp, TableProps } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import { FieldDescriptors } from '../utils/table';

type TablePaginationConfig = Exclude<TableProps['pagination'], boolean>;
export interface TableParams<T> {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<T>['field'];
    sortOrder?: SorterResult<T>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

export interface RequestTableParams<T> {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<T>['field'];
    sortOrder?: SorterResult<T>['order'];
    filters?: FieldDescriptors[];
}

export type ColumnsType<T extends object = object> = TableProps<T>['columns'];
