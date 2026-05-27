/**
 * Một lần: sửa neo shape Invoice trong file template gốc (public/).
 * Chạy: node scripts/fix-invoice-template-anchors.mjs
 */
import PizZip from 'pizzip';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(__dirname, '../public/IUC_Invoice VAT_UNIVERSITY_template.docx');

const INVOICE_HEADER_SHAPE_NAMES = new Set([
    'Rectangles 244',
    'Rectangles 245',
    'Straight Arrow Connector 247'
]);
const HEADER_ANCHOR_POSITIONS = {
    'Rectangles 244': { h: '457200', v: '274320' },
    'Rectangles 245': { h: '1554480', v: '274320' },
    'Straight Arrow Connector 247': { h: '139700', v: '274320' }
};
const DEFAULT_HEADER_POSITION = { h: '914400', v: '274320' };

function isInvoiceTitleAnchor(block) {
    return block.includes('>Invoice</w:t>');
}

function isInvoiceHeaderAnchor(block) {
    const name = block.match(/<wp:docPr[^>]*name="([^"]+)"/)?.[1];
    if (name && INVOICE_HEADER_SHAPE_NAMES.has(name)) return true;
    return isInvoiceTitleAnchor(block);
}

function applyHeaderAnchorFix(anchorBlock) {
    const name = anchorBlock.match(/<wp:docPr[^>]*name="([^"]+)"/)?.[1];
    const pos =
        (name && HEADER_ANCHOR_POSITIONS[name]) ||
        (isInvoiceTitleAnchor(anchorBlock) ? DEFAULT_HEADER_POSITION : null);
    if (!pos) return anchorBlock;

    let fixed = anchorBlock.replace(/layoutInCell="1"/g, 'layoutInCell="0"');
    fixed = fixed.replace(
        /<wp:positionH relativeFrom="[^"]+">[\s\S]*?<\/wp:positionH>/,
        `<wp:positionH relativeFrom="page"><wp:posOffset>${pos.h}</wp:posOffset></wp:positionH>`
    );
    fixed = fixed.replace(
        /<wp:positionV relativeFrom="[^"]+">[\s\S]*?<\/wp:positionV>/,
        `<wp:positionV relativeFrom="page"><wp:posOffset>${pos.v}</wp:posOffset></wp:positionV>`
    );
    if (fixed.includes('<wp:wrapNone/>')) {
        fixed = fixed.replace('<wp:wrapNone/>', '<wp:wrapTopAndBottom/>');
    }
    return fixed;
}

function fixInvoiceHeaderAnchorsInXml(documentXml) {
    return documentXml.replace(/<wp:anchor[\s\S]*?<\/wp:anchor>/g, (anchorBlock) => {
        if (!isInvoiceHeaderAnchor(anchorBlock)) return anchorBlock;
        return applyHeaderAnchorFix(anchorBlock);
    });
}

const buf = fs.readFileSync(templatePath);
const zip = new PizZip(buf);
const xml = zip.file('word/document.xml').asText();
zip.file('word/document.xml', fixInvoiceHeaderAnchorsInXml(xml));
fs.writeFileSync(templatePath, zip.generate({ type: 'nodebuffer' }));
console.log('Updated invoice template anchors:', templatePath);
