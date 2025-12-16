const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');
const LeavePolicy = require('../models/LeavePolicy');

router.get('/', auth, async (req, res) => {
    try {
        const policies = await LeavePolicy.find();
        res.json(policies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', auth, checkRole(['Admin']), async (req, res) => {
    const { type, maxDays } = req.body;
    try {
        let policy = new LeavePolicy({ type, maxDays });
        await policy.save();
        res.json(policy);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, checkRole(['Admin']), async (req, res) => {
    try {
        await LeavePolicy.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Policy removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
