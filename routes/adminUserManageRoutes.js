const express = require('express');
const router = express.Router();
const userController = require('../controllers/adminUserManageControllers');

// Middleware for logging
const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

router.use(logRequest);

router.post('/AdminUsers', userController.createUser);
router.get('/AdminUsers', userController.getAdminUsers);
router.get('/AdminUsers/:id', userController.getUserById);
router.put('/AdminUsers/:id', userController.updateUser);
router.delete('/AdminUsers/:id', userController.deleteUser);

module.exports = router;

// Middleware example for authentication (authMiddleware.js)
module.exports.authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  // Token verification logic here
  try {
    // Example: Verify token with a secret key
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};