const Tour = require('../models/Tour');
const { getEmailToList, isEmailConfigured } = require('../config/env');
const { buildSelectedTourSegmentsLabel } = require('./tourSelectionLabels');
const { generateRegistrationDocuments } = require('./documentProcessor');

function buildRepresentativesHtml(formData) {
    if (!Array.isArray(formData.representatives) || formData.representatives.length === 0) {
        return '';
    }

    return formData.representatives.map((rep, index) => `
        <p><strong>Representative ${index + 1}${index === 0 ? ' (Legal Representative)' : ''}:</strong></p>
        <ul>
            <li>Name: ${rep.name || 'N/A'}</li>
            <li>Position: ${rep.position || 'N/A'}</li>
            <li>Phone: ${rep.phone || 'N/A'}</li>
            <li>Email: ${rep.email || 'N/A'}</li>
        </ul>
    `).join('');
}

function buildTourRegistrationMailOptions(formData, tourData, attachments) {
    const selectedTour = tourData?.title || formData.tourName || 'Unknown Tour';
    const tourDate = tourData?.tourDates || tourData?.date || 'TBD';
    const earlyBirdExpiration = tourData?.earlyBirdDeadline
        ? new Date(tourData.earlyBirdDeadline).toLocaleDateString('en-GB')
        : 'TBD';

    const selectedCities = buildSelectedTourSegmentsLabel(formData, tourData);
    const promotions = formData.promotions || {};
    const selectedPromotions = [
        promotions.earlyBird ? 'Early Bird 10%' : '',
        promotions.returningClient ? 'Returning Client 15%' : ''
    ].filter(Boolean).join(', ') || 'None selected';

    const representativesHtml = buildRepresentativesHtml(formData);
    const attachmentNote = attachments.length === 0
        ? '<p><em>Word attachments were not generated (missing templates on server).</em></p>'
        : '';

    return {
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
            ${attachmentNote}
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
        attachments: attachments.map((file) => ({
            filename: file.filename,
            content: file.content
        }))
    };
}

/**
 * Generate Word docs + send registration email (chạy background sau khi API trả 202).
 */
async function processTourRegistrationAsync({ formData, calculatedPrice, tourName, sendMail }) {
    if (tourName) {
        formData.tourName = tourName;
    }

    let tourData = null;
    if (formData.tourId) {
        try {
            tourData = await Tour.findById(formData.tourId);
        } catch (tourError) {
            console.error('Error fetching tour data for registration:', tourError);
        }
    }

    let attachments = [];
    try {
        attachments = await generateRegistrationDocuments(formData, calculatedPrice, tourData);
        console.log(`[registration] Generated ${attachments.length} document(s) for ${formData.organization}`);
    } catch (docError) {
        console.error('[registration] Document generation failed:', docError);
    }

    if (!isEmailConfigured()) {
        if (process.env.EMAIL_SKIP_SEND === 'true') {
            console.log('[EMAIL_SKIP_SEND] Tour registration (no mail sent):', {
                wouldSendTo: getEmailToList(),
                organization: formData.organization,
                email: formData.email,
                attachments: attachments.length
            });
            return;
        }
        throw new Error('Email server is not configured');
    }

    const mailOptions = buildTourRegistrationMailOptions(formData, tourData, attachments);
    await sendMail(mailOptions);
    console.log(`[registration] Email sent for ${formData.organization}`);
}

module.exports = {
    buildTourRegistrationMailOptions,
    processTourRegistrationAsync
};
