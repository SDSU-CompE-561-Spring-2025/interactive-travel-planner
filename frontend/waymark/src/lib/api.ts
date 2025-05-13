// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true,
});

/** Summary info (for listing) */
export interface ItinerarySummary {
  id:        string
  title:     string
  createdAt: string
  // …any other summary fields…
}

/** Full itinerary payload */
export interface Itinerary {
  id:           string
  title:        string
  start:        string
  end:          string
  budget:       { total: number; spent: number }
  destinations: { name: string; dates: string; coords: [number,number] }[]
  timeline:     { type: 'stay'|'flight'|'train'; label: string; date: string; sub?: string }[]
  days:         { date: string; activities: { title: string; time: string; duration: string; notes?: string }[] }[]
  transports:   { mode: string; provider: string; from: string; to: string; date: string; code: string; details: string }[]
}

// Authentication
export async function login(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function signup(email: string, password: string, name: string) {
  try {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    throw error;
  }
}

// Itineraries
export async function getItineraries(): Promise<ItinerarySummary[]> {
  try {
    const response = await api.get<ItinerarySummary[]>('/itineraries');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getItinerary(id: string): Promise<Itinerary> {
  try {
    const response = await api.get<Itinerary>(`/itineraries/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createItinerary(data: Partial<Itinerary>) {
  try {
    const response = await api.post<Itinerary>('/itineraries', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateItinerary(id: string, data: Partial<Itinerary>) {
  try {
    const response = await api.put<Itinerary>(`/itineraries/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteItinerary(id: string) {
  try {
    await api.delete(`/itineraries/${id}`);
  } catch (error) {
    throw error;
  }
}

export async function getMostRecentItineraryId(): Promise<string | null> {
  try {
    const itineraries = await getItineraries();
    if (itineraries.length === 0) return null;
    return itineraries[0].id;
  } catch (error) {
    console.error('Error getting most recent itinerary:', error);
    return null;
  }
}

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
