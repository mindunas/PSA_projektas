// frontend/src/components/Notes.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Notes.css';

export default function Notes() {
  const stored = localStorage.getItem('currentUser');
  const currentUser = stored ? JSON.parse(stored) : null;

  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes');
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createNote = async () => {
    if (!content) return;
    try {
      const res = await axios.post('/api/notes', {
        content,
        user: currentUser.username
      });
      setNotes(prev => [...prev, res.data]);
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const editNote = async (note) => {
    const newContent = prompt('Edit note:', note.content);
    if (newContent == null) return;
    try {
      const res = await axios.put(`/api/notes/${note._id}`, {
        content: newContent
      });
      setNotes(prev =>
        prev.map(n => (n._id === res.data._id ? res.data : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (note) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await axios.delete(`/api/notes/${note._id}`);
      setNotes(prev => prev.filter(n => n._id !== note._id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notes-container">
      <h1>Notes</h1>
      <textarea
        className="notes-input"
        placeholder="Create a note..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button className="notes-button" onClick={createNote}>
        Create Note
      </button>
      <ul className="notes-list">
        {notes.map(note => (
          <li key={note._id} className="note-item">
            <p>{note.content}</p>
            <div className="note-meta">
              <span className="note-user">by {note.user}</span>
              <span className="note-time">
                on {new Date(note.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="note-actions">
              <button
                className="note-edit"
                onClick={() => editNote(note)}
              >
                Edit
              </button>
              <button
                className="note-delete"
                onClick={() => deleteNote(note)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
