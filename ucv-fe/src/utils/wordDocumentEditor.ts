import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

/**
 * Directly replaces text in a Word document without using template engine
 * This is a fallback method for when templating fails
 */
export async function replaceTextInWordDocument(
    templateUrl: string,
    replacements: Record<string, string>,
    outputFilename: string
): Promise<void> {
    try {
        console.log(`Starting direct text replacement in: ${templateUrl}`);
        
        // Fetch the template document
        const response = await fetch(templateUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
        }
        
        const templateContent = await response.arrayBuffer();
        if (templateContent.byteLength === 0) {
            throw new Error('Template file is empty');
        }
        
        // Create a zip instance from the template content
        const zip = new PizZip(templateContent);
        
        // Get the document.xml content
        const documentXml = zip.files['word/document.xml'];
        if (!documentXml) {
            throw new Error('document.xml not found in the template');
        }
        
        // Get the text content
        let content = documentXml.asText();
        console.log('Original document size:', content.length);
        
        // Enhanced XML handling for phone and email fields
        // This is critical for Word documents because the text is split across multiple XML tags
        
        // DIRECTLY replace [PHONE] and [EMAIL] in raw content
        // This is a brute force approach that should work regardless of context
        if (replacements['PHONE'] || replacements['phone'] || replacements['Phone']) {
            const phoneValue = replacements['PHONE'] || replacements['phone'] || replacements['Phone'];
            console.log(`Directly replacing [PHONE] with ${phoneValue}`);
            
            // Handle XML split across tags with regex to match w:t tags containing parts of the placeholder
            content = content.replace(/(<w:t[^>]*>)(.*?)(\[)(PHONE|Phone|phone)(\])(.*?)(<\/w:t>)/g, `$1$2${phoneValue}$6$7`);
            
            // Additional pattern for when the bracket is split across tags
            content = content.replace(/(<w:t[^>]*>.*?)\[(<\/w:t>)(<w:t[^>]*>)(PHONE|Phone|phone)(\])(.*?)(<\/w:t>)/g, 
                `$1${phoneValue}$6$7`);
            content = content.replace(/(<w:t[^>]*>.*?)\[(PHONE|Phone|phone)(<\/w:t>)(<w:t[^>]*>)\](.*?)(<\/w:t>)/g, 
                `$1${phoneValue}$5$6`);
            
            // Handle all variations of [PHONE] tag
            content = content.replace(/\[PHONE\]/g, phoneValue);
            content = content.replace(/\[Phone\]/g, phoneValue);
            content = content.replace(/\[phone\]/g, phoneValue);
            
            // Also handle plain text variations in different contexts
            content = content.replace(/(Phone\/Điện thoại:)\s*undefined/g, `$1 ${phoneValue}`);
            content = content.replace(/(Phone\/Điện thoại:)\s*\[PHONE\]/g, `$1 ${phoneValue}`);
            content = content.replace(/(Phone:)\s*undefined/g, `$1 ${phoneValue}`);
            content = content.replace(/(Phone:)\s*\[PHONE\]/g, `$1 ${phoneValue}`);
            content = content.replace(/(PHONE:)\s*undefined/g, `$1 ${phoneValue}`);
            content = content.replace(/(PHONE:)\s*\[PHONE\]/g, `$1 ${phoneValue}`);
            
            // Handle specific patterns in content
            content = content.replace(/Phone\/Điện thoại:\s*undefined/g, `Phone/Điện thoại: ${phoneValue}`);
            
            // Handle PHONE value that appears within XML tags where opening and closing brackets might be in different tags
            content = content.replace(/(<w:t[^>]*>[^<]*)\[(?:PHONE|Phone|phone)\]([^<]*<\/w:t>)/g, `$1${phoneValue}$2`);
            
            // Replace undefined within XML tags
            content = content.replace(/(<w:t[^>]*>[^<]*)undefined([^<]*<\/w:t>)/g, `$1${phoneValue}$2`);
        }
        
        if (replacements['EMAIL'] || replacements['email'] || replacements['Email']) {
            const emailValue = replacements['EMAIL'] || replacements['email'] || replacements['Email'];
            console.log(`Directly replacing [EMAIL] with ${emailValue}`);
            
            // Handle XML split across tags with regex to match w:t tags containing parts of the placeholder
            content = content.replace(/(<w:t[^>]*>)(.*?)(\[)(EMAIL|Email|email)(\])(.*?)(<\/w:t>)/g, `$1$2${emailValue}$6$7`);
            
            // Additional pattern for when the bracket is split across tags
            content = content.replace(/(<w:t[^>]*>.*?)\[(<\/w:t>)(<w:t[^>]*>)(EMAIL|Email|email)(\])(.*?)(<\/w:t>)/g, 
                `$1${emailValue}$6$7`);
            content = content.replace(/(<w:t[^>]*>.*?)\[(EMAIL|Email|email)(<\/w:t>)(<w:t[^>]*>)\](.*?)(<\/w:t>)/g, 
                `$1${emailValue}$5$6`);
            
            // Handle all variations of [EMAIL] tag
            content = content.replace(/\[EMAIL\]/g, emailValue);
            content = content.replace(/\[Email\]/g, emailValue);
            content = content.replace(/\[email\]/g, emailValue);
            
            // Also handle plain text variations in different contexts
            content = content.replace(/(Email:)\s*undefined/g, `$1 ${emailValue}`);
            content = content.replace(/(Email:)\s*\[EMAIL\]/g, `$1 ${emailValue}`);
            content = content.replace(/(EMAIL:)\s*undefined/g, `$1 ${emailValue}`);
            content = content.replace(/(EMAIL:)\s*\[EMAIL\]/g, `$1 ${emailValue}`);
            
            // Handle specific pattern found in content
            content = content.replace(/Email:\s*undefined/g, `Email: ${emailValue}`);
            
            // Handle EMAIL value that appears within XML tags where opening and closing brackets might be in different tags
            content = content.replace(/(<w:t[^>]*>[^<]*)\[(?:EMAIL|Email|email)\]([^<]*<\/w:t>)/g, `$1${emailValue}$2`);
            
            // Replace undefined within XML tags
            content = content.replace(/(<w:t[^>]*>[^<]*)undefined([^<]*<\/w:t>)/g, `$1${emailValue}$2`);
        }
        
        // Perform text replacements for all other items
        const replacementEntries = Object.entries(replacements);
        console.log(`Replacing ${replacementEntries.length} text items`);
        
        // First, find all potential placeholders in the document
        const bracketPlaceholders = content.match(/\[([^\]]+)\]/g) || [];
        const bracePlaceholders = content.match(/\{([^\}]+)\}/g) || [];
        
        // Log for debugging
        console.log('Found bracket placeholders:', bracketPlaceholders);
        console.log('Found brace placeholders:', bracePlaceholders);
        
        // Find potential plain text placeholders
        const potentialPlainTextPlaceholders = [
            'PHONE', 'EMAIL', 'UNIVERSITY NAME', 'HEAD OFFICE ADDRESS',
            'Phone', 'Email', 'University Name', 'Head Office Address'
        ];
        
        for (const placeholder of potentialPlainTextPlaceholders) {
            // Use a specific regex to find text content in Word XML
            const regex = new RegExp(`<w:t[^>]*>([^<]*${placeholder}[^<]*)</w:t>`, 'gi');
            let match;
            
            while ((match = regex.exec(content)) !== null) {
                console.log(`Found potential plain text placeholder: "${match[1]}" containing "${placeholder}"`);
            }
        }
        
        // Try different placeholder formats
        for (const [placeholder, value] of replacementEntries) {
            // Skip PHONE and EMAIL as they've been handled already
            if (placeholder === 'PHONE' || placeholder === 'EMAIL' || 
                placeholder === 'Phone' || placeholder === 'Email' ||
                placeholder === 'phone' || placeholder === 'email') {
                continue;
            }
            
            // Replace [PLACEHOLDER]
            const bracketPattern = new RegExp(`\\[${placeholder}\\]`, 'gi');
            content = content.replace(bracketPattern, value);
            
            // Replace {PLACEHOLDER}
            const bracePattern = new RegExp(`\\{${placeholder}\\}`, 'gi');
            content = content.replace(bracePattern, value);
            
            // Replace PLACEHOLDER without brackets (direct text replacement)
            // Only do this for specific placeholders that wouldn't cause issues
            if (placeholder.length > 5) { // Avoid replacing short words that might be part of actual text
                // This pattern tries to find placeholder within w:t tags to avoid replacing within XML tags
                const safePattern = new RegExp(`(<w:t[^>]*>[^<]*)(${placeholder})([^<]*</w:t>)`, 'gi');
                content = content.replace(safePattern, `$1${value}$3`);
            }
            
            // Special handling for specific placeholders
            if (placeholder.includes('representative') || placeholder.includes('REPRESENTATIVE')) {
                // Handle "Legal representative/Người đại diện pháp lý:" format
                content = content.replace(/(Legal representative\/Người đại diện pháp lý:)\s*undefined/g, `$1 ${value}`);
                content = content.replace(/(Legal representative\/Người đại diện pháp lý:)\s*\[.*?\]/g, `$1 ${value}`);
            }
            
            if (placeholder.includes('position') || placeholder.includes('POSITION')) {
                // Handle "Position/Chức vụ:" format
                content = content.replace(/(Position\/Chức vụ:)\s*undefined/g, `$1 ${value}`);
                content = content.replace(/(Position\/Chức vụ:)\s*\[.*?\]/g, `$1 ${value}`);
            }
        }
        
        // Final check for any remaining "undefined" values related to PHONE or EMAIL
        if (replacements['PHONE'] || replacements['phone'] || replacements['Phone']) {
            const phoneValue = replacements['PHONE'] || replacements['phone'] || replacements['Phone'];
            
            // Generic replace for any remaining undefined values near Phone
            content = content.replace(/(Phone[^<]{0,30})undefined/g, `$1${phoneValue}`);
            content = content.replace(/(PHONE[^<]{0,30})undefined/g, `$1${phoneValue}`);
            
            // Replace any remaining [PHONE] tags
            content = content.replace(/\[PHONE\]/g, phoneValue);
            
            // Super aggressive final replacement - any 'undefined' word between relevant XML tags
            content = content.replace(/(<w:t[^>]*>[^<]*)undefined([^<]*<\/w:t>)/g, (match, p1, p2) => {
                // Only replace if nearby context suggests it's a phone field
                if (match.toLowerCase().includes('phone') || match.toLowerCase().includes('tel')) {
                    return `${p1}${phoneValue}${p2}`;
                }
                return match;
            });
        }
        
        if (replacements['EMAIL'] || replacements['email'] || replacements['Email']) {
            const emailValue = replacements['EMAIL'] || replacements['email'] || replacements['Email'];
            
            // Generic replace for any remaining undefined values near Email
            content = content.replace(/(Email[^<]{0,30})undefined/g, `$1${emailValue}`);
            content = content.replace(/(EMAIL[^<]{0,30})undefined/g, `$1${emailValue}`);
            
            // Replace any remaining [EMAIL] tags
            content = content.replace(/\[EMAIL\]/g, emailValue);
            
            // Super aggressive final replacement - any 'undefined' word between relevant XML tags
            content = content.replace(/(<w:t[^>]*>[^<]*)undefined([^<]*<\/w:t>)/g, (match, p1, p2) => {
                // Only replace if nearby context suggests it's an email field
                if (match.toLowerCase().includes('email') || match.toLowerCase().includes('e-mail')) {
                    return `${p1}${emailValue}${p2}`;
                }
                return match;
            });
        }
        
        // Update the document.xml content
        zip.file('word/document.xml', content);
        
        // Generate the updated document
        const updatedContent = zip.generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        
        // Save the document
        saveAs(updatedContent, outputFilename);
        console.log(`Document saved as ${outputFilename}`);
        
        return Promise.resolve();
    } catch (error: any) {
        console.error('Error processing document:', error);
        console.error('Error message:', error.message || 'No message');
        console.error('Error stack:', error.stack || 'No stack trace');
        return Promise.reject(error);
    }
} 