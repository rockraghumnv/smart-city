'use client';

import { useState } from 'react';
import { ArrowLeft, Recycle, UtensilsCrossed, Camera, MapPin, Calendar, Clock, Upload, CheckCircle, Coins, Truck, Package, AlertCircle, Users, Leaf } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function RecycleHubPage() {
  return (
    <ProtectedRoute>
      <RecycleHubContent />
    </ProtectedRoute>
  );
}

function RecycleHubContent() {
  const [currentView, setCurrentView] = useState('home');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [classification, setClassification] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  // Use env-based API base URL, fallback to localhost:5000
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [requests, setRequests] = useState([
    { id: 1, type: 'recycle', category: 'plastic', quantity: '5', status: 'Completed', date: '2025-09-15', points: 50 },
    { id: 2, type: 'food', foodType: 'cooked', servings: '10', status: 'Completed', date: '2025-09-18', points: 200 }
  ]);
  const [userStats, setUserStats] = useState({
    totalPoints: 2450,
    itemsRecycled: 87,
    foodDonations: 23,
    carbonSaved: 156
  });

  const recycleCategories = [
    { id: 'plastic', name: 'Plastic', points: 10, unit: 'kg', icon: '♻️' },
    { id: 'paper', name: 'Paper', points: 5, unit: 'kg', icon: '📄' },
    { id: 'ewaste', name: 'E-waste', points: 50, unit: 'pieces', icon: '💻' },
    { id: 'clothes', name: 'Clothes', points: 12, unit: 'pieces', icon: '👕' },
    { id: 'furniture', name: 'Furniture', points: 25, unit: 'pieces', icon: '🪑' },
    { id: 'metal', name: 'Metal', points: 15, unit: 'kg', icon: '🔩' }
  ];

  const foodTypes = [
    { id: 'cooked', name: 'Cooked Meals', points: 20, icon: '🍽️' },
    { id: 'vegetables', name: 'Fresh Vegetables', points: 15, icon: '🥬' },
    { id: 'packaged', name: 'Packaged Food', points: 10, icon: '📦' }
  ];

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setClassification(null);
    setUploadError('');
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setIsUploading(true);
      try {
        const formData = new FormData();
        // Backend expects the field name 'file' for the image
        formData.append('file', file);
        // Provide minimal required fields for productController
        formData.append('name', 'Recyclable Item');
        formData.append('description', 'User uploaded recyclable item');
        formData.append('price', '0.50');

        const token = typeof window !== 'undefined' ? localStorage.getItem('greenshift_token') : null;
        const uploadRes = await fetch(`${API_BASE_URL}/products/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          throw new Error(errText || 'Image upload failed');
        }

        const uploadData = await uploadRes.json();
        // Use backend's AI analysis directly for the UI classification box
        setClassification({
          result: uploadData.analysis || 'Upload successful',
          recyclable: true,
          message: uploadData.analysis || 'Upload successful',
        });
      } catch (err) {
        setUploadError(err.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const submitRequest = (type, formData) => {
    const newRequest = {
      id: Date.now(),
      type,
      ...formData,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
      points: type === 'recycle' 
        ? recycleCategories.find(c => c.id === formData.category)?.points * parseInt(formData.quantity) || 0
        : foodTypes.find(f => f.id === formData.foodType)?.points * parseInt(formData.servings) || 0
    };
    setRequests([...requests, newRequest]);
    setUserStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + newRequest.points,
      [type === 'recycle' ? 'itemsRecycled' : 'foodDonations']: prev[type === 'recycle' ? 'itemsRecycled' : 'foodDonations'] + 1
    }));
    setCurrentView('confirmation');
  };

  const HomeView = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recycle Hub</h1>
        <p className="text-gray-600">Make a difference through recycling and food donation</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">{userStats.totalPoints}</div>
          <div className="text-sm text-gray-600">Total Points</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">{userStats.itemsRecycled}</div>
          <div className="text-sm text-gray-600">Items Recycled</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-orange-600">{userStats.foodDonations}</div>
          <div className="text-sm text-gray-600">Food Donations</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-teal-600">{userStats.carbonSaved}kg</div>
          <div className="text-sm text-gray-600">CO₂ Saved</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-8 text-white cursor-pointer transform hover:scale-105 transition-transform"
             onClick={() => setCurrentView('recycle-form')}>
          <div className="flex items-center justify-between mb-4">
            <Recycle className="w-12 h-12" />
            <div className="text-right">
              <div className="text-2xl font-bold">♻️</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Recycle Items</h3>
          <p className="text-green-100 mb-6">Turn your waste into rewards. Schedule pickup for plastic, e-waste, clothes, and more.</p>
          <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Start Recycling
          </button>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-8 text-white cursor-pointer transform hover:scale-105 transition-transform"
             onClick={() => setCurrentView('food-form')}>
          <div className="flex items-center justify-between mb-4">
            <UtensilsCrossed className="w-12 h-12" />
            <div className="text-right">
              <div className="text-2xl font-bold">🍽️</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Donate Food</h3>
          <p className="text-orange-100 mb-6">Share surplus food with those in need. Help reduce food waste and hunger.</p>
          <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
            Donate Food
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setCurrentView('wallet')}
          className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center space-x-3 hover:border-green-500 transition-colors">
          <Coins className="w-6 h-6 text-yellow-500" />
          <span className="font-medium">View Wallet</span>
        </button>
        <button 
          onClick={() => setCurrentView('history')}
          className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center space-x-3 hover:border-blue-500 transition-colors">
          <Clock className="w-6 h-6 text-blue-500" />
          <span className="font-medium">Request History</span>
        </button>
      </div>
    </div>
  );

  const RecycleForm = () => {
    const [formDataState, setFormData] = useState({
      category: '',
      quantity: '',
      address: '',
      date: '',
      time: '',
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formDataState.category || !formDataState.quantity || !formDataState.address) {
        alert('Please fill in all required fields');
        return;
      }
      submitRequest('recycle', formDataState);
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('home')} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Schedule Recycling Pickup</h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {recycleCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData({...formDataState, category: category.id})}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    formDataState.category === category.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-gray-500">{category.points} pts/{category.unit}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedImage ? (
                <div className="space-y-3">
                  <img src={uploadedImage} alt="Uploaded" className="mx-auto h-32 w-32 object-cover rounded-lg" />
                  <button type="button" onClick={() => { setUploadedImage(null); setClassification(null); }} className="text-red-500 text-sm">Remove</button>
                </div>
              ) : (
                <div>
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="photo-upload" />
                    <label htmlFor="photo-upload" className="cursor-pointer text-green-600 hover:text-green-500">
                      Click to upload photo
                    </label>
                  </div>
                </div>
              )}
              {isUploading && <div className="text-sm text-gray-500 mt-2">Uploading...</div>}
              {uploadError && <div className="text-red-600 text-sm mt-2">{uploadError}</div>}
              {classification && (
                <div className="mt-4 p-4 rounded-lg border border-green-200 bg-green-50 text-left">
                  <div className="font-semibold">Classification Result:</div>
                  <div className="mt-1">{classification.result}</div>
                  <div className="mt-1 font-medium">
                    {classification.recyclable ? (
                      <span className="text-green-700">♻️ {classification.message}</span>
                    ) : (
                      <span className="text-red-700">🚫 {classification.message}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
            <input
              type="number"
              min="1"
              value={formDataState.quantity}
              onChange={(e) => setFormData({...formDataState, quantity: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address *</label>
            <textarea
              value={formDataState.address}
              onChange={(e) => setFormData({...formDataState, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="3"
              placeholder="Enter your full pickup address"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <input
                type="date"
                value={formDataState.date}
                onChange={(e) => setFormData({...formDataState, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
              <select
                value={formDataState.time}
                onChange={(e) => setFormData({...formDataState, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select time</option>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="evening">Evening (4 PM - 7 PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formDataState.notes}
              onChange={(e) => setFormData({...formDataState, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="2"
              placeholder="Any special instructions for pickup"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold">
            Schedule Pickup
          </button>
        </form>
      </div>
    );
  };

  const FoodForm = () => {
    const [formData, setFormData] = useState({
      foodType: '',
      servings: '',
      address: '',
      hostelName: '',
      date: '',
      time: '',
      isUrgent: false,
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.foodType || !formData.servings || !formData.address) {
        alert('Please fill in all required fields');
        return;
      }
      submitRequest('food', formData);
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('home')} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Donate Food</h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Type *</label>
            <div className="grid md:grid-cols-3 gap-3">
              {foodTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({...formData, foodType: type.id})}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    formData.foodType === type.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="font-medium text-sm">{type.name}</div>
                  <div className="text-xs text-gray-500">{type.points} pts/serving</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
            <input
              type="checkbox"
              id="urgent"
              checked={formData.isUrgent}
              onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})}
              className="w-4 h-4 text-orange-600"
            />
            <label htmlFor="urgent" className="text-sm font-medium">
              <AlertCircle className="w-4 h-4 inline mr-1 text-orange-500" />
              Urgent donation (expires today)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Quantity * (serves how many people)</label>
            <input
              type="number"
              min="1"
              value={formData.servings}
              onChange={(e) => setFormData({...formData, servings: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Number of people this can serve"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="3"
                placeholder="Full pickup address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hostel/PG Name</label>
              <input
                type="text"
                value={formData.hostelName}
                onChange={(e) => setFormData({...formData, hostelName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Name of hostel, PG, or building"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Window</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select time</option>
                <option value="morning">Morning (8 AM - 11 AM)</option>
                <option value="lunch">Lunch Time (11 AM - 2 PM)</option>
                <option value="evening">Evening (5 PM - 8 PM)</option>
                <option value="anytime">Anytime Today (Urgent)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="2"
              placeholder="Description of food, any special handling instructions"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition-colors font-semibold">
            Donate Food
          </button>
        </form>
      </div>
    );
  };

  const ConfirmationView = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your contribution! Your request has been submitted and our partner will contact you soon.
        </p>
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <p className="text-green-800 font-medium">
            🎉 You've earned points for this request! Check your wallet to see your updated balance.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentView('home')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Back to Home
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
            View History
          </button>
        </div>
      </div>
    </div>
  );

  const WalletView = () => (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentView('home')} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">My Wallet</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">Total Points</h3>
              <div className="text-4xl font-bold">{userStats.totalPoints}</div>
            </div>
            <Coins className="w-16 h-16 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Your Environmental Impact</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Recycle className="w-6 h-6 text-green-500" />
                <span>Items Recycled</span>
              </div>
              <span className="font-bold">{userStats.itemsRecycled}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <UtensilsCrossed className="w-6 h-6 text-orange-500" />
                <span>Food Donations</span>
              </div>
              <span className="font-bold">{userStats.foodDonations}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Leaf className="w-6 h-6 text-teal-500" />
                <span>CO₂ Saved</span>
              </div>
              <span className="font-bold">{userStats.carbonSaved}kg</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-800 mb-2">🌟 Amazing Impact!</h3>
          <p className="text-green-700">
            You recycled {userStats.itemsRecycled} items and donated {userStats.foodDonations} meals this month, 
            saving {userStats.carbonSaved}kg of CO₂ emissions. Keep up the great work!
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 mb-2">Redeem Rewards</h3>
          <p className="text-gray-600 text-sm">
            Coming soon! Use your points to get discounts, vouchers, and eco-friendly products.
          </p>
        </div>
      </div>
    </div>
  );

  const HistoryView = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentView('home')} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Request History</h2>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No requests yet</h3>
          <p className="text-gray-500 mb-6">
            Start your first recycling request or food donation to see your history here.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCurrentView('recycle-form')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Start Recycling
            </button>
            <button
              onClick={() => setCurrentView('food-form')}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Donate Food
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    request.type === 'recycle' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {request.type === 'recycle' ? 
                      <Recycle className="w-6 h-6 text-green-600" /> :
                      <UtensilsCrossed className="w-6 h-6 text-orange-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-bold">
                      {request.type === 'recycle' ? 
                        `${recycleCategories.find(c => c.id === request.category)?.name} Recycling` :
                        `${foodTypes.find(f => f.id === request.foodType)?.name} Donation`
                      }
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {request.type === 'recycle' ? 
                        `${request.quantity} ${recycleCategories.find(c => c.id === request.category)?.unit}` :
                        `Serves ${request.servings} people`
                      }
                    </p>
                    <p className="text-gray-500 text-xs">{request.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {request.status}
                  </div>
                  <div className="text-lg font-bold text-green-600 mt-1">+{request.points} pts</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {currentView === 'home' && <HomeView />}
        {currentView === 'recycle-form' && <RecycleForm />}
        {currentView === 'food-form' && <FoodForm />}
        {currentView === 'confirmation' && <ConfirmationView />}
        {currentView === 'wallet' && <WalletView />}
        {currentView === 'history' && <HistoryView />}
      </div>
    </div>
  );
}
