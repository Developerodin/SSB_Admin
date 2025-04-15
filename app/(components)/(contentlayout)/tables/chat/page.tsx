"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Pageheader from '@/shared/layout-components/page-header/pageheader'
import Seo from '@/shared/layout-components/seo/seo'
import { Base_url } from '@/app/api/config/BaseUrl'
import axios from 'axios';

interface User {
  id?: string;
  _id?: string;
  email: string;
  name: string;
}

interface SenderReceiver {
  id: User;
  type: string;
}

interface Message {
  _id: string;
  sender: SenderReceiver;
  receiver: SenderReceiver;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatUser {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

const AdminChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchAdminDetails = useCallback(() => {
    const adminDetails = localStorage.getItem('AdminDetails');
    if (adminDetails) {
      const parsedDetails = JSON.parse(adminDetails);
      setAdminId(parsedDetails.id);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('Admin token');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await axios.get(`${Base_url}chat/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const transformedUsers = response.data.data.map((user: any) => ({
          id: user.userId || user._id,
          name: user.name || 'Unknown User',
          lastMessage: user.lastMessage || '',
          lastMessageTime: user.lastMessageTime || '',
          unreadCount: 0
        }));
        setUsers(transformedUsers);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Failed to load users. Invalid response format.');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
      setUsers([]);
    }
  }, []);

  const fetchMessages = useCallback(async (userId: string) => {
    try {
      const token = localStorage.getItem('Admin token');
      if (!token) {
        throw new Error('No admin token found');
      }

      const response = await axios.post(
        `${Base_url}chat/history`,
        {
          userId: userId,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setMessages(response.data.data);
      } else {
        console.error('Invalid messages format:', response.data);
        setMessages([]);
      }
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  }, [adminId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUsers();
      if (selectedUser) {
        await fetchMessages(selectedUser.id);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [fetchAdminDetails]);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await fetchUsers();
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchUsers]);

  useEffect(() => {
    if (selectedUser && adminId) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser, adminId, fetchMessages]);

  const sendMessage = async () => {
    if (!selectedUser || !newMessage.trim() || !adminId) return;

    try {
      const token = localStorage.getItem('Admin token');
      if (!token) {
        throw new Error('No admin token found');
      }

      await axios.post(
        `${Base_url}chat/send`,
        {
          senderId: adminId,
          senderType: "Admin",
          receiverId: selectedUser.id,
          receiverType: "User",
          message: newMessage,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setNewMessage('');
      fetchMessages(selectedUser.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <Seo title={"Admin Chat"} />
      <Pageheader currentpage="Admin Chat" activepage="Tables" mainpage="Chat" />
      
      <div className="box p-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <div className="flex h-[600px] border rounded-lg overflow-hidden">
            {/* Users List */}
            <div className="w-1/3 border-r bg-gray-50">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Users</h2>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <svg
                    className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto h-[calc(100%-4rem)]">
                {users.length > 0 ? (
                  users.map(user => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                        selectedUser?.id === user.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{user.name}</span>
                        {user.unreadCount ? (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {user.unreadCount}
                          </span>
                        ) : null}
                      </div>
                      {user.lastMessage && (
                        <div className="mt-1">
                          <p className="text-sm text-gray-500 truncate">
                            {user.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(user.lastMessageTime || '')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="w-2/3 flex flex-col">
              {selectedUser ? (
                <>
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length > 0 ? (
                      messages.map(message => {
                        const isAdminMessage = message.sender.type === 'Admin';
                        return (
                          <div
                            key={message._id}
                            className={`flex ${
                              isAdminMessage ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isAdminMessage
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <p>{message.message}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {formatDate(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex justify-center items-center h-full text-gray-500">
                        No messages yet
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={sendMessage}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a user to start chatting
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
