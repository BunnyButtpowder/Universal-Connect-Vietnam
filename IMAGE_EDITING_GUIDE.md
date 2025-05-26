# Image Editing Functionality

This document explains the new image editing functionality that has been implemented for the Universal Connect Vietnam (UCV) content management system.

## Overview

The image editing functionality allows administrators to upload and replace images throughout the website content management system. When a new image is uploaded to replace an existing one, the old image is automatically deleted from both the server filesystem and the database to prevent storage bloat.

## Features

### 1. Image Replacement with Automatic Cleanup
- When uploading a new image to replace an existing one, the old image file is automatically deleted
- Old image records are removed from the database
- This prevents accumulation of unused images on the server

### 2. Supported Components
The following components now support image editing with automatic replacement:

#### Content Management System (CMS)
- **AboutUsEditor**: Main about us image
- **AboutUsBannerEditor**: Banner image
- **AboutUsCarouselEditor**: All three carousel images
- **SignUpFormSuccessEditor**: Success screen image
- **ContentEditor**: All image type content items
- **ImageCarouselEditor**: Home page image carousel (10 images)

#### Tour Management System
- **EditTourModal**: 
  - Main tour image with replacement
  - City images for new city creation with replacement
  - Additional tour images with individual replacement and deletion
  - All images use the new TourImageEditor component

### 3. Components Used

#### ImageEditor
Used for CMS content items that are part of the content store:
- Integrates with the content store system
- Updates content items automatically
- Used in visual editors for page content

#### TourImageEditor  
Used specifically for tour-related images in the EditTourModal:
- Handles tour image uploads with replacement
- Works with tour data structures
- Supports individual image replacement in arrays
- Includes progress indicators and error handling

## API Endpoints

### Image Upload with Replacement
- **Endpoint**: `POST /upload/image/replace`
- **Purpose**: Upload a new image and automatically delete the old one
- **Parameters**: 
  - `image`: The new image file
  - `oldImageUrl`: URL of the image to be replaced (optional)

### Image Deletion
- **Endpoint**: `POST /upload/image/delete`
- **Purpose**: Delete an image and its database record
- **Parameters**:
  - `imageUrl`: URL of the image to be deleted

## Technical Implementation

### Backend (Node.js/Express)
- **File**: `ucv-be/routes/uploadRoutes.js`
- Handles image replacement by deleting old files before storing new ones
- Manages database records for image tracking
- Provides error handling and validation

### Frontend (React/TypeScript)
- **ImageEditor**: `ucv-fe/src/components/admin/ImageEditor.tsx`
- **TourImageEditor**: `ucv-fe/src/components/admin/TourImageEditor.tsx`
- **ContentEditor**: `ucv-fe/src/components/admin/ContentEditor.tsx`
- **EditTourModal**: `ucv-fe/src/components/admin/EditTourModal.tsx`

## Usage Examples

### CMS Content Images
```tsx
<ImageEditor
  item={imageContentItem}
  pageName="about-us"
  sectionId="mainBanner"
  className="w-full"
  label="Change Banner Image"
  imageClassName="h-40 object-cover mx-auto rounded"
/>
```

### Tour Images
```tsx
<TourImageEditor 
  currentImageUrl={tour.imageUrl}
  onImageUploaded={handleImageUpdate}
  label="Change Tour Image"
  className="w-full"
/>
```

### Additional Tour Images with Replacement
```tsx
<TourImageEditor 
  currentImageUrl={existingImageUrl}
  onImageUploaded={(newUrl) => updateImageInArray(index, newUrl)}
  label="Replace"
  imageClassName="hidden" // Hide preview if shown elsewhere
/>
```

### Image Carousel Management
```tsx
<ImageCarouselEditor pageContent={homePageContent} />
```
The ImageCarouselEditor manages 10 carousel images that appear on the home page. Each image can be individually replaced using the ImageEditor component.

## Benefits

1. **Storage Efficiency**: Prevents accumulation of unused images
2. **Database Cleanliness**: Removes orphaned image records
3. **User Experience**: Seamless image replacement without manual cleanup
4. **Consistency**: Unified approach across all image editing interfaces
5. **Error Handling**: Robust error handling and user feedback
6. **Progress Tracking**: Visual upload progress indicators

## Configuration

The API base URL can be configured in both components:
- Production: `https://api.ucv.com.vn`
- Development: `http://localhost:3000`

Currently set to development mode. Update the commented/uncommented lines to switch environments.

## Error Handling

- File type validation (images only)
- File size limits (5MB maximum)
- Network error handling
- Server response validation
- Graceful fallbacks when deletion fails

## Database Schema

### Images Table
```sql
CREATE TABLE images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    created_at DATETIME NOT NULL
);
```

## Security Considerations

1. **File Type Validation**: Only image files are accepted
2. **File Size Limits**: Maximum 5MB per image
3. **Unique Filenames**: UUIDs prevent filename conflicts
4. **Error Handling**: Graceful handling of upload failures

## Future Enhancements

1. **Image Optimization**: Automatic resizing and compression
2. **Multiple Image Upload**: Batch upload functionality
3. **Image Gallery**: Browse and select from uploaded images
4. **CDN Integration**: Store images on external CDN for better performance

## Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check file size (must be under 5MB)
   - Ensure file is a valid image format
   - Check server disk space

2. **Old Images Not Deleted**
   - Check server permissions for uploads directory
   - Verify database connection
   - Check server logs for errors

3. **Images Not Displaying**
   - Verify image URL is accessible
   - Check if uploads directory is properly served
   - Ensure content store is updated

### Error Messages

- "Only image files are allowed": File type not supported
- "File size should not exceed 5MB": File too large
- "Failed to parse server response": Server error or network issue
- "No image item found": Content item missing or invalid

## Support

For technical support or questions about the image editing functionality, please contact the development team or refer to the main project documentation. 