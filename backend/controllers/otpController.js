const nodemailer = require('nodemailer');
const twilio = require('twilio');
const otpGenerator = require('otp-generator');
const supabase = require('../db/supabaseClient');
const otpStore = {};

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Twilio setup
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Sends a one-time password (OTP) to a user's email or phone number,
 * but only if the user does not already exist in the database.
 */
exports.sendOTP = async (req, res) => {
    const { identifier, type } = req.body;
    
    if (!identifier || !type) {
        return res.status(400).json({ error: 'Identifier and type are required.' });
    }

    try {
        // Check if the user already exists in the database
        let userExists = false;
        let userData;

        if (type === 'email') {
            // Regex for a more comprehensive email validation
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(identifier)) {
                return res.status(400).json({ error: 'Invalid email address format.' });
            }
            const { data, error } = await supabase.from('users').select('*').eq('email', identifier);
            if (error) throw error;
            userData = data;
        } else if (type === 'phone_number') {
            if (identifier.length !== 10 ) {
                return res.status(400).json({ error: 'Please enter a valid US phone number.' });
            }
            const { data, error } = await supabase.from('users').select('*').eq('phone_number', identifier);
            if (error) throw error;
            userData = data;
        } else {
            return res.status(400).json({ error: 'Invalid identifier type.' });
        }

        userExists = userData && userData.length > 0;
        if (userExists) {
            if (type === 'email') {
                return res.status(409).json({ error: 'User with this email already exists.' });
            } else if (type === 'phone_number') {
                return res.status(409).json({ error: 'User with this phone number already exists.' });
            }
        }

        // Proceed to send OTP if the user does not exist
        const newOtp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        const expirationTime = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

        // Store the OTP in memory
        otpStore[identifier] = {
            otp: newOtp,
            expiresAt: expirationTime,
            type,
        };

        if (type === 'email') {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: identifier,
                subject: 'Your Agentsuit OTP',
                html: `<p>Your Verification code is: <strong>${newOtp}</strong>. It expires in 5 minutes.</p>`,
            };
            await transporter.sendMail(mailOptions);
        } else if (type === 'phone_number') {
            await twilioClient.messages.create({
                body: `Your Agentsuit OTP is: ${newOtp}. It expires in 5 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+91${identifier}`,
            });
        }

        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP.' });
    }
};


exports.verifyOTP = async (req, res) => {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
        return res.status(400).json({ error: 'Identifier and OTP are required.' });
    }

    const storedOtp = otpStore[identifier];

    // Check if an OTP exists for the identifier
    if (!storedOtp) {
        return res.status(400).json({ error: 'Invalid OTP or user not found.' });
    }

    // Check for expiration
    if (storedOtp.expiresAt < Date.now()) {
        delete otpStore[identifier]; // Remove expired OTP
        return res.status(400).json({ error: 'OTP has expired.' });
    }

    // Validate the OTP
    console.log(storedOtp.otp, otp);
    if (storedOtp.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP.' });
    }

    // If successful, delete the OTP to prevent reuse
    delete otpStore[identifier];

    res.status(200).json({ message: 'OTP verified successfully.' });
};