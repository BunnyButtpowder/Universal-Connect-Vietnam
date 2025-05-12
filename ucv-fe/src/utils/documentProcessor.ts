import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { contactApi } from '@/lib/api';

// Types for our form data based on the form interface
interface FormData {
    fullName: string;
    organization: string;
    phone: string;
    email: string;
    wantCallback: boolean;
    selectedPackage: string;
    cities: {
        hanoiHaiDuong: boolean;
        hueDaNang: boolean;
    };
    transfers: {
        hotel: boolean;
        travel: boolean;
        flight: boolean;
    };
    headOffice: string;
    businessRegistration: string;
    legalRepresentative: string;
    position: string;
    accountNumber: string;
    bank: string;
    swift: string;
    tourId: string;
}

/**
 * Creates a mapping of form data to document template fields
 * This function centralizes the mapping logic so we can easily adjust field mappings
 * @param formData The form data from the signup form
 * @returns An object with key-value pairs matching the document template fields
 */
function createTemplateData(formData: FormData): Record<string, string | boolean | number> {
    console.log("Creating template data from form data:", formData);
    const selectedTour = formData.tourId === 'fallTour2025' 
        ? 'Fall Tour 2025 (Central Vietnam - Hue, Da Nang)'
        : 'Spring Tour 2026 (Northern Vietnam - Hanoi, Hai Duong)';
        
    const tourDate = formData.tourId === 'fallTour2025'
        ? '1 - 8 OCTOBER 2025'
        : '31 MARCH - 10 APRIL 2026';
    
    // Create a comprehensive mapping that covers all possible template placeholders
    return {
        // Basic information - common placeholders with variations
        fullName: formData.fullName,
        organization: formData.organization,
        "UNIVERSITY NAME": formData.organization, // For invoice template
        phone: formData.phone,
        email: formData.email,
        
        // Add direct support for bracketed placeholders
        "PHONE": formData.phone,
        "EMAIL": formData.email,
        "[PHONE]": formData.phone, // Explicitly add bracketed versions
        "[EMAIL]": formData.email, // Explicitly add bracketed versions
        "[Phone]": formData.phone,
        "[Email]": formData.email,
        
        // Business information with variations
        headOffice: formData.headOffice,
        "Head office address": formData.headOffice, // Common format in templates
        "HEAD OFFICE ADDRESS": formData.headOffice, // Alternative format
        
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
        
        // Selected cities (comma-separated list of selected cities)
        selectedCities: [
            formData.cities.hanoiHaiDuong ? 'Hanoi & Hai Duong' : '',
            formData.cities.hueDaNang ? 'Hue & Da Nang' : ''
        ].filter(Boolean).join(', ') || 'None selected',
        "Selected Cities": [
            formData.cities.hanoiHaiDuong ? 'Hanoi & Hai Duong' : '',
            formData.cities.hueDaNang ? 'Hue & Da Nang' : ''
        ].filter(Boolean).join(', ') || 'None selected',
            
        // Selected transfers (comma-separated list of selected transfers)
        selectedTransfers: [
            formData.transfers.hotel ? 'Accommodation for Northern Vietnam tour' : '',
            formData.transfers.travel ? 'Accommodation for Central Vietnam tour' : '',
            formData.transfers.flight ? 'One way flight from Hanoi to Hue' : ''
        ].filter(Boolean).join(', ') || 'None selected',
        "Selected Transfers": [
            formData.transfers.hotel ? 'Accommodation for Northern Vietnam tour' : '',
            formData.transfers.travel ? 'Accommodation for Central Vietnam tour' : '',
            formData.transfers.flight ? 'One way flight from Hanoi to Hue' : ''
        ].filter(Boolean).join(', ') || 'None selected',
        
        // Checkbox values as Yes/No
        wantCallback: formData.wantCallback ? 'Yes' : 'No',
        "Want Callback": formData.wantCallback ? 'Yes' : 'No',
        
        // Individual city preferences
        hanoiHaiDuong: formData.cities.hanoiHaiDuong ? 'Yes' : 'No',  
        "Hanoi Hai Duong": formData.cities.hanoiHaiDuong ? 'Yes' : 'No',  
        hueDaNang: formData.cities.hueDaNang ? 'Yes' : 'No',
        "Hue Da Nang": formData.cities.hueDaNang ? 'Yes' : 'No',
        
        // Individual transfer preferences
        hotelTransfer: formData.transfers.hotel ? 'Yes' : 'No',
        "Hotel Transfer": formData.transfers.hotel ? 'Yes' : 'No',
        travelTransfer: formData.transfers.travel ? 'Yes' : 'No',
        "Travel Transfer": formData.transfers.travel ? 'Yes' : 'No',
        flightTransfer: formData.transfers.flight ? 'Yes' : 'No',
        "Flight Transfer": formData.transfers.flight ? 'Yes' : 'No',
        
        // Date information
        currentDate: new Date().toLocaleDateString('en-GB'),  // DD/MM/YYYY format
        "Current Date": new Date().toLocaleDateString('en-GB'),
        
        // Package information
        selectedPackage: formData.selectedPackage || 'Early Bird',
        "Selected Package": formData.selectedPackage || 'Early Bird',
        packagePrice: '€5,500',  // This should be dynamic based on package selection
        "Package Price": '€5,500',
        
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
}

/**
 * Processes a DOCX template file with the given form data
 * @param templateUrl The URL of the template file
 * @param formData The form data to insert into the template
 * @param outputFilename The name of the output file to save
 */
export async function processDocumentTemplate(
    templateUrl: string,
    formData: FormData,
    outputFilename: string
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
        const templateData = createTemplateData(formData);
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
 */
export async function processAllTemplates(formData: FormData): Promise<void> {
    console.log("Starting to process all templates with form data", formData);
    try {
        // Make a copy of formData to ensure we don't modify the original
        const processedFormData = { ...formData };
        
        // Ensure phone and email are properly formatted and non-empty
        const phoneValue = formData.phone && formData.phone.trim() ? formData.phone.trim() : "N/A";
        const emailValue = formData.email && formData.email.trim() ? formData.email.trim() : "N/A";
        
        // Update formData with validated values to ensure template processing works correctly
        processedFormData.phone = phoneValue;
        processedFormData.email = emailValue;
        
        console.log("Processing with phone:", phoneValue);
        console.log("Processing with email:", emailValue);
        
        // Create replacement mapping for direct text replacement if needed
        const replacements: Record<string, string> = {
            // Basic information
            'UNIVERSITY NAME': formData.organization,
            'University name': formData.organization,
            'university name': formData.organization,
            'Head office address': formData.headOffice,
            'HEAD OFFICE ADDRESS': formData.headOffice,
            'head office address': formData.headOffice,
            'LEGAL REPRESENTATIVE': formData.legalRepresentative,
            'Legal representative': formData.legalRepresentative,
            'legal representative': formData.legalRepresentative,
            'POSITION': formData.position,
            'Position': formData.position,
            'position': formData.position,
            
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
        
        // Store generated documents in memory for sending to backend
        const generatedDocuments: File[] = [];
        
        // Process the Vietnam template
        try {
            // Process the Vietnam template
            console.log("Processing Vietnam template using template engine");
            const vnDoc = await processDocumentTemplateForEmail(
                '/VN_template.docx',
                processedFormData,
                `Registration_Form_${formData.organization.replace(/\s+/g, '_')}.docx`
            );
            
            if (vnDoc) {
                generatedDocuments.push(vnDoc);
            }
        } catch (error) {
            console.log("Template engine failed for VN template, trying direct text replacement", error);
            
            // Special handling for VN template with additional specific mappings
            const vnReplacements = {
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
                '/VN_template.docx',
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
                '/IUC_Invoice VAT_UNIVERSITY_template.docx',
                processedFormData,
                `Invoice_${formData.organization.replace(/\s+/g, '_')}.docx`
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
                'ADDRESS': formData.headOffice,
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
                '/IUC_Invoice VAT_UNIVERSITY_template.docx',
                invoiceReplacements,
                `Invoice_${formData.organization.replace(/\s+/g, '_')}.docx`
            );
            
            if (invoiceDoc) {
                generatedDocuments.push(invoiceDoc);
            }
        }
        
        // Check if we have documents to send
        if (generatedDocuments.length > 0) {
            // Send documents to backend API
            console.log(`Sending ${generatedDocuments.length} documents to backend API`);
            await contactApi.submitDocuments(processedFormData, generatedDocuments);
            console.log("Documents sent successfully");
        } else {
            throw new Error("No documents were generated");
        }
        
        console.log("All templates processed and submitted successfully");
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
    outputFilename: string
): Promise<File | null> {
    console.log(`Starting to process document template for email: ${templateUrl}`);
    try {
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
        
        // Create a zip instance and load template
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
        const templateData = createTemplateData(formData);
        doc.setData(templateData);
        
        // Render document
        doc.render();
        
        // Get the document blob
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
        // Fetch the document
        const response = await fetch(documentUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
        }
        
        const documentContent = await response.arrayBuffer();
        console.log('Document fetched successfully, size:', documentContent.byteLength, 'bytes');
        
        // Create a zip instance and load document
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
        
        // Update the document.xml file
        zip.file('word/document.xml', documentText);
        
        // Generate output file
        const content = zip.generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            compression: 'DEFLATE'
        });
        
        // Convert blob to File
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