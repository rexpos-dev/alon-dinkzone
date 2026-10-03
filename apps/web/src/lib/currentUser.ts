'use client';

// Lightweight stand-in for real auth (see Technical Architecture doc §1/§9 —
// Firebase Auth/Auth0 replaces this once built). Stores the "logged in"
// organizer in this browser's localStorage so forms have a userId to send.

import type { AppUser } from './api';

const KEY = 'pickleball_current_user';

export function getCurrentUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AppUser) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
