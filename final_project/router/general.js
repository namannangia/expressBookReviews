const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  if (req.body.username) {
    users.push({ username: req.body.username, password: req.body.password });
    return res.json({
      message: "Customer successfully registered. Now you can login",
    });
  }
  return res.send("Some error occured while Registering User");
});

public_users.get("/", function (req, res) {
  res.send(books);
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[Number(isbn)]) {
    return res.json(books[Number(isbn)]);
  } else {
    return res.status(404).send(`No books found by author: ${isbn}`);
  }
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(
    (book) => book.author === author
  );

  if (matchingBooks.length > 0) {
    return res.json({ booksbyauthor: matchingBooks });
  } else {
    return res.status(404).send(`No books found by author: ${author}`);
  }
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(
    (book) => book.title === title
  );

  if (matchingBooks.length > 0) {
    return res.json({ booksbytitle: matchingBooks });
  } else {
    return res.status(404).send(`No books found by title: ${author}`);
  }
});

public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (books[Number(isbn)]) {
    return res.json(books[Number(isbn)].reviews);
  } else {
    return res.status(404).send(`No books found by author: ${isbn}`);
  }
});

module.exports.general = public_users;
