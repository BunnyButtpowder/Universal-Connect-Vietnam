/**
 * Giữ tiêu đề "Invoice" + thanh xanh ở góc trên trái trang (neo theo page),
 * tránh bị đẩy vào bảng khi [CITY NAMES] / giá làm hàng sản phẩm cao hơn.
 */

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

function isInvoiceTitleAnchor(anchorBlock) {
    return anchorBlock.includes('>Invoice</w:t>');
}

function isInvoiceHeaderAnchor(anchorBlock) {
    const name = anchorBlock.match(/<wp:docPr[^>]*name="([^"]+)"/)?.[1];
    if (name && INVOICE_HEADER_SHAPE_NAMES.has(name)) return true;
    return isInvoiceTitleAnchor(anchorBlock);
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
        if (!isInvoiceHeaderAnchor(anchorBlock)) {
            return anchorBlock;
        }
        return applyHeaderAnchorFix(anchorBlock);
    });
}

function fixInvoiceDocxZip(zip) {
    const documentFile = zip.file('word/document.xml');
    if (!documentFile) return;
    zip.file('word/document.xml', fixInvoiceHeaderAnchorsInXml(documentFile.asText()));
}

module.exports = {
    fixInvoiceDocxZip,
    fixInvoiceHeaderAnchorsInXml
};
