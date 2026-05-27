const nodemailer = require('nodemailer');
const { getEmailToList, isEmailConfigured } = require('../config/env');
const { buildSelectedCityNamesLabel } = require('../utils/tourSelectionLabels');

function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
}

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
            to: getEmailToList(),
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

        if (!isEmailConfigured()) {
            return res.status(503).json({
                message: 'Email server is not configured',
                error: 'Set EMAIL_USER and EMAIL_PASSWORD in ucv-be/.env (Gmail App Password).'
            });
        }

        await createTransporter().sendMail(mailOptions);

        res.status(200).json({ message: 'Contact form submitted successfully' });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ message: 'Error submitting contact form', error: err.message });
    }
};

// Submit document attachments
const Tour = require('../models/Tour');

exports.submitDocuments = async (req, res) => {
    if (!req.body.formData) {
        return res.status(400).json({ message: 'Form data is required' });
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

        const files = req.files || [];
        const attachments = files.map(file => ({
            filename: file.originalname,
            content: file.buffer
        }));

        const representativesHtml = Array.isArray(formData.representatives) && formData.representatives.length > 0
            ? formData.representatives.map((rep, index) => `
                <p><strong>Representative ${index + 1}${index === 0 ? ' (Legal Representative)' : ''}:</strong></p>
                <ul>
                    <li>Name: ${rep.name || 'N/A'}</li>
                    <li>Position: ${rep.position || 'N/A'}</li>
                    <li>Phone: ${rep.phone || 'N/A'}</li>
                    <li>Email: ${rep.email || 'N/A'}</li>
                </ul>
            `).join('')
            : '';

        const selectedCities = buildSelectedCityNamesLabel(formData, tourData);
        
        const promotions = formData.promotions || {};
        const selectedPromotions = [
            promotions.earlyBird ? 'Early Bird 10%' : '',
            promotions.returningClient ? 'Returning Client 15%' : ''
        ].filter(Boolean).join(', ') || 'None selected';

        // Create email content
        const mailOptions = {
            from: `"${formData.email}" <${process.env.EMAIL_USER}>`,
            to: getEmailToList(),
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
                ${representativesHtml}
                ${attachments.length === 0 ? '<p><em>Word attachments were not generated (missing templates on server build).</em></p>' : ''}
                
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

        if (!isEmailConfigured()) {
            if (process.env.EMAIL_SKIP_SEND === 'true') {
                console.log('[EMAIL_SKIP_SEND] Tour registration (no mail sent):', {
                    wouldSendTo: getEmailToList(),
                    organization: formData.organization,
                    email: formData.email,
                    tour: selectedTour,
                    attachments: attachments.length
                });
                return res.status(200).json({
                    message: 'Registration saved (email skipped — dev mode)',
                    devMode: true
                });
            }

            return res.status(503).json({
                message: 'Email server is not configured',
                error: 'Set EMAIL_USER and EMAIL_PASSWORD in ucv-be/.env. For local test without mail, set EMAIL_SKIP_SEND=true.'
            });
        }

        await createTransporter().sendMail(mailOptions);

        res.status(200).json({ message: 'Documents submitted successfully' });
    } catch (err) {
        console.error('Error sending documents:', err);
        res.status(500).json({
            message: 'Error submitting documents',
            error: err.message
        });
    }
}; 