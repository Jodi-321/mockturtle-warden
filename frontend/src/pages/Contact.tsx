/**
 * contact placeholder
 */

import React from 'react';
import { Navbar } from '../components/Navbar';

export function Contact(): JSX.Element {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Navbar />
          <div className="max-w-xl mx-auto px-6 py-20 text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Contact Us</h1>
            <p className="text-md text-gray-700 mb-4">
              This project is still under active development. If you'd like to reach out
              for feedback, collaboration, or support, you can contact us at:
            </p>
            <div className="text-md font-semibold text-blue-600">contact@sockpuppetsentinel.dev</div>
            <p className="mt-4 text-sm italic text-gray-500">
              (This is a placeholder. Email handling integration to follow in a future release.)
            </p>
          </div>
        </div>
      );
    }
    