import PizZip from 'pizzip';
import fs from 'fs';

const xml = new PizZip(fs.readFileSync('public/IUC_Invoice VAT_UNIVERSITY_template.docx'))
    .file('word/document.xml')
    .asText();

const blocks = xml.split('wp:anchor').slice(1);
for (let i = 0; i < blocks.length; i++) {
    const s = 'wp:anchor' + blocks[i].split('</wp:anchor>')[0];
    const name = s.match(/name="([^"]+)"/)?.[1];
    const color = s.match(/srgbClr val="([^"]+)"/)?.[1];
    const cx = s.match(/<wp:extent cx="(\d+)"/)?.[1];
    const cy = s.match(/cy="(\d+)"/)?.[1];
    const posV = s.match(/positionV relativeFrom="([^"]+)"[^>]*>\s*<wp:posOffset>(\d+)/);
    if (!name && !s.includes('Invoice')) continue;
    console.log({ i: i + 1, name, color, cx, cy, posV: posV ? `${posV[1]}:${posV[2]}` : null, invoice: s.includes('>Invoice</w:t>') });
}
