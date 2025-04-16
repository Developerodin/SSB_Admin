"use client"
import React, { useState, useEffect } from 'react';
import Pageheader from '@/shared/layout-components/page-header/pageheader'
import Seo from '@/shared/layout-components/seo/seo'
import { Base_url } from '@/app/api/config/BaseUrl'
import axios from 'axios';
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

type User = {
  id: string;
  name: string;
  email: string;
  nftType: string;
  date: string;
  walletAddress: string;
  totalNFTs: number;
  totalSteps: number;
  rewards: number;
  lastActive: string;
  referredBy: string;
  dateOfBirth: string;
  gender: string;
  height: string;
  weight: string;
  freeMiningActivate: boolean;
  freeMiningActivateDate: string;
  blockchainMiningActivate: boolean;
  blockchainMiningActivateDate: string;
  completedBlocks: number;
  watchOwner: boolean;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">User Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Date of Birth</label>
                <p className="font-medium">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Gender</label>
                <p className="font-medium">{user.gender}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Height</label>
                <p className="font-medium">{user.height || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Weight</label>
                <p className="font-medium">{user.weight || '-'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Mining Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Free Mining Status</label>
                <p className="font-medium">{user.freeMiningActivate ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Free Mining Start Date</label>
                <p className="font-medium">{new Date(user.freeMiningActivateDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Blockchain Mining Status</label>
                <p className="font-medium">{user.blockchainMiningActivate ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Blockchain Mining Start Date</label>
                <p className="font-medium">{user.blockchainMiningActivateDate ? new Date(user.blockchainMiningActivateDate).toLocaleDateString() : '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Completed Blocks</label>
                <p className="font-medium">{user.completedBlocks}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Wallet Address</label>
                <p className="font-medium break-all">{user.walletAddress}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Watch Owner</label>
                <p className="font-medium">{user.watchOwner ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  userName 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Confirm Deletion</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <p className="mb-6">
          Are you sure you want to delete user <span className="font-semibold">{userName}</span>? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: (updatedUser: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        gender: user.gender,
        height: user.height || '',
        weight: user.weight || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('Admin token');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await axios.patch(
        `${Base_url}users/update-profile`,
        {
          userId: user?.id,
          ...formData
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      onUpdate(response.data.user);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Edit User</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newUser: User) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    const errors = [];

    // Name validation
    if (!formData.name.trim()) {
      errors.push('Name is required');
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.push('Username is required');
    } else if (formData.username.length < 3 || formData.username.length > 30) {
      errors.push('Username must be between 3 and 30 characters');
    }

    // Password validation
    if (!formData.password) {
      errors.push('Password is required');
    } else if (formData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
      }
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      errors.push('Date of Birth is required');
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (today.getMonth() < birthDate.getMonth() || 
          (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
          age--;
      }
      if (age < 18) {
        errors.push('You must be at least 18 years old to register');
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('Admin token');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await axios.post(
        `${Base_url}admin/register-user`,
        {
          name: formData.name,
          username: formData.username,
          password: formData.password,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      onCreate(response.data.user);
      onClose();
      // Reset form after successful creation
      setFormData({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        dateOfBirth: '',
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Create New User</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Username (3-30 characters) *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Password (min 8 characters) *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Confirm Password *</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Date of Birth (Must be 18+) *</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UsersTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${Base_url}/users/all-users`);
        // Transform API data to match our table structure
        const transformedData = response.data.users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          nftType: user.blockchainIds?.length > 0 ? 'Gold' : '-', // Determine NFT type based on blockchainIds
          date: new Date(user.freeMiningActivateDate).toLocaleDateString(),
          walletAddress: user.decentralizedWalletAddress,
          totalNFTs: user.blockchainIds?.length || 0,
          totalSteps: user.totalSteps,
          rewards: user.completedBlocks * 10, // Assuming 10 SSB per completed block
          lastActive: new Date(user.lastLogin).toLocaleDateString(),
          referredBy: user.referredBy || '-',
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          freeMiningActivate: user.freeMiningActivate,
          freeMiningActivateDate: user.freeMiningActivateDate,
          blockchainMiningActivate: user.blockchainMiningActivate,
          blockchainMiningActivateDate: user.blockchainMiningActivateDate,
          completedBlocks: user.completedBlocks,
          watchOwner: user.watchOwner,
        }));
        setData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = async (user: User) => {
    try {
      const token = localStorage.getItem('Admin token');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await axios.get(`${Base_url}/users/get-user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
         
      setUserToEdit(response.data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to fetch user details. Please try again.');
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setData(data.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const handleDelete = async (user: User) => {
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('Admin token');
      if (!token) {
        throw new Error('No admin token found');
      }

      await axios.post(
        `${Base_url}/users/delete-account`,
        { userId: userToDelete.id },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Remove the user from the local state
      setData(data.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateUser = (newUser: User) => {
    setData([...data, newUser]);
  };

  const columnHelper = createColumnHelper<User>();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => (
        <button
          onClick={() => setSelectedUser(info.row.original)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('nftType', {
      header: 'NFT Type',
      cell: info => {
        const nftType = info.getValue();
        let badgeClass = 'px-2 py-1 rounded-full text-xs ';
        switch (nftType) {
          case 'Gold':
            badgeClass += 'bg-yellow-100 text-yellow-800';
            break;
          case 'Silver':
            badgeClass += 'bg-gray-100 text-gray-800';
            break;
          default:
            badgeClass += 'bg-blue-100 text-blue-800';
        }
        return <span className={badgeClass}>{nftType}</span>;
      },
    }),
    columnHelper.accessor('date', {
      header: 'Date',
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
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(info.row.original)}
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
      <Seo title={"Users Management"} />
      <Pageheader currentpage="Users Management" activepage="Tables" mainpage="Users" />
      
      <div className="box p-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Users List</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Create User
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
          </>
        )}
      </div>

      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />

      <DeleteConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
        userName={userToDelete?.name || ''}
      />

      <EditUserModal
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        user={userToEdit}
        onUpdate={handleUpdateUser}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />
    </div>
  );
};

export default UsersTable; 