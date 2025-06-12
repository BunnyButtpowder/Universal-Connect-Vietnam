# Google Translate API Setup Guide

This guide explains how to set up Google Translate API integration for the UCV internationalization system.

## 🚀 Quick Start

Google Translate has been integrated into your existing translation system. It will automatically fall back to local translations if the API is not available.

## 🔑 API Setup Options

You have two options to configure Google Translate API:

### Option 1: API Key (Recommended for Development)

1. **Get a Google Cloud API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the "Cloud Translation API"
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy your API key

2. **Add to Environment Variables:**
   ```bash
   # In your .env file
   GOOGLE_TRANSLATE_API_KEY=your_api_key_here
   ```

### Option 2: Service Account (Recommended for Production)

1. **Create Service Account:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and description
   - Grant "Cloud Translator API User" role
   - Download the JSON key file

2. **Configure Environment:**
   ```bash
   # In your .env file
   GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
   ```

## 📋 Environment Setup

Add these variables to your `ucv-be/.env` file:

```env
# Database Configuration
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=ucv_db

# Google Translate API Configuration
# Choose ONE of the following options:

# Option 1: API Key (simpler)
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here

# Option 2: Service Account (more secure)
# GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# Other existing configurations...
```

## 🧪 Testing the Integration

### 1. Start the Server
```bash
cd ucv-be
npm run dev
```

### 2. Test Translation Endpoint
```bash
curl -X POST http://localhost:3000/translations/auto-translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello World",
    "from": "en",
    "to": "vi"
  }'
```

**Expected Response with Google API:**
```json
{
  "translatedText": "Xin chào thế giới",
  "originalText": "Hello World",
  "fromLanguage": "en",
  "toLanguage": "vi",
  "provider": "google",
  "googleApiAvailable": true
}
```

**Expected Response without Google API (fallback):**
```json
{
  "translatedText": "[VI] Hello World",
  "originalText": "Hello World",
  "fromLanguage": "en",
  "toLanguage": "vi",
  "provider": "fallback",
  "googleApiAvailable": false
}
```

### 3. Check Console Logs

When the server starts, you should see:
- `✅ Google Translate API initialized successfully` (if API is configured)
- `⚠️ Google Translate API credentials not found. Using fallback translations.` (if not configured)

During translation:
- `🌍 Google Translate: "Hello" -> "Xin chào"` (if using Google API)
- `📚 Fallback translation: "Hello" -> "Xin chào"` (if using fallback)

## 🔧 System Behavior

### Smart Fallback Strategy

1. **Google Translate API** - Primary translation service
2. **Local Fallback Translations** - 100+ pre-configured common phrases
3. **Formatted Fallback** - `[VI] Original Text` if no translation found

### Supported Languages
- English (`en`)
- Vietnamese (`vi`)

### Error Handling
- API failures automatically fall back to local translations
- Network issues don't break the translation system
- Detailed logging for debugging

## 🎯 Frontend Integration

The frontend automatically uses the new Google Translate integration:

```typescript
// In TranslationEditor component
const translatedText = await translationApi.autoTranslate(item.content, 'en', 'vi');
// This now uses Google Translate if available, fallback otherwise
```

## 💰 Cost Considerations

### Google Translate Pricing (as of 2024)
- **Free Tier:** 500,000 characters per month
- **Paid Tier:** $20 per 1M characters

### Optimization Tips
1. **Cache translations** - Store translated content in database
2. **Batch requests** - Translate multiple items at once
3. **Use fallbacks** - 100+ common phrases don't use API quota
4. **Detect same language** - Skip translation if source = target

## 🔍 Troubleshooting

### Common Issues

1. **"Google Translate API not available" message**
   - Check your API key or service account file
   - Verify the Cloud Translation API is enabled
   - Check your internet connection

2. **"Invalid API key" error**
   - Verify your API key in Google Cloud Console
   - Make sure Cloud Translation API is enabled for your project
   - Check API key restrictions (if any)

3. **"Quota exceeded" error**
   - Check your Google Cloud billing account
   - Monitor usage in Google Cloud Console
   - Consider implementing translation caching

4. **Translations not saving**
   - This is normal - the API provides translations
   - Use the admin interface to save translations to database
   - Check database connection and permissions

### Debug Mode

Enable detailed logging by checking the server console:

```bash
# In development
npm run dev

# Look for these log messages:
# ✅ Google Translate API initialized successfully
# 🌍 Google Translate: "text" -> "translation"
# 📚 Fallback translation: "text" -> "translation"
```

## 🚀 Advanced Configuration

### Custom Language Pairs

To add more languages, update the service:

```javascript
// In googleTranslateService.js
getSupportedLanguages() {
    return ['en', 'vi', 'fr', 'de']; // Add more languages
}
```

### Caching Translations

Implement caching to reduce API costs:

```javascript
// Example Redis caching
const redis = require('redis');
const client = redis.createClient();

async function getCachedTranslation(text, from, to) {
    const key = `translate:${from}:${to}:${text}`;
    return await client.get(key);
}
```

### Batch Translation

For large content volumes:

```javascript
// Batch translate multiple items
async function translateBatch(items, fromLang, toLang) {
    const texts = items.map(item => item.content);
    const [translations] = await this.translate.translate(texts, {
        from: fromLang,
        to: toLang,
    });
    return translations;
}
```

## 📚 Resources

- [Google Cloud Translation API Documentation](https://cloud.google.com/translate/docs)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Pricing](https://cloud.google.com/translate/pricing)
- [Client Libraries](https://cloud.google.com/translate/docs/reference/libraries)

## 🎉 Next Steps

1. **Set up your Google API credentials** using one of the options above
2. **Test the translation endpoint** to verify it's working
3. **Use the admin interface** to translate your content
4. **Monitor usage** in Google Cloud Console
5. **Consider implementing caching** for production use

Your translation system is now powered by Google Translate with intelligent fallbacks! 🌍 