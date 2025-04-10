"use client"
import React, { useState, useEffect } from 'react';
import Pageheader from '@/shared/layout-components/page-header/pageheader'
import Seo from '@/shared/layout-components/seo/seo'
import TableSearch from '../components/TableSearch'
import { Base_url } from '@/app/api/config/BaseUrl'
import axios from 'axios';
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
  userId: string;
  name: string | null;
  PoolA: {
    activated: boolean;
    dateTime: string;
  };
  PoolB: {
    activated: boolean;
    dateTime: string | null;
  };
}

type TransformedPool = Pool & {
  poolType: string;
  date: string;
  time: string;
}

const RewardsTable = () => {
  const [data, setData] = useState<TransformedPool[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await axios.get(`${Base_url}/pools/getAllUsersActivatedPools`);
        if (response.data.success) {
          // Transform data to show separate rows for each activated pool
          const transformedData = response.data.data
            .filter((user: Pool) => user.name) // Filter out null/undefined names
            .flatMap((user: Pool) => {
              const pools: TransformedPool[] = [];
              if (user.PoolA.activated) {
                const [date, time] = user.PoolA.dateTime.split(' ');
                pools.push({
                  ...user,
                  poolType: 'Pool A',
                  date: date || '',
                  time: time || ''
                });
              }
              if (user.PoolB.activated) {
                const [date, time] = (user.PoolB.dateTime || '').split(' ');
                pools.push({
                  ...user,
                  poolType: 'Pool B',
                  date: date || '',
                  time: time || ''
                });
              }
              return pools;
            });
          setData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching pools:', error);
      }
    };

    fetchPools();
  }, []);

  const columnHelper = createColumnHelper<TransformedPool>();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Username',
      id: 'userName',
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
          case 'Pool A':
            badgeClass += 'bg-green-100 text-green-800';
            break;
          case 'Pool B':
            badgeClass += 'bg-blue-100 text-blue-800';
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