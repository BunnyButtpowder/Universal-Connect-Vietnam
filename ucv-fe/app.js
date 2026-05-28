import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

if (!fs.existsSync(distPath)) {
    console.error(
        'Thiếu thư mục dist/. Trên server chạy: npm run build (trong thư mục ucv-fe) rồi Restart app.'
    );
    process.exit(1);
}

app.use(
    express.static(distPath, {
        index: 'index.html',
        maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
    })
);

app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`UCV frontend (dist) — port ${PORT}`);
});
