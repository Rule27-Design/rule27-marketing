import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const ImageUpload = ({
  value,
  onChange,
  onRemove,
  bucket = 'media',
  folder = 'uploads',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  disabled = false,
  showPreview = true,
  aspectRatio = 'aspect-video'
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      toast.error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onChange(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [bucket, folder, maxSize, onChange]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    onRemove?.();
  }, [onRemove]);

  return (
    <div className={cn('relative', className)}>
      {preview ? (
        <div className={cn('relative rounded-lg overflow-hidden bg-gray-100', aspectRatio)}>
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          {!disabled && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <label
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors',
            'hover:border-gray-400 hover:bg-gray-50',
            aspectRatio,
            disabled && 'opacity-50 cursor-not-allowed',
            uploading && 'pointer-events-none'
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleUpload}
            disabled={disabled || uploading}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center p-6">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            <p className="mt-2 text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max size: {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
