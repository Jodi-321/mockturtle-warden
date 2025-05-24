/**
 * Minimal landing page for MVP
 */

import React from 'react';
import { Navbar } from '../components/Navbar';

export function Home(): JSX.Element {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Navbar />
          <div className="max-w-3xl mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to Sockpuppet Sentinel</h1>
            <p className="text-lg text-gray-700 mb-4">
              Sockpuppet Sentinel is a secure chat interface built as a foundational MVP
              for AI-enhanced moderation and research in security-sensitive environments.
            </p>
            <p className="text-md text-gray-600">
              Explore protected communication via the <strong>Chat</strong> page or learn
              more about the system via our navigation links above.
            </p>
          </div>
        </div>
      );
    }
    