const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const db = require("./database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { userCollection } = require("./module/userModule");
const userController = require("./controller/userController");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", userController.create);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await userCollection.findOne({ email });

  if (!user) return res.status(500).send("User Not found");

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ email: user.email, userid: user._id }, "shhhhh");
      console.log(token);
      res.cookie("token", token);
      // res.status(200).redirect("/profile");
      res.redirect("/profile");
    } else res.redirect("/login");
  });
});

app.get("/profile", isLoggedIn, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

function isLoggedIn(req, res, next) {
  if (req.cookies.token == "") res.send("Login first");
  else {
    let data = jwt.verify(req.cookies.token, "shhhhh");
    req.user = data;
    console.log(data);
  }
  next();
}
app.listen(3000);
