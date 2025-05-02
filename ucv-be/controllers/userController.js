const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users', error: err.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }

    try {
        // Hash the password with a salt round of 10
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword
        });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    // Validate request
    if (!req.body.name && !req.body.email) {
        return res.status(400).json({ message: 'Name or email is required for update' });
    }

    try {
        const updatedUser = await User.update(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username
        });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const result = await User.delete(req.params.id);
        if (result) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
}; 