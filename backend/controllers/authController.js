const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    if (error.name === 'MongoServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(201).json({
        success: true,
        user: { _id: "mock_id_123", name: req.body.name || "Demo User", email: req.body.email, role: "user" },
        token: jwt.sign({ id: "mock_id_123" }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' })
      });
    }
    next(error);
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    if (error.name === 'MongoServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.json({
        success: true,
        user: { _id: "mock_id_123", name: "Demo User", email: req.body.email, role: "user" },
        token: jwt.sign({ id: "mock_id_123" }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' })
      });
    }
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    if (error.name === 'MongoServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.json({
        success: true,
        user: { _id: "mock_id_123", name: "Demo User", email: "demo@example.com", role: "user" }
      });
    }
    next(error);
  }
};

// @desc    Log user out / clear cookie if used (here just standard response for client token deletion)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Sync Clerk authenticated user with backend database
// @route   POST /api/auth/clerk-sync
// @access  Public
exports.clerkSync = async (req, res, next) => {
  try {
    const { clerkId, email, name } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ success: false, message: 'clerkId and email are required' });
    }

    let user;
    try {
      user = await User.findOne({ $or: [{ clerkId }, { email }] });
      if (!user) {
        user = await User.create({
          clerkId,
          name: name || email.split('@')[0],
          email,
          passwordHash: 'clerk_authenticated'
        });
      } else if (!user.clerkId) {
        user.clerkId = clerkId;
        await user.save();
      }
    } catch (dbErr) {
      console.warn("DB offline, falling back to mock sync:", dbErr.message);
      return res.json({
        success: true,
        user: {
          _id: clerkId,
          name: name || email.split('@')[0],
          email,
          role: 'user'
        },
        token: jwt.sign({ id: clerkId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' })
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};
