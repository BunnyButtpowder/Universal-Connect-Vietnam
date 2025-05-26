const Content = require('../models/Content');

// Get all content
exports.getAllContent = async (req, res) => {
    try {
        const content = await Content.getAll();
        
        // Parse the JSON content field for each item
        const parsedContent = content.map(item => {
            return {
                ...item,
                content: JSON.parse(item.content)
            };
        });
        
        res.status(200).json(parsedContent);
    } catch (error) {
        console.error('Error getting all content:', error);
        res.status(500).json({ message: 'Error retrieving content', error: error.message });
    }
};

// Get content by page name
exports.getContentByPage = async (req, res) => {
    try {
        const { pageName } = req.params;
        const content = await Content.getByName(pageName);
        
        if (!content) {
            return res.status(404).json({ message: `Content for page ${pageName} not found` });
        }
        
        // Parse the JSON content field
        const parsedContent = {
            ...content,
            content: JSON.parse(content.content)
        };
        
        res.status(200).json(parsedContent);
    } catch (error) {
        console.error(`Error getting content for page ${req.params.pageName}:`, error);
        res.status(500).json({ message: 'Error retrieving content', error: error.message });
    }
};

// Save content for a specific page
exports.saveContent = async (req, res) => {
    try {
        const { pageName } = req.params;
        const pageContent = req.body;
        
        if (!pageContent) {
            return res.status(400).json({ message: 'Content is required' });
        }
        
        const result = await Content.saveContent(pageName, pageContent);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error saving content for page ${req.params.pageName}:`, error);
        res.status(500).json({ message: 'Error saving content', error: error.message });
    }
};

// Update a specific content item
exports.updateContentItem = async (req, res) => {
    try {
        const { pageName, sectionId, itemId } = req.params;
        const { content, metadata } = req.body;
        
        // Get the current content
        const pageContent = await Content.getByName(pageName);
        
        if (!pageContent) {
            return res.status(404).json({ message: `Content for page ${pageName} not found` });
        }
        
        // Parse the stored content
        const parsedContent = JSON.parse(pageContent.content);
        
        // Find the section and item
        if (!parsedContent.sections || !parsedContent.sections[sectionId]) {
            return res.status(404).json({ message: `Section ${sectionId} not found in page ${pageName}` });
        }
        
        const section = parsedContent.sections[sectionId];
        const itemIndex = section.items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: `Item ${itemId} not found in section ${sectionId}` });
        }
        
        // Update the item content
        const updatedItem = {
            ...section.items[itemIndex],
            content: content
        };
        
        // Update metadata if provided
        if (metadata) {
            updatedItem.metadata = {
                ...updatedItem.metadata,
                ...metadata
            };
        }
        
        section.items[itemIndex] = updatedItem;
        
        // Save the updated content
        const result = await Content.saveContent(pageName, parsedContent);
        res.status(200).json({ updated: true, item: updatedItem });
    } catch (error) {
        console.error(`Error updating content item:`, error);
        res.status(500).json({ message: 'Error updating content item', error: error.message });
    }
};

// Reset all content to default values
exports.resetAllContent = async (req, res) => {
    try {
        const defaultContent = req.body;
        
        if (!Array.isArray(defaultContent) || defaultContent.length === 0) {
            return res.status(400).json({ message: 'Default content array is required' });
        }
        
        const result = await Content.resetToDefault(defaultContent);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error resetting all content:', error);
        res.status(500).json({ message: 'Error resetting content', error: error.message });
    }
};

// Reset specific page content to default
exports.resetPageContent = async (req, res) => {
    try {
        const { pageName } = req.params;
        const defaultPageContent = req.body;
        
        if (!defaultPageContent) {
            return res.status(400).json({ message: 'Default page content is required' });
        }
        
        const result = await Content.resetPage(pageName, defaultPageContent);
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error resetting content for page ${req.params.pageName}:`, error);
        res.status(500).json({ message: 'Error resetting page content', error: error.message });
    }
}; 