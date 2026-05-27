import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { contactApi, TourFull } from '@/lib/api';
import { UniversityRepresentative } from '@/types/signup';
import { buildFlatSelectedCityNamesForInvoice } from '@/utils/tourSelectionLabels';
import { fixInvoiceDocxZip } from '@/utils/invoiceDocxLayout';

const TEMPLATE_PATHS = {
    registration: '/VN_template.docx',
    invoice: '/IUC_Invoice VAT_UNIVERSITY_template.docx'
} as const;

function isDocxArrayBuffer(buffer: ArrayBuffer): boolean {
    const bytes = new Uint8Array(buffer);
    return bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b;
}

/** Tải template .docx — báo lỗi rõ nếu thiếu file (tránh treo khi Vite trả về index.html) */
async function fetchDocxTemplate(templateUrl: string): Promise<ArrayBuffer> {
    const response = await fetch(templateUrl);

    if (!response.ok) {
        throw new Error(
            `Không tìm thấy template ${templateUrl} (HTTP ${response.status}). ` +
                `Đặt file .docx vào thư mục ucv-fe/public.`
        );
    }

    const templateContent = await response.arrayBuffer();

    if (templateContent.byteLength === 0) {
        throw new Error(`Template ${templateUrl} rỗng.`);
    }

    if (!isDocxArrayBuffer(templateContent)) {
        throw new Error(
            `File ${templateUrl} không phải Word (.docx). ` +
                `Thường do thiếu file trong public/ — server trả về trang HTML thay vì template.`
        );
    }

    return templateContent;
}

// Types for our form data based on the form interface
interface FormData {
    fullName: string;
    organization: string;
    phone: string;
    email: string;
    wantCallback: boolean;
    selectedPackage: string;
    cities: {
        [key: string]: boolean;
    };
    promotions: {
        earlyBird: boolean;
        returningClient: boolean;
    };
    participantCount?: number;
    representatives?: UniversityRepresentative[];
    headOffice: string;
    businessRegistration: string;
    legalRepresentative: string;
    position: string;
    accountNumber: string;
    bank: string;
    swift: string;
    tourId: string;
    tourName?: string;
}

function applyRepresentativeTemplateFields(
    data: Record<string, string | boolean | number>,
    formData: FormData
): void {
    const reps = formData.representatives?.length
        ? formData.representatives
        : [
              {
                  name: formData.legalRepresentative,
                  position: formData.position,
                  phone: formData.phone,
                  email: formData.email
              }
          ];

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
        .map(
            (r, i) =>
                `Representative ${i + 1}: ${r.name}, ${r.position}, ${r.phone}, ${r.email}`
        )
        .join('\n');
}

/**
 * Creates a mapping of form data to document template fields
 * This function centralizes the mapping logic so we can easily adjust field mappings
 * @param formData The form data from the signup form
 * @param calculatedPrice The calculated price based on selected options
 * @returns An object with key-value pairs matching the document template fields
 */
