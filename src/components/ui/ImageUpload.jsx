// src/components/ui/ImageUpload.jsx
import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import Button from './Button';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';
import { optimizeImage } from '../../utils/imageOptimization';

const ImageUpload = ({ 
  value = '', 
  onChange, 
  bucket = 'media',
  folder = 'uploads',
  label = 'Image',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
  showPreview = true,
  multiple = false,
  disabled = false,
  optimize = true,
  optimizeOptions = {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.9
  }
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Validate file
      if (file.size > maxSize) {
        throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Optimize image if enabled and file is larger than 500KB
      let fileToUpload = file;
      if (optimize && file.size > 500 * 1024) {
        try {
          console.log(`Optimizing image from ${(file.size / 1024).toFixed(2)}KB...`);
          fileToUpload = await optimizeImage(
            file,
            optimizeOptions.maxWidth,
            optimizeOptions.maxHeight,
            optimizeOptions.quality
          );
          console.log(`Optimized to ${(fileToUpload.size / 1024).toFixed(2)}KB`);
        } catch (error) {
          console.warn('Image optimization failed, using original:', error);
        }
      }

      // Generate unique filename
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Optionally store in media table for tracking (with proper auth)
      try {
        // Get the current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Only try to insert if we have a user
          const { error: mediaError } = await supabase.from('media').insert({
            file_name: fileName,
            original_name: file.name,
            file_url: publicUrl,
            file_path: filePath,
            file_type: 'image',
            mime_type: fileToUpload.type,
            file_size: fileToUpload.size,
            folder: folder,
            is_public: true,
            uploaded_by: session.user.id // Include the user ID for RLS
          });

          if (mediaError) {
            // Log but don't fail the upload
            console.warn('Failed to track in media table:', mediaError);
          }
        }
      } catch (mediaError) {
        // Don't fail the upload if media tracking fails
        console.warn('Media tracking skipped:', mediaError);
      }

      onChange(publicUrl);
      setUploadProgress(100);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;
    
    if (multiple) {
      // Handle multiple files
      Array.from(files).forEach(uploadFile);
    } else {
      // Handle single file
      uploadFile(files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlInput = (url) => {
    onChange(url);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Current Image Preview */}
      {value && showPreview && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600 text-white rounded-full"
            disabled={disabled}
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors',
          dragActive ? 'border-accent bg-accent/5' : 'border-gray-300',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-accent hover:bg-accent/5'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin mx-auto h-8 w-8 text-accent">
                <Icon name="RefreshCw" size={32} />
              </div>
              <p className="text-sm text-gray-600">
                {optimize && uploadProgress < 50 ? 'Optimizing...' : 'Uploading...'}
              </p>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Icon name="Upload" size={32} className="mx-auto text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, JPEG up to {maxSize / 1024 / 1024}MB
                </p>
                {optimize && (
                  <p className="text-xs text-gray-400 mt-1">
                    Images will be automatically optimized
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* URL Input Option */}
      <div className="text-center text-sm text-gray-500">or</div>
      
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-600">
          Paste Image URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => handleUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-accent focus:border-accent"
            disabled={disabled}
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="shrink-0"
              disabled={disabled}
            >
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Gallery Upload Component
export const GalleryUpload = ({ 
  value = [], 
  onChange, 
  label = 'Gallery Images',
  maxImages = 10,
  ...props 
}) => {
  const addImage = (url) => {
    if (value.length < maxImages) {
      onChange([...value, url]);
    }
  };

  const removeImage = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const updateImage = (index, url) => {
    const newValue = [...value];
    newValue[index] = url;
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} ({value.length}/{maxImages})
        </label>
      )}

      {/* Existing Images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeImage(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Image */}
      {value.length < maxImages && (
        <ImageUpload
          value=""
          onChange={addImage}
          label={`Add Image ${value.length + 1}`}
          showPreview={false}
          {...props}
        />
      )}
    </div>
  );
};

export default ImageUpload;