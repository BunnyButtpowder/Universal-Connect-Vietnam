import fs from 'fs';
import PizZip from 'pizzip';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { generateRegistrationDocuments } = require('../utils/documentProcessor.js');

const formData = {
    fullName: 'Jane Smith',
    organization: 'Example University',
    phone: '1234567890',
    email: 'jane@example.edu',
    position: 'International Officer',
    headOffice: '123 Campus Road, Berlin, Germany',
    businessRegistration: 'BR-998877',
    legalRepresentative: 'Jane Smith',
    tourId: '1',
    tourName: 'Spring Tour 2027',
    wantCallback: true,
    participantCount: 2,
    promotions: { earlyBird: true, returningClient: false },
    cities: { Full: true, Hanoi: false, HaiDuong: false },
    representatives: [
        { name: 'Jane Smith', position: 'International Officer', phone: '1234567890', email: 'jane@example.edu' }
    ]
};

const tourData = {
    title: 'Spring Tour 2027',
    tourDates: '31 MARCH - 10 APRIL 2027',
    date: 'SPRING 2027',
    earlyBirdDeadline: '2027-01-15',
    standardDeadline: '2027-01-31',
    pricing: {
        standard: { regular: 7000, returningUniversity: 5950 },
        earlyBird: { regular: 6300, returningUniversity: 5250 }
    },
    customizeOptions: [
        { optionKey: 'Full', optionName: 'Full Tour', description: 'All 5 cities' },
        { optionKey: 'Hanoi', optionName: 'Hanoi' },
        { optionKey: 'HaiDuong', optionName: 'Hai Duong' }
    ]
};

function docText(buffer) {
    const zip = new PizZip(buffer);
    return [...zip.file('word/document.xml').asText().matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)]
        .map((m) => m[1])
        .join('');
}

const docs = await generateRegistrationDocuments(formData, 6300, tourData);

for (const doc of docs) {
    const text = docText(doc.content);
    const issues = [];
    if (text.includes('{{')) issues.push('mustache');
    if (text.includes('AUTO-FILLED')) issues.push('AUTO-FILLED');
    if (text.includes('TOUR_CITIES')) issues.push('TOUR_CITIES');
    if (text.includes('STANDARD_PRICE')) issues.push('STANDARD_PRICE');
    if (text.includes('(CITY NAME)')) issues.push('CITY NAME');
    if (text.includes('[FINAL PRICE]')) issues.push('[FINAL PRICE]');

    console.log(doc.filename, issues.length ? `ISSUES: ${issues.join(', ')}` : 'OK');
    console.log('  has org:', text.includes('Example University'));
    console.log('  has full tour label:', text.includes('Full Tour') || text.includes('All 5 cities'));
    console.log('  has 6300:', text.includes('6,300'));
}
