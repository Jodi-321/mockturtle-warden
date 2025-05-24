/**
 * ProtectedRoute.tsx
 * 
 * Reusable component that restricts access to routes requiring auhtentication
 * if no valid token is found, the user is redirected to /login
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken, isTokenExpired } from '../services/authService';

/**
 * Props for a protected route wrapper
 */
interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Wrapper to protect authenticated routes
 * Redirects to /login i no token is found
 */
export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element
{
    const token = getAuthToken();
    // Redirect to /login if no token found
    if(!token || isTokenExpired(token)) {
        logout(); // Clear token and redirect
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}