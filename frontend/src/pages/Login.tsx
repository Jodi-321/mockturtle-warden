/**
 * Login page for authenticating users against the FastAPI backend
 * 
 * Authenicates users against the FastAPI backend
 * Automatically redirects to /chat upon succesful login
 * 
 */

import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeAuthToken } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import { AuthToken } from '../types/AuthToken';
import { Navbar } from '../components/Navbar';

/**
 * Component for the login page
 * 
 * Submits credentials, stores JWT token, and displays decoded info
 * 
 */
export function Login(): JSX.Element {
    const navigate = useNavigate();

// State for form inputs
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // UI state
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [tokenInfo, setTokenInfo] = useState<AuthToken | null>(null);  


    /**
     * Submits the login form and stores the token securely
     * Also decodes the token to display the logged-in user info
     * 
     */
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/token',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username,
                    password,
                }),
            });

            if (!response.ok){
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            storeAuthToken(data.access_token, data.token_type);

            // Decode the JWT to extract user info - Optional debug to be removed
            try {
                const decoded: AuthToken = jwtDecode(data.access_token);
                console.log('User logged in:', decoded);
            } catch (decodeError) {
                console.warn('Token stored, but decoding failed:', decodeError);
            }

            // Redirect to /chat
            navigate('/chat');
        } catch (err) {
            setError('Login failed. Please check your username and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Navbar />
          <div className="max-w-md mx-auto mt-20 px-6 py-8 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">Login to Sentinel</h2>
    
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-1 font-medium">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
    
              <div className="mb-4">
                <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
    
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
    
            {error && (
              <div className="mt-6 p-4 border border-rose-400 bg-rose-50 rounded-md text-rose-600">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>
      );
    }