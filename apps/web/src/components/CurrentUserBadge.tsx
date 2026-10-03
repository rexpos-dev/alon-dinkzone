'use client';

import { useEffect, useState } from 'react';
import { api, type AppUser } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
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
        <span className="text-muted">
          Organizing as <span className="font-semibold text-ink">{user.fullName}</span>
        </span>
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Switch
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-wrap items-center gap-2 text-sm"
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
      <Input
        className="w-36"
        placeholder="Your name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <Input
        className="w-44"
        placeholder="you@email.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button size="sm" type="submit">
        Set organizer
      </Button>
      {user && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            clearCurrentUser();
            setUser(null);
            setEditing(false);
          }}
        >
          Cancel
        </Button>
      )}
      {error && <span className="text-danger">{error}</span>}
    </form>
  );
}
