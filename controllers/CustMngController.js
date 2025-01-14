const CustomerManage = require('../models/CustMngModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Function to send OTP via email
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: process.env.SMTP_USER,
            pass:  process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};

// Create new customer with email verification
exports.createCustAcc = async (req, res) => {
    try {
        const { name, email, mobile, password, country_name, address, state, zipCode } = req.body;

        // Check if customer already exists
        const existingCustomer = await CustomerManage.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Generate a hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a random OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save the customer data with OTP
        const newCustomer = new CustomerManage({
            name,
            email,
            mobile,
            password: hashedPassword,
            country_name,
            address,
            state,
            zipCode,
            otp,
            status: 0, // Set status to 0 until verified
        });

        await newCustomer.save();

        // Send OTP via email
        await sendOTPEmail(email, otp);

        return res.status(201).json({ message: 'Customer created. OTP sent to email.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Verify OTP and activate customer account
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the customer by email
        const customer = await CustomerManage.findOne({ email });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        // Check if the provided OTP matches
        if (customer.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Activate the account and clear OTP
        customer.status = 1; // Account activated
        customer.otp = null; // Remove OTP
        await customer.save();

        return res.status(200).json({ message: 'Account verified successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};




exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email exists in the database
        const customer = await CustomerManage.findOne({ email });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        // Check if the account is verified (OTP should be null)
        if (customer.otp !== null) {
            return res.status(400).json({ message: 'Account not verified. Please verify your email.' });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Successful login
        return res.status(200).json({
            message: 'Login successful.',
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                mobile: customer.mobile,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
