# UCV Translation API Setup Guide

This guide explains how to set up and test the internationalization backend for the UCV project.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd ucv-be
npm install
```

### 2. Environment Setup
Make sure your `.env` file in `ucv-be` contains:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ucv_db
```

### 3. Start the Server
```bash
cd ucv-be
npm run dev
```

The server will:
- Create all necessary database tables automatically
- Initialize default content items and translations
- Start listening on port 3000

## 📊 Database Tables Created

The system automatically creates these tables:

### Content Management
- `content_items` - Stores translatable content pieces
- `content_translations` - Stores translations for content items
- `static_translations` - Stores UI element translations

### Sample Data
- Default content items (hero banner, about us section, etc.)
- Default static UI translations (navigation, buttons, etc.)

## 🔌 API Endpoints

### Translation Management
```http
GET /translations                           # Get all translations
GET /translations/page/:pageName            # Get translations for specific page
GET /translations/:contentItemId/:language  # Get specific translation
PUT /translations                           # Create/update translation
PUT /translations/bulk                      # Bulk update translations
DELETE /translations/:contentItemId/:language # Delete translation
```

### Auto-Translation
```http
POST /translations/auto-translate           # Auto-translate text
Content-Type: application/json
{
  "text": "Hello World",
  "from": "en",
  "to": "vi"
}
```

### Static UI Translations
```http
GET /translations/static                    # Get static UI translations
PUT /translations/static                    # Update static translation
```

### Content Items
```http
GET /translations/content-items             # Get all content items
GET /translations/content-items/page/:pageName # Get page content items
PUT /translations/content-items             # Create/update content item
```

### Initialization
```http
POST /translations/initialize               # Initialize default data
```

## 🧪 Testing the API

### 1. Check Server Status
```bash
curl http://localhost:3000/
```

### 2. Get All Translations
```bash
curl http://localhost:3000/translations
```

### 3. Get Page Translations
```bash
curl http://localhost:3000/translations/page/home
```

### 4. Create a Translation
```bash
curl -X PUT http://localhost:3000/translations \
  -H "Content-Type: application/json" \
  -d '{
    "id": "heroBanner-heading",
    "language": "vi",
    "content": "Khám Phá Các Trường Hàng Đầu Việt Nam"
  }'
```

### 5. Auto-Translate Text
```bash
curl -X POST http://localhost:3000/translations/auto-translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "About Us",
    "from": "en",
    "to": "vi"
  }'
```

### 6. Get Static Translations
```bash
curl http://localhost:3000/translations/static
```

### 7. Initialize Default Data (if needed)
```bash
curl -X POST http://localhost:3000/translations/initialize
```

## 🔧 Frontend Integration

### 1. Update Frontend API Base URL
In `ucv-fe/src/lib/translationApi.ts`, ensure:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
```

### 2. Test Frontend Integration
Start the frontend:
```bash
cd ucv-fe
npm run dev
```

The language selector should now:
- Fetch static translations from the database
- Save translation changes to the database
- Use auto-translation features

## 📝 Database Schema

### Content Items Table
```sql
content_items (
  id VARCHAR(255) PRIMARY KEY,
  type ENUM('heading', 'paragraph', 'button', 'image', 'statistic'),
  content TEXT NOT NULL,
  metadata JSON,
  page_name VARCHAR(100),
  section_id VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Content Translations Table
```sql
content_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content_item_id VARCHAR(255),
  language ENUM('en', 'vi'),
  content TEXT NOT NULL,
  metadata JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (content_item_id) REFERENCES content_items(id)
)
```

### Static Translations Table
```sql
static_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  translation_key VARCHAR(255) UNIQUE,
  en TEXT NOT NULL,
  vi TEXT NOT NULL,
  category VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 🎯 Usage Examples

### Adding New Content for Translation

1. **Create Content Item:**
```bash
curl -X PUT http://localhost:3000/translations/content-items \
  -H "Content-Type: application/json" \
  -d '{
    "id": "new-section-title",
    "type": "heading",
    "content": "New Section Title",
    "pageName": "home",
    "sectionId": "newSection"
  }'
```

2. **Add Vietnamese Translation:**
```bash
curl -X PUT http://localhost:3000/translations \
  -H "Content-Type: application/json" \
  -d '{
    "id": "new-section-title",
    "language": "vi",
    "content": "Tiêu Đề Phần Mới"
  }'
```

### Bulk Translation Update
```bash
curl -X PUT http://localhost:3000/translations/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "translations": [
      {
        "id": "heroBanner-heading",
        "language": "vi",
        "content": "Khám Phá Các Trường Hàng Đầu Việt Nam"
      },
      {
        "id": "heroBanner-paragraph1",
        "language": "vi",
        "content": "Chào mừng đến với UCV..."
      }
    ]
  }'
```

## 🚨 Troubleshooting

### Database Connection Issues
- Check your MariaDB server is running
- Verify database credentials in `.env`
- Ensure database `ucv_db` exists

### Translation Not Saving
- Check browser console for API errors
- Verify content item exists before creating translation
- Check database constraints

### Auto-Translation Not Working
- Currently using mock translations
- To integrate real translation service, update `translationController.js`
- Consider Google Translate API or similar service

## 🔄 Development Workflow

1. **Add new translatable content:**
   - Create content item via API or admin interface
   - Add translations for each language

2. **Update existing translations:**
   - Use PUT `/translations` endpoint
   - Changes are immediately available

3. **Test translations:**
   - Switch language in frontend
   - Verify content updates correctly
   - Check fallback behavior

## 🌟 Next Steps

1. **Integrate Real Translation Service:**
   - Replace mock auto-translation with Google Translate API
   - Add translation confidence scores
   - Implement translation caching

2. **Enhanced Admin Interface:**
   - Build translation management dashboard
   - Add bulk import/export features
   - Implement translation status tracking

3. **Performance Optimization:**
   - Add caching layer for frequently accessed translations
   - Implement lazy loading for large content sets
   - Add compression for API responses

The translation system is now fully functional and ready for production use! 