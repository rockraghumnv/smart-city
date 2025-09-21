'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Recycle, 
  CheckCircle, 
  XCircle, 
  Weight, 
  Building, 
  User, 
  Home, 
  Calendar,
  MapPin,
  ShoppingCart,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function VendorDashboard() {
  return (
    <ProtectedRoute>
      <VendorDashboardContent />
    </ProtectedRoute>
  );
}

function VendorDashboardContent() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Mock vendor token - in real app, get from auth context
  const vendorToken = 'vendor_token_123';
  
  // API Base URL
  const API_BASE = 'http://localhost:5000/api';

  // Sample product data posted by individual users
  const sampleProducts = [
    {
      id: 'prod_1',
      name: 'Plastic Bottles & Containers',
      category: 'plastic',
      weight: 15.5,
      uploadedBy: 'Sarah Johnson',
      uploaderType: 'individual',
      dateUploaded: '2025-09-21',
      location: 'Green Valley Apartment, Block A',
      description: 'Collection of clean plastic bottles, food containers, and packaging materials. All items are properly cleaned and sorted.',
      phone: '+1-234-567-8901',
      email: 'sarah.johnson@email.com',
      address: '123 Green Valley St, Apartment 4B',
      image: null,
      status: 'pending',
      price: 45.50
    },
    {
      id: 'prod_2',
      name: 'Old Electronics & Cables',
      category: 'e-waste',
      weight: 8.2,
      uploadedBy: 'Mike Chen',
      uploaderType: 'individual',
      dateUploaded: '2025-09-20',
      location: 'Downtown Tech District',
      description: 'Old smartphone, tablet, chargers, and various cables. All devices have been factory reset.',
      phone: '+1-234-567-8902',
      email: 'mike.chen@email.com',
      address: '456 Tech Avenue, Suite 12',
      image: null,
      status: 'pending',
      price: 120.00
    },
    {
      id: 'prod_3',
      name: 'Paper & Cardboard Bundle',
      category: 'paper',
      weight: 22.0,
      uploadedBy: 'Emily Rodriguez',
      uploaderType: 'individual',
      dateUploaded: '2025-09-21',
      location: 'Riverside Residential Complex',
      description: 'Newspapers, magazines, office papers, and cardboard boxes. All clean and dry.',
      phone: '+1-234-567-8903',
      email: 'emily.rodriguez@email.com',
      address: '789 Riverside Drive, House 15',
      image: null,
      status: 'pending',
      price: 28.75
    },
    {
      id: 'prod_4',
      name: 'Metal Cans & Scrap',
      category: 'metal',
      weight: 12.3,
      uploadedBy: 'David Wilson',
      uploaderType: 'individual',
      dateUploaded: '2025-09-19',
      location: 'Suburban Area',
      description: 'Aluminum cans, steel cans, and small metal scraps. All items are clean.',
      phone: '+1-234-567-8904',
      email: 'david.wilson@email.com',
      address: '321 Suburban Lane, House 8',
      image: null,
      status: 'pending',
      price: 67.20
    },
    {
      id: 'prod_5',
      name: 'Glass Bottles Collection',
      category: 'glass',
      weight: 18.7,
      uploadedBy: 'Lisa Thompson',
      uploaderType: 'individual',
      dateUploaded: '2025-09-21',
      location: 'City Center',
      description: 'Various glass bottles and jars. All clean and sorted by color.',
      phone: '+1-234-567-8905',
      email: 'lisa.thompson@email.com',
      address: '654 City Center Plaza, Apt 202',
      image: null,
      status: 'pending',
      price: 35.90
    }
  ];

  // Initialize data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Buy product (accept order)
  const buyProduct = async (product) => {
    try {
      // In real app, call API
      // const response = await fetch(`${API_BASE}/orders`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${vendorToken}`
      //   },
      //   body: JSON.stringify({ productIds: [product.id] })
      // });
      
      // For demo, remove from list
      setProducts(products.filter(p => p.id !== product.id));
      showToast(`Successfully bought ${product.name} for $${product.price}`, 'success');
    } catch (error) {
      console.error('Error buying product:', error);
      showToast('Failed to buy product', 'error');
    }
  };

  // Reject product request
  const rejectProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    showToast('Product request rejected', 'success');
  };

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Get uploader icon
  const getUploaderIcon = (type) => {
    switch (type) {
      case 'company': return Building;
      case 'hostel': 
      case 'institution': return Home;
      default: return User;
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      plastic: 'bg-blue-100 text-blue-800',
      paper: 'bg-green-100 text-green-800',
      food: 'bg-orange-100 text-orange-800',
      'e-waste': 'bg-purple-100 text-purple-800',
      metal: 'bg-gray-100 text-gray-800',
      glass: 'bg-cyan-100 text-cyan-800',
      textile: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex items-center gap-2">
                <Recycle className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-semibold text-gray-900">Vendor Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name || 'Vendor'}</span>
              <button 
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Requests from Users</h2>
          <p className="text-gray-600">Review and purchase recycled materials from individual users</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product requests...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-100 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Product Requests Available</h3>
            <p className="text-gray-600">There are currently no pending product requests from users.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map(product => {
              const UploaderIcon = getUploaderIcon(product.uploaderType);
              return (
                <div 
                  key={product.id} 
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Weight className="h-4 w-4 mr-1" />
                        <span>{product.weight} kg</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>{product.description}</p>

                  {/* User Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Information
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <User className="h-3 w-3 mr-2" />
                        <span className="font-medium">{product.uploadedBy}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium text-blue-600">{product.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium">{product.phone}</span>
                      </div>
                      <div className="flex items-start text-gray-600">
                        <MapPin className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-xs">{product.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Posted: {new Date(product.dateUploaded).toLocaleDateString()}</span>
                    </div>
                    {product.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{product.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => buyProduct(product)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Buy
                    </button>
                    <button
                      onClick={() => rejectProduct(product.id)}
                      className="flex-1 border-2 border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toastType === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toastType === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
