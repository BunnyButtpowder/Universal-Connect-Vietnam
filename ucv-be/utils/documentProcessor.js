const fs = require('fs');
const path = require('path');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const { fixInvoiceDocxZip } = require('./invoiceDocxLayout');
const {
    buildSelectedTourSegmentsLabel,
    buildSelectedTourSegmentsLabelVi,
    normalizeCitySelectionsForSubmit
} = require('./tourSelectionLabels');

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates');
const TEMPLATE_FILES = {
    registration: 'VN_template.docx',
    invoice: 'IUC_Invoice VAT_UNIVERSITY_template.docx'
};

/** Thứ tự các dòng Party A trong template mới (8 lần {{AUTO-FILLED FROM BOOKING FORM}}). */
const PARTY_A_AUTO_KEYS = [
    'PARTY_A_ORGANIZATION',
    'PARTY_A_COUNTRY',
    'PARTY_A_HEAD_OFFICE',
    'PARTY_A_BUSINESS_ID',
    'PARTY_A_LEGAL_REP',
    'PARTY_A_TITLE',
    'PARTY_A_EMAIL',
    'PARTY_A_PHONE'
];

const templateCache = new Map();

function loadTemplateBuffer(templateKey) {
    const filename = TEMPLATE_FILES[templateKey];
    if (!filename) {
        throw new Error(`Unknown template key: ${templateKey}`);
    }
    if (!templateCache.has(filename)) {
        const filePath = path.join(TEMPLATE_DIR, filename);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Template not found: ${filePath}`);
        }
        templateCache.set(filename, fs.readFileSync(filePath));
    }
    return templateCache.get(filename);
}

function getRepresentatives(formData) {
    if (Array.isArray(formData.representatives) && formData.representatives.length > 0) {
        return formData.representatives;
    }
    return [{
        name: formData.legalRepresentative || formData.fullName || '',
        position: formData.position || '',
        phone: formData.phone || '',
        email: formData.email || ''
    }];
}

function formatDeadline(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB');
}

function formatUsd(amount) {
    if (amount == null || amount === '') return '';
    const num = Number(amount);
    if (!Number.isFinite(num)) return '';
    return `$${Math.round(num).toLocaleString('en-US')}`;
}

function applyRepresentativeTemplateFields(data, formData) {
    const reps = getRepresentatives(formData);

    reps.forEach((rep, index) => {
        const n = index + 1;
        const suffix = n === 1 ? '' : ` ${n}`;

        data[`REPRESENTATIVE_${n}_NAME`] = rep.name;
        data[`REPRESENTATIVE_${n}_POSITION`] = rep.position;
        data[`REPRESENTATIVE_${n}_PHONE`] = rep.phone;
        data[`REPRESENTATIVE_${n}_EMAIL`] = rep.email;
        data[`Name of University Representative${suffix}`] = rep.name;
        data[`Position${suffix}`] = rep.position;
        data[`Phone${suffix}`] = rep.phone;
        data[`Email${suffix}`] = rep.email;
    });

    const legal = reps[0];
    if (legal) {
        data.legalRepresentative = legal.name;
        data['Legal Representative'] = legal.name;
        data['LEGAL REPRESENTATIVE'] = legal.name;
        data.position = legal.position;
        data['Position'] = legal.position;
        data['POSITION'] = legal.position;
        data.phone = legal.phone || formData.phone;
        data.email = legal.email || formData.email;
        data['PHONE'] = legal.phone || formData.phone;
        data['EMAIL'] = legal.email || formData.email;
    }

    data['ALL REPRESENTATIVES'] = reps
        .map((r, i) => `Representative ${i + 1}: ${r.name}, ${r.position}, ${r.phone}, ${r.email}`)
        .join('\n');
}

function applyNewTemplateMustacheFields(data, formData, tourData) {
    const legal = getRepresentatives(formData)[0] || {};
    const standardRegular = tourData?.pricing?.standard?.regular;

    data.PARTY_A_ORGANIZATION = formData.organization || '';
    data.PARTY_A_COUNTRY = formData.countryOfRegistration || '';
    data.PARTY_A_HEAD_OFFICE = formData.headOffice || '';
    data.PARTY_A_BUSINESS_ID = formData.businessRegistration || 'N/A';
    data.PARTY_A_LEGAL_REP = legal.name || formData.legalRepresentative || '';
    data.PARTY_A_TITLE = legal.position || formData.position || '';
    data.PARTY_A_EMAIL = legal.email || formData.email || '';
    data.PARTY_A_PHONE = legal.phone || formData.phone || '';

    data.TOUR_CITIES = data['CITY NAMES'] || data.selectedCities || '';
    data.STANDARD_PRICE = formatUsd(standardRegular);
    data.STANDARD_DEADLINE = formatDeadline(tourData?.standardDeadline);
    data.EARLY_DEADLINE = formatDeadline(tourData?.earlyBirdDeadline);

    data['Name of Authorised Signatory'] = legal.name || formData.legalRepresentative || '';
    data.Title = legal.position || formData.position || '';
    data.Country = formData.countryOfRegistration || '';

    data['as stated in the Party A section above'] = 'as stated in the Party A section above';
    data['như ghi trong phần Bên A ở trên'] = 'như ghi trong phần Bên A ở trên';
}

function replaceNthOccurrence(text, search, replacement, nth) {
    if (!search || nth <= 0) return text;
    let count = 0;
    let fromIndex = 0;
    while (true) {
        const index = text.indexOf(search, fromIndex);
        if (index === -1) return text;
        count += 1;
        if (count === nth) {
            return text.slice(0, index) + replacement + text.slice(index + search.length);
        }
        fromIndex = index + search.length;
    }
}

function escapeXmlText(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function applyVietnameseSegmentLabelToRegistrationXml(zip, englishSegments, vietnameseSegments) {
    if (!englishSegments || !vietnameseSegments || englishSegments === vietnameseSegments) return;
    const documentFile = zip.file('word/document.xml');
    if (!documentFile) return;

    const xml = documentFile.asText();
    const escapedEnglish = escapeXmlText(englishSegments);
    const escapedVietnamese = escapeXmlText(vietnameseSegments);
    const updated = replaceNthOccurrence(xml, escapedEnglish, escapedVietnamese, 2);
    zip.file('word/document.xml', updated);
}

function prepareRegistrationTemplateXml(zip) {
    const documentFile = zip.file('word/document.xml');
    if (!documentFile) return;

    let xml = documentFile.asText();
    let index = 0;
    xml = xml.replace(/\{\{AUTO-FILLED FROM BOOKING FORM\}\}/g, () => {
        const key = PARTY_A_AUTO_KEYS[index] || 'PARTY_A_EXTRA';
        index += 1;
        return `{{${key}}}`;
    });
    zip.file('word/document.xml', xml);
}

function applyInvoiceCityNamePlaceholder(zip, cityLabel) {
    const documentFile = zip.file('word/document.xml');
    if (!documentFile || !cityLabel) return;

    const xml = documentFile.asText().replace(/\(CITY NAME\)/g, escapeXmlText(cityLabel));
    zip.file('word/document.xml', xml);
}

function renderWithDelimiters(zip, data, start, end) {
    const doc = new Docxtemplater()
        .loadZip(zip)
        .setOptions({
            delimiters: { start, end },
            nullGetter: () => ''
        });

    doc.setData(data);
    doc.render();
    const outBuffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
    return new PizZip(outBuffer);
}

function createTemplateData(formData, calculatedPrice = 0, tourData) {
    const selectedTour = tourData?.title || formData.tourName || (formData.tourId === 'fallTour2025'
        ? 'Fall Tour 2025 (Central Vietnam - Hue, Da Nang)'
        : 'Spring Tour 2026 (Northern Vietnam - Hanoi, Hai Duong)');

    const tourDate = tourData?.tourDates || tourData?.date || (formData.tourId === 'fallTour2025'
        ? '1 - 8 OCTOBER 2025'
        : '31 MARCH - 10 APRIL 2026');

    const today = new Date();
    const formattedToday = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    const invoiceNumber = `${(Date.now() % 1000).toString().padStart(3, '0')}`;
    const priceWithVAT = Math.round(calculatedPrice * 1.08).toLocaleString('en-US');
    const formattedFinalPrice = calculatedPrice.toLocaleString('en-US');

    const selectedCitiesLabel = buildSelectedTourSegmentsLabel(formData, tourData);
    const selectedCitiesLabelVi = buildSelectedTourSegmentsLabelVi(formData, tourData);
    const standardRegular = tourData?.pricing?.standard?.regular;

    const templateData = {
        fullName: formData.fullName,
        organization: formData.organization,
        'UNIVERSITY NAME': formData.organization,
        phone: formData.phone,
        email: formData.email,
        PHONE: formData.phone,
        EMAIL: formData.email,
        '[PHONE]': formData.phone,
        '[EMAIL]': formData.email,
        '[Phone]': formData.phone,
        '[Email]': formData.email,
        PRICE: formatUsd(standardRegular),
        DATE: formatDeadline(tourData?.earlyBirdDeadline),
        STANDARDDATE: formatDeadline(tourData?.standardDeadline),
        ADDRESS: formData.headOffice,
        NO: invoiceNumber,
        TODAY: formattedToday,
        '[PRICE]': formatUsd(standardRegular),
        '[DATE]': formatDeadline(tourData?.earlyBirdDeadline),
        '[STANDARDDATE]': formatDeadline(tourData?.standardDeadline),
        '[ADDRESS]': formData.headOffice,
        '[NO]': invoiceNumber,
        '[TODAY]': formattedToday,
        'FINAL PRICE': formattedFinalPrice,
        '[FINAL PRICE]': formattedFinalPrice,
        'FINAL PRICE * 108%': priceWithVAT,
        '[FINAL PRICE * 108%]': priceWithVAT,
        headOffice: formData.headOffice,
        'Head office address': formData.headOffice,
        businessRegistration: formData.businessRegistration || 'N/A',
        'Business Registration': formData.businessRegistration || 'N/A',
        'BUSINESS REGISTRATION': formData.businessRegistration || 'N/A',
        legalRepresentative: formData.legalRepresentative,
        'Legal Representative': formData.legalRepresentative,
        'LEGAL REPRESENTATIVE': formData.legalRepresentative,
        position: formData.position,
        Position: formData.position,
        POSITION: formData.position,
        accountNumber: formData.accountNumber || 'N/A',
        'Account Number': formData.accountNumber || 'N/A',
        'ACCOUNT NUMBER': formData.accountNumber || 'N/A',
        bank: formData.bank || 'N/A',
        Bank: formData.bank || 'N/A',
        BANK: formData.bank || 'N/A',
        swift: formData.swift || 'N/A',
        Swift: formData.swift || 'N/A',
        SWIFT: formData.swift || 'N/A',
        selectedTour,
        'Selected Tour': selectedTour,
        'SELECTED TOUR': selectedTour,
        tourDate,
        'Tour Date': tourDate,
        'TOUR DATE': tourDate,
        selectedCities: selectedCitiesLabel,
        'Selected Cities': selectedCitiesLabel,
        'TOUR NAME': selectedTour,
        '[TOUR NAME]': selectedTour,
        'CITY NAMES': selectedCitiesLabel,
        '[CITY NAMES]': selectedCitiesLabel,
        'CITY NAMES VI': selectedCitiesLabelVi,
        '[CITY NAMES VI]': selectedCitiesLabelVi,
        'CITY NAMES VN': selectedCitiesLabelVi,
        '[CITY NAMES VN]': selectedCitiesLabelVi,
        selectedPromotions: [
            formData.promotions?.earlyBird ? 'Early Bird 10%' : '',
            formData.promotions?.returningClient ? 'Returning Client 15%' : ''
        ].filter(Boolean).join(', ') || 'None selected',
        'Selected Promotions': [
            formData.promotions?.earlyBird ? 'Early Bird 10%' : '',
            formData.promotions?.returningClient ? 'Returning Client 15%' : ''
        ].filter(Boolean).join(', ') || 'None selected',
        wantCallback: formData.wantCallback ? 'Yes' : 'No',
        'Want Callback': formData.wantCallback ? 'Yes' : 'No',
        earlyBird: formData.promotions?.earlyBird ? 'Yes' : 'No',
        'Early Bird': formData.promotions?.earlyBird ? 'Yes' : 'No',
        returningClient: formData.promotions?.returningClient ? 'Yes' : 'No',
        'Returning Client': formData.promotions?.returningClient ? 'Yes' : 'No',
        currentDate: new Date().toLocaleDateString('en-GB'),
        'Current Date': new Date().toLocaleDateString('en-GB'),
        selectedPackage: formData.selectedPackage || 'Early Bird',
        'Selected Package': formData.selectedPackage || 'Early Bird',
        packagePrice: `$${formattedFinalPrice}`,
        'Package Price': `$${formattedFinalPrice}`,
        tourCode: formData.tourId === 'fallTour2025' ? 'UCV-F25' : 'UCV-S26',
        'Tour Code': formData.tourId === 'fallTour2025' ? 'UCV-F25' : 'UCV-S26',
        companyName: 'Universal Connect',
        'Company Name': 'Universal Connect',
        companyAddress: 'An der Spandauer Brücke 24, 10128 Berlin, Germany',
        'Company Address': 'An der Spandauer Brücke 24, 10128 Berlin, Germany',
        companyPhone: '+49 157 80561435',
        'Company Phone': '+49 157 80561435',
        companyEmail: 'info@universal-connect.com',
        'Company Email': 'info@universal-connect.com',
        companyWebsite: 'universal-connect.com',
        'Company Website': 'universal-connect.com'
    };

    Object.keys(formData.cities || {}).forEach((key) => {
        const readableName = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        templateData[key] = formData.cities[key] ? 'Yes' : 'No';
        templateData[readableName] = formData.cities[key] ? 'Yes' : 'No';
    });

    applyRepresentativeTemplateFields(templateData, formData);
    applyNewTemplateMustacheFields(templateData, formData, tourData);
    return templateData;
}

function renderDocument(templateKey, formData, calculatedPrice, tourData) {
    const buffer = loadTemplateBuffer(templateKey);
    let zip = new PizZip(buffer);
    const templateData = createTemplateData(formData, calculatedPrice, tourData);

    if (templateKey === 'registration') {
        prepareRegistrationTemplateXml(zip);
    }

    zip = renderWithDelimiters(zip, templateData, '{{', '}}');
    zip = renderWithDelimiters(zip, templateData, '[', ']');

    if (templateKey === 'registration') {
        const selectedSegmentsEn = buildSelectedTourSegmentsLabel(formData, tourData);
        const selectedSegmentsVi = buildSelectedTourSegmentsLabelVi(formData, tourData);
        applyVietnameseSegmentLabelToRegistrationXml(zip, selectedSegmentsEn, selectedSegmentsVi);
    }

    if (templateKey === 'invoice') {
        applyInvoiceCityNamePlaceholder(zip, templateData.TOUR_CITIES || templateData['CITY NAMES']);
        fixInvoiceDocxZip(zip);
    }

    return zip.generate({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    });
}

/**
 * Tạo Registration + Invoice .docx trên server (song song).
 * @returns {Promise<Array<{filename: string, content: Buffer}>>}
 */
async function generateRegistrationDocuments(formData, calculatedPrice = 0, tourData) {
    const orgSlug = (formData.organization || 'Registration').replace(/\s+/g, '_');
    const processedFormData = {
        ...formData,
        phone: formData.phone?.trim() || 'N/A',
        email: formData.email?.trim() || 'N/A',
        cities: normalizeCitySelectionsForSubmit(
            formData.cities,
            tourData?.customizeOptions
        )
    };

    const [registrationBuffer, invoiceBuffer] = await Promise.all([
        Promise.resolve().then(() => renderDocument('registration', processedFormData, calculatedPrice, tourData)),
        Promise.resolve().then(() => renderDocument('invoice', processedFormData, calculatedPrice, tourData))
    ]);

    return [
        { filename: `Registration_Form_${orgSlug}.docx`, content: registrationBuffer },
        { filename: `Invoice_${orgSlug}.docx`, content: invoiceBuffer }
    ];
}

module.exports = {
    generateRegistrationDocuments,
    normalizeCitySelectionsForSubmit,
    TEMPLATE_DIR,
    createTemplateData,
    renderDocument
};
