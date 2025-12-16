const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/', auth, checkRole(['Admin']), async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('manager', 'username');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', auth, checkRole(['Admin']), async (req, res) => {
    const { username, password, role, managerId } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        user = new User({
            username,
            password: await bcrypt.hash(password, salt),
            role,
            manager: managerId || null
        });

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/managers', auth, checkRole(['Admin']), async (req, res) => {
    try {
        const managers = await User.find({ role: 'Manager' }).select('username id');
        res.json(managers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
