const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  date:      { type: Date,   required: true },  // stored as ISO Date
  title:     { type: String, required: true },
  user:      { type: String, required: true }
}, { timestamps: true });     // adds createdAt and updatedAt

module.exports = mongoose.model('Event', EventSchema);