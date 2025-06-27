const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user:    { type: String, required: true }
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model('Note', NoteSchema);
