const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/haha").then(() => {
    console.log("succesful connection");
}).catch((e) => {
    console.error("Connection failed:", e);
})