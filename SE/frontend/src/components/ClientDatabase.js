import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ClientDatabase.css';

export default function ClientDatabase() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await axios.get('/api/clients');
    setClients(res.data);
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editing) {
      // update
      await axios.put(`/api/clients/${editing._id}`, form);
      setEditing(null);
    } else {
      // create
      await axios.post('/api/clients', form);
    }
    setForm({ firstName: '', lastName: '', phone: '' });
    fetchClients();
  };

  const handleEdit = client => {
    setEditing(client);
    setForm({ firstName: client.firstName, lastName: client.lastName, phone: client.phone });
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this client?')) return;
    await axios.delete(`/api/clients/${id}`);
    fetchClients();
  };

  return (
    <div className="clientdb-container">
      <h1>Client Database</h1>

      <form className="client-form" onSubmit={handleSubmit}>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <button type="submit">
          {editing ? 'Update Client' : 'Add Client'}
        </button>
      </form>

      <ul className="client-list">
        {clients.map(c => (
          <li key={c._id} className="client-item">
            <span>{c.firstName} {c.lastName} — {c.phone}</span>
            <div className="client-actions">
              <button onClick={() => handleEdit(c)}>Edit</button>
              <button onClick={() => handleDelete(c._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
