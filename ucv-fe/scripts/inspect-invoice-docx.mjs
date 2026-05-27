import PizZip from 'pizzip';
import fs from 'fs';

const path = 'public/IUC_Invoice VAT_UNIVERSITY_template.docx';
const xml = new PizZip(fs.readFileSync(path)).file('word/document.xml').asText();

const parts = xml.split('wp:anchor');
for (let i = 1; i < parts.length; i++) {
    const s = 'wp:anchor' + parts[i].slice(0, 2500);
    if (!s.includes('Invoice') && !s.includes('Rectangles') && !s.includes('003DA5')) continue;
    const posV = s.match(/positionV relativeFrom="([^"]+)"[^>]*>\s*<wp:posOffset>(\d+)/);
    const posH = s.match(/positionH relativeFrom="([^"]+)"[^>]*>\s*<wp:posOffset>(\d+)/);
    const layoutInCell = s.match(/layoutInCell="(\d)"/);
    const name = s.match(/name="([^"]+)"/);
    console.log({
        i,
        name: name?.[1],
        hasInvoice: s.includes('Invoice'),
        posV: posV ? `${posV[1]}:${posV[2]}` : null,
        posH: posH ? `${posH[1]}:${posH[2]}` : null,
        layoutInCell: layoutInCell?.[1]
    });
}
