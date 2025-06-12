const { Translate } = require('@google-cloud/translate').v2;

class GoogleTranslateService {
    constructor() {
        // Initialize Google Cloud Translate
        // The service will automatically use environment variables:
        // GOOGLE_APPLICATION_CREDENTIALS (path to service account key)
        // or GOOGLE_TRANSLATE_API_KEY for API key authentication
        this.translate = null;
        this.isGoogleApiAvailable = false;
        
        this.initializeGoogleTranslate();
        
        // Fallback translations for common phrases
        this.fallbackTranslations = {
            'en_to_vi': {
                // Navigation & Common UI
                'Home': 'Trang chủ',
                'About Us': 'Về chúng tôi',
                'Contact': 'Liên hệ',
                'Our Tours': 'Tours của chúng tôi',
                'Services': 'Dịch vụ',
                'Pricing': 'Bảng giá',
                'FAQ': 'Câu hỏi thường gặp',
                'Blog': 'Blog',
                'News': 'Tin tức',
                
                // Actions & Buttons
                'Read More': 'Đọc thêm',
                'Learn More': 'Tìm hiểu thêm',
                'Get Started': 'Bắt đầu',
                'Sign Up': 'Đăng ký',
                'Log In': 'Đăng nhập',
                'Submit': 'Gửi',
                'Cancel': 'Hủy',
                'Save': 'Lưu',
                'Edit': 'Chỉnh sửa',
                'Delete': 'Xóa',
                'Update': 'Cập nhật',
                'Confirm': 'Xác nhận',
                'Next': 'Tiếp theo',
                'Previous': 'Trước đó',
                'Back': 'Quay lại',
                'Close': 'Đóng',
                
                // Common Words
                'Welcome': 'Chào mừng',
                'Hello': 'Xin chào',
                'Thank you': 'Cảm ơn',
                'Please': 'Vui lòng',
                'Yes': 'Có',
                'No': 'Không',
                'Search': 'Tìm kiếm',
                'Filter': 'Lọc',
                'Sort': 'Sắp xếp',
                'Loading': 'Đang tải',
                'Error': 'Lỗi',
                'Success': 'Thành công',
                
                // Education Related
                'University': 'Trường đại học',
                'College': 'Trường cao đẳng',
                'School': 'Trường học',
                'Education': 'Giáo dục',
                'Study': 'Học tập',
                'Student': 'Sinh viên',
                'Teacher': 'Giáo viên',
                'Course': 'Khóa học',
                'Program': 'Chương trình',
                'Admission': 'Tuyển sinh',
                'Scholarship': 'Học bổng',
                'Tuition': 'Học phí',
                'Campus': 'Khuôn viên',
                'Library': 'Thư viện',
                'Graduation': 'Tốt nghiệp',
                
                // Tour Related
                'Tour': 'Tour',
                'Visit': 'Thăm quan',
                'Schedule': 'Lịch trình',
                'Duration': 'Thời gian',
                'Location': 'Địa điểm',
                'Guide': 'Hướng dẫn viên',
                'Group': 'Nhóm',
                'Individual': 'Cá nhân',
                'Book Now': 'Đặt ngay',
                'Available': 'Có sẵn',
                'Sold Out': 'Hết chỗ',
                
                // Vietnam Specific
                'Vietnam': 'Việt Nam',
                'Vietnamese': 'Tiếng Việt',
                'Hanoi': 'Hà Nội',
                'Ho Chi Minh City': 'Thành phố Hồ Chí Minh',
                'Da Nang': 'Đà Nẵng',
                'Hue': 'Huế',
                'Hoi An': 'Hội An',
                'Saigon': 'Sài Gòn',
                
                // Time & Dates
                'Today': 'Hôm nay',
                'Tomorrow': 'Ngày mai',
                'Yesterday': 'Hôm qua',
                'Week': 'Tuần',
                'Month': 'Tháng',
                'Year': 'Năm',
                'Monday': 'Thứ hai',
                'Tuesday': 'Thứ ba',
                'Wednesday': 'Thứ tư',
                'Thursday': 'Thứ năm',
                'Friday': 'Thứ sáu',
                'Saturday': 'Thứ bảy',
                'Sunday': 'Chủ nhật',
                
                // Numbers
                'First': 'Đầu tiên',
                'Second': 'Thứ hai',
                'Third': 'Thứ ba',
                'Last': 'Cuối cùng',
                'Next': 'Tiếp theo',
                'Previous': 'Trước đó',
            },
            'vi_to_en': {
                // Reverse mapping for Vietnamese to English
                'Trang chủ': 'Home',
                'Về chúng tôi': 'About Us',
                'Liên hệ': 'Contact',
                'Tours của chúng tôi': 'Our Tours',
                'Dịch vụ': 'Services',
                'Bảng giá': 'Pricing',
                'Câu hỏi thường gặp': 'FAQ',
                'Blog': 'Blog',
                'Tin tức': 'News',
                
                'Đọc thêm': 'Read More',
                'Tìm hiểu thêm': 'Learn More',
                'Bắt đầu': 'Get Started',
                'Đăng ký': 'Sign Up',
                'Đăng nhập': 'Log In',
                'Gửi': 'Submit',
                'Hủy': 'Cancel',
                'Lưu': 'Save',
                'Chỉnh sửa': 'Edit',
                'Xóa': 'Delete',
                'Cập nhật': 'Update',
                'Xác nhận': 'Confirm',
                'Tiếp theo': 'Next',
                'Trước đó': 'Previous',
                'Quay lại': 'Back',
                'Đóng': 'Close',
                
                'Chào mừng': 'Welcome',
                'Xin chào': 'Hello',
                'Cảm ơn': 'Thank you',
                'Vui lòng': 'Please',
                'Có': 'Yes',
                'Không': 'No',
                'Tìm kiếm': 'Search',
                'Lọc': 'Filter',
                'Sắp xếp': 'Sort',
                'Đang tải': 'Loading',
                'Lỗi': 'Error',
                'Thành công': 'Success',
                
                'Trường đại học': 'University',
                'Trường cao đẳng': 'College',
                'Trường học': 'School',
                'Giáo dục': 'Education',
                'Học tập': 'Study',
                'Sinh viên': 'Student',
                'Giáo viên': 'Teacher',
                'Khóa học': 'Course',
                'Chương trình': 'Program',
                'Tuyển sinh': 'Admission',
                'Học bổng': 'Scholarship',
                'Học phí': 'Tuition',
                'Khuôn viên': 'Campus',
                'Thư viện': 'Library',
                'Tốt nghiệp': 'Graduation',
                
                'Tour': 'Tour',
                'Thăm quan': 'Visit',
                'Lịch trình': 'Schedule',
                'Thời gian': 'Duration',
                'Địa điểm': 'Location',
                'Hướng dẫn viên': 'Guide',
                'Nhóm': 'Group',
                'Cá nhân': 'Individual',
                'Đặt ngay': 'Book Now',
                'Có sẵn': 'Available',
                'Hết chỗ': 'Sold Out',
                
                'Việt Nam': 'Vietnam',
                'Tiếng Việt': 'Vietnamese',
                'Hà Nội': 'Hanoi',
                'Thành phố Hồ Chí Minh': 'Ho Chi Minh City',
                'Đà Nẵng': 'Da Nang',
                'Huế': 'Hue',
                'Hội An': 'Hoi An',
                'Sài Gòn': 'Saigon',
            }
        };
    }

