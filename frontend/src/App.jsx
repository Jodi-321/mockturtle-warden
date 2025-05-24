/**
 * App.jsx
 * 
 * Root component for the AI Security Chat frontend.
 * Wraps the app in a browser router and renders the app routes
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
