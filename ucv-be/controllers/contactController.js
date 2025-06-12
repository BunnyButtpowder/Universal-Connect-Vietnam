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
            from: process.env.EMAIL_USER,
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

        // Get file attachments
        const attachments = req.files.map(file => ({
            filename: file.originalname,
            content: file.buffer
        }));

        // Build email content with tour and form information
        const selectedTour = formData.tourId === 'fallTour2025' 
            ? 'Fall Tour 2025 (Central Vietnam - Hue, Da Nang)'
            : 'Spring Tour 2026 (Northern Vietnam - Hanoi, Hai Duong)';
        
        const tourDate = formData.tourId === 'fallTour2025'
            ? '1 - 8 OCTOBER 2025'
            : '31 MARCH - 10 APRIL 2026';
            
        // Selected cities as text
        const selectedCities = [
            formData.cities.hanoiHaiDuong ? 'Hanoi & Hai Duong' : '',
            formData.cities.hueDaNang ? 'Hue & Da Nang' : '',
            formData.cities.hcmc ? 'Ho Chi Minh City (HCMC)' : ''
        ].filter(Boolean).join(', ') || 'None selected';
        
        // Selected promotions as text
        const selectedPromotions = [
            formData.promotions.earlyBird ? 'Early Bird 10%' : '',
            formData.promotions.returningClient ? 'Returning Client 15%' : ''
        ].filter(Boolean).join(', ') || 'None selected';

        // Early bird expiration date based on tour
        const earlyBirdExpiration = formData.tourId === 'fallTour2025' 
            ? '10 July 2025'
            : '10 December 2025';

        // Create email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'info@ucv.com.vn',
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