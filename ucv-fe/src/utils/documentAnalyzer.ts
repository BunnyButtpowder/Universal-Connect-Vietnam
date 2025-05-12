import PizZip from 'pizzip';

/**
 * Analyzes a DOCX template file and logs all template tags
 * @param templateUrl The URL of the template file
 */
export async function analyzeDocumentTemplate(templateUrl: string): Promise<void> {
    try {
        // Fetch the template document
        const response = await fetch(templateUrl);
        const templateContent = await response.arrayBuffer();
        
        // Create a zip instance from the template content
        const zip = new PizZip(templateContent);
        
        // Read document.xml content directly
        const documentXml = zip.files['word/document.xml'];
        if (!documentXml) {
            throw new Error('document.xml not found in the template');
        }
        
        const textContent = documentXml.asText();
        
        // Find all template tags using regex
        const tagRegex = /\{([^{}]+)\}/g;
        const tags: string[] = [];
        let match;
        
        while ((match = tagRegex.exec(textContent)) !== null) {
            tags.push(match[1]);
        }
        
        // Remove duplicates and log unique tags
        const uniqueTags = [...new Set(tags)];
        console.log(`Template tags found in ${templateUrl}:`, uniqueTags);
        
        return Promise.resolve();
    } catch (error) {
        console.error(`Error analyzing document template ${templateUrl}:`, error);
        return Promise.reject(error);
    }
} 