const nodemailer = require('nodemailer');
const twilio = require('twilio');

const createTransporter = () => {
    // Determine whether to use real SMTP or fallback to Ethereal/Console if missing credentials
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: 'gmail', // Standardized to Gmail per user requirements
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    // Fallback Mock Logger (if user left .env blank)
    return {
        sendMail: async (mailOptions) => {
            console.log(`\n============================`);
            console.log(`[Mock Email Triggered]`);
            console.log(`To: ${mailOptions.to}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log(`Text: ${mailOptions.text}`);
            console.log(`============================\n`);
            return { messageId: 'mock-id' };
        }
    };
};

const sendVerificationEmail = async (userEmail, token) => {
    const transporter = createTransporter();
    const verificationUrl = `http://localhost:5000/api/auth/verify-email/${token}`;
    
    const info = await transporter.sendMail({
        from: '"VetSense AI Security" <security@vetsense.ai>',
        to: userEmail,
        subject: "Verify Your Email - VetSense AI",
        text: `Please verify your email by opening this link: ${verificationUrl}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4CAF50;">Welcome to VetSense AI!</h2>
                <p>We are excited to have you on board. To complete your registration and secure your account, please verify your email address.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
                </div>
                <p style="font-size: 0.9em; color: #777;">If the button doesn't work, copy and paste this link into your browser: <br/> ${verificationUrl}</p>
            </div>
        `,
    });

    console.log("Email Verification Message processed.");
};

const sendMockSMS = async (userPhone, textMessage) => {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        try {
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
                body: textMessage,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: userPhone
            });
            console.log(`Twilio SMS dispatched to ${userPhone}`);
            return;
        } catch (err) {
            console.error('Twilio Error:', err.message);
        }
    }

    // Fallback Mock Logger (if user left .env blank)
    console.log(`\n============================`);
    console.log(`[Twilio SMS Mock Triggered]`);
    console.log(`To: ${userPhone}`);
    console.log(`Message: ${textMessage}`);
    console.log(`============================\n`);
};

module.exports = {
    sendVerificationEmail,
    sendMockSMS
};
