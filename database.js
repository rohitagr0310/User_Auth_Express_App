const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/project");

const con = mongoose.connection;

con.on("connected", () => {
  console.log("Database Connected");
});

con.on("error", () => {
  console.log("ERROR: While Connecting Database");
});

module.exports = con;
