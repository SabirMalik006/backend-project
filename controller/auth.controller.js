const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models').Usser;

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email already registered',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
        const newUser = await User.create({ name, email, password : hashedPassword });

        res.status(201).json({
            message: 'User registered successfully',
            data: { name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET, // ✅ use .env secret here
            { expiresIn: '1h' }
          );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { login , register } 

