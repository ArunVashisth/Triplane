const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    console.log(`Attempting to send email to: ${options.email}`);
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Triplane Concierge" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error in sendEmail utility:', error);
        throw error;
    }
};

module.exports = sendEmail;
