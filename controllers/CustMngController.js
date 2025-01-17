const CustomerManage = require('../models/CustMngModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Function to send OTP via email
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: process.env.smtp_user,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.smtp_user,
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
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Email already registered.',
            });
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

        return res.status(201).json({
            status: 201,
            success: true,
            message: 'Customer created. OTP sent to email.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal server error.',
        });
    }
};

// Verify OTP and activate customer account
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the customer by email
        const customer = await CustomerManage.findOne({ email });

        if (!customer) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Customer not found.',
            });
        }

        // Check if the provided OTP matches
        if (customer.otp !== otp) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invalid OTP.',
            });
        }

        // Activate the account and clear OTP
        customer.status = 1; // Account activated
        customer.otp = null; // Remove OTP
        await customer.save();

        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Account verified successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal server error.',
        });
    }
};

// Customer login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email exists in the database
        const customer = await CustomerManage.findOne({ email });
        if (!customer) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Customer not found.',
            });
        }

        // Check if the account is verified (OTP should be null)
        if (customer.otp !== null) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Account not verified. Please verify your email.',
            });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: 'Invalid email or password.',
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: customer._id, email: customer.email },
            process.env.SESSION_SECRET,
            { expiresIn: '7d' } // Token expires in 1 hour
        );

        // Successful login with JWT token
        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Login successful.',
            token: token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                mobile: customer.mobile,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal server error.',
        });
    }
};


// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await CustomerManage.find();
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Customers retrieved successfully',
            data: customers
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Failed to retrieve customers',
            error: error.message
        });
    }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await CustomerManage.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Customer not found'
            });
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Customer retrieved successfully',
            data: customer
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Failed to retrieve customer',
            error: error.message
        });
    }
};