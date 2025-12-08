// routes/books.js
const express = require('express');
const axios = require('axios');
const FavoriteBook = require('../models/FavoriteBook');

const router = express.Router();

// Home page with a search form
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Book Explorer',
    query: '',
    results: []
  });
});

// Search route using OpenLibrary API
router.get('/search', async (req, res) => {
  const query = req.query.q || '';

  if (!query) {
    return res.render('searchResults', {
      title: 'Search Results',
      query: '',
      results: [],
      error: 'Please enter a search term.'
    });
  }

  try {
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        q: query,
        limit: 20
      }
    });

    const docs = response.data.docs || [];

    // Map to a simpler structure for the template
    const results = docs.map((doc) => {
      const openLibraryId = doc.key || '';
      const title = doc.title || 'No title';
      const author =
        (doc.author_name && doc.author_name.length > 0
          ? doc.author_name[0]
          : 'Unknown author');

      // OpenLibrary cover image URL (may be missing)
      let coverUrl = '';
      if (doc.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
      }

      return { openLibraryId, title, author, coverUrl };
    });

    res.render('searchResults', {
      title: 'Search Results',
      query,
      results,
      error: null
    });
  } catch (err) {
    console.error('Error fetching from OpenLibrary:', err.message);
    res.render('searchResults', {
      title: 'Search Results',
      query,
      results: [],
      error: 'There was a problem fetching data from the book API.'
    });
  }
});

module.exports = router;