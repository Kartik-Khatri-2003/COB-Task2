const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 3000;

require("./db/connect");
const Sign = require("./models/registers");
const { log } = require("console");
const { register } = require("module");
const { hasSubscribers } = require("diagnostics_channel");

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

/* console.log(path.join(__dirname,"../public")); */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs")
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

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Sign.findOne({ email: email });

        if (useremail.password === password) {
            res.status(201).render("home");
        } else {
            res.send("wrong pass");
        }

        }
        
        
    catch (error) {
        res.status(400).send("invalid");
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
        const registered = await register_employee.save();
        res.status(201).render("home");
        
    } catch (error) {
        res.status(400).send(error);
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