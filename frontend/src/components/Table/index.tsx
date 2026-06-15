import React from 'react';
import './index.scss';

interface TableHeaderProps {
  children: React.ReactNode;
  sortable?: boolean;
  onSort?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  sortable = false,
  onSort,
  className = '',
  style,
}) => (
  <th
    onClick={onSort}
    style={style}
    className={`
      table__header
      ${sortable ? 'table__header--sortable' : ''}
      ${className}
    `}
  >
    <div className="table__header-content">
      {children}

      {sortable && (
        <span className="table__sort-icon">
          ↕
        </span>
      )}
    </div>
  </th>
);

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  className = '',
}) => (
  <td className={`table__cell ${className}`}>
    {children}
  </td>
);

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const TableRow: React.FC<TableRowProps> = ({
  children,
  onClick,
  className = '',
}) => (
  <tr
    onClick={onClick}
    className={`
      table__row
      ${onClick ? 'table__row--clickable' : ''}
      ${className}
    `}
  >
    {children}
  </tr>
);

interface TableProps<T> {
  columns: {
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
  }[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps<any>>(
  (
    {
      columns,
      data,
      onRowClick,
      emptyMessage = 'No data available',
      className = '',
    },
    ref
  ) => {
    if (data.length === 0) {
      return (
        <div className="table__empty">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className={`table-container ${className}`}>
        <table
          ref={ref}
          className="table"
        >
          <thead>
            <tr className="table__head-row">
              {columns.map((col) => (
                <TableHeader
                  key={String(col.key)}
                  sortable={col.sortable}
                  style={
                    col.width
                      ? { width: col.width }
                      : undefined
                  }
                >
                  {col.label}
                </TableHeader>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, idx) => (
              <TableRow
                key={idx}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.render
                      ? col.render(item[col.key], item)
                      : String(item[col.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';