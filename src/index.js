// Import necessary modules
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 3000;

// Import the database connection setup
require("./db/connect");

// Import the Mongoose model for "registers"
const Sign = require("./models/registers");

// Set up the view engine and configure static and template paths
const static_path = path.join(__dirname, "/mern-backend/public/images");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.use(express.static(static_path));
app.set("views", templates_path);
hbs.registerPartials(partials_path);

// Route for the home page (registration form)
app.get("/", (req, res) => {
    res.render("register");
});

// Route for the login page
app.get("/login", (req, res) => {
    res.render("login");
});

// Route for handling login form submission
app.post("/login", async (req, res) => {
    try {
        // Extract data from the request
        const user_name = req.body.user_name;
        const email = req.body.email;
        const password = req.body.password;

        // Define a regular expression to validate email
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

        // Check if the email is empty or not valid
        if (email === "") {
            return res.render("login", { error_email: "Email is required" });
        } else if (!emailRegex.test(email)) {
            return res.render("login", { error_email: "Enter a valid email address" });
        }

        // Find a user with the provided email
        const useremail = await Sign.findOne({ email: email });

        // Check if the password is empty or incorrect
        if (password === "") {
            return res.render("login", { errorMessage: "Password is required" });
        } else if (useremail.password === password) {
            return res.status(201).render("home", { name: useremail.user_name });
        } else {
            return res.render("login", { errorMessage: "Incorrect password" });
        }
    } catch (error) {
        console.error(error);
        return res.render("login", { errorMessage: "Incorrect details" });
    }
});

// Route for the registration page
app.get("/register", (req, res) => {
    res.render("register");
});

// Route for handling registration form submission
app.post("/register", async (req, res) => {
    try {
        // Create a new employee using the Sign model
        const register_employee = new Sign({
            user_name: req.body.user_name,
            email: req.body.email,
            password: req.body.password,
        });

        // Extract data from the request
        const user_name = req.body.user_name;
        const email = req.body.email;
        const password = req.body.password;

        // Validate user inputs
        if (user_name === "") {
            return res.render("register", { error_user: "Username is required" });
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        const existingUser = await Sign.findOne({ email });

        if (email === "") {
            return res.render("register", { error_email: "Email is required" });
        } else if (!emailRegex.test(email)) {
            return res.render("register", { error_email: "Enter a valid email address" });
        } else if (existingUser) {
            return res.render("register", { error_email: "Email already exists" });
        }

        if (password === "") {
            return res.render("register", { errorMessage: "Password is required" });
        } else if (password.length < 5) {
            return res.render("register", { errorMessage: "Password is too short" });
        }

        // Save the new employee to the database
        const registered = await register_employee.save();
        res.status(201).render("home", { name: user_name });
    } catch (error) {
        console.error(error);
        return res.render("register", { errorMessage: "Incorrect details" });
    }
});

// Route for the home page
app.get("/home", (req, res) => {
    res.render("home");
});

// Route for the forgot password page
app.get("/forgot", (req, res) => {
    res.render("forgot");
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log('server is running on ' + port);
});
