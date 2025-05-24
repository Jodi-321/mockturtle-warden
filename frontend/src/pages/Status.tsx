/**
 * status check page that pings the backend /health endpoint
 */

import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';

export function Status(): JSX.Element {
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/health')
        .then((res) => {
            if (!res.ok) throw new Error('Health check failed');
            return res.json();
        })
        .then((data) => setStatus(data.status))
        .catch((err) => setError(err.message));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Navbar />
          <div className="max-w-xl mx-auto px-6 py-20 text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">System Status</h1>
    
            {status && (
              <div className="p-4 bg-emerald-50 border border-emerald-400 text-emerald-700 rounded-md">
                <strong>Status:</strong> {status}
              </div>
            )}
    
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-400 text-rose-600 rounded-md">
                <strong>Error:</strong> {error}
              </div>
            )}
    
            {!status && !error && (
              <p className="text-gray-500">Checking system health...</p>
            )}
          </div>
        </div>
      );
    }