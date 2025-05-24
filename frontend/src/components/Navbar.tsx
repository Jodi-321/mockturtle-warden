/**
 * Nav bar used across all pages 
 */

import React from 'react';
import { Link } from 'react-router-dom';

export function Navbar(): JSX.Element {
    return (
      <nav className="bg-white shadow-md px-6 py-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">Sockpuppet Sentinel</div>
          <div className="space-x-4">
            <Link className="text-gray-700 hover:text-blue-600" to="/">Home </Link>
            <Link className="text-gray-700 hover:text-blue-600" to="/chat">Chat </Link>
            <Link className="text-gray-700 hover:text-blue-600" to="/about">About </Link>
            <Link className="text-gray-700 hover:text-blue-600" to="/docs">Docs </Link>
            <Link className="text-gray-700 hover:text-blue-600" to="/status">Status </Link>
            <Link className="text-gray-700 hover:text-blue-600" to="/contact">Contact </Link>
          </div>
        </div>
      </nav>
    );
  }