const userModule = require("../module/userModule");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  create: (req, res) => {
    const userData = req.body;
    const { username } = userData;
    userModule.userCollection.find({ username: username }).then((data) => {
      if (data.length >= 1) {
        return res.send({ status: "User already Present" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(userData.password, salt, (err, hash) => {
            userData.password = hash;
            userModule.create(userData);

            let token = jwt.sign(
              { username: username, userid: data._id },
              "shhhhh"
            );
            console.log(token);
            res.cookie("token", token);
            return res.redirect("/");
          });
        });
      }
    });
  },

  login: (req, res) => {
    const { username, password } = req.body;

    userModule.userCollection
      .findOne({ username: username })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ status: "User not found" });
        }

        // User found, compare passwords
        bcrypt.compare(password, user.password, (err, result) => {
          if (err || !result) {
            return res.status(401).send({ status: "Authentication failed" });
          }

          // Passwords match, create JWT token
          let token = jwt.sign(
            { username: username, userid: user._id },
            "shhhhh"
          );

          // Set token as a cookie
          res.cookie("token", token);

          // Redirect or send success response as per your application logic
          return res.redirect("/");
        });
      })
      .catch((err) => {
        console.error("Login error:", err);
        return res.status(500).send({ status: "Internal server error" });
      });
  },
};
