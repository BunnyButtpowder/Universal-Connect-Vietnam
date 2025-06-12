import { Language, Translation } from './types';

// Static UI translations
export const staticTranslations: Translation[] = [
  // Navigation
  { key: 'nav.home', en: 'Home', vi: 'Trang chủ' },
  { key: 'nav.aboutUs', en: 'About Us', vi: 'Về chúng tôi' },
  { key: 'nav.ourTours', en: 'Our Tours', vi: 'Tours của chúng tôi' },
  { key: 'nav.contact', en: 'Contact', vi: 'Liên hệ' },
  
  // Common actions
  { key: 'common.readMore', en: 'Read More', vi: 'Đọc thêm' },
  { key: 'common.getStarted', en: 'Get Started', vi: 'Bắt đầu' },
  { key: 'common.learnMore', en: 'Learn More', vi: 'Tìm hiểu thêm' },
  { key: 'common.signUp', en: 'Sign Up', vi: 'Đăng ký' },
  { key: 'common.login', en: 'Login', vi: 'Đăng nhập' },
  { key: 'common.logout', en: 'Logout', vi: 'Đăng xuất' },
  { key: 'common.submit', en: 'Submit', vi: 'Gửi' },
  { key: 'common.cancel', en: 'Cancel', vi: 'Hủy' },
  { key: 'common.save', en: 'Save', vi: 'Lưu' },
  { key: 'common.edit', en: 'Edit', vi: 'Chỉnh sửa' },
  { key: 'common.delete', en: 'Delete', vi: 'Xóa' },
  { key: 'common.loading', en: 'Loading...', vi: 'Đang tải...' },
  { key: 'common.error', en: 'Error', vi: 'Lỗi' },
  { key: 'common.success', en: 'Success', vi: 'Thành công' },
  
  // Language selector
  { key: 'language.english', en: 'English', vi: 'Tiếng Anh' },
  { key: 'language.vietnamese', en: 'Vietnamese', vi: 'Tiếng Việt' },
  { key: 'language.toggleLanguage', en: 'Toggle language', vi: 'Chuyển đổi ngôn ngữ' },
  
  // Loading states
  { key: 'loading.content', en: 'Loading content...', vi: 'Đang tải nội dung...' },
  { key: 'loading.error', en: 'Error loading content', vi: 'Lỗi khi tải nội dung' },
  { key: 'loading.tryAgain', en: 'Try Again', vi: 'Thử lại' },
  
  // Form fields
  { key: 'form.name', en: 'Name', vi: 'Tên' },
  { key: 'form.email', en: 'Email', vi: 'Email' },
  { key: 'form.phone', en: 'Phone', vi: 'Số điện thoại' },
  { key: 'form.message', en: 'Message', vi: 'Tin nhắn' },
  { key: 'form.university', en: 'University', vi: 'Trường đại học' },
  { key: 'form.position', en: 'Position', vi: 'Vị trí' },
  
  // Admin panel
  { key: 'admin.panel', en: 'Admin Panel', vi: 'Bảng quản trị' },
  { key: 'admin.content', en: 'Content Management', vi: 'Quản lý nội dung' },
  { key: 'admin.users', en: 'User Management', vi: 'Quản lý người dùng' },
  { key: 'admin.tours', en: 'Tour Management', vi: 'Quản lý tour' },
];

// Create a lookup map for faster access
export const translationMap = staticTranslations.reduce((acc, translation) => {
  acc[translation.key] = {
    en: translation.en,
    vi: translation.vi
  };
  return acc;
}, {} as Record<string, Record<Language, string>>);

// Translation function
export function t(key: string, language: Language = 'en'): string {
  const translation = translationMap[key];
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`);
    return key; // Fallback to key if translation not found
  }
  
  return translation[language] || translation.en || key;
}

// Helper to get browser language preference
export function getBrowserLanguage(): Language {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  return browserLang.startsWith('vi') ? 'vi' : 'en';
}

// Helper to get stored language preference
export function getStoredLanguage(): Language {
  const stored = localStorage.getItem('ucv-language');
  return (stored === 'vi' || stored === 'en') ? stored : getBrowserLanguage();
}

// Helper to store language preference
export function setStoredLanguage(language: Language): void {
  localStorage.setItem('ucv-language', language);
} 