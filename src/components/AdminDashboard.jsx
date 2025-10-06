import React, { useState, useEffect, useRef, useCallback } from 'react';
import { adminAPI, messagesAPI, documentsAPI } from '../services/api';
import { Users, FileText, CheckCircle, Clock, Search, X, Save, AlertCircle, MessageSquare, Send, Bell, Check, Edit2, Trash2, Eye, Download, Tag, Plus } from 'lucide-react';

// Memoized message input with internal state to prevent re-renders
const MessageInputForm = React.memo(({ onSend, isSending, editingMessage, onCancelEdit }) => {
  const [localValue, setLocalValue] = React.useState('');
  const inputRef = React.useRef(null);

  // Update local value when editing message changes
  React.useEffect(() => {
    if (editingMessage) {
      setLocalValue(editingMessage.message);
      inputRef.current?.focus();
    } else {
      setLocalValue('');
    }
  }, [editingMessage]);

  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    if (localValue.trim()) {
      onSend(localValue);
      setLocalValue('');
    }
  }, [localValue, onSend]);

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape' && editingMessage) {
      onCancelEdit();
    }
  }, [handleSubmit, editingMessage, onCancelEdit]);

  return (
    <div className="border-t p-4">
      {editingMessage && (
        <div className="mb-2 flex items-center justify-between bg-blue-50 px-3 py-2 rounded text-sm">
          <span className="text-blue-900">Editing message...</span>
          <button onClick={onCancelEdit} className="text-blue-900 hover:text-blue-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isSending || !localValue.trim()}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 flex items-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
});

// Memoized admin messaging component to prevent focus loss
const AdminMessaging = React.memo(({
  conversations,
  selectedConversation,
  messages,
  handleSendMessage,
  sendingMessage,
  onSelectConversation,
  editingMessage,
  onEditMessage,
  onDeleteMessage,
  onCancelEdit
}) => {
  // Find the last admin message
  const lastAdminMessageIndex = messages.map((m, i) => m.is_admin_message ? i : -1).filter(i => i !== -1).pop();
  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b bg-blue-900 text-white">
          <h2 className="text-xl font-semibold">Conversations</h2>
        </div>
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 64px)' }}>
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No conversations yet
            </div>
          ) : (
            conversations.map((user) => (
              <div
                key={user.id}
                onClick={() => onSelectConversation(user.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === user.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.messages && user.messages[0] && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {user.messages[0].message.substring(0, 50)}...
                      </p>
                    )}
                  </div>
                  {user.unread_messages_count > 0 && (
                    <span className="bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                      {user.unread_messages_count}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="col-span-2 bg-white rounded-lg shadow flex flex-col">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p>Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b bg-blue-900 text-white">
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>

            {/* Messages Container */}
            <div id="admin-messages-container" className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => {
                    const isLastAdminMessage = msg.is_admin_message && index === lastAdminMessageIndex;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${msg.is_admin_message ? 'justify-end' : 'justify-start'} group`}
                      >
                        <div className="flex items-end gap-2">
                          {isLastAdminMessage && (
                            <div className="flex flex-col gap-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onEditMessage(msg)}
                                className="p-1 hover:bg-gray-200 rounded"
                                title="Edit message"
                              >
                                <Edit2 className="w-3 h-3 text-gray-600" />
                              </button>
                              <button
                                onClick={() => onDeleteMessage(msg.id)}
                                className="p-1 hover:bg-red-100 rounded"
                                title="Delete message"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          )}
                          <div
                            className={`px-4 py-2 rounded-lg break-all whitespace-pre-line max-w-[80%] ${
                              msg.is_admin_message
                                ? 'bg-blue-900 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs opacity-70">
                                {new Date(msg.created_at).toLocaleString()}
                              </p>
                              {msg.updated_at && msg.created_at !== msg.updated_at && (
                                <span className="text-xs opacity-60 italic">edited</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Message Input */}
            <MessageInputForm
              onSend={handleSendMessage}
              isSending={sendingMessage}
              editingMessage={editingMessage}
              onCancelEdit={onCancelEdit}
            />
          </>
        )}
      </div>
    </div>
  );
});

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('users'); // 'users' or 'messages'
  const [updateForm, setUpdateForm] = useState({
    status: '',
    progress_percentage: '',
    nif_number: '',
    niss_number: '',
    bank_account_name: '',
    bank_account_number: '',
    bank_name: '',
    aima_appointment_date: '',
    aima_appointment_location: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Label state
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [labelForm, setLabelForm] = useState({
    label_type: '',
    amount: '',
    notes: ''
  });

  // Messaging state
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [editingMessage, setEditingMessage] = useState(null);

  // Refs to track state for comparison without causing re-renders
  const messagesRef = useRef(messages);
  const conversationsRef = useRef(conversations);

  // Update refs when state changes
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  const statusOptions = [
    { value: 'not_started', label: 'Not Started', progress: 0 },
    { value: 'documents_pending', label: 'Documents Pending', progress: 5 },
    { value: 'nif_in_progress', label: 'NIF In Progress', progress: 15 },
    { value: 'nif_completed', label: 'NIF Completed', progress: 25 },
    { value: 'niss_in_progress', label: 'NISS In Progress', progress: 35 },
    { value: 'niss_completed', label: 'NISS Completed', progress: 45 },
    { value: 'bank_account_in_progress', label: 'Bank Account In Progress', progress: 55 },
    { value: 'bank_account_completed', label: 'Bank Account Completed', progress: 65 },
    { value: 'course_in_progress', label: 'Course In Progress', progress: 70 },
    { value: 'course_completed', label: 'Course Completed', progress: 80 },
    { value: 'aima_scheduled', label: 'AIMA Scheduled', progress: 85 },
    { value: 'aima_completed', label: 'AIMA Completed', progress: 95 },
    { value: 'approved', label: 'Approved', progress: 100 }
  ];

  useEffect(() => {
    loadData();
    // Load conversations without blocking UI
    loadConversations().catch(err => console.error('Failed to load conversations:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll for new messages - DISABLED
  // useEffect(() => {
  //   const pollMessages = async () => {
  //     if (view === 'messages') {
  //       // Refresh conversations list to update unread counts
  //       loadConversations();

  //       if (selectedConversation) {
  //         // Load messages without scrolling or losing focus
  //         try {
  //           const response = await messagesAPI.getUserMessages(selectedConversation);
  //           const newMessages = response.data;
  //           const prevMessagesStr = JSON.stringify(messagesRef.current);
  //           const newMessagesStr = JSON.stringify(newMessages);

  //           // Only update if messages have actually changed
  //           if (prevMessagesStr !== newMessagesStr) {
  //             setMessages(newMessages);
  //           }
  //         } catch (error) {
  //           console.error('Failed to poll messages:', error);
  //         }
  //       }
  //     } else {
  //       // Just update unread count when not in messages view
  //       loadConversations();
  //     }
  //   };

  //   // Poll every 5 seconds when in messages view, 30 seconds otherwise
  //   const pollInterval = view === 'messages' ? 5000 : 30000;
  //   const interval = setInterval(pollMessages, pollInterval);
  //   return () => clearInterval(interval);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [view, selectedConversation]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getStatistics()
      ]);
      setUsers(usersRes.data.users);
      setStatistics(statsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Failed to load admin data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async (userId) => {
    try {
      const response = await adminAPI.getUserDetails(userId);
      setUserDetails(response.data);
      setSelectedUser(userId);

      // Populate form
      const app = response.data.application;
      setUpdateForm({
        status: app?.status || '',
        progress_percentage: app?.progress_percentage || '',
        nif_number: app?.nif_number || '',
        niss_number: app?.niss_number || '',
        bank_account_name: app?.bank_account_name || '',
        bank_account_number: app?.bank_account_number || '',
        bank_name: app?.bank_name || '',
        aima_appointment_date: app?.aima_appointment_date || '',
        aima_appointment_location: app?.aima_appointment_location || '',
        notes: app?.notes || ''
      });
    } catch (error) {
      console.error('Failed to load user details:', error);
    }
  };

  const handleUpdateApplication = async () => {
    if (!selectedUser) return;

    setSaving(true);
    setSuccessMessage('');

    try {
      await adminAPI.updateApplicationStatus({
        user_id: selectedUser,
        ...updateForm
      });

      setSuccessMessage('Application updated successfully!');

      // Reload data
      await loadData();
      await loadUserDetails(selectedUser);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update application:', error);
      alert('Failed to update application. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Label management functions
  const handleAddLabel = async () => {
    if (!selectedUser || !labelForm.label_type) return;

    try {
      await adminAPI.addUserLabel({
        user_id: selectedUser,
        ...labelForm
      });

      setSuccessMessage('Label added successfully!');
      setShowAddLabel(false);
      setLabelForm({ label_type: '', amount: '', notes: '' });

      // Reload user details
      await loadUserDetails(selectedUser);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to add label:', error);
      alert('Failed to add label. Please try again.');
    }
  };

  const handleDeleteLabel = async (labelId) => {
    if (!window.confirm('Are you sure you want to delete this label?')) return;

    try {
      await adminAPI.deleteUserLabel(labelId);
      setSuccessMessage('Label deleted successfully!');

      // Reload user details
      await loadUserDetails(selectedUser);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to delete label:', error);
      alert('Failed to delete label. Please try again.');
    }
  };

  // Messaging functions
  const loadConversations = async () => {
    try {
      const response = await messagesAPI.getAllConversations();
      const conversationsData = Array.isArray(response.data) ? response.data : [];

      // Only update if conversations have changed (prevent focus loss)
      const prevConversationsStr = JSON.stringify(conversationsRef.current);
      const newConversationsStr = JSON.stringify(conversationsData);

      if (prevConversationsStr !== newConversationsStr) {
        setConversations(conversationsData);

        // Calculate total unread
        const total = conversationsData.reduce((sum, user) => sum + (user.unread_messages_count || 0), 0);
        setTotalUnread(total);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setConversations([]);
      setTotalUnread(0);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const response = await messagesAPI.getUserMessages(userId);
      setMessages(response.data);
      setSelectedConversation(userId);

      // Refresh conversations to update unread count
      loadConversations();

      // Scroll to bottom of messages
      setTimeout(() => {
        const messagesContainer = document.getElementById('admin-messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = useCallback(async (message) => {
    if (!message || !message.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      if (editingMessage) {
        // Edit existing message
        await messagesAPI.update(editingMessage.id, message);
        // Update message in list
        setMessages(prev => prev.map(msg =>
          msg.id === editingMessage.id ? { ...msg, message } : msg
        ));
        setEditingMessage(null);
      } else {
        // Send new message
        const response = await messagesAPI.send(message, selectedConversation);
        // Add new message to the list
        setMessages(prev => [...prev, response.data]);
      }

      // Refresh conversations
      loadConversations();

      // Scroll to bottom
      setTimeout(() => {
        const messagesContainer = document.getElementById('admin-messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  }, [selectedConversation, editingMessage]);

  const handleEditMessage = useCallback((msg) => {
    setEditingMessage(msg);
  }, []);

  const handleDeleteMessage = useCallback(async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await messagesAPI.delete(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      loadConversations();
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message. Please try again.');
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMessage(null);
  }, []);

  // Document handlers
  const handleDocumentView = useCallback(async (id, name) => {
    try {
      const response = await documentsAPI.download(id);

      // response.data is already a Blob, just create URL from it
      const url = window.URL.createObjectURL(response.data);
      window.open(url, '_blank');
      // Clean up after a delay to ensure the new tab loads
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Failed to view document:', error);
      alert('Failed to view document. Please try again.');
    }
  }, []);

  const handleDocumentDownload = useCallback(async (id, name) => {
    try {
      const response = await documentsAPI.download(id);

      // response.data is already a Blob, create URL from it
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download document:', error);
      alert('Failed to download document. Please try again.');
    }
  }, []);

  // Load conversations when switching to messages view
  useEffect(() => {
    if (view === 'messages') {
      loadConversations();
    }
  }, [view]);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white pt-20 ">
        <div className="max-w-7xl mx-auto flex justify-between items-center pb-5">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button
              onClick={() => setView('messages')}
              className="relative p-2 hover:bg-blue-800 rounded-full transition"
              title={totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'No new messages'}
            >
              <Bell className="w-6 h-6" />
              {totalUnread > 0 && (
                <>
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {totalUnread > 99 ? '99+' : totalUnread}
                  </span>
                  <span className="absolute top-0 right-0 bg-red-500 rounded-full w-5 h-5 animate-ping opacity-75"></span>
                </>
              )}
            </button>

            <div className="h-6 w-px bg-blue-700"></div>

            <button
              onClick={() => setView('users')}
              className={`px-4 py-2 rounded flex items-center ${
                view === 'users' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white hover:bg-blue-700'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Users
            </button>
            <button
              onClick={() => setView('messages')}
              className={`px-4 py-2 rounded flex items-center ${
                view === 'messages' ? 'bg-white text-blue-900' : 'bg-blue-800 text-white hover:bg-blue-700'
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Messages
            </button>
            <button
              onClick={onLogout}
              className="bg-white text-blue-900 px-4 py-2 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Statistics - Only show on users view */}
      {view === 'users' && statistics && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-blue-900">{statistics.total_users}</p>
                </div>
                <Users className="w-12 h-12 text-blue-900 opacity-20" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Applications</p>
                  <p className="text-3xl font-bold text-green-600">{statistics.total_applications}</p>
                </div>
                <FileText className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Approved</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {statistics.status_breakdown?.approved || 0}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'users' && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Users List */}
            <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold mb-4">Users</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => loadUserDetails(user.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedUser === user.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.nationality} • {user.preferred_language}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        user.application_status === 'approved' ? 'bg-green-100 text-green-800' :
                        user.application_status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.application_status?.replace(/_/g, ' ')}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.documents_count} docs
                      </p>
                    </div>
                  </div>
                  {user.package && (
                    <div className="mt-2">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {user.package}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No users found
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="bg-white rounded-lg shadow">
            {!selectedUser ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Select a user to view details</p>
              </div>
            ) : userDetails ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold">{userDetails.user.name}</h2>
                    <p className="text-gray-600">{userDetails.user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setUserDetails(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 text-sm">{successMessage}</span>
                  </div>
                )}

                {/* User Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-medium">{userDetails.user.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Nationality:</span>
                      <p className="font-medium">{userDetails.user.nationality || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Package:</span>
                      <p className="font-medium">{userDetails.user.package || 'None'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Language:</span>
                      <p className="font-medium">{userDetails.user.preferred_language || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* User Labels */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold flex items-center">
                      <Tag className="w-5 h-5 mr-2" />
                      Labels ({userDetails.labels?.length || 0})
                    </h3>
                    <button
                      onClick={() => setShowAddLabel(!showAddLabel)}
                      className="text-sm bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-800 flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Label
                    </button>
                  </div>

                  {/* Add Label Form */}
                  {showAddLabel && (
                    <div className="mb-3 p-4 bg-gray-50 rounded-lg border">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Label Type
                          </label>
                          <input
                            type="text"
                            value={labelForm.label_type}
                            onChange={(e) => setLabelForm({ ...labelForm, label_type: e.target.value })}
                            placeholder="e.g., paid, vip, urgent"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (optional)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={labelForm.amount}
                            onChange={(e) => setLabelForm({ ...labelForm, amount: e.target.value })}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (optional)
                          </label>
                          <textarea
                            value={labelForm.notes}
                            onChange={(e) => setLabelForm({ ...labelForm, notes: e.target.value })}
                            placeholder="Additional notes..."
                            rows="2"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddLabel}
                            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                          >
                            Save Label
                          </button>
                          <button
                            onClick={() => {
                              setShowAddLabel(false);
                              setLabelForm({ label_type: '', amount: '', notes: '' });
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Labels List */}
                  <div className="space-y-2">
                    {userDetails.labels && userDetails.labels.length > 0 ? (
                      userDetails.labels.map((label) => (
                        <div key={label.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                                  {label.label_type}
                                </span>
                                {label.amount && (
                                  <span className="text-sm font-medium text-green-600">
                                    €{parseFloat(label.amount).toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {label.notes && (
                                <p className="text-sm text-gray-600 mt-1">{label.notes}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(label.created_at).toLocaleDateString()} at {new Date(label.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteLabel(label.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete label"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No labels added</p>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Documents ({userDetails.documents.length})
                  </h3>
                  <div className="space-y-2">
                    {userDetails.documents.map((doc) => (
                      <div key={doc.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{doc.type}</p>
                          <p className="text-xs text-gray-600">{doc.filename}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDocumentView(doc.id, doc.filename)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDocumentDownload(doc.id, doc.filename)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {userDetails.documents.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No documents uploaded</p>
                    )}
                  </div>
                </div>

                {/* Application Status Update */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Update Application Status
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={updateForm.status}
                        onChange={(e) => {
                          const selectedStatus = statusOptions.find(opt => opt.value === e.target.value);
                          setUpdateForm({
                            ...updateForm,
                            status: e.target.value,
                            progress_percentage: selectedStatus ? selectedStatus.progress : updateForm.progress_percentage
                          });
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select status...</option>
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Progress %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={updateForm.progress_percentage}
                        onChange={(e) => setUpdateForm({ ...updateForm, progress_percentage: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIF Number
                      </label>
                      <input
                        type="text"
                        value={updateForm.nif_number}
                        onChange={(e) => setUpdateForm({ ...updateForm, nif_number: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 123456789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NISS Number
                      </label>
                      <input
                        type="text"
                        value={updateForm.niss_number}
                        onChange={(e) => setUpdateForm({ ...updateForm, niss_number: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 12345678901"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Account Name
                      </label>
                      <input
                        type="text"
                        value={updateForm.bank_account_name}
                        onChange={(e) => setUpdateForm({ ...updateForm, bank_account_name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Account holder name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Account Number (IBAN)
                      </label>
                      <input
                        type="text"
                        value={updateForm.bank_account_number}
                        onChange={(e) => setUpdateForm({ ...updateForm, bank_account_number: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., PT50..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={updateForm.bank_name}
                        onChange={(e) => setUpdateForm({ ...updateForm, bank_name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Millennium BCP, Santander, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        AIMA Appointment Date
                      </label>
                      <input
                        type="date"
                        value={updateForm.aima_appointment_date}
                        onChange={(e) => setUpdateForm({ ...updateForm, aima_appointment_date: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        AIMA Appointment Location
                      </label>
                      <input
                        type="text"
                        value={updateForm.aima_appointment_location}
                        onChange={(e) => setUpdateForm({ ...updateForm, aima_appointment_location: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Lisbon Office"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={updateForm.notes}
                        onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Internal notes..."
                      />
                    </div>

                    <button
                      onClick={handleUpdateApplication}
                      disabled={saving}
                      className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 disabled:bg-gray-400 flex items-center justify-center"
                    >
                      {saving ? (
                        'Saving...'
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Loading user details...
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Messages View */}
      {view === 'messages' && (
        <div className="max-w-7xl mx-auto p-6">
          <AdminMessaging
            conversations={conversations}
            selectedConversation={selectedConversation}
            messages={messages}
            handleSendMessage={handleSendMessage}
            sendingMessage={sendingMessage}
            onSelectConversation={loadMessages}
            editingMessage={editingMessage}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
