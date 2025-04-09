import React from 'react';

interface TableSearchProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  columnFilters: any[];
  setColumnFilters: (filters: any[]) => void;
  columns: any[];
}

const TableSearch: React.FC<TableSearchProps> = ({
  globalFilter,
  setGlobalFilter,
  columnFilters,
  setColumnFilters,
  columns,
}) => {
  return (
    <div className="mb-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Search all columns..."
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {columns.map(column => {
          if (column.id !== 'actions' && column.id !== 'name') {
            return (
              <div key={column.id} className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={(columnFilters.find(f => f.id === column.id)?.value) ?? ''}
                  onChange={e => {
                    const newFilters = columnFilters.filter(f => f.id !== column.id);
                    if (e.target.value) {
                      newFilters.push({
                        id: column.id,
                        value: e.target.value,
                      });
                    }
                    setColumnFilters(newFilters);
                  }}
                  placeholder={`Filter ${column.id}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default TableSearch; 