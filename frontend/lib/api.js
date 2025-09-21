// lib/api.js
// Centralized API utility for all backend calls

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

// Helper to handle fetch and errors
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  const opts = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };
  try {
    const res = await fetch(url, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
  } catch (err) {
    throw err;
  }
}

// --- Auth APIs ---
export async function loginUser(credentials) {
  return apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(userData) {
  return apiFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// --- Recycle APIs ---
export async function getProductRequests(token) {
  return apiFetch('/recycle/requests', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function buyProductRequest(productId, token) {
  return apiFetch(`/recycle/buy/${productId}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function rejectProductRequest(productId, token) {
  return apiFetch(`/recycle/reject/${productId}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// Add more API functions as needed
