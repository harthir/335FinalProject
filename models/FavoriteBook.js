// models/FavoriteBook.js
const mongoose = require('mongoose');

const FavoriteBookSchema = new mongoose.Schema({
  openLibraryId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Unknown author'
  },
  coverUrl: {
    type: String,
    default: ''
  },
  userNote: {
    type: String,
    default: ''
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FavoriteBook', FavoriteBookSchema);