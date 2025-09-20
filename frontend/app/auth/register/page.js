'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Lock, Building, Users, Home, ArrowLeft, Eye, EyeOff, CheckCircle, Phone } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: '',
    organizationName: '', // For hostel, company, vendor
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const router = useRouter();

  const userTypes = [
    {
      id: 'individual',
      name: 'Individual',
      description: 'Personal account for citizens',
      icon: User,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      selectedColor: 'border-blue-500 bg-blue-50'
    },
    {
      id: 'hostel',
      name: 'Hostel/PG',
      description: 'For hostels, PGs, and student accommodations',
      icon: Home,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      selectedColor: 'border-orange-500 bg-orange-50'
    },
    {
      id: 'company',
      name: 'Company',
      description: 'Corporate and business accounts',
      icon: Building,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      selectedColor: 'border-purple-500 bg-purple-50'
    },
    {
      id: 'vendor',
      name: 'Vendor/NGO',
      description: 'Service providers, recyclers, and NGOs',
      icon: Users,
      color: 'text-green-600 bg-green-50 border-green-200',
      selectedColor: 'border-green-500 bg-green-50'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleUserTypeSelect = (userType) => {
    setFormData({
      ...formData,
      userType
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.userType) {
      return 'Please fill in all required fields';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }

    if (['hostel', 'company', 'vendor'].includes(formData.userType) && !formData.organizationName) {
      return 'Organization name is required for this account type';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    // Prepare registration data
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      userType: formData.userType,
      organizationName: formData.organizationName,
      address: formData.address,
    };

    const result = await register(registrationData);

    if (result.success) {
      router.push('/'); // Redirect to dashboard
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center mb-6">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join GreenShift</h2>
          <p className="text-gray-600">Create your account and start making a difference</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Account Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleUserTypeSelect(type.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                      formData.userType === type.id 
                        ? type.selectedColor 
                        : `${type.color} hover:border-gray-300`
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-6 h-6 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">{type.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                      </div>
                    </div>
                    {formData.userType === type.id && (
                      <CheckCircle className="w-5 h-5 text-green-600 float-right mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Organization Name (for non-individual accounts) */}
          {['hostel', 'company', 'vendor'].includes(formData.userType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.userType === 'hostel' ? 'Hostel/PG Name' :
                 formData.userType === 'company' ? 'Company Name' :
                 'Organization Name'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder={
                    formData.userType === 'hostel' ? 'e.g., Students Paradise PG' :
                    formData.userType === 'company' ? 'e.g., TechCorp Solutions' :
                    'e.g., GreenCycle NGO'
                  }
                  required
                />
              </div>
            </div>
          )}

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              rows="2"
              placeholder="Enter your address (optional)"
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Create password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>Password must be at least 6 characters long</p>
            <p>We recommend using a mix of letters, numbers, and symbols</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Footer Links */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