    async initializeGoogleTranslate() {
        try {
            // Check if Google Cloud credentials are available
            if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_TRANSLATE_API_KEY) {
                this.translate = new Translate({
                    key: process.env.GOOGLE_TRANSLATE_API_KEY, // For API key auth
                    // keyFilename is automatically picked up from GOOGLE_APPLICATION_CREDENTIALS
                });
                
                // Test the API by detecting language of a simple text
                await this.translate.detect('Hello');
                this.isGoogleApiAvailable = true;
                console.log('✅ Google Translate API initialized successfully');
            } else {
                console.log('⚠️ Google Translate API credentials not found. Using fallback translations.');
                this.isGoogleApiAvailable = false;
            }
        } catch (error) {
            console.log('⚠️ Google Translate API not available:', error.message);
            console.log('Using fallback translations.');
            this.isGoogleApiAvailable = false;
        }
    }

    async translateText(text, fromLanguage, toLanguage) {
        try {
            // First check if Google API is available and text is not empty
            if (!text || text.trim() === '') {
                return text;
            }

            // Try Google Translate API first
            if (this.isGoogleApiAvailable && this.translate) {
                try {
                    const [translation] = await this.translate.translate(text, {
                        from: fromLanguage,
                        to: toLanguage,
                    });
                    
                    console.log(`🌍 Google Translate: "${text}" -> "${translation}"`);
                    return translation;
                } catch (googleError) {
                    console.log('Google Translate API error:', googleError.message);
                    console.log('Falling back to local translations...');
                }
            }

            // Fallback to local translations
            const translationKey = `${fromLanguage}_to_${toLanguage}`;
            const fallbackTranslation = this.fallbackTranslations[translationKey]?.[text];
            
            if (fallbackTranslation) {
                console.log(`📚 Fallback translation: "${text}" -> "${fallbackTranslation}"`);
                return fallbackTranslation;
            }

            // If no translation found, return formatted text
            const fallbackText = `[${toLanguage.toUpperCase()}] ${text}`;
            console.log(`⚠️ No translation found for: "${text}". Using: "${fallbackText}"`);
            return fallbackText;

        } catch (error) {
            console.error('Translation service error:', error);
            return `[Translation Error] ${text}`;
        }
    }

    // Check if Google API is available
    isGoogleTranslateAvailable() {
        return this.isGoogleApiAvailable;
    }

    // Get supported languages
    getSupportedLanguages() {
        return ['en', 'vi'];
    }

    // Add a new fallback translation
    addFallbackTranslation(text, fromLang, toLang, translation) {
        const key = `${fromLang}_to_${toLang}`;
        if (!this.fallbackTranslations[key]) {
            this.fallbackTranslations[key] = {};
        }
        this.fallbackTranslations[key][text] = translation;
    }

    // Get all fallback translations
    getFallbackTranslations() {
        return this.fallbackTranslations;
    }
}

// Export singleton instance
module.exports = new GoogleTranslateService();