const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let books_found = new Promise ((resolve,reject) => {
        if (books) {
            resolve(JSON.stringify(books));
        } else {
            reject("There are no books in the db");
        }
    })

    books_found
    .then((message) => {
        res.send(message);
    })
    .catch((error) => {
        res.status(404).send(error);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let books_found = new Promise ((resolve,reject) => {
        if (books[isbn]) {
            resolve(JSON.stringify(books[isbn]));
        } else {
            reject(`There is no book with the ISBN ${isbn}`);
        }
    })

    books_found
    .then((message) => {
        res.send(message);
    })
    .catch((error) => {
        res.status(404).send(error);
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let books_found = new Promise ((resolve,reject) => {
        let filtered_books = Object.values(books).filter(book => book.author === author);
        if (filtered_books.length > 0) {
            resolve(JSON.stringify(filtered_books));
        } else {
            reject(`There are no books with the author "${author}"`);
        }
    })

    books_found
    .then((message) => {
        res.send(message);
    })
    .catch((error) => {
        res.status(404).send(error);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let books_found = new Promise ((resolve,reject) => {
        let filtered_books = Object.values(books).filter(book => book.title === title);
        if (filtered_books.length > 0) {
            resolve(JSON.stringify(filtered_books));
        } else {
            reject(`There are no books with the title "${title}"`);
        }
    })

    books_found
    .then((message) => {
        res.send(message);
    })
    .catch((error) => {
        res.status(404).send(error);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.send(JSON.stringify(book.reviews));
  } else {
    return res.status(404).json("Book with this ISBN doesn't exist");
  }
    
});

module.exports.general = public_users;
