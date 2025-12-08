// routes/favorites.js
const express = require('express');
const FavoriteBook = require('../models/FavoriteBook');

const router = express.Router();

// List all favorite books
router.get('/', async (req, res) => {
  try {
    const favorites = await FavoriteBook.find().sort({ dateAdded: -1 });
    res.render('favorites', {
      title: 'My Favorite Books',
      favorites
    });
  } catch (err) {
    console.error('Error fetching favorites:', err.message);
    res.status(500).render('error', {
      title: 'Database Error',
      message: 'There was a problem retrieving favorite books.'
    });
  }
});

// Add a new favorite book (from a form)
router.post('/add', async (req, res) => {
  const { openLibraryId, title, author, coverUrl, userNote } = req.body;

  if (!openLibraryId || !title) {
    return res.status(400).render('error', {
      title: 'Invalid Data',
      message: 'Missing required book information.'
    });
  }

  try {
    // Upsert so we don’t duplicate the same book
    await FavoriteBook.findOneAndUpdate(
      { openLibraryId },
      { title, author, coverUrl, userNote },
      { upsert: true, new: true, runValidators: true }
    );

    res.redirect('/favorites');
  } catch (err) {
    console.error('Error saving favorite:', err.message);
    res.status(500).render('error', {
      title: 'Database Error',
      message: 'There was a problem saving this book as favorite.'
    });
  }
});

// Delete a favorite book
router.post('/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {
    await FavoriteBook.findByIdAndDelete(id);
    res.redirect('/favorites');
  } catch (err) {
    console.error('Error deleting favorite:', err.message);
    res.status(500).render('error', {
      title: 'Database Error',
      message: 'There was a problem deleting this favorite book.'
    });
  }
});

module.exports = router;