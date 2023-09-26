const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 3000;

require("./db/connect");
/* const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected:"+ conn.connection.host );
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  } */
const Sign = require("./models/registers");
const { log } = require("console");
const { register } = require("module");
const { hasSubscribers } = require("diagnostics_channel");
const { Script } = require("vm");

/* const publicPath = path.resolve(__dirname, "public") */
const static_path = path.join(__dirname, "/mern-backend/public/images");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

/* console.log(path.join(__dirname,"../public")); */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set("view engine", "hbs")
app.use(express.static(static_path));
app.set("views", templates_path)
hbs.registerPartials(partials_path)

/* app.get("/", (req, res) => {
    res.send("helooooooooo")
}) */

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

/* app.post("/login", (req, res) => {
    res.render("home");
}); */


app.post("/login", async (req, res) => {
    try {
        const user_name = req.body.user_name;
        const email = req.body.email;
        const password = req.body.password;

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

        if (email === "") {
            // Email is empty
            return res.render("login", { error_email: "email is needed" });
            
        } else if (!emailRegex.test(email)) {
            // Email is not valid
            return res.render("login", { error_email: "enter a valid email adress" });
            
        } 
        
        const useremail = await Sign.findOne({ email: email });

        if (password === "") {
            // Password is empty, render the login page with an error message
            return res.render("login", { errorMessage: "Password cannot be empty" });
        } else if (useremail.password === password) {
            // Password is correct, render the home page
            return res.status(201).render("home" ,{name: useremail.user_name});
        } else {
            // Incorrect password, render the login page with an error message
            return res.render("login", { errorMessage: "Incorrect password" });
        }
        

    }
    catch (error) {
        
        console.error(error);
        return res.render("login", { errorMessage: "Incorrect details" });
    }
});


app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        const register_employee = new Sign({
            user_name: req.body.user_name,
            email: req.body.email,
            password: req.body.password,
        })
        
        const user_name = req.body.user_name;
        const email = req.body.email;
        const password = req.body.password;

        if (user_name === "") {
            // username is empty
            return res.render("register", { error_user: "username is needed" });
            
        }

        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        const existingUser = await Sign.findOne({ email });

        if (email === "") {
            // Email is empty
            return res.render("register", { error_email: "email is needed" });
            
        } else if (!emailRegex.test(email)) {
            // Email is not valid
            return res.render("register", { error_email: "enter a valid email adress" });
            
        } else if (existingUser) {
            return res.render("register", { error_email: "email already exists" })
        }

        if (password === "") {
            // Password is empty, render the login page with an error message
            return res.render("register", { errorMessage: "Password cannot be empty" });
        } else if (password.length < 9) {
            // password is short
            return res.render("register", { errorMessage: "password is short" });
            
        } 

        const registered = await register_employee.save();
        res.status(201).render("home" ,{name: user_name});
        
    } catch (error) {
        
        console.error(error);
        return res.render("register", { errorMessage: "Incorrect details" });
    }
});

app.get("/home", (req, res) => {
    res.render("home");
})

app.get("/forgot", (req, res) => {
    res.render("forgot");
})

/* app.get("/index", (req, res) => {
    res.render("index");
}) */

app.listen(port, () => {
    console.log('server is running on ' + port);
})