function createTemplateData(formData: FormData, calculatedPrice: number = 0, currentTour?: TourFull): Record<string, string | boolean | number> {
    console.log("Creating template data from form data:", formData);
    
    // Use the actual tour name if provided, otherwise fall back to the previous logic
    const selectedTour = formData.tourName || (formData.tourId === 'fallTour2025' 
        ? 'Fall Tour 2025 (Central Vietnam - Hue, Da Nang)'
        : 'Spring Tour 2026 (Northern Vietnam - Hanoi, Hai Duong)');
        
    const tourDate = formData.tourId === 'fallTour2025'
        ? '1 - 8 OCTOBER 2025'
        : '31 MARCH - 10 APRIL 2026';
        
    // Get current date in DD/MM/YYYY format for TODAY placeholder
    const today = new Date();
    const formattedToday = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
    // Generate an invoice number (in a real app, this would come from a database or sequence)
    // For demo purposes, we'll use a timestamp-based number
    const invoiceNumber = `${(new Date().getTime() % 1000).toString().padStart(3, '0')}`;
    
    // Calculate prices with VAT
    const priceWithVAT = Math.round(calculatedPrice * 1.08).toLocaleString();

    const selectedCitiesLabel = buildFlatSelectedCityNamesForInvoice(
        formData.cities,
        currentTour ?? null
    );
    
    const templateData: Record<string, string | boolean | number> = {
        // Basic information - common placeholders with variations
        fullName: formData.fullName,
        organization: formData.organization,
        "UNIVERSITY NAME": formData.organization, // For invoice template
        phone: formData.phone,
        email: formData.email,
        
        // Add direct support for phone and email placeholders (for Docxtemplater)
        "PHONE": formData.phone,
        "EMAIL": formData.email,
        "[PHONE]": formData.phone, // Explicitly add bracketed versions
        "[EMAIL]": formData.email, // Explicitly add bracketed versions
        "[Phone]": formData.phone,
        "[Email]": formData.email,
        
        // New special placeholders for price, dates, etc.
        // Keys without brackets for Docxtemplater (when using bracket delimiters)
        "PRICE": currentTour?.pricing?.standard?.regular ? `$${Math.round(Number(currentTour.pricing.standard.regular))}` : '',
        "DATE": currentTour?.earlyBirdDeadline ? new Date(currentTour.earlyBirdDeadline).toLocaleDateString('en-GB') : '',
        "STANDARDDATE": currentTour?.standardDeadline ? new Date(currentTour.standardDeadline).toLocaleDateString('en-GB') : '',
        "ADDRESS": formData.headOffice,
        "NO": invoiceNumber,
        "TODAY": formattedToday,
        
        // Keys with brackets for direct text replacement (fallback method)
        "[PRICE]": currentTour?.pricing?.standard?.regular ? `$${Math.round(Number(currentTour.pricing.standard.regular))}` : '',
        "[DATE]": currentTour?.earlyBirdDeadline ? new Date(currentTour.earlyBirdDeadline).toLocaleDateString('en-GB') : '',
        "[STANDARDDATE]": currentTour?.standardDeadline ? new Date(currentTour.standardDeadline).toLocaleDateString('en-GB') : '',
        "[ADDRESS]": formData.headOffice,
        "[NO]": invoiceNumber,
        "[TODAY]": formattedToday,
        
        // Other price formats
        "FINAL PRICE": calculatedPrice.toLocaleString(),
        "[FINAL PRICE]": calculatedPrice.toLocaleString(),
        "FINAL PRICE * 108%": priceWithVAT,
        "[FINAL PRICE * 108%]": priceWithVAT,
        
        // Business information with variations
        headOffice: formData.headOffice,
        "Head office address": formData.headOffice, // Common format in templates
        
        businessRegistration: formData.businessRegistration || 'N/A',  // Optional field
        "Business Registration": formData.businessRegistration || 'N/A',
        "BUSINESS REGISTRATION": formData.businessRegistration || 'N/A',
        
        legalRepresentative: formData.legalRepresentative,
        "Legal Representative": formData.legalRepresentative,
        "LEGAL REPRESENTATIVE": formData.legalRepresentative,

        position: formData.position,
        "Position": formData.position,
        "POSITION": formData.position,
        
        accountNumber: formData.accountNumber || 'N/A',  // Optional field
        "Account Number": formData.accountNumber || 'N/A',
        "ACCOUNT NUMBER": formData.accountNumber || 'N/A',
        
        bank: formData.bank || 'N/A',  // Optional field
        "Bank": formData.bank || 'N/A',
        "BANK": formData.bank || 'N/A',
        
        swift: formData.swift || 'N/A',  // Optional field
        "Swift": formData.swift || 'N/A',
        "SWIFT": formData.swift || 'N/A',
        
        // Selected tour information
        selectedTour,
        "Selected Tour": selectedTour,
        "SELECTED TOUR": selectedTour,
        
        tourDate,
        "Tour Date": tourDate,
        "TOUR DATE": tourDate,
        
        selectedCities: selectedCitiesLabel,
        "Selected Cities": selectedCitiesLabel,
        "TOUR NAME": selectedTour,
        "[TOUR NAME]": selectedTour,
        "CITY NAMES": selectedCitiesLabel,
        "[CITY NAMES]": selectedCitiesLabel,
            
        // Selected promotions (comma-separated list of selected promotions)
        selectedPromotions: [
            formData.promotions.earlyBird ? 'Early Bird 10%' : '',
            formData.promotions.returningClient ? 'Returning Client 15%' : ''
        ].filter(Boolean).join(', ') || 'None selected',
        "Selected Promotions": [
            formData.promotions.earlyBird ? 'Early Bird 10%' : '',
            formData.promotions.returningClient ? 'Returning Client 15%' : ''
        ].filter(Boolean).join(', ') || 'None selected',
        
        // Checkbox values as Yes/No
        wantCallback: formData.wantCallback ? 'Yes' : 'No',
        "Want Callback": formData.wantCallback ? 'Yes' : 'No',
        
        // Individual city preferences - Dynamic approach
        ...Object.keys(formData.cities).reduce((acc, key) => {
            const readableName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            acc[key] = formData.cities[key] ? 'Yes' : 'No';
            acc[readableName] = formData.cities[key] ? 'Yes' : 'No';
            return acc;
        }, {} as Record<string, string>),
        
        // Individual promotion preferences
        earlyBird: formData.promotions.earlyBird ? 'Yes' : 'No',
        "Early Bird": formData.promotions.earlyBird ? 'Yes' : 'No',
        returningClient: formData.promotions.returningClient ? 'Yes' : 'No',
        "Returning Client": formData.promotions.returningClient ? 'Yes' : 'No',
        
        // Date information
        currentDate: new Date().toLocaleDateString('en-GB'),  // DD/MM/YYYY format
        "Current Date": new Date().toLocaleDateString('en-GB'),
        
        // Package information
        selectedPackage: formData.selectedPackage || 'Early Bird',
        "Selected Package": formData.selectedPackage || 'Early Bird',
        packagePrice: `$${calculatedPrice.toLocaleString()}`,  // Dynamic based on calculation
        "Package Price": `$${calculatedPrice.toLocaleString()}`,
        
        // Tour code - needed for invoice
        tourCode: formData.tourId === 'fallTour2025' ? 'UCV-F25' : 'UCV-S26',
        "Tour Code": formData.tourId === 'fallTour2025' ? 'UCV-F25' : 'UCV-S26',
        
        // Company details (fixed values that might be used in templates)
        companyName: 'Universal Connect',
        "Company Name": 'Universal Connect',
        companyAddress: 'An der Spandauer Brücke 24, 10128 Berlin, Germany',
        "Company Address": 'An der Spandauer Brücke 24, 10128 Berlin, Germany',
        companyPhone: '+49 157 80561435',
        "Company Phone": '+49 157 80561435',
        companyEmail: 'info@universal-connect.com',
        "Company Email": 'info@universal-connect.com',
        companyWebsite: 'universal-connect.com',
        "Company Website": 'universal-connect.com',
    };

    applyRepresentativeTemplateFields(templateData, formData);
    return templateData;
}

