import { useEffect } from 'react';
import { analyzeDocumentTemplate } from '@/utils/documentAnalyzer';

/**
 * A utility component that analyzes docx templates on page load
 * This is for development purposes only to help understand template structure
 */
export function TemplateAnalyzer() {
    useEffect(() => {
        // Using setTimeout to ensure this runs after the page is rendered
        const timer = setTimeout(() => {
            console.log('Analyzing document templates...');
            
            // Analyze both templates
            analyzeDocumentTemplate('/VN_template.docx')
                .then(() => console.log('VN template analysis complete'))
                .catch(err => console.error('Failed to analyze VN template:', err));
                
            analyzeDocumentTemplate('/IUC_Invoice VAT_UNIVERSITY_template.docx')
                .then(() => console.log('Invoice template analysis complete'))
                .catch(err => console.error('Failed to analyze Invoice template:', err));
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);
    
    // This component doesn't render anything
    return null;
} 