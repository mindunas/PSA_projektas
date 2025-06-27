import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="home-container">
      <h1>Welcome</h1>
      <div className="button-group">
        <button onClick={() => nav('/register')}>Register</button>
        <button onClick={() => nav('/signin')}>Sign In</button>
      </div>
    </div>
  );
}