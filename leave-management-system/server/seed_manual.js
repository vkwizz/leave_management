const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        const salt = await bcrypt.genSalt(10);

        const admin = new User({
            username: 'admin',
            role: 'Admin',
            password: await bcrypt.hash('admin123', salt)
        });
        await admin.save();
        console.log('Admin created');

        const manager = new User({
            username: 'manager',
            role: 'Manager',
            password: await bcrypt.hash('manager123', salt)
        });
        await manager.save();
        console.log('Manager created');

        const employee = new User({
            username: 'employee',
            role: 'Employee',
            manager: manager.id,
            password: await bcrypt.hash('employee123', salt)
        });
        await employee.save();
        console.log('Employee created');

        console.log('Seeding Complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
