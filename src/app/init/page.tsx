'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function InitPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInit = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✓ Database initialized successfully! You can now close this page.');
      } else {
        setError(`Error: ${data.error}`);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Database Setup</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to initialize the Supabase database with the required tables.
        </p>

        <Button
          onClick={handleInit}
          disabled={loading}
          className="w-full mb-4"
          size="lg"
        >
          {loading ? 'Initializing...' : 'Initialize Database'}
        </Button>

        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          This page creates database tables for:
          <ul className="mt-2 space-y-1 text-left">
            <li>• Students</li>
            <li>• School Settings</li>
            <li>• Attendance Sessions & Logs</li>
            <li>• Exam Events</li>
            <li>• Card Templates</li>
          </ul>
        </p>
      </div>
    </div>
  );
}
