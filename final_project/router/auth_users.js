const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return username && users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }

    if (!authenticatedUser(username, password)) {
      return res.status(401).json({message: "Invalid credentials"});
    }

    // Generate JWT token
    const token = jwt.sign({ username: username }, 'access', { expiresIn: '1h' });
    // Store token in session
    req.session.authorization = {
      accessToken: token
    };
    return res.status(200).json({token: token, message: "Login successful"});
    
  } catch(error) {
    return res.status(500).json({message: "Error occurred during login"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const review = req.query.review;
    // const username = req.user.username;
    // Get username from session token
    const token = req.session.authorization.accessToken;
    const decoded = jwt.verify(token, 'access');
    const username = decoded.username;

    if (!review) {
      return res.status(400).json({message: "Review text is required"});
    }

    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }

    // Initialize reviews array if it doesn't exist
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    // Add or update review for this user
    books[isbn].reviews[username] = review;
        
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });

    } catch(error) {
      console.log(error);
      return res.status(500).json({message: "Error occurred while adding review"});
    }
  
  return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const token = req.session.authorization.accessToken;
    const decoded = jwt.verify(token, 'access');
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({message: "Review not found"});
    }

    // Delete the review
    delete books[isbn].reviews[username];
    
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews
    });

  } catch(error) {
    console.log(error);
    return res.status(500).json({message: "Error occurred while deleting review"});
  }

  return res.status(300).json({message: "Yet to be implemented"});  
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
