// src/utils/imageOptimization.js
/**
 * Optimize an image file by resizing and compressing it
 * @param {File} file - The image file to optimize
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} maxHeight - Maximum height in pixels  
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<File>} - The optimized image file
 */
export const optimizeImage = async (file, maxWidth = 800, maxHeight = 800, quality = 0.9) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let { width, height } = img;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw the resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object with the optimized image
              const optimizedFile = new File(
                [blob], 
                file.name.replace(/\.[^/.]+$/, '.jpg'), // Always save as jpg for consistency
                {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                }
              );
              resolve(optimizedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Create a thumbnail from an image file
 * @param {File} file - The image file
 * @param {number} size - Thumbnail size (square)
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<File>} - The thumbnail file
 */
export const createThumbnail = async (file, size = 150, quality = 0.8) => {
  return optimizeImage(file, size, size, quality);
};

/**
 * Get image dimensions from a file
 * @param {File} file - The image file
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image dimensions
 * @param {File} file - The image file
 * @param {Object} constraints - Min/max width and height
 * @returns {Promise<boolean>} - Whether the image meets constraints
 */
export const validateImageDimensions = async (file, constraints = {}) => {
  const { minWidth = 0, maxWidth = Infinity, minHeight = 0, maxHeight = Infinity } = constraints;
  
  try {
    const dimensions = await getImageDimensions(file);
    
    return (
      dimensions.width >= minWidth &&
      dimensions.width <= maxWidth &&
      dimensions.height >= minHeight &&
      dimensions.height <= maxHeight
    );
  } catch (error) {
    console.error('Error validating image dimensions:', error);
    return false;
  }
};