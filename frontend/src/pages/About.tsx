/**
 * Explains the purpose, goals, and design for MVP
 */

import React from 'react';
import { Navbar } from '../components/Navbar';

 export function About(): JSX.Element {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Navbar />
          <div className="max-w-3xl mx-auto px-6 py-20">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">About Sockpuppet Sentinel</h1>
            <p className="mb-4 text-lg">
              Sockpuppet Sentinel is a secure-by-default chat MVP developed to support AI-assisted moderation and privacy-conscious communication.
            </p>
            <p className="mb-4 text-md text-gray-700">
              This project emphasizes foundational security principles like JWT authentication, input sanitization, and IP-based access control. Designed as a weekend proof-of-concept, it lays the groundwork for future integrations with large language models and moderation frameworks.
            </p>
            <p className="text-sm italic text-gray-500">
              Built with React, FastAPI, Docker, and deployed via AWS — this MVP keeps things clean, modern, and secure.
            </p>
          </div>
        </div>
      );
    }