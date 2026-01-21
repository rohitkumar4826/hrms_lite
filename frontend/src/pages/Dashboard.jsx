import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { attendanceAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceAPI.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      let errorMessage = 'Failed to load dashboard statistics';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - Backend server may not be responding';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error - Cannot connect to backend server at http://localhost:8000';
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
    fetchStats();
  }, []);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStats} />;

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.total_employees || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Total Attendance Records',
      value: stats?.total_attendance_records || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
    },
    {
      title: 'Present Today',
      value: stats?.present_today || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
    },
    {
      title: 'Absent Today',
      value: stats?.absent_today || 0,
      icon: XCircle,
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">Overview of your HR system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgLight} p-3 rounded-lg`}>
                  <Icon className={`w-8 h-8 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/employees"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer"
          >
            <Users className="w-6 h-6 text-primary-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Manage Employees</h4>
            <p className="text-sm text-gray-600">Add, view, or remove employees</p>
          </a>
          <a
            href="/attendance"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer"
          >
            <Calendar className="w-6 h-6 text-primary-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Track Attendance</h4>
            <p className="text-sm text-gray-600">Mark and view attendance records</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;