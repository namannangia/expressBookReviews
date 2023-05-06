const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        username: username,
        pass: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log(req.query.review);
  let username = req.user.username;
  let review = req.query.review;
  books[req.params.isbn].reviews[username] = review;
  return res.send(
    "The review for the book with isbn " +
      req.params.isbn +
      " has been added/updated."
  );
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  console.log(req.query.review);
  let username = req.user.username;
  let review = req.query.review;
  delete books[req.params.isbn].reviews[username];
  return res.send(
    "Reviews for the isbn " +
      req.params.isbn +
      " posted by the user " +
      username +
      " deleted."
  );
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
