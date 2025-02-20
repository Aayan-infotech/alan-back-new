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
            { expiresIn: '7d' } // Token expires in 7 hour
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

// exports.updateCustomer = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updateData = req.body;

//         // Find the customer by ID and update it with the new data
//         const updatedCustomer = await CustomerManage.findByIdAndUpdate(
//             id,
//             updateData,
//             { new: true, runValidators: true } // Return the updated document and run validators
//         );

//         if (!updatedCustomer) {
//             return res.status(404).json({ message: 'Customer not found' });
//         }

//         res.status(200).json({ message: 'Customer updated successfully', data: updatedCustomer });
//     } catch (error) {
//         console.error('Error updating customer:', error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, mobile, state, zipCode, address } = req.body;

        // Create an object with only the fields that should be updated
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (mobile !== undefined) updateData.mobile = mobile;
        if (state !== undefined) updateData.state = state;
        if (zipCode !== undefined) updateData.zipCode = zipCode;
        if (address !== undefined) updateData.address = address;

        // Find the customer by ID and update it with the filtered data
        const updatedCustomer = await CustomerManage.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Construct the response with updated fields
        const response = {
            status: 200,
            success: true,
            message: 'Customer updated successfully',
            data: {
                name: updatedCustomer.name,
                mobile: updatedCustomer.mobile,
                state: updatedCustomer.state,
                zipCode: updatedCustomer.zipCode,
                address: updatedCustomer.address,
            },
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Forget Password with OTP Verification
exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email exists
        const customer = await CustomerManage.findOne({ email });

        if (!customer) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Customer not found.',
            });
        }

        // Generate a random OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to the customer's record
        customer.otp = otp;
        await customer.save();

        // Send OTP via email
        await sendOTPEmail(email, otp);

        return res.status(200).json({
            status: 200,
            success: true,
            message: 'OTP sent to your email.',
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

// Verify OTP and Reset Password
exports.verifyForgetPasswordOTP = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'New password and confirm password do not match.',
            });
        }

        // Find the customer by email
        const customer = await CustomerManage.findOne({ email });

        if (!customer) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Customer not found.',
            });
        }

        // Validate OTP
        if (customer.otp !== otp) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invalid OTP.',
            });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password and clear OTP
        customer.password = hashedNewPassword;
        customer.otp = null;
        await customer.save();

        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Password reset successfully.',
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

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Ensure token is provided
        const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent as "Bearer <token>"
        if (!token) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: 'Authorization token is required.',
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        if (!decoded) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: 'Invalid or expired token.',
            });
        }

        // Find the customer by ID (from the token)
        const customer = await CustomerManage.findById(decoded.id);
        if (!customer) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Customer not found.',
            });
        }

        // Check if new and confirm passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'New password and confirm password do not match.',
            });
        }

        // Check if the old password matches
        const isOldPasswordValid = await bcrypt.compare(oldPassword, customer.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: 'Old password is incorrect.',
            });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the customer's password
        customer.password = hashedNewPassword;
        await customer.save();

        return res.status(200).json({
            status: 200,
            success: true,
            message: 'Password updated successfully.',
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


exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "ID parameter is required"
            });
        }
        
        const deletedCustomer = await CustomerManage.findByIdAndDelete(id);
        
        if (!deletedCustomer) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Customer not found"
            });
        }
        
        res.status(200).json({
            status: 200,
            success: true,
            message: "Customer deleted successfully",
            data: deletedCustomer
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
