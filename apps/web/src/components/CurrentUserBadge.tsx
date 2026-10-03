'use client';

import { useEffect, useState } from 'react';
import { api, type AppUser } from '@/lib/api';
import { getCurrentUser, setCurrentUser, clearCurrentUser } from '@/lib/currentUser';

// Shown in the header on every page. Stands in for real sign-in until
// Phase 1 wires up a real auth provider — see root README "Still to build".
export default function CurrentUserBadge() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (user && !editing) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-600">Organizing as {user.fullName}</span>
        <button className="text-gray-400 underline" onClick={() => setEditing(true)}>
          switch
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex items-center gap-2 text-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        try {
          const created = await api.upsertUser({ fullName, email });
          setCurrentUser(created);
          setUser(created);
          setEditing(false);
        } catch {
          setError('Could not reach the API.');
        }
      }}
    >
      <input
        className="w-32 rounded border px-2 py-1"
        placeholder="Your name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <input
        className="w-40 rounded border px-2 py-1"
        placeholder="you@email.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button className="rounded bg-black px-3 py-1 text-white" type="submit">
        Set organizer
      </button>
      {user && (
        <button
          type="button"
          className="text-gray-400 underline"
          onClick={() => {
            clearCurrentUser();
            setUser(null);
            setEditing(false);
          }}
        >
          cancel
        </button>
      )}
      {error && <span className="text-red-600">{error}</span>}
    </form>
  );
}
