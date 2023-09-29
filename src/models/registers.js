// Import the Mongoose library
const mongoose = require("mongoose");

// Define a Mongoose schema for the "employee" collection
const employeeSchema = new mongoose.Schema({
    // Define a field for the user's name, which is a required string
    user_name: {
        type: String,       
        required: true,     
    },

    // Define a field for the user's email, which is a required and unique string
    email: {
        type: String,       // Data type: String
        required: true,     // It's a required field (cannot be empty)
        unique: true,       // It must be unique (no two documents can have the same email)
    },

    // Define a field for the user's password, which is a required string
    password: {
        type: String,       
        required: true,     
    }
})

// Create a Mongoose model based on the schema, named "Sign" and associated with the "haha" collection
const Sign = new mongoose.model("haha", employeeSchema);

// Export the "Sign" model to use it in other parts of your application
module.exports = Sign;
