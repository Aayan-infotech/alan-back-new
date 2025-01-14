const User = require('../models/adminUserManageModel');
const bcrypt = require('bcrypt');


exports.createUser = async (req, res) => {
  try {
    const { name, email, mobile, password, ins_ip, country_name, address, state, zipCode } = req.body;
    const ins_by = req.user ? req.user._id : null; // Set ins_by based on the logged-in user
  
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create a new User instance
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      ins_ip,
      ins_by,
      country_name,
      address,
      state,
      zipCode,
    });
  
    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', data: newUser });
  } catch (error) {
    console.error('Error during user creation:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};



// exports.createUser = async (req, res) => {
//     try {
//       const { name, email, mobile,password, ins_ip } = req.body;
//       const ins_by = req.user ? req.user._id : null; // Set ins_by based on the logged-in user
  
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       const newUser = new User({
//         name,
//         email,
//         mobile,
//         password: hashedPassword,
//         ins_ip,
//         ins_by,
//       });
  
//       await newUser.save();
//       res.status(201).json({ message: 'User created successfully', data: newUser });
//     } catch (error) {
//       console.error('Error during user creation:', error);
//       res.status(500).json({ message: 'Error creating user', error: error.message });
//     }
//   };
  
  

// Fetch all AdminUsers
exports.getAdminUsers = async (req, res) => {
  try {
    const AdminUsers = await User.find();
    res.status(200).json({ data: AdminUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AdminUsers', error });
  }
};

// Fetch a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};