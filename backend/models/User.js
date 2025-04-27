const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profilePic: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'professor'], required: true },
    courses: [{ type: String }] // Only for professors
});

module.exports = mongoose.model('User', UserSchema);
