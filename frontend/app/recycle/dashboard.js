'use client';

import { useState } from 'react';
import { ArrowLeft, Package, UtensilsCrossed, MapPin, Clock, CheckCircle, X, Eye } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function RecycleDashboard() {
  return (
    <ProtectedRoute allowedUserTypes={['vendor']}>
      <RecycleDashboardContent />
    </ProtectedRoute>
  );
}

function RecycleDashboardContent() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      type: 'recycle',
      userName: 'Rahul Sharma',
      contact: '+91 98765 43210',
      category: 'plastic',
      quantity: '5 kg',
      address: 'HSR Layout, Bengaluru',
      date: '2025-09-20',
      time: 'Morning (9 AM - 12 PM)',
      status: 'Pending',
      notes: 'Plastic bottles and containers'
    },
    {
      id: 2,
      type: 'food',
      userName: 'Priya Menon',
      contact: '+91 87654 32109',
      foodType: 'cooked',
      servings: '15 people',
      address: 'Koramangala PG, 5th Block',
      hostelName: 'Students Paradise PG',
      date: '2025-09-20',
      time: 'Evening (5 PM - 8 PM)',
      status: 'Pending',
      isUrgent: true,
      notes: 'Fresh cooked meals from hostel mess'
    },
    {
      id: 3,
      type: 'recycle',
      userName: 'Amit Kumar',
      contact: '+91 76543 21098',
      category: 'ewaste',
      quantity: '3 pieces',
      address: 'Whitefield, Bengaluru',
      date: '2025-09-21',
      time: 'Afternoon (12 PM - 4 PM)',
      status: 'Accepted',
      notes: 'Old laptop and mobile phones'
    },
    {
      id: 4,
      type: 'food',
      userName: 'Sneha Reddy',
      contact: '+91 65432 10987',
      foodType: 'vegetables',
      servings: '8 people',
      address: 'Indiranagar, Bengaluru',
      date: '2025-09-19',
      time: 'Morning (8 AM - 11 AM)',
      status: 'Collected',
      notes: 'Fresh vegetables from grocery store'
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, pending, accepted, collected, rejected

  const updateRequestStatus = (id, newStatus) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Collected': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    accepted: requests.filter(r => r.status === 'Accepted').length,
    collected: requests.filter(r => r.status === 'Collected').length,
    urgent: requests.filter(r => r.isUrgent).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/recycle" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Recycle Hub
            </Link>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recycler & NGO Dashboard</h1>
          <p className="text-gray-600">Manage incoming recycling and food donation requests</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.collected}</div>
            <div className="text-sm text-gray-600">Collected</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <div className="text-sm text-gray-600">Urgent</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              All Requests
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              Pending
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'accepted' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              Accepted
            </button>
            <button
              onClick={() => setFilter('collected')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'collected' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              Collected
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Incoming Requests</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User & Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type & Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                        <div className="text-sm text-gray-500">{request.contact}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          request.type === 'recycle' ? 'bg-green-100' : 'bg-orange-100'
                        }`}>
                          {request.type === 'recycle' ? 
                            <Package className="w-4 h-4 text-green-600" /> :
                            <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                          }
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.type === 'recycle' ? 
                              `${request.category.charAt(0).toUpperCase() + request.category.slice(1)} Recycling` :
                              `${request.foodType.charAt(0).toUpperCase() + request.foodType.slice(1)} Food`
                            }
                            {request.isUrgent && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                URGENT
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.type === 'recycle' ? request.quantity : `Serves ${request.servings}`}
                          </div>
                          {request.notes && (
                            <div className="text-xs text-gray-400 mt-1">{request.notes}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-900">{request.address}</div>
                          {request.hostelName && (
                            <div className="text-xs text-gray-500">{request.hostelName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-900">{request.date}</div>
                          <div className="text-xs text-gray-500">{request.time}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {request.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'Accepted')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">
                              Accept
                            </button>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'Rejected')}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">
                              Reject
                            </button>
                          </>
                        )}
                        {request.status === 'Accepted' && (
                          <button
                            onClick={() => updateRequestStatus(request.id, 'Collected')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                            Mark Collected
                          </button>
                        )}
                        {request.status === 'Collected' && (
                          <span className="text-green-600 text-xs font-medium">✓ Completed</span>
                        )}
                        {request.status === 'Rejected' && (
                          <span className="text-red-600 text-xs font-medium">✗ Rejected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {filter === 'all' ? 
                  <Package className="w-12 h-12 mx-auto" /> :
                  <Eye className="w-12 h-12 mx-auto" />
                }
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {filter === 'all' ? 'No requests yet' : `No ${filter} requests`}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' ? 
                  'New recycling and food donation requests will appear here.' :
                  `No requests with ${filter} status found.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Today's Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">127kg</div>
              <div className="text-sm text-gray-600">Materials Recycled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">89</div>
              <div className="text-sm text-gray-600">People Fed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-1">45kg</div>
              <div className="text-sm text-gray-600">CO₂ Emissions Saved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
