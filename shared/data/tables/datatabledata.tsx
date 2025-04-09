"use client"
import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

type Person = {
  id: string;
  name: string;
  email: string;
  status: string;
  date: string;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Person>) => void;
  initialData?: Person;
  title: string;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const [formData, setFormData] = React.useState<Partial<Person>>(
    initialData || {
      name: '',
      email: '',
      status: 'Active',
      date: new Date().toISOString().split('T')[0],
    }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
          onClose();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const defaultData: Person[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
    date: '2024-02-20',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'Inactive',
    date: '2024-02-19',
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    status: 'Active',
    date: '2024-02-18',
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily@example.com',
    status: 'Active',
    date: '2024-02-17',
  },
  {
    id: '5',
    name: 'William Davis',
    email: 'william@example.com',
    status: 'Inactive',
    date: '2024-02-16',
  },
  {
    id: '6',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    status: 'Active',
    date: '2024-02-15',
  },
  {
    id: '7',
    name: 'James Taylor',
    email: 'james@example.com',
    status: 'Active',
    date: '2024-02-14',
  },
  {
    id: '8',
    name: 'Emma Anderson',
    email: 'emma@example.com',
    status: 'Inactive',
    date: '2024-02-13',
  },
  {
    id: '9',
    name: 'Daniel Martinez',
    email: 'daniel@example.com',
    status: 'Active',
    date: '2024-02-12',
  },
  {
    id: '10',
    name: 'Olivia Thompson',
    email: 'olivia@example.com',
    status: 'Active',
    date: '2024-02-11',
  },
  {
    id: '11',
    name: 'Alexander White',
    email: 'alex@example.com',
    status: 'Inactive',
    date: '2024-02-10',
  },
  {
    id: '12',
    name: 'Sophia Clark',
    email: 'sophia@example.com',
    status: 'Active',
    date: '2024-02-09',
  },
  {
    id: '13',
    name: 'David Rodriguez',
    email: 'david@example.com',
    status: 'Active',
    date: '2024-02-08',
  },
  {
    id: '14',
    name: 'Isabella Lee',
    email: 'isabella@example.com',
    status: 'Inactive',
    date: '2024-02-07',
  },
  {
    id: '15',
    name: 'Joseph Walker',
    email: 'joseph@example.com',
    status: 'Active',
    date: '2024-02-06',
  },
  {
    id: '16',
    name: 'Mia Green',
    email: 'mia@example.com',
    status: 'Active',
    date: '2024-02-05',
  },
  {
    id: '17',
    name: 'Ethan Hall',
    email: 'ethan@example.com',
    status: 'Inactive',
    date: '2024-02-04',
  },
  {
    id: '18',
    name: 'Ava Young',
    email: 'ava@example.com',
    status: 'Active',
    date: '2024-02-03',
  },
  {
    id: '19',
    name: 'Noah King',
    email: 'noah@example.com',
    status: 'Active',
    date: '2024-02-02',
  },
  {
    id: '20',
    name: 'Charlotte Adams',
    email: 'charlotte@example.com',
    status: 'Inactive',
    date: '2024-02-01',
  }
];

const columnHelper = createColumnHelper<Person>();

export const BasicTable = () => {
  const [data, setData] = React.useState(() => [...defaultData]);
  const [pageSize, setPageSize] = React.useState(10);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingData, setEditingData] = React.useState<Person | undefined>();

  const handleCreate = (newData: Partial<Person>) => {
    const newId = (Math.max(...data.map(item => parseInt(item.id))) + 1).toString();
    setData([...data, { ...newData, id: newId } as Person]);
  };

  const handleEdit = (updatedData: Partial<Person>) => {
    setData(data.map(item => 
      item.id === editingData?.id ? { ...item, ...updatedData } : item
    ));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingData(info.row.original);
              setIsModalOpen(true);
            }}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
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
    <div className="p-2">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => {
            setEditingData(undefined);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create New
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
        <span className="flex items-center gap-1 text-sm">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingData(undefined);
        }}
        onSubmit={editingData ? handleEdit : handleCreate}
        initialData={editingData}
        title={editingData ? 'Edit Entry' : 'Create New Entry'}
      />
    </div>
  );
};
