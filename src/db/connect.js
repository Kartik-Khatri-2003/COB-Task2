// Import the Mongoose library
const mongoose = require("mongoose");

/* mongoose.connect("mongodb://127.0.0.1:27017/haha").then(() => {
    console.log("succesful connection");
}).catch((e) => {
    console.error("Connection failed:", e);
}) */

mongoose.connect(process.env.MONGO_URI).then(() => {              //Database Connection Link
    console.log("MongoDB Connected");
}).catch((error) => {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
}); 