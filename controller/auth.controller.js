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
            'your_jwt_secret_key', // Secret key
            { expiresIn: '1h' }     // Token expiry time
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


// Register Controller
// const registerUser = (req, res) => {
//     const { username, password } = req.body;

//     // Basic validation (just for demo)
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password required' });
//     }

//     // Dummy response (in real case, save to DB)
//     res.status(201).json({ message: 'User registered successfully', user: { username } });
// };

// // Login Controller
// const loginUser = (req, res) => {
//     const { username, password } = req.body;

//     // Dummy logic (in real case, verify from DB)
//     if (username === 'admin' && password === '123456') {
//         res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token' });
//     } else {
//         res.status(401).json({ message: 'Invalid credentials' });
//     }
// };

// module.exports = { registerUser, loginUser };