/**
 * Processes a DOCX template file with the given form data
 * @param templateUrl The URL of the template file
 * @param formData The form data to insert into the template
 * @param outputFilename The name of the output file to save
 * @param calculatedPrice The calculated price based on user selections
 */
export async function processDocumentTemplate(
    templateUrl: string,
    formData: FormData,
    outputFilename: string,
    calculatedPrice: number = 0,
    currentTour?: TourFull
): Promise<void> {
    console.log(`Starting to process document template: ${templateUrl}`);
    try {
        // Verify required libraries are loaded
        if (!PizZip) {
            throw new Error("PizZip is not available. Make sure it's properly imported.");
        }
        if (!Docxtemplater) {
            throw new Error("Docxtemplater is not available. Make sure it's properly imported.");
        }
        if (!saveAs) {
            throw new Error("file-saver is not available. Make sure it's properly imported.");
        }

        // Fetch the template document
        console.log(`Fetching template: ${templateUrl}`);
        const response = await fetch(templateUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
        }
        
        const templateContent = await response.arrayBuffer();
        console.log('Template fetched successfully, size:', templateContent.byteLength, 'bytes');
        
        if (templateContent.byteLength === 0) {
            throw new Error('Template file is empty');
        }
        
        // Create a zip instance from the template content
        let zip;
        try {
            zip = new PizZip(templateContent);
            console.log('Template loaded into PizZip successfully');
        } catch (zipError: any) {
            console.error('PizZip error:', zipError);
            throw new Error(`Failed to unzip template: ${zipError.message || 'Unknown error'}`);
        }
        
        // Log template XML for debugging
        try {
            const documentXml = zip.files['word/document.xml'];
            if (documentXml) {
                const content = documentXml.asText();
                // Look for placeholders in the document
                const placeholders = content.match(/\[([^\]]+)\]/g);
                if (placeholders && placeholders.length > 0) {
                    console.log('Found these potential placeholders in the document:', 
                        [...new Set(placeholders)].map(p => p.replace(/\[|\]/g, '')));
                }
            }
        } catch (e) {
            console.log('Could not analyze document structure:', e);
        }

        // Create a Docxtemplater instance with the template
        let doc;
        try {
            // Set up Docxtemplater with advanced options
            doc = new Docxtemplater()
                .loadZip(zip)
                .setOptions({
                    // Set delimiters to match [PLACEHOLDER] format often used in Word
                    delimiters: {
                        start: '[',
                        end: ']'
                    }
                });
            console.log('Template loaded into Docxtemplater successfully with custom delimiters');
        } catch (docError: any) {
            console.error('Docxtemplater error:', docError);
            throw new Error(`Failed to load template into Docxtemplater: ${docError.message || 'Unknown error'}`);
        }
        
        // Get data for template
        const templateData = createTemplateData(formData, calculatedPrice, currentTour);
        console.log('Template data prepared:', templateData);
        
        // Set the template data
        try {
            doc.setData(templateData);
            console.log('Template data set successfully');
        } catch (dataError: any) {
            console.error('Error setting template data:', dataError);
            throw new Error(`Failed to set template data: ${dataError.message || 'Unknown error'}`);
        }
        
        try {
            // Render the document (replace all template variables)
            doc.render();
            console.log('Document rendered successfully');
            
            // Get the binary content of the rendered document
            const outputContent = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            
            console.log('Generated document blob successfully, size:', outputContent.size, 'bytes');
            
            // Save the document
            saveAs(outputContent, outputFilename);
            console.log(`Document saved as ${outputFilename}`);
            
            return Promise.resolve();
        } catch (error: any) {
            console.error('Error rendering document:', error);
            if (error.properties && error.properties.errors) {
                console.error('Template render errors:', error.properties.errors);
                
                // Log more details about each error
                Object.keys(error.properties.errors).forEach(key => {
                    console.error(`Error for tag "${key}":`, error.properties.errors[key]);
                });
            }
            
            // Try to log the raw error message and stack trace
            console.error('Error message:', error.message || 'No message');
            console.error('Error stack:', error.stack || 'No stack trace');
            
            return Promise.reject(error);
        }
    } catch (error: any) {
        console.error('Error processing document template:', error);
        console.error('Error message:', error.message || 'No message');
        console.error('Error stack:', error.stack || 'No stack trace');
        return Promise.reject(error);
    }
}

