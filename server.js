// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// Routers
const booksRouter = require('./routes/books');
const favoritesRouter = require('./routes/favorites');

const app = express();

// ----- MongoDB connection -----
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/book_explorer';
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// ----- Express configuration -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // for form data

// ----- Routes -----
app.use('/', booksRouter);          // home + search
app.use('/favorites', favoritesRouter); // favorites CRUD

// Fallback error handler for unmatched routes
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you requested does not exist.'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});