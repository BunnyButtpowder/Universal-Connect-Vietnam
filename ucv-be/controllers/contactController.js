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
            // to: 'bernd@iucconsulting.com',
            to: 'ngominhvu2003@gmail.com',
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