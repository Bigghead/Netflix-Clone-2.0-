const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: String,
    userList : []
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;