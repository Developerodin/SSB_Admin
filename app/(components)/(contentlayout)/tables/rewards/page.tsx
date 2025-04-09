"use client"
import React, { useState } from 'react';
import Pageheader from '@/shared/layout-components/page-header/pageheader'
import Seo from '@/shared/layout-components/seo/seo'
import TableSearch from '../components/TableSearch'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';

type Pool = {
  id: string;
  username: string;
  poolType: string;
  date: string;
  time: string;
}

const defaultData: Pool[] = [
  {
    id: '1',
    username: 'JohnDoe',
    poolType: 'Daily Pool',
    date: '2024-04-15',
    time: '14:30:00'
  },
  {
    id: '2',
    username: 'JaneSmith',
    poolType: 'Weekly Pool',
    date: '2024-04-14',
    time: '09:15:00'
  },
  {
    id: '3',
    username: 'MikeJohnson',
    poolType: 'Monthly Pool',
    date: '2024-04-13',
    time: '16:45:00'
  },
  {
    id: '4',
    username: 'SarahWilliams',
    poolType: 'Daily Pool',
    date: '2024-04-12',
    time: '11:20:00'
  },
  {
    id: '5',
    username: 'DavidBrown',
    poolType: 'Weekly Pool',
    date: '2024-04-11',
    time: '13:10:00'
  }
];

const RewardsTable = () => {
  const [data] = useState(defaultData);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnHelper = createColumnHelper<Pool>();

  const columns = [
    columnHelper.accessor('username', {
      header: 'Username',
      cell: info => (
        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('poolType', {
      header: 'Pool Type',
      cell: info => {
        const poolType = info.getValue();
        let badgeClass = 'px-2 py-1 rounded-full text-xs ';
        switch (poolType) {
          case 'Daily Pool':
            badgeClass += 'bg-green-100 text-green-800';
            break;
          case 'Weekly Pool':
            badgeClass += 'bg-blue-100 text-blue-800';
            break;
          case 'Monthly Pool':
            badgeClass += 'bg-purple-100 text-purple-800';
            break;
          default:
            badgeClass += 'bg-gray-100 text-gray-800';
        }
        return <span className={badgeClass}>{poolType}</span>;
      },
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('time', {
      header: 'Time',
      cell: info => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  return (
    <div>
      <Seo title={"Rewards & Pools"} />
      <Pageheader currentpage="Rewards & Pools" activepage="Tables" mainpage="Rewards" />
      
      <div className="box p-5">
        <div className="mb-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Rewards & Pools List</h2>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                table.setPageSize(Number(e.target.value));
              }}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {[5, 10, 20].map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>

          <TableSearch
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            columns={table.getAllColumns()}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      <span className="ml-2">
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
            <span className="ml-2">
              ({table.getPrePaginationRowModel().rows.length} total records)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsTable; 