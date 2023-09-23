const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    }
})

const Sign = new mongoose.model("haha", employeeSchema);

module.exports = Sign;