/**
 * Process all document templates with the given form data
 * @param formData The form data to fill in the templates
 * @param calculatedPrice The calculated price based on user selections
 * @param tourName Optional tour name to override the default tour name logic
 */
export async function processAllTemplates(formData: FormData, calculatedPrice: number = 0, tourName?: string, currentTour?: TourFull): Promise<void> {
    console.log("Starting to process all templates with form data", formData);
    console.log("Values:", currentTour?.pricing.standard.regular, currentTour?.standardDeadline, formData.headOffice)
    try {
        // Make a copy of formData to ensure we don't modify the original
        const processedFormData = { ...formData };
        
        // Add tour name if provided
        if (tourName) {
            processedFormData.tourName = tourName;
        }
        
        // Ensure phone and email are properly formatted and non-empty
        const phoneValue = formData.phone && formData.phone.trim() ? formData.phone.trim() : "N/A";
        const emailValue = formData.email && formData.email.trim() ? formData.email.trim() : "N/A";
        
        // Update formData with validated values to ensure template processing works correctly
        processedFormData.phone = phoneValue;
        processedFormData.email = emailValue;
        
        console.log("Processing with phone:", phoneValue);
        console.log("Processing with email:", emailValue);
        console.log("Processing with calculated price:", calculatedPrice);
        
        // Get the tour name for replacements
        const tourNameForReplacements = tourName || (formData.tourId === 'fallTour2025' 
            ? 'Fall Tour 2025 (Central Vietnam - Hue, Da Nang)'
            : 'Spring Tour 2026 (Northern Vietnam - Hanoi, Hai Duong)');
            
        const selectedCitiesString = buildFlatSelectedCityNamesForInvoice(
            processedFormData.cities,
            currentTour ?? null
        );
        
        // Create replacement mapping for direct text replacement if needed
        const replacements: Record<string, string> = {
            // Basic information
            'UNIVERSITY NAME': formData.organization,
            'University name': formData.organization,
            'university name': formData.organization,
            'ADDRESS': formData.headOffice,
            '[ADDRESS]': formData.headOffice,
            'LEGAL REPRESENTATIVE': formData.legalRepresentative,
            'Legal representative': formData.legalRepresentative,
            'legal representative': formData.legalRepresentative,
            'POSITION': formData.position,
            'Position': formData.position,
            'position': formData.position,
            
            // User requested tags
            'TOUR NAME': tourNameForReplacements,
            '[TOUR NAME]': tourNameForReplacements,
            'CITY NAMES': selectedCitiesString,
            '[CITY NAMES]': selectedCitiesString,
            'Selected Cities': selectedCitiesString,
            
            // Dynamic pricing
            'PRICE': currentTour?.pricing?.standard?.regular ? `$${Math.round(Number(currentTour.pricing.standard.regular))}` : '',
            '[PRICE]': currentTour?.pricing?.standard?.regular ? `$${Math.round(Number(currentTour.pricing.standard.regular))}` : '',
            'FINAL PRICE': `$${calculatedPrice.toLocaleString()}`,
            '[FINAL PRICE]': `$${calculatedPrice.toLocaleString()}`,
            'FINAL PRICE * 108%': `$${Math.round(calculatedPrice * 1.08).toLocaleString()}`,
            '[FINAL PRICE * 108%]': `$${Math.round(calculatedPrice * 1.08).toLocaleString()}`,
            
            // Date placeholders
            'DATE': currentTour?.earlyBirdDeadline ? new Date(currentTour.earlyBirdDeadline).toLocaleDateString('en-GB') : '',
            '[DATE]': currentTour?.earlyBirdDeadline ? new Date(currentTour.earlyBirdDeadline).toLocaleDateString('en-GB') : '',
            'STANDARDDATE': currentTour?.standardDeadline ? new Date(currentTour.standardDeadline).toLocaleDateString('en-GB') : '',
            '[STANDARDDATE]': currentTour?.standardDeadline ? new Date(currentTour.standardDeadline).toLocaleDateString('en-GB') : '',
            'STANDARD DATE': currentTour?.standardDeadline ? new Date(currentTour.standardDeadline).toLocaleDateString('en-GB') : '',
            'TODAY': new Date().toLocaleDateString('en-GB'),
            '[TODAY]': new Date().toLocaleDateString('en-GB'),
            
            // Invoice number
            'NO': `${(new Date().getTime() % 1000).toString().padStart(3, '0')}`,
            '[NO]': `${(new Date().getTime() % 1000).toString().padStart(3, '0')}`,
            
            // Account information (optional)
            'Account number': formData.accountNumber || 'N/A',
            'ACCOUNT NUMBER': formData.accountNumber || 'N/A',
            'account number': formData.accountNumber || 'N/A',
            'Bank': formData.bank || 'N/A',
            'BANK': formData.bank || 'N/A',
            'bank': formData.bank || 'N/A',
            'Business registration number': formData.businessRegistration || 'N/A',
            'BUSINESS REGISTRATION': formData.businessRegistration || 'N/A',
            'business registration': formData.businessRegistration || 'N/A',
            
            // Contact information - ensure all possible variations are covered
            'EMAIL': emailValue,
            'Email': emailValue,
            'email': emailValue,
            'PHONE': phoneValue,
            'Phone': phoneValue, 
            'phone': phoneValue,
            'PHONE NUMBER': phoneValue,
            'Phone number': phoneValue,
            'phone number': phoneValue,
            'CONTACT NUMBER': phoneValue,
            'Contact number': phoneValue,
            'contact number': phoneValue,
            // Raw text that might be in the document
            'CONTACT PHONE': phoneValue,
            'Contact phone': phoneValue,
            'contact phone': phoneValue,
            'CONTACT EMAIL': emailValue,
            'Contact email': emailValue,
            'contact email': emailValue,
            
            // Tour information
            'SELECTED TOUR': formData.tourId === 'fallTour2025' 
                ? 'Fall Tour 2025 (Central Vietnam - Hue, Da Nang)'
                : 'Spring Tour 2026 (Northern Vietnam - Hanoi, Hai Duong)',
            'Selected tour': formData.tourId === 'fallTour2025' 
                ? 'Fall Tour 2025 (Central Vietnam - Hue, Da Nang)'
                : 'Spring Tour 2026 (Northern Vietnam - Hanoi, Hai Duong)',
            'TOUR DATE': formData.tourId === 'fallTour2025'
                ? '1 - 8 OCTOBER 2025'
                : '31 MARCH - 10 APRIL 2026',
            'Tour date': formData.tourId === 'fallTour2025'
                ? '1 - 8 OCTOBER 2025'
                : '31 MARCH - 10 APRIL 2026'
        };

        const repTemplateFields: Record<string, string | boolean | number> = {};
        applyRepresentativeTemplateFields(repTemplateFields, formData);
        Object.assign(
            replacements,
            Object.fromEntries(
                Object.entries(repTemplateFields).map(([key, value]) => [key, String(value)])
            )
        );
        
        // Store generated documents in memory for sending to backend
        const generatedDocuments: File[] = [];
        
        // Process the Vietnam template
        try {
            // Process the Vietnam template
            console.log("Processing Vietnam template using template engine");
            const vnDoc = await processDocumentTemplateForEmail(
                TEMPLATE_PATHS.registration,
                processedFormData,
                `Registration_Form_${formData.organization.replace(/\s+/g, '_')}.docx`,
                calculatedPrice,
                currentTour
            );
            
            if (vnDoc) {
                generatedDocuments.push(vnDoc);
            }
        } catch (error) {
            console.log("Template engine failed for VN template, trying direct text replacement", error);
            
            // Special handling for VN template with additional specific mappings
            const vnReplacements = {
                ...replacements,
                'PHONE': phoneValue,
                'Phone': phoneValue,
                'phone': phoneValue,
                
                'EMAIL': emailValue,
                'Email': emailValue, 
                'email': emailValue,
                
                // Additional variations for the exact format in VN_template
                'Phone/Điện thoại': `Phone/Điện thoại: ${phoneValue}`,
                'Phone/Điện thoại:': `Phone/Điện thoại: ${phoneValue}`,
                'Phone/Điện thoại: undefined': `Phone/Điện thoại: ${phoneValue}`,
                'Phone/Điện thoại: [PHONE]': `Phone/Điện thoại: ${phoneValue}`,
                
                'Email:': `Email: ${emailValue}`,
                'Email: undefined': `Email: ${emailValue}`,
                'Email: [EMAIL]': `Email: ${emailValue}`,
                
                // Even more explicit mappings for specific formats
                'Phone/Điện thoại: ': `Phone/Điện thoại: ${phoneValue}`,
                'Phone: ': `Phone: ${phoneValue}`,
                'PHONE: ': `PHONE: ${phoneValue}`,
                'Email: ': `Email: ${emailValue}`,
                'EMAIL: ': `EMAIL: ${emailValue}`
            };
            
            // Try direct text replacement as fallback
            const vnDoc = await replaceTextInWordDocumentForEmail(
                TEMPLATE_PATHS.registration,
                vnReplacements,
                `Registration_Form_${formData.organization.replace(/\s+/g, '_')}.docx`
            );
            
            if (vnDoc) {
                generatedDocuments.push(vnDoc);
            }
        }
        
        // Process the Invoice template
        try {
            console.log("Processing Invoice template using template engine");
            const invoiceDoc = await processDocumentTemplateForEmail(
                TEMPLATE_PATHS.invoice,
                processedFormData,
                `Invoice_${formData.organization.replace(/\s+/g, '_')}.docx`,
                calculatedPrice,
                currentTour
            );
            
            if (invoiceDoc) {
                generatedDocuments.push(invoiceDoc);
            }
        } catch (error) {
            console.log("Template engine failed for Invoice template, trying direct text replacement", error);
            
            // Special handling for Invoice template
            const invoiceReplacements = {
                ...replacements,
                // Direct exact placeholder matches and variations as before
                'PHONE': phoneValue,
                'Phone': phoneValue,
                'phone': phoneValue,
                '[PHONE]': phoneValue,
                '[Phone]': phoneValue,
                '[phone]': phoneValue,
                
                'EMAIL': emailValue,
                'Email': emailValue, 
                'email': emailValue,
                '[EMAIL]': emailValue,
                '[Email]': emailValue,
                '[email]': emailValue,
                
                // Common invoice template placeholders
                'INVOICE TO': formData.organization,
                'UNIVERSITY': formData.organization,
                'Organization': formData.organization,
                'Address': formData.headOffice,
                'CONTACT': formData.legalRepresentative,
                'Contact person': formData.legalRepresentative,
                'CONTACT PERSON': formData.legalRepresentative,
                
                // Phone and email with various formats
                'Tel:': `Tel: ${phoneValue}`,
                'TEL:': `TEL: ${phoneValue}`,
                'Tel: undefined': `Tel: ${phoneValue}`,
                'Tel: [PHONE]': `Tel: ${phoneValue}`,
                'Telephone:': `Telephone: ${phoneValue}`,
                'TELEPHONE:': `TELEPHONE: ${phoneValue}`,
                'PHONE:': `PHONE: ${phoneValue}`,
                'Phone:': `Phone: ${phoneValue}`,
                
                'E-mail:': `E-mail: ${emailValue}`,
                'E-mail: undefined': `E-mail: ${emailValue}`,
                'E-mail: [EMAIL]': `E-mail: ${emailValue}`,
                'E-MAIL:': `E-MAIL: ${emailValue}`,
                'EMAIL:': `EMAIL: ${emailValue}`,
                
                // Extended formats with spaces
                'Tel: ': `Tel: ${phoneValue}`,
                'TEL: ': `TEL: ${phoneValue}`,
                'Telephone: ': `Telephone: ${phoneValue}`,
                'TELEPHONE: ': `TELEPHONE: ${phoneValue}`,
                'PHONE: ': `PHONE: ${phoneValue}`,
                'Phone: ': `Phone: ${phoneValue}`,
                
                'E-mail: ': `E-mail: ${emailValue}`,
                'E-MAIL: ': `E-MAIL: ${emailValue}`,
                'EMAIL: ': `EMAIL: ${emailValue}`
            };
            
            // Try direct text replacement as fallback
            const invoiceDoc = await replaceTextInWordDocumentForEmail(
                TEMPLATE_PATHS.invoice,
                invoiceReplacements,
                `Invoice_${formData.organization.replace(/\s+/g, '_')}.docx`
            );
            
            if (invoiceDoc) {
                generatedDocuments.push(invoiceDoc);
            }
        }
        
        console.log(`Sending registration (${generatedDocuments.length} document(s)) to backend API`);
        await contactApi.submitDocuments(processedFormData, generatedDocuments);

        if (generatedDocuments.length === 0) {
            console.warn(
                'Registration sent without Word attachments — add VN_template.docx and ' +
                    'IUC_Invoice VAT_UNIVERSITY_template.docx to ucv-fe/public/'
            );
        } else {
            console.log('Documents sent successfully');
        }

        console.log('Registration submitted successfully');
        return Promise.resolve();
    } catch (error: any) {
        console.error('Error processing templates:', error);
        console.error('Error message:', error.message || 'No message');
        console.error('Error stack:', error.stack || 'No stack trace');
        return Promise.reject(error);
    }
}

