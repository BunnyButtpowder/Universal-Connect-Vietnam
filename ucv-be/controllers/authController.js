const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login user
exports.login = async (req, res) => {
    // Validate request
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find user by username
        const user = await User.findByUsername(req.body.username);
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return user info and token
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: token
        });
    } catch (err) {
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
};

// Verify token middleware
exports.verifyToken = (req, res, next) => {
    // Get token from header
    const bearerHeader = req.headers['authorization'];
    
    if (!bearerHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        // Extract token from bearer header
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Add user info to request
        req.user = decoded;
        
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
}; 