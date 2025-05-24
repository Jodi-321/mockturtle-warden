/**
 * Chat.tsx
 * 
 * Simple interface for sending authenticated messages to the backend `/chat` endpoint
 */

import React, { useState, FormEvent } from 'react';
import { postWithAuth } from '../services/apiClient';
import { ChatRequest, ChatResponse } from '../types/Chat';
import { logout } from '../services/authService';
import { Navbar } from '../components/Navbar';

/**
 * Chat page component for testing authenticated backend requests
 */

export function Chat(): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const [reply, setReply] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * handles chat form submission to the secured /chat endpoint
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setReply(null);

        try {
            const data = await postWithAuth<ChatRequest, ChatResponse>(
                'http://localhost:8000/chat',
                { message }
            );
            setReply(data.reply);
        } catch (err: any) {
            setError(err.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles logout by clearing token and redirecting to login
     */
    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Navbar />
          <div className="max-w-xl mx-auto px-4 py-8 bg-white shadow rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-600">Chat Interface</h2>
              <button
                onClick={handleLogout}
                className="text-sm text-blue-600 hover:underline"
              >
                Log Out
              </button>
            </div>
    
            <form onSubmit={handleSubmit}>
              <label htmlFor="message" className="block font-medium mb-1">
                Your Message
              </label>
              <input
                id="message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                {loading ? 'Sending...' : 'Ask the Sentinel'}
              </button>
            </form>
    
            {/* Display reply as a card */}
            {reply && (
              <div className="mt-6 p-4 border border-emerald-400 bg-emerald-50 rounded-md">
                <strong className="text-emerald-600">Sentinel:</strong> {reply}
              </div>
            )}
    
            {/* Display error message */}
            {error && (
              <div className="mt-6 p-4 border border-rose-400 bg-rose-50 rounded-md text-rose-600">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        </div>
      );
    }