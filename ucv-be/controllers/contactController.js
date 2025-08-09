const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Submit contact form
exports.submitContactForm = async (req, res) => {
    // Validate request
    if (!req.body.fullname || !req.body.email || !req.body.message) {
        return res.status(400).json({ message: 'Full name, email, and message are required' });
    }

    try {
        // Extract tour regions as string
        const tourRegions = Array.isArray(req.body.tourRegions) 
            ? req.body.tourRegions.join(', ') 
            : req.body.tourRegions || 'Not specified';

        // Create email content
        const mailOptions = {
            from: `"${req.body.email}" <${process.env.EMAIL_USER}>`,
            to: 'info@ucv.com.vn',
            replyTo: req.body.email,
            subject: 'New Contact Form Submission - Universal Connect Vietnam',
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Full Name:</strong> ${req.body.fullname}</p>
                <p><strong>University/Organization:</strong> ${req.body.organization || 'Not specified'}</p>
                <p><strong>Email:</strong> ${req.body.email}</p>
                <p><strong>Preferred Tour Region:</strong> ${tourRegions}</p>
                <p><strong>Message:</strong></p>
                <p>${req.body.message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Contact form submitted successfully' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ message: 'Error submitting contact form', error: err.message });
    }
};

// Submit document attachments
const Tour = require('../models/Tour');

exports.submitDocuments = async (req, res) => {
    // Check for required data
    if (!req.body.formData || !req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Form data and documents are required' });
    }

    try {
        const formData = JSON.parse(req.body.formData);
        
        // Validate basic form data
        if (!formData.fullName || !formData.email || !formData.organization) {
            return res.status(400).json({ message: 'Name, email, and organization are required' });
        }

        let tourData = null;
        let selectedTour = 'Unknown Tour';
        let tourDate = 'TBD';
        let earlyBirdExpiration = 'TBD';
        
        if (formData.tourId) {
            try {
                tourData = await Tour.findById(formData.tourId);
                if (tourData) {
                    selectedTour = tourData.title;
                    tourDate = tourData.tourDates || tourData.date || 'TBD';
                    earlyBirdExpiration = tourData.earlyBirdDeadline ? 
                        new Date(tourData.earlyBirdDeadline).toLocaleDateString('en-GB') : 'TBD';
                }
            } catch (tourError) {
                console.error('Error fetching tour data:', tourError);
                // Continue with fallback values if tour fetch fails
            }
        }

        // Get file attachments
        const attachments = req.files.map(file => ({
            filename: file.originalname,
            content: file.buffer
        }));

        // Build selected cities list using actual tour data
        let selectedCities = 'None selected';
        if (tourData && tourData.customizeOptions && formData.cities) {
            const selectedCityNames = [];
            
            // Process each selected customize option
            Object.keys(formData.cities).forEach(cityKey => {
                if (formData.cities[cityKey]) {
                    // Find the corresponding customize option
                    const customizeOption = tourData.customizeOptions.find(opt => opt.key === cityKey);
                    
                    if (customizeOption) {
                        // Use the customize option name directly
                        selectedCityNames.push(customizeOption.name);
                    } else {
                        // Fallback for legacy keys if customize option not found
                        const fallbackNames = {
                            'hanoiHaiDuong': 'Hanoi & Hai Duong',
                            'hueDaNang': 'Hue & Da Nang', 
                            'hcmc': 'Ho Chi Minh City',
                            'northern': 'Northern Vietnam',
                            'central': 'Central Vietnam',
                            'southern': 'Southern Vietnam'
                        };
                        if (fallbackNames[cityKey]) {
                            selectedCityNames.push(fallbackNames[cityKey]);
                        } else {
                            // If no fallback, use the key itself (formatted)
                            const formattedKey = cityKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            selectedCityNames.push(formattedKey);
                        }
                    }
                }
            });
            
            selectedCities = selectedCityNames.length > 0 ? 
                [...new Set(selectedCityNames)].join(', ') : 'None selected';
        }
        
        // Selected promotions as text
        const selectedPromotions = [
            formData.promotions.earlyBird ? 'Early Bird 10%' : '',
            formData.promotions.returningClient ? 'Returning Client 15%' : ''
        ].filter(Boolean).join(', ') || 'None selected';

        // Create email content
        const mailOptions = {
            from: `"${formData.email}" <${process.env.EMAIL_USER}>`,
            to: 'info@ucv.com.vn',
            // to: 'ngominhvu2003@gmail.com',
            replyTo: formData.email,
            subject: `New Tour Registration - ${formData.organization} - Universal Connect Vietnam`,
            html: `
                <h2>New Tour Registration</h2>
                <p><strong>Full Name:</strong> ${formData.fullName}</p>
                <p><strong>University/Organization:</strong> ${formData.organization}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Phone:</strong> ${formData.phone}</p>
                <p><strong>Position:</strong> ${formData.position}</p>
                <p><strong>Head Office Address:</strong> ${formData.headOffice}</p>
                <p><strong>Legal Representative:</strong> ${formData.legalRepresentative}</p>
                
                <h3>Tour Details</h3>
                <p><strong>Selected Tour:</strong> ${selectedTour}</p>
                <p><strong>Tour Date:</strong> ${tourDate}</p>
                <p><strong>Selected Cities:</strong> ${selectedCities}</p>
                <p><strong>Number of Participants:</strong> ${formData.participantCount || 1} ${(formData.participantCount || 1) === 1 ? 'person' : 'people'}</p>
                <p><strong>Applied Promotions:</strong> ${selectedPromotions}</p>
                <p><strong>Want Callback:</strong> ${formData.wantCallback ? 'Yes' : 'No'}</p>
                <p><strong>Early Bird Expiration:</strong> ${earlyBirdExpiration}</p>
                <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
            `,
            attachments: attachments
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Documents submitted successfully' });
    } catch (err) {
        console.error('Error sending documents:', err);
        res.status(500).json({ message: 'Error submitting documents', error: err.message });
    }
}; 