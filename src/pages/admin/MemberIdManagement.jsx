// src/pages/admin/MemberIdManagement.jsx
import React, { useState, useEffect } from 'react';
import { memberIdService } from '../../services/memberIdService';
import { FaSync, FaUsers, FaIdCard, FaChartBar, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const MemberIdManagement = () => {
  const [stats, setStats] = useState(null);
  const [usersWithoutMemberID, setUsersWithoutMemberID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await memberIdService.getStats();
      setStats(response.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users without member IDs
  const fetchUsersWithoutMemberID = async (page = 1) => {
    try {
      setLoading(true);
      const response = await memberIdService.getUsersWithoutMemberID(page, 10);
      setUsersWithoutMemberID(response.data.users);
      setPagination(response.data.pagination);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch users without member IDs');
    } finally {
      setLoading(false);
    }
  };

  // Migrate all users
  const handleMigrateAllUsers = async () => {
    if (!window.confirm('Are you sure you want to migrate all users without member IDs? This action cannot be undone.')) {
      return;
    }

    try {
      setMigrating(true);
      const response = await memberIdService.migrateAllUsers();
      
      if (response.success) {
        setSuccess(response.message);
        // Refresh data
        await fetchStats();
        await fetchUsersWithoutMemberID(currentPage);
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(response.message || 'Migration failed');
      }
    } catch (err) {
      setError(err.message || 'Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  // Generate member ID for a specific user
  const handleGenerateForMember = async (userId) => {
    try {
      setLoading(true);
      const response = await memberIdService.generateMemberIDForUser(userId);
      
      if (response.success) {
        setSuccess(`Member ID generated for ${response.data.userName}`);
        // Refresh data
        await fetchStats();
        await fetchUsersWithoutMemberID(currentPage);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to generate member ID');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate member ID');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setCurrentPage(newPage);
      fetchUsersWithoutMemberID(newPage);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchStats();
    fetchUsersWithoutMemberID(currentPage);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Member ID Management</h1>
        <p className="text-gray-600">Manage and monitor member ID generation for all users</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <FaCheckCircle className="mr-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <FaExclamationTriangle className="mr-2" />
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <FaUsers className="text-blue-500 text-2xl mr-4" />
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <FaIdCard className="text-green-500 text-2xl mr-4" />
              <div>
                <p className="text-gray-500 text-sm">With Member ID</p>
                <p className="text-2xl font-bold">{stats.usersWithMemberID}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-yellow-500 text-2xl mr-4" />
              <div>
                <p className="text-gray-500 text-sm">Without Member ID</p>
                <p className="text-2xl font-bold">{stats.usersWithoutMemberID}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <FaChartBar className="text-purple-500 text-2xl mr-4" />
              <div>
                <p className="text-gray-500 text-sm">Completion</p>
                <p className="text-2xl font-bold">{stats.completionPercentage}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Migration Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Migration Tools</h2>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 mb-3">
            <strong>Migration Status:</strong> {stats ? `${stats.usersWithMemberID} of ${stats.totalUsers} users have member IDs` : 'Loading...'}
          </p>
          
          {stats && stats.usersWithoutMemberID > 0 ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleMigrateAllUsers}
                disabled={migrating}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center justify-center"
              >
                {migrating ? (
                  <>
                    <FaSync className="animate-spin mr-2" />
                    Migrating...
                  </>
                ) : (
                  'Migrate All Users'
                )}
              </button>
              <p className="text-sm text-blue-700 mt-2 sm:mt-0">
                This will automatically generate member IDs for all {stats.usersWithoutMemberID} users without them.
              </p>
            </div>
          ) : (
            <p className="text-green-700 flex items-center">
              <FaCheckCircle className="mr-2" />
              All users have member IDs. No migration needed.
            </p>
          )}
        </div>
      </div>

      {/* Users Without Member ID Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Users Without Member ID</h2>
          <p className="text-gray-600 text-sm mt-1">
            {usersWithoutMemberID.length} users need member IDs
          </p>
        </div>

        {loading && usersWithoutMemberID.length === 0 ? (
          <div className="text-center py-8">
            <p>Loading users...</p>
          </div>
        ) : usersWithoutMemberID.length === 0 ? (
          <div className="text-center py-8">
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
            <p className="text-gray-600">All users have member IDs!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersWithoutMemberID.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.mobile || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleGenerateForMember(user._id)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        >
                          Generate Member ID
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.page} of {pagination.pages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MemberIdManagement;