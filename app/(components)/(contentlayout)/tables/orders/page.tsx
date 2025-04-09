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

type Order = {
  id: string;
  username: string;
  nft: string;
  amount: number;
  date: string;
  time: string;
  referredBy: string;
}

const defaultData: Order[] = [
  {
    id: '1',
    username: 'JohnDoe',
    nft: 'Gold NFT #123',
    amount: 1000,
    date: '2024-04-15',
    time: '14:30:00',
    referredBy: 'JaneSmith'
  },
  {
    id: '2',
    username: 'JaneSmith',
    nft: 'Silver NFT #456',
    amount: 500,
    date: '2024-04-14',
    time: '09:15:00',
    referredBy: 'MikeJohnson'
  },
  {
    id: '3',
    username: 'MikeJohnson',
    nft: 'Bronze NFT #789',
    amount: 250,
    date: '2024-04-13',
    time: '16:45:00',
    referredBy: 'SarahWilliams'
  },
  {
    id: '4',
    username: 'SarahWilliams',
    nft: 'Gold NFT #321',
    amount: 2000,
    date: '2024-04-12',
    time: '11:20:00',
    referredBy: 'DavidBrown'
  },
  {
    id: '5',
    username: 'DavidBrown',
    nft: 'Silver NFT #654',
    amount: 750,
    date: '2024-04-11',
    time: '13:10:00',
    referredBy: 'JohnDoe'
  }
];

const OrdersTable = () => {
  const [data] = useState(defaultData);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnHelper = createColumnHelper<Order>();

  const columns = [
    columnHelper.accessor('username', {
      header: 'Username',
      cell: info => (
        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('nft', {
      header: 'NFT',
      cell: info => {
        const nft = info.getValue();
        let badgeClass = 'px-2 py-1 rounded-full text-xs ';
        if (nft.includes('Gold')) {
          badgeClass += 'bg-yellow-100 text-yellow-800';
        } else if (nft.includes('Silver')) {
          badgeClass += 'bg-gray-100 text-gray-800';
        } else {
          badgeClass += 'bg-orange-100 text-orange-800';
        }
        return <span className={badgeClass}>{nft}</span>;
      },
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: info => `$${info.getValue().toLocaleString()}`,
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('time', {
      header: 'Time',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('referredBy', {
      header: 'Referred By',
      cell: info => {
        const referredBy = info.getValue();
        return referredBy ? (
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
            {referredBy}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
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
      <Seo title={"Orders"} />
      <Pageheader currentpage="Orders" activepage="Tables" mainpage="Orders" />
      
      <div className="box p-5">
        <div className="mb-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Orders List</h2>
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

export default OrdersTable; 