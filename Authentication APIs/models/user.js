
const mongoose = require('mongoose');
const Utils = require('../common/utils');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    isPassWordReset: { type: Boolean, default: false },


}, { timestamps: true });


userSchema.methods.response = function response() {
    const user = this;
    return {
        userId: user._id,
        email: user.email,
        name: user.name
    };
}



const User = mongoose.model('User', userSchema);

module.exports = {
    model: User,
    schema: userSchema
};