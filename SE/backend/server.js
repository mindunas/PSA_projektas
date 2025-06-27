require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const User  = require('./models/User');
const Event = require('./models/Event');
const Note  = require('./models/Note');

const app = express();
app.use(cors());
app.use(express.json());

// Connection to mongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err));

// Registration
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();
    res.status(201).json({ msg: 'Registered successfully' });
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });
    res.json({ user: { username: user.username, email: user.email } });
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch all events or by date query
app.get('/api/events', async (req, res) => {
  try {
    const { date } = req.query;
    const filter = date ? { date: new Date(date) } : {};
    const events = await Event.find(filter);
    res.json(events);
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create event in calendar
app.post('/api/events', async (req, res) => {
  try {
    const { date, title, user } = req.body;
    const ev = await new Event({ date: new Date(date), title, user }).save();
    res.status(201).json(ev);
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update event in calendar
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date } = req.body;
    const ev = await Event.findByIdAndUpdate(id,
      { title, date: new Date(date) },
      { new: true }
    );
    if (!ev) return res.status(404).json({ msg: 'Not found' });
    res.json(ev);
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Notes endpoints
// Fetch all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a note
app.post('/api/notes', async (req, res) => {
  try {
    const { content, user } = req.body;
    const note = await new Note({ content, user }).save();
    res.status(201).json(note);
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});
// Update a note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const note = await Note.findByIdAndUpdate(
      id,
      { content, updatedAt: new Date() },
      { new: true }
    );
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    res.json(note);
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    res.json({ msg: 'Deleted successfully', id });
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});
const Client = require('./models/Client');

// Fetch all clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create a client
app.post('/api/clients', async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const client = await new Client({ firstName, lastName, phone }).save();
    res.status(201).json(client);
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a client
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone } = req.body;
    const client = await Client.findByIdAndUpdate(
      id,
      { firstName, lastName, phone, updatedAt: new Date() },
      { new: true }
    );
    if (!client) return res.status(404).json({ msg: 'Not found' });
    res.json(client);
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Deleted', id });
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));