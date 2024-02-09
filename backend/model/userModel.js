const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    name: { type: String, required: false },
    avatar: { type: String, required: false, get: (avatar) => {
        if(avatar) {
            return `https://coders-house.vercel.app/${avatar}`
        }
        return avatar
    } },
    activated: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { getters: true } });

module.exports = mongoose.model('User', userSchema, 'users')