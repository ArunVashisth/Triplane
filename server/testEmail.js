require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

async function test() {
    try {
        await sendEmail({
            email: process.env.EMAIL_USER,
            subject: 'Triplane - Test Email',
            html: '<h1>If you receive this, your email settings are correct!</h1>'
        });
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Test email failed:', error);
    }
}

test();
