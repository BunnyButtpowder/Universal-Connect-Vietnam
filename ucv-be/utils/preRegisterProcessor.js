const Tour = require('../models/Tour');
const { getEmailToList, isEmailConfigured } = require('../config/env');

function escapeHtml(value) {
    if (value == null) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildPreRegistrationMailOptions(formData, tourData) {
    const selectedTour = tourData?.title || formData.tourName || 'Unknown Tour';
    const tourDate = tourData?.tourDates || tourData?.date || 'TBD';
    const questions = (formData.anyQuestions || '').trim();

    return {
        from: `"${formData.email}" <${process.env.EMAIL_USER}>`,
        to: getEmailToList(),
        replyTo: formData.email,
        subject: `New Tour Pre-registration - ${formData.organization} - Universal Connect Vietnam`,
        html: `
            <h2>New Tour Pre-registration</h2>
            <p><strong>Full Name:</strong> ${escapeHtml(formData.fullName)}</p>
            <p><strong>University/Organization:</strong> ${escapeHtml(formData.organization)}</p>
            <p><strong>Email:</strong> ${escapeHtml(formData.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(formData.phone)}</p>
            <p><strong>Position:</strong> ${escapeHtml(formData.position)}</p>
            <p><strong>Pre-registrant's questions:</strong> ${questions ? escapeHtml(questions) : 'None'}</p>
            <p><strong>Want Callback:</strong> ${formData.wantCallback ? 'Yes' : 'No'}</p>

            <h3>Tour Details</h3>
            <p><strong>Selected Tour:</strong> ${escapeHtml(selectedTour)}</p>
            <p><strong>Tour Date:</strong> ${escapeHtml(tourDate)}</p>
            <p><strong>Pre-registration Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
        `
    };
}

function validatePreRegisterFormData(formData) {
    if (!formData || typeof formData !== 'object') {
        return 'Form data is required';
    }
    if (!formData.fullName?.trim()) {
        return 'Full name is required';
    }
    if (!formData.organization?.trim()) {
        return 'University/Organization is required';
    }
    if (!formData.email?.trim()) {
        return 'Email is required';
    }
    if (!formData.phone?.trim()) {
        return 'Phone is required';
    }
    if (!formData.position?.trim()) {
        return 'Position is required';
    }
    if (!formData.tourId) {
        return 'Tour is required';
    }
    return null;
}

/**
 * Gửi email pre-register (không kèm docx — tour coming soon chưa mở đăng ký).
 */
async function processPreRegistrationAsync({ formData, tourName, sendMail }) {
    if (tourName) {
        formData.tourName = tourName;
    }

    let tourData = null;
    try {
        tourData = await Tour.findById(formData.tourId);
    } catch (tourError) {
        console.error('[pre-register] Error fetching tour:', tourError);
        throw new Error('Tour not found');
    }

    if (!tourData) {
        throw new Error('Tour not found');
    }

    if (!tourData.isComingSoon) {
        throw new Error('This tour is not open for pre-registration');
    }

    if (!isEmailConfigured()) {
        if (process.env.EMAIL_SKIP_SEND === 'true') {
            console.log('[EMAIL_SKIP_SEND] Pre-registration (no mail sent):', {
                wouldSendTo: getEmailToList(),
                organization: formData.organization,
                email: formData.email,
                tour: tourData.title
            });
            return;
        }
        throw new Error('Email server is not configured');
    }

    const mailOptions = buildPreRegistrationMailOptions(formData, tourData);
    await sendMail(mailOptions);
    console.log(`[pre-register] Email sent for ${formData.organization} (${tourData.title})`);
}

module.exports = {
    buildPreRegistrationMailOptions,
    validatePreRegisterFormData,
    processPreRegistrationAsync
};
