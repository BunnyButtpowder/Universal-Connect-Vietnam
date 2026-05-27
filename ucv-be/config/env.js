const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const projectRoot = path.resolve(__dirname, '..');
const ALLOWED_PROFILES = ['local', 'production'];

let loaded = false;

function loadEnv() {
    if (loaded) {
        return { profile: process.env.DB_PROFILE || 'local' };
    }

    const basePath = path.join(projectRoot, '.env');
    if (fs.existsSync(basePath)) {
        dotenv.config({ path: basePath });
    }

    let profile = (process.env.DB_PROFILE || 'local').trim().toLowerCase();
    if (!ALLOWED_PROFILES.includes(profile)) {
        console.warn(`DB_PROFILE="${profile}" không hợp lệ. Dùng "local".`);
        profile = 'local';
    }

    const profilePath = path.join(projectRoot, `.env.${profile}`);
    if (fs.existsSync(profilePath)) {
        dotenv.config({ path: profilePath, override: true });
    } else {
        console.warn(
            `Không tìm thấy ${path.basename(profilePath)}. ` +
            `Tạo file từ .env.${profile}.example hoặc đặt biến DB_* trong .env.`
        );
    }

    process.env.DB_PROFILE = profile;
    loaded = true;

    return { profile };
}

function getDbConfig() {
    const port = parseInt(process.env.DB_PORT, 10);

    return {
        host: process.env.DB_HOST || 'localhost',
        port: Number.isFinite(port) ? port : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'ucv_db'
    };
}

function getSafeDbLabel() {
    const { host, port, database } = getDbConfig();
    const profile = process.env.DB_PROFILE || 'local';
    return `[${profile}] ${host}:${port}/${database}`;
}

const DEFAULT_EMAIL_TO = 'info@ucv.com.vn';

/** Danh sách người nhận mail (contact + tour signup). EMAIL_TO trong .env, phân tách bằng dấu phẩy nếu nhiều người. */
function getEmailToList() {
    const raw = process.env.EMAIL_TO || DEFAULT_EMAIL_TO;
    return raw
        .split(',')
        .map((address) => address.trim())
        .filter(Boolean);
}

function getEmailToLabel() {
    return getEmailToList().join(', ');
}

function isEmailConfigured() {
    return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
}

module.exports = {
    loadEnv,
    getDbConfig,
    getSafeDbLabel,
    getEmailToList,
    getEmailToLabel,
    isEmailConfigured,
    DEFAULT_EMAIL_TO,
    projectRoot
};
