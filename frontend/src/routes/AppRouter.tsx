/**
 * AppRouter.tsx
 * 
 * Defines application routes using React Router v6
 * Protects routes based on authentication state
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

import { Login } from '../pages/Login';
import { Chat } from '../pages/Chat';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Status } from '../pages/Status';
import { Contact } from '../pages/Contact';


/**
 * Central route definitions for the application
 * 
 * Add protected routes and redirects here as needed
 */
export function AppRouter(): JSX.Element {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />}/>
        <Route path="/status" element={<Status />}/>
        <Route path="/contact" element={<Contact />} />
  
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
  
        {/* Catch-all route: redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  