/**
 * Processes a DOCX template file with the given form data for email submission
 * Similar to processDocumentTemplate but returns a File instead of downloading
 */
async function processDocumentTemplateForEmail(
    templateUrl: string,
    formData: FormData,
    outputFilename: string,
    calculatedPrice: number = 0,
    currentTour?: TourFull
): Promise<File | null> {
    console.log(`Starting to process document template for email: ${templateUrl}`);
    try {
        console.log(`Fetching template: ${templateUrl}`);
        const templateContent = await fetchDocxTemplate(templateUrl);
        console.log('Template fetched successfully, size:', templateContent.byteLength, 'bytes');

        const zip = new PizZip(templateContent);
        
        // Create a Docxtemplater instance with the template
        const doc = new Docxtemplater()
            .loadZip(zip)
            .setOptions({
                delimiters: {
                    start: '[',
                    end: ']'
                }
            });
        
        // Set template data
        const templateData = createTemplateData(formData, calculatedPrice, currentTour);
        doc.setData(templateData);
        
        doc.render();

        if (templateUrl === TEMPLATE_PATHS.invoice) {
            fixInvoiceDocxZip(doc.getZip());
        }

        const content = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            compression: 'DEFLATE'
        });
        
        // Convert blob to File
        const file = new File([content], outputFilename, {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        
        console.log(`Document processed successfully: ${outputFilename}`);
        return file;
    } catch (error: any) {
        console.error(`Error processing template for email: ${error.message}`);
        throw error;
    }
}

/**
 * Falls back to direct text replacement when template engine fails
 * Similar to replaceTextInWordDocument but returns a File instead of downloading
 */
async function replaceTextInWordDocumentForEmail(
    documentUrl: string,
    replacements: Record<string, string>,
    outputFilename: string
): Promise<File | null> {
    console.log(`Starting direct text replacement for email: ${documentUrl}`);
    try {
        const documentContent = await fetchDocxTemplate(documentUrl);
        console.log('Document fetched successfully, size:', documentContent.byteLength, 'bytes');

        const zip = new PizZip(documentContent);
        
        // Get the document.xml file
        const documentXml = zip.files['word/document.xml'];
        if (!documentXml) {
            throw new Error('Invalid document format: word/document.xml not found');
        }
        
        // Get the text content of the document
        let documentText = documentXml.asText();
        
        // Perform replacements
        for (const [search, replace] of Object.entries(replacements)) {
            // Skip empty replacements
            if (!search || search === '') continue;
            
            // Skip undefined or null values
            if (replace === undefined || replace === null) continue;
            
            // Simple string replacement for basic text
            documentText = documentText.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
            
            // Also try different brackets in case they are used for placeholders
            if (!search.includes('[')) {
                documentText = documentText.replace(new RegExp(`\\[${search}\\]`, 'g'), replace);
            }
        }
        
        zip.file('word/document.xml', documentText);

        if (documentUrl === TEMPLATE_PATHS.invoice) {
            fixInvoiceDocxZip(zip);
        }

        const content = zip.generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            compression: 'DEFLATE'
        });

        const file = new File([content], outputFilename, {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        console.log(`Document replaced successfully: ${outputFilename}`);
        return file;
    } catch (error: any) {
        console.error(`Error replacing text in document for email: ${error.message}`);
        throw error;
    }
} 