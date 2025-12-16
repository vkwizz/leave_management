const mongoose = require('mongoose');

const LeavePolicySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true
    },
    maxDays: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('LeavePolicy', LeavePolicySchema);
