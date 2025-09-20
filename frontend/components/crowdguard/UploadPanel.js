'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertTriangle, Image, Video, X, Send, CheckCircle } from 'lucide-react';
import { generateId, saveMediaReport } from '../../app/crowdguard/lib/storage';
import imageCompression from 'browser-image-compression';

export default function UploadPanel({ eventId, onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('low');
  const [consentGiven, setConsentGiven] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsUploading(true);
    
    try {
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          let processedFile = file;
          
          // Compress images
          if (file.type.startsWith('image/')) {
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };
            processedFile = await imageCompression(file, options);
          }

          // Convert to data URL for storage
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                id: generateId(),
                name: file.name,
                type: file.type.startsWith('image/') ? 'image' : 'video',
                size: processedFile.size,
                dataUrl: reader.result,
                originalFile: file
              });
            };
            reader.readAsDataURL(processedFile);
          });
        })
      );

      setUploadedFiles(prev => [...prev, ...processedFiles]);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    maxFiles: 5,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentGiven) return;
    
    setIsUploading(true);

    try {
      // Save each file as a media report
      const reports = await Promise.all(
        uploadedFiles.map(async (file) => {
          let detectedSeverity = severity;
          
          // For image files, attempt to classify using AI (demo mode)
          if (file.type === 'image') {
            try {
              // Mock call to classify-image API for demonstration
              // In production, this would call the actual API
              const classificationResponse = await mockImageClassification(file.dataUrl);
              if (classificationResponse.hasCrowdingIssue) {
                detectedSeverity = classificationResponse.suggestedSeverity;
              }
            } catch (error) {
              console.log('Image classification unavailable, using manual severity');
            }
          }

          const report = {
            id: generateId(),
            eventId,
            type: file.type,
            dataUrl: file.dataUrl,
            description,
            severity: detectedSeverity,
            aiDetected: detectedSeverity !== severity,
            forwarded: false,
            uploadedAt: new Date().toISOString(),
            fileName: file.name,
            fileSize: file.size
          };

          return saveMediaReport(report);
        })
      );

      // Show success state
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setUploadedFiles([]);
        setDescription('');
        setSeverity('low');
        setConsentGiven(false);
        onUploadSuccess && onUploadSuccess(reports);
      }, 2000);

    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Mock image classification function for demo
  const mockImageClassification = async (imageDataUrl) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock classification results based on random factors for demo
    const random = Math.random();
    if (random > 0.7) {
      return {
        hasCrowdingIssue: true,
        suggestedSeverity: 'high',
        confidence: 0.85,
        detectedObjects: ['dense_crowd', 'blocked_exit']
      };
    } else if (random > 0.4) {
      return {
        hasCrowdingIssue: true,
        suggestedSeverity: 'medium',
        confidence: 0.72,
        detectedObjects: ['moderate_crowd']
      };
    } else {
      return {
        hasCrowdingIssue: false,
        suggestedSeverity: 'low',
        confidence: 0.91,
        detectedObjects: ['normal_crowd']
      };
    }
  };

  const getSeverityColor = (sev) => {
    switch(sev) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
        <p className="text-gray-600">
          {severity === 'high' && 'High severity incident has been forwarded to authorities.'}
          Your media has been saved and organizers have been notified.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Upload className="w-6 h-6 text-red-500 mr-3" />
        <div>
          <h3 className="text-lg font-bold text-gray-900">Upload Media & Reports</h3>
          <p className="text-gray-600">Share photos/videos or report incidents</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-red-400 bg-red-50' 
              : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-red-600 font-medium">Drop files here...</p>
          ) : (
            <div>
              <p className="text-gray-600 font-medium mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Images (JPG, PNG, GIF) or Videos (MP4, WebM) up to 50MB
              </p>
            </div>
          )}
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Uploaded Files</h4>
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {file.type === 'image' ? (
                    <Image className="w-5 h-5 text-blue-600 mr-3" />
                  ) : (
                    <Video className="w-5 h-5 text-purple-600 mr-3" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Describe what you're reporting or sharing..."
          />
        </div>

        {/* Severity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            Incident Severity
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['low', 'medium', 'high'].map((level) => (
              <label key={level} className="cursor-pointer">
                <input
                  type="radio"
                  name="severity"
                  value={level}
                  checked={severity === level}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-3 border-2 rounded-lg text-center transition-all ${
                  severity === level 
                    ? getSeverityColor(level) + ' border-current' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="font-medium text-sm capitalize">{level}</div>
                  <div className="text-xs mt-1 text-gray-600">
                    {level === 'low' && 'General sharing'}
                    {level === 'medium' && 'Minor issue'}
                    {level === 'high' && 'Urgent incident'}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {severity === 'high' && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ High severity reports are automatically forwarded to local authorities
              </p>
            </div>
          )}
        </div>

        {/* Consent */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-1 mr-3"
            />
            <div className="text-sm">
              <div className="font-medium text-blue-900 mb-1">Privacy Consent</div>
              <div className="text-blue-700">
                I consent to share this media with event organizers and local authorities for safety purposes. 
                I understand that high-severity reports may be forwarded automatically.
              </div>
            </div>
          </label>
        </div>        {/* Submit */}
        <button
          type="submit"
          disabled={uploadedFiles.length === 0 || !consentGiven || isUploading}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5 mr-2" />
          {isUploading ? 'Analyzing & Uploading...' : 'Submit Report'}
        </button>
        
        {/* AI Classification Notice */}
        {uploadedFiles.some(file => file.type === 'image') && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-sm text-purple-800">
              <div className="font-medium mb-1">🤖 AI-Powered Analysis</div>
              <div className="text-purple-700">
                Images will be automatically analyzed to detect crowd safety issues and suggest appropriate severity levels.
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
