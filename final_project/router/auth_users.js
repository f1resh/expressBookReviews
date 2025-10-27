const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userExists = users.filter((user) => {
        return user.username === username;}
    );
    if (userExists.length > 0) 
        return true;
    else
        return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter ((user) => {
        return (user.username === username && user.password === password);
    });
    if (validUsers.length > 0)
        return true;
    else
        return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password){
    return res.status(400).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60*60});

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send({message: "User successfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
    const isbn = req.params.isbn;
    book = books[isbn];
    if (!book){
        return res.status(400).send({message: "Book with this ISBN doesn't exist!"})
    }

    const review = req.body.review;
    if (!review) {
        return res.status(400).send({message: "Missing review in request"})
    }

    username = req.session.authorization['username'];
    book["reviews"][username] = review;
    return res.status(200).send({message: `Review for the book with ISBN ${isbn} has been updated`});

});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req,res) =>{
    const isbn = req.params.isbn;
    book = books[isbn];
    if (!book){
        return res.status(400).send({message: "Book with this ISBN doesn't exist!"})
    }
    username = req.session.authorization['username'];
    delete book["reviews"][username];
    return res.status(200).send({message: `Review for the book with with ISBN ${isbn} has been deleted`});
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
