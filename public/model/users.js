const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    description: String
});


UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); 

    const salt = await bcrypt.genSalt(10);  
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
