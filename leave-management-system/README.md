# Role-Based Leave Management System

A MERN stack application for managing employee leaves.

## Features
- **Admin**: Manage Users, Policies, and Approve/Reject any leave.
- **Manager**: Approve/Reject Team leaves, Apply for own leave.
- **Employee**: Apply for leave, View status.

## Prerequisites
- Node.js
- MongoDB (Local or Atlas)

## Setup

1. **Install Dependencies**
   ```bash
   # Server
   cd server
   npm install

   # Client
   cd ../client
   npm install
   ```

2. **Configure Environment**
   - Rename `.env.example` to `.env` (already created).
   - Update `MONGO_URI` if not using local default.

3. **Start MongoDB**
   - Ensure your MongoDB service is running.
   - Default URI: `mongodb://127.0.0.1:27017/leave-management`

4. **Seed Database**
   ```bash
   cd server
   node seed_manual.js
   ```
   Default Credentials:
   - Admin: `admin` / `admin123`
   - Manager: `manager` / `manager123`
   - Employee: `employee` / `employee123`

5. **Run Application**
   ```bash
   # Terminal 1 (Server)
   cd server
   npm start

   # Terminal 2 (Client)
   cd client
   npm run dev
   ```

## Git
The project is initialized with Git. To push to your remote:
```bash
git remote add origin <your-repo-url>
git push -u origin master
```
