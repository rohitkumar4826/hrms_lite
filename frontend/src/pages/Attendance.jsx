import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle, XCircle, Filter, User } from 'lucide-react';
import { attendanceAPI, employeeAPI } from '../services/api';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedEmployeeStats, setSelectedEmployeeStats] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    employee_id: '',
    start_date: '',
    end_date: '',
  });

  // Form data
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filters.employee_id) params.employee_id = filters.employee_id;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      
      const response = await attendanceAPI.getAll(params);
      setAttendance(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      console.log('Fetching employees...');
      const response = await employeeAPI.getAll();
      console.log('Employees fetched:', response.data);
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to load employees:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError('Failed to load employees for dropdown');
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    fetchAttendance();
  };

  const clearFilters = () => {
    setFilters({ employee_id: '', start_date: '', end_date: '' });
    setTimeout(fetchAttendance, 0);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting attendance with data:', formData);
    
    // Validate form
    if (!formData.employee_id) {
      setFormError('Please select an employee');
      return;
    }
    if (!formData.date) {
      setFormError('Please select a date');
      return;
    }
    if (!formData.status) {
      setFormError('Please select a status');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      console.log('Calling API with:', formData);
      const response = await attendanceAPI.create(formData);
      console.log('Success! Response:', response);
      
      // Show success message
      alert('✅ Attendance marked successfully!');
      
      // Close modal and reset form
      setIsModalOpen(false);
      setFormData({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
      });
      
      // Refresh attendance records
      await fetchAttendance();
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      let errorMessage = 'Failed to mark attendance';
      
      if (err.response?.status === 400) {
        errorMessage = err.response.data?.detail || 'Invalid attendance data (may be duplicate)';
      } else if (err.response?.status === 404) {
        errorMessage = 'Employee not found';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setFormError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const viewEmployeeStats = async (employeeId) => {
    try {
      const response = await attendanceAPI.getEmployeeStats(employeeId);
      setSelectedEmployeeStats(response.data);
      setIsStatsModalOpen(true);
    } catch (err) {
      alert('Failed to load employee statistics');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Attendance</h2>
          <p className="mt-2 text-gray-600">Track employee attendance</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Mark Attendance</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
            <select name="employee_id" value={filters.employee_id} onChange={handleFilterChange} className="input-field">
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} className="input-field" />
          </div>
          <div className="flex items-end space-x-2">
            <button onClick={applyFilters} className="btn-primary flex-1">Apply</button>
            <button onClick={clearFilters} className="btn-secondary flex-1">Clear</button>
          </div>
        </div>
      </div>

      {loading && <Loading message="Loading attendance records..." />}
      {error && <ErrorMessage message={error} onRetry={fetchAttendance} />}

      {!loading && !error && attendance.length === 0 && (
        <EmptyState
          title="No attendance records found"
          description="Start marking attendance to see records here."
          action={
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Mark Attendance</span>
            </button>
          }
        />
      )}

      {!loading && !error && attendance.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.employee?.full_name || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.employee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        record.status === 'Present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'Present' ? (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1" />
                        )}
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => viewEmployeeStats(record.employee_id)}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        View Stats
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mark Attendance Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mark Attendance">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <ErrorMessage message={formError} />}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
            <select name="employee_id" value={formData.employee_id} onChange={handleInputChange} className="input-field" required>
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Present"
                  checked={formData.status === 'Present'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                <span>Present</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Absent"
                  checked={formData.status === 'Absent'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <XCircle className="w-5 h-5 text-red-600 mr-1" />
                <span>Absent</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Marking...' : 'Mark Attendance'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Employee Stats Modal */}
      <Modal isOpen={isStatsModalOpen} onClose={() => setIsStatsModalOpen(false)} title="Employee Statistics">
        {selectedEmployeeStats && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Employee Name</p>
              <p className="text-lg font-semibold">{selectedEmployeeStats.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Employee ID</p>
              <p className="text-lg font-semibold">{selectedEmployeeStats.employee_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="text-lg font-semibold">{selectedEmployeeStats.department}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{selectedEmployeeStats.total_present}</p>
                <p className="text-sm text-gray-600">Present Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{selectedEmployeeStats.total_absent}</p>
                <p className="text-sm text-gray-600">Absent Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedEmployeeStats.total_days}</p>
                <p className="text-sm text-gray-600">Total Days</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Attendance;