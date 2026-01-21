import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { employeeAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      let errorMessage = 'Failed to load employees';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - Backend server may not be responding';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error - Cannot connect to backend server';
      } else if (err.response?.status === 404) {
        errorMessage = 'API endpoint not found (404)';
      } else if (err.response?.status === 500) {
        errorMessage = `Server error: ${err.response?.data?.detail || 'Internal server error'}`;
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      await employeeAPI.create(formData);
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
      });
      setIsModalOpen(false);
      await fetchEmployees();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(employeeId);
        await fetchEmployees();
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete employee');
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section - ALWAYS VISIBLE */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Employees</h1>
            <p className="mt-1 md:mt-2 text-gray-600">Manage your organization's employees</p>
          </div>
          
          {/* Add Employee Button - ALWAYS VISIBLE */}
          <button
            onClick={() => {
              setFormData({ employee_id: '', full_name: '', email: '', department: '' });
              setFormError(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-sm"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mb-6">
          <Loading message="Loading employees..." />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mb-6">
          <ErrorMessage message={error} onRetry={fetchEmployees} />
        </div>
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Employee ID</th>
                    <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 md:px-6 text-center text-gray-500">
                        {employees.length === 0 ? 'No employees found' : 'No employees match your search'}
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-900 font-medium">{emp.employee_id}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-900">{emp.full_name}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-600">{emp.email}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-600">{emp.department}</td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-sm">
                          <button
                            onClick={() => handleDelete(emp.employee_id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                            title="Delete employee"
                          >
                            <Trash2 className="w-4 h-4 md:w-4 md:h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Employee"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {formError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              required
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g., EMP001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g., John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g., john@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g., IT"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;