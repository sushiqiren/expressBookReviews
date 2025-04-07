const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }

    // Check if username already exists
    if (users.find(user => user.username === username)) {
      return res.status(409).json({message: "Username already exists"});
    }

    // Add new user
    users.push({ username, password });
    return res.status(201).json({message: "User registered successfully"});
  } catch(error) {
    return res.status(500).json({message: "Error occurred during registration"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  // try {
  //   res.status(200).send(JSON.stringify(books, null, 2));
  // } catch(error) {
  //   res.status(500).json({message: "Error occurred while fetching books"});
  // }
  try {
    // Simulating an API call to get books (since we're using local data)
    const response = await axios.get('http://localhost:5000/api/books');
    return res.status(200).json(response.data);
  } catch(error) {
    return res.status(500).json({message: "Error occurred while fetching books"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Create an endpoint to serve the books data
public_users.get('/api/books', (req, res) => {
  try {
    return res.status(200).json(books);
  } catch(error) {
    return res.status(500).json({message: "Error occurred while fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  // try {
  //   const isbn = req.params.isbn;
  //   if (books[isbn]) {
  //     res.status(200).send(JSON.stringify(books[isbn], null, 2));
  //   } else {
  //     res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  //   }
  // } catch(error) {
  //   res.status(500).json({message: "Error occurred while fetching the book"});
  // }
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/api/books/${isbn}`);
    return res.status(200).json(response.data);
  } catch(error) {
    return res.status(500).json({message: "Error occurred while fetching the book"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });

// Add endpoint to serve book by ISBN
public_users.get('/api/books/:isbn', (req, res) => {
  try {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    }
  } catch(error) {
    return res.status(500).json({message: "Error occurred while fetching the book"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  // try {
  //   const author = req.params.author;
  //   const booksByAuthor = Object.keys(books)
  //     .filter(isbn => books[isbn].author === author)
  //     .reduce((result, isbn) => {
  //       result[isbn] = books[isbn];
  //       return result;
  //     }, {});

  //   if (Object.keys(booksByAuthor).length > 0) {
  //     res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
  //   } else {
  //     res.status(404).json({message: `No books found for author: ${author}`});
  //   }
  // } catch(error) {
  //   res.status(500).json({message: "Error occurred while fetching books"});
  // }
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/api/books/author/${author}`);
    return res.status(200).json(response.data);
  } catch(error) {
    return res.status(500).json({message: "Error occurred while fetching books"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add endpoint to serve books by author
public_users.get('/api/books/author/:author', (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = Object.keys(books)
      .filter(isbn => books[isbn].author === author)
      .reduce((result, isbn) => {
        result[isbn] = books[isbn];
        return result;
      }, {});

    if (Object.keys(booksByAuthor).length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({message: `No books found for author: ${author}`});
    }
  } catch(error) {
    return res.status(500).json({message: "Error occurred while fetching books"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  // try {
  //   const title = req.params.title;
  //   const booksByTitle = Object.keys(books)
  //     .filter(isbn => books[isbn].title === title)
  //     .reduce((result, isbn) => {
  //       result[isbn] = books[isbn];
  //       return result;
  //     }, {});

  //   if (Object.keys(booksByTitle).length > 0) {
  //     res.status(200).send(JSON.stringify(booksByTitle, null, 2));
  //   } else {
  //     res.status(404).json({message: `No books found with title: ${title}`});
  //   }
  // } catch(error) {
  //   res.status(500).json({message: "Error occurred while fetching books"});
  // }
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/api/books/title/${title}`);
    return res.status(200).json(response.data);
  } catch(error) {
    return res.status(500).json({message: "Error occurred while fetching books"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add endpoint to serve books by title
public_users.get('/api/books/title/:title', (req, res) => {
  try {
    const title = req.params.title;
    const booksByTitle = Object.keys(books)
      .filter(isbn => books[isbn].title === title)
      .reduce((result, isbn) => {
        result[isbn] = books[isbn];
        return result;
      }, {});

    if (Object.keys(booksByTitle).length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({message: `No books found with title: ${title}`});
    }
  } catch(error) {
    return res.status(500).json({message: "Error occurred while fetching books"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
      res.status(200).send(JSON.stringify(books[isbn].reviews, null, 2));
    } else if (books[isbn]) {
      res.status(404).json({message: `No reviews found for ISBN ${isbn}`});
    } else {
      res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    }
  } catch(error) {
    res.status(500).json({message: "Error occurred while fetching the reviews"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
