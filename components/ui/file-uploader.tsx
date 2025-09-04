'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, X, MapPin, Tag, File, Image, Video, FileText, Camera } from 'lucide-react';
import { CameraCapture } from '@/components/ui/camera-capture';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onTagsChange: (tags: string[]) => void;
  onLocationChange: (location: { lat: number; lng: number } | null) => void;
  allowMultiple?: boolean;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export function FileUploader({
  onFilesSelected,
  onTagsChange,
  onLocationChange,
  allowMultiple = true,
  maxSize = 50,
  acceptedTypes = ['image/*', 'video/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.dwg']
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const sizeInMB = file.size / (1024 * 1024);
      return sizeInMB <= maxSize;
    });

    if (allowMultiple) {
      const newFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    } else {
      setSelectedFiles(validFiles.slice(0, 1));
      onFilesSelected(validFiles.slice(0, 1));
    }
  }, [selectedFiles, allowMultiple, maxSize, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    multiple: allowMultiple,
    maxSize: maxSize * 1024 * 1024
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const newTags = [...tags, newTag.trim()];
      setTags(newTags);
      onTagsChange(newTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    onTagsChange(newTags);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsCapturingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(coords);
          setLocationInput(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
          setIsCapturingLocation(false);
          onLocationChange(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please enter coordinates manually.');
          setIsCapturingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleLocationInput = (value: string) => {
    setLocationInput(value);
    const coords = value.split(',').map(s => parseFloat(s.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      const locationObj = { lat: coords[0], lng: coords[1] };
      setLocation(locationObj);
      onLocationChange(locationObj);
    } else {
      setLocation(null);
      onLocationChange(null);
    }
  };

  const handleCameraCapture = (file: File) => {
    const newFiles = [...selectedFiles, file];
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
    setIsCameraOpen(false);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (file.type.includes('pdf')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* File Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input 
          {...getInputProps()} 
          ref={fileInputRef}
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports images, videos, PDFs, documents (max {maxSize}MB each)
            </p>
          </div>
        )}
      </div>

      {/* Camera and File Upload Buttons */}
      <div className="flex justify-center space-x-4">
        <Button type="button" variant="outline" onClick={() => setIsCameraOpen(true)}>
          <Camera className="mr-2 h-4 w-4" />
          Take Photo
        </Button>
        <Button type="button" variant="outline" onClick={openFileDialog}>
          <Upload className="mr-2 h-4 w-4" />
          Choose Files
        </Button>
      </div>

      <CameraCapture isOpen={isCameraOpen} onCapture={handleCameraCapture} onClose={() => setIsCameraOpen(false)} />

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tags (for easy searching)
        </label>
        <div className="flex space-x-2">
          <Input
            placeholder="Add tag (e.g., foundation, safety, progress)"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <Button type="button" onClick={addTag} size="sm">
            <Tag className="h-4 w-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                <span>{tag}</span>
                <button onClick={() => removeTag(tag)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Location (Optional)
        </label>
        <div className="flex space-x-2">
          <Input
            placeholder="Latitude, Longitude (e.g., 40.7128, -74.0060)"
            value={locationInput}
            onChange={(e) => handleLocationInput(e.target.value)}
          />
          <Button type="button" onClick={getCurrentLocation} size="sm">
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
        {location && (
          <p className="text-sm text-green-600">
            📍 Location set: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        )}
      </div>

      {/* Quick Tag Suggestions */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Quick Tags:
        </label>
        <div className="flex flex-wrap gap-2">
          {['foundation', 'framing', 'electrical', 'plumbing', 'safety', 'progress', 'inspection', 'materials', 'equipment', 'weather'].map((quickTag) => (
            <Button
              key={quickTag}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (!tags.includes(quickTag)) {
                  const newTags = [...tags, quickTag];
                  setTags(newTags);
                  onTagsChange(newTags);
                }
              }}
              className="text-xs"
            >
              {quickTag}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}