'use client';

import { useState } from 'react';
import { ArrowLeft, Upload, AlertTriangle, CheckCircle, Camera, Activity } from 'lucide-react';
import Link from 'next/link';

export default function CrowdGuardPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock analysis results
  const mockAnalysis = () => {
    const scenarios = [
      {
        status: 'Safe',
        crowdDensity: 'Low',
        riskLevel: 'Normal',
        peopleCount: 23,
        confidence: 94,
        recommendations: ['Continue normal operations', 'Monitor for any changes']
      },
      {
        status: 'Moderate Risk',
        crowdDensity: 'Medium',
        riskLevel: 'Caution',
        peopleCount: 78,
        confidence: 87,
        recommendations: ['Increase security presence', 'Monitor crowd movement', 'Prepare crowd control measures']
      },
      {
        status: 'High Risk',
        crowdDensity: 'High',
        riskLevel: 'Alert',
        peopleCount: 156,
        confidence: 91,
        recommendations: ['Immediate crowd control needed', 'Deploy additional security', 'Consider crowd dispersal measures']
      }
    ];
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  };

  const recentAlerts = [
    {
      id: 1,
      location: 'Brigade Road',
      time: '2 minutes ago',
      status: 'High Risk',
      type: 'Overcrowding',
      severity: 'high'
    },
    {
      id: 2,
      location: 'Commercial Street',
      time: '15 minutes ago',
      status: 'Resolved',
      type: 'Crowd Dispersed',
      severity: 'low'
    },
    {
      id: 3,
      location: 'MG Road Metro',
      time: '1 hour ago',
      status: 'Monitoring',
      type: 'Moderate Crowd',
      severity: 'medium'
    }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setAnalysisResult(null);
    }
  };

  const analyzeImage = () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult(mockAnalysis());
      setIsAnalyzing(false);
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Safe': return 'text-green-600 bg-green-100';
      case 'Moderate Risk': return 'text-yellow-600 bg-yellow-100';
      case 'High Risk': return 'text-red-600 bg-red-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      case 'Monitoring': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">City Safety</h1>
          <p className="text-gray-600">AI-powered crowd monitoring and event detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload & Analysis Section */}
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-blue-600" />
              Upload Image/Video for Analysis
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Upload an image or video to analyze crowd density and detect potential risks
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Choose File
              </label>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Selected: <span className="font-medium">{uploadedFile.name}</span>
                </p>
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="mt-3 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                </button>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {isAnalyzing && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Analyzing image with AI...</span>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-semibold px-2 py-1 rounded text-sm inline-block ${getStatusColor(analysisResult.status)}`}>
                      {analysisResult.status}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">People Count</p>
                    <p className="text-xl font-bold text-gray-900">{analysisResult.peopleCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Crowd Density</p>
                    <p className="font-semibold text-gray-900">{analysisResult.crowdDensity}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-xl font-bold text-gray-900">{analysisResult.confidence}%</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="text-blue-800 text-sm flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alerts & Monitoring */}
        <div className="space-y-6">
          {/* Live Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(alert.severity)}
                    <div>
                      <p className="font-medium text-gray-900">{alert.location}</p>
                      <p className="text-sm text-gray-600">{alert.type} • {alert.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(alert.status)}`}>
                    {alert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* City Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">City Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">127</div>
                <div className="text-sm text-green-700">Safe Zones</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">8</div>
                <div className="text-sm text-yellow-700">Monitoring</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">2</div>
                <div className="text-sm text-red-700">High Risk</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">45</div>
                <div className="text-sm text-blue-700">Active Cameras</div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Contact</h3>
            <p className="text-red-700 text-sm mb-4">
              For immediate assistance or to report emergencies:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-red-700">Emergency:</span>
                <span className="font-bold text-red-800">112</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Police:</span>
                <span className="font-bold text-red-800">100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Traffic Control:</span>
                <span className="font-bold text-red-800">103</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
