import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { isDbConnected } from '../config/db.js';
import { mockStore } from '../data/mockStore.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (isDbConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone: phone || '',
        role: role === 'admin' ? 'admin' : 'customer',
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      const existing = await mockStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const user = await mockStore.createUser({
        name,
        email,
        password,
        phone,
        role: role === 'admin' ? 'admin' : 'customer',
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses || [],
          token: generateToken(user._id),
        });
      }
    } else {
      const user = await mockStore.findUserByEmail(email);
      if (user) {
        let isMatch = false;
        if (user.rawPassword && user.rawPassword === password) {
          isMatch = true;
        } else if (user.password) {
          isMatch = await bcrypt.compare(password, user.password);
        }
        if (isMatch) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            addresses: user.addresses || [],
            token: generateToken(user._id),
          });
        }
      }
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

