const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email: { type: String, unique: true },

    password: String,
});

module.exports = UserSchema;
