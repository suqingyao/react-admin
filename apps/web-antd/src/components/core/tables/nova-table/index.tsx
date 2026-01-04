import { cn } from '@suqingyao/utils';
import type { PaginationProps, TableColumnProps } from 'antd';
import { Pagination, Table } from 'antd';

interface NovaTableProps {
  columns: TableColumnProps<any>[];
  dataSource: any[];
  pagination?: PaginationProps;
}

export function NovaTable(props: NovaTableProps) {
  return (
    <div className={cn('nova-table')}>
      <Table {...props} />
      <Pagination {...props.pagination} />
    </div>
  );
}
