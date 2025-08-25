import { TablePaginationConfig } from 'antd/es/table';
import { FilterMap } from '../types/FilterTypes';
import { buildODataFilter } from './Filter';
import { SorterResult } from 'antd/es/table/interface';
import buildQuery from 'odata-query';

export function buildODataRequest({
    count = true,
    pagination,
    filters,
    sorter,
    expand,
}: {
    count?: boolean;
    pagination: TablePaginationConfig;
    filters?: FilterMap<any>;
    sorter?: SorterResult<any> | SorterResult<any>[];
    expand?: object;
}) {
    const orderby =
        sorter &&
        Object.keys(sorter).length > 0 &&
        (Array.isArray(sorter)
            ? sorter.map((s) => `${s.field} ${s.order === 'ascend' ? 'asc' : 'desc'}`)
            : [`${sorter.field} ${sorter.order === 'ascend' ? 'asc' : 'desc'}`]);

    const query = buildQuery({
        count,
        top: pagination.pageSize || 20,
        skip: (pagination.pageSize || 20) * ((pagination.current || 1) - 1),
        ...(filters && { filter: buildODataFilter(filters) }),
        ...(orderby && { orderby }),
        expand,
    });
    return query;
}
