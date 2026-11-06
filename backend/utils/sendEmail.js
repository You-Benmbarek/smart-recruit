const nodeMailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.emailSend,
        pass: process.env.mdpSend
    }
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.emailSend,
            to, 
            subject,
            text
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Email welcome message for new users
const sendWelcomeEmail = async (to, name) => {
    const subject = 'Welcome to Our Platform!';
    const text = `Hello ${name},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`;
    await sendEmail(to, subject, text);
};



module.exports = { sendEmail, sendWelcomeEmail };