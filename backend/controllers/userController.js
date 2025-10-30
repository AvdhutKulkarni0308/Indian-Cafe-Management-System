const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered.' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
};
