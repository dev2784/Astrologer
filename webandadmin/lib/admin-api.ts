'use client';

export async function adminFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = localStorage.getItem('token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0; SameSite=Strict';
    window.location.assign('/admin');
    throw new Error('Session expired. Please log in again.');
  }
  return response;
}

export async function adminJsonFetcher(url: string) {
  const response = await adminFetch(url);
  if (!response.ok) throw new Error('Unable to load admin data.');
  return response.json();
}
