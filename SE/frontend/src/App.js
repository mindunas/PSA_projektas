import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import SignIn from './components/SignIn';
import DashboardLayout from './components/DashboardLayout';
import CalendarView from './components/Calendar';
import OrderSection from './components/OrderSection';
import ClientDatabase from './components/ClientDatabase';
import Settings from './components/Settings';
import Notes from './components/Notes';
import Tools from './components/Tools';
import Warranties from './components/Warranties';
import Documentation from './components/Documentation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="calendar" />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="ordersection" element={<OrderSection />} />
          <Route path="clientdatabase" element={<ClientDatabase />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notes" element={<Notes />} />
          <Route path="tools" element={<Tools />} />
          <Route path="warranties" element={<Warranties />} />
          <Route path="documentation" element={<Documentation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;