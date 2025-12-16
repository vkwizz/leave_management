const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/role');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

router.post('/', auth, async (req, res) => {
    const { type, startDate, endDate, reason } = req.body;
    try {
        const newLeave = new LeaveRequest({
            user: req.user.id,
            type,
            startDate,
            endDate,
            reason
        });
        const leave = await newLeave.save();
        res.json(leave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/my-leaves', auth, async (req, res) => {
    try {
        const leaves = await LeaveRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/pending', auth, checkRole(['Admin', 'Manager']), async (req, res) => {
    try {
        let leaves;
        if (req.user.role === 'Admin') {
            leaves = await LeaveRequest.find({ status: 'Pending' }).populate('user', 'username role');
        } else {
            const subordinates = await User.find({ manager: req.user.id }).select('_id');
            const subordinateIds = subordinates.map(u => u._id);
            leaves = await LeaveRequest.find({
                user: { $in: subordinateIds },
                status: 'Pending'
            }).populate('user', 'username role');
        }
        res.json(leaves);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', auth, checkRole(['Admin', 'Manager']), async (req, res) => {
    const { status } = req.body;
    try {
        let leave = await LeaveRequest.findById(req.params.id).populate('user');
        if (!leave) return res.status(404).json({ msg: 'Leave not found' });

        if (req.user.role === 'Manager' && leave.user.role === 'Manager') {
            return res.status(403).json({ msg: 'Managers cannot approve Manager leaves' });
        }

        leave.status = status;
        await leave.save();
        res.json(leave);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
