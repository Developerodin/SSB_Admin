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

type Coupon = {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'used';
  usageLimit: number;
  usedCount: number;
  minPurchase: number;
}

const defaultData: Coupon[] = [
  {
    id: '1',
    code: 'WELCOME20',
    discount: 20,
    type: 'percentage',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    status: 'active',
    usageLimit: 100,
    usedCount: 45,
    minPurchase: 50
  },
  {
    id: '2',
    code: 'SPRING50',
    discount: 50,
    type: 'fixed',
    startDate: '2024-04-15',
    endDate: '2024-05-15',
    status: 'active',
    usageLimit: 50,
    usedCount: 12,
    minPurchase: 100
  },
  {
    id: '3',
    code: 'SUMMER10',
    discount: 10,
    type: 'percentage',
    startDate: '2024-05-01',
    endDate: '2024-05-31',
    status: 'active',
    usageLimit: 200,
    usedCount: 0,
    minPurchase: 30
  }
];

const CouponForm = ({ 
  coupon, 
  onClose, 
  onSubmit 
}: { 
  coupon?: Coupon; 
  onClose: () => void; 
  onSubmit: (data: Omit<Coupon, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState<Omit<Coupon, 'id'>>(
    coupon || {
      code: '',
      discount: 0,
      type: 'percentage',
      startDate: '',
      endDate: '',
      status: 'active',
      usageLimit: 0,
      usedCount: 0,
      minPurchase: 0
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {coupon ? 'Edit Coupon' : 'Create New Coupon'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount</label>
            <input
              type="number"
              value={formData.discount}
              onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Usage Limit</label>
            <input
              type="number"
              value={formData.usageLimit}
              onChange={e => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Purchase</label>
            <input
              type="number"
              value={formData.minPurchase}
              onChange={e => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {coupon ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CouponsTable = () => {
  const [data, setData] = useState(defaultData);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>();

  const columnHelper = createColumnHelper<Coupon>();

  const handleCreate = (newCoupon: Omit<Coupon, 'id'>) => {
    const id = (data.length + 1).toString();
    setData([...data, { ...newCoupon, id }]);
    setShowForm(false);
  };

  const handleEdit = (updatedCoupon: Omit<Coupon, 'id'>) => {
    if (editingCoupon) {
      setData(data.map(coupon => 
        coupon.id === editingCoupon.id 
          ? { ...updatedCoupon, id: editingCoupon.id }
          : coupon
      ));
      setShowForm(false);
      setEditingCoupon(undefined);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setData(data.filter(coupon => coupon.id !== id));
    }
  };

  const columns = [
    columnHelper.accessor('code', {
      header: 'Code',
      cell: info => (
        <span className="font-medium text-blue-600">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('discount', {
      header: 'Discount',
      cell: info => {
        const type = info.row.original.type;
        return type === 'percentage' 
          ? `${info.getValue()}%` 
          : `$${info.getValue()}`;
      },
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: info => {
        const type = info.getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            type === 'percentage' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.accessor('startDate', {
      header: 'Start Date',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('endDate', {
      header: 'End Date',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        let badgeClass = 'px-2 py-1 rounded-full text-xs ';
        switch (status) {
          case 'active':
            badgeClass += 'bg-green-100 text-green-800';
            break;
          case 'expired':
            badgeClass += 'bg-red-100 text-red-800';
            break;
          case 'used':
            badgeClass += 'bg-gray-100 text-gray-800';
            break;
        }
        return <span className={badgeClass}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
      },
    }),
    columnHelper.accessor('usageLimit', {
      header: 'Usage',
      cell: info => {
        const { usageLimit, usedCount } = info.row.original;
        return `${usedCount}/${usageLimit}`;
      },
    }),
    columnHelper.accessor('minPurchase', {
      header: 'Min. Purchase',
      cell: info => `$${info.getValue()}`,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingCoupon(info.row.original);
              setShowForm(true);
            }}
            className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      ),
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
      <Seo title={"Discount Coupons"} />
      <Pageheader currentpage="Discount Coupons" activepage="Tables" mainpage="Coupons" />
      
      <div className="box p-5">
        <div className="mb-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Discount Coupons</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setEditingCoupon(undefined);
                  setShowForm(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Create Coupon
              </button>
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

      {showForm && (
        <CouponForm
          coupon={editingCoupon}
          onClose={() => {
            setShowForm(false);
            setEditingCoupon(undefined);
          }}
          onSubmit={editingCoupon ? handleEdit : handleCreate}
        />
      )}
    </div>
  );
};

export default CouponsTable; 