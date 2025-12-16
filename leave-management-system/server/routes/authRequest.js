const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, id: user.id });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/seed', async (req, res) => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) return res.status(400).json({ msg: 'Admin already exists' });

        const salt = await bcrypt.genSalt(10);

        const admin = new User({
            username: 'admin',
            role: 'Admin',
            password: await bcrypt.hash('admin123', salt)
        });
        await admin.save();

        const manager = new User({
            username: 'manager',
            role: 'Manager',
            password: await bcrypt.hash('manager123', salt)
        });
        await manager.save();

        const employee = new User({
            username: 'employee',
            role: 'Employee',
            manager: manager.id,
            password: await bcrypt.hash('employee123', salt)
        });
        await employee.save();

        res.json({ msg: 'Users seeded' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
