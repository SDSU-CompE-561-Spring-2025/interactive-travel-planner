// src/lib/api.ts

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

// Configuration options
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_TIMEOUT = 5000; // 5 seconds timeout

// Utility function to handle API errors
const handleApiError = (error: any, fallbackData: any = null, errorMessage: string = 'API Error') => {
  console.error(`${errorMessage}:`, error);
  if (fallbackData !== null) {
    console.warn('Using fallback data instead');
    return fallbackData;
  }
  throw error;
};

// Utility function for API requests with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = API_TIMEOUT) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Mock data for fallback use when API is unavailable
const mockItineraries: Record<string, Itinerary> = {
  'italy-2025': {
    id: 'italy-2025',
    title: 'Italy Adventure 2025',
    start: 'May 15, 2025',
    end: 'May 25, 2025',
    budget: {
      total: 5000,
      spent: 3250,
    },
    destinations: [
      {
        name: 'Rome',
        dates: 'May 15-18, 2025',
        coords: [41.9028, 12.4964],
      },
      {
        name: 'Florence',
        dates: 'May 18-21, 2025',
        coords: [43.7696, 11.2558],
      },
      {
        name: 'Venice',
        dates: 'May 21-25, 2025',
        coords: [45.4408, 12.3155],
      },
    ],
    timeline: [
      {
        type: 'flight',
        label: 'Flight to Rome',
        date: 'May 15, 2025',
        sub: 'Arrival at 10:30 AM',
      },
      {
        type: 'stay',
        label: 'Hotel Roma',
        date: 'May 15-18, 2025',
      },
      {
        type: 'train',
        label: 'Train to Florence',
        date: 'May 18, 2025',
        sub: 'Departure at 9:15 AM',
      },
      {
        type: 'stay',
        label: 'Florence Apartment',
        date: 'May 18-21, 2025',
      },
      {
        type: 'train',
        label: 'Train to Venice',
        date: 'May 21, 2025',
        sub: 'Departure at 11:00 AM',
      },
      {
        type: 'stay',
        label: 'Grand Canal Hotel',
        date: 'May 21-25, 2025',
      },
      {
        type: 'flight',
        label: 'Flight home',
        date: 'May 25, 2025',
        sub: 'Departure at 3:45 PM',
      },
    ],
    days: [
      {
        date: 'May 15, Thursday',
        activities: [
          {
            title: 'Arrive in Rome',
            time: '10:30 AM',
            duration: '1h',
            notes: 'Pickup luggage at carousel 5',
          },
          {
            title: 'Check in at Hotel Roma',
            time: '1:00 PM',
            duration: '30m',
          },
          {
            title: 'Visit Colosseum',
            time: '3:00 PM',
            duration: '2h',
            notes: 'Guided tour booked',
          },
          {
            title: 'Dinner at Trattoria Romano',
            time: '7:00 PM',
            duration: '1.5h',
            notes: 'Reservation confirmed',
          },
        ],
      },
      // Other days...
    ],
    transports: [
      {
        mode: 'flight',
        provider: 'Alitalia',
        from: 'Home Airport',
        to: 'Rome FCO',
        date: 'May 15, 2025 - 07:00 AM',
        code: 'AZ789',
        details: 'Terminal 3, Seat 14A',
      },
      // Other transports...
    ],
  },
  // Other itineraries...
};

// Mock summaries for fallback
const mockSummaries: ItinerarySummary[] = [
  {
    id: 'italy-2025',
    title: 'Italy Adventure 2025',
    createdAt: '2025-01-15T14:30:00Z',
  },
  {
    id: 'japan-2025',
    title: 'Japan Exploration 2025',
    createdAt: '2025-02-20T09:15:00Z',
  },
];

// Function to simulate a network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all itineraries (summary information)
 */
export async function getItineraries(): Promise<ItinerarySummary[]> {
  try {
    return await fetchWithTimeout(`${API_BASE_URL}/itineraries`);
  } catch (error) {
    return handleApiError(error, mockSummaries, 'Failed to load itineraries');
  }
}

/**
 * Get an itinerary by its ID
 */
export async function getItinerary(id: string): Promise<Itinerary> {
  try {
    return await fetchWithTimeout(`${API_BASE_URL}/itineraries/${id}`);
  } catch (error) {
    // Return the requested mock itinerary if it exists
    const fallbackData = mockItineraries[id] || mockItineraries[Object.keys(mockItineraries)[0]];
    return handleApiError(error, fallbackData, `Failed to fetch itinerary ${id}`);
  }
}

/**
 * Update an existing itinerary
 */
export async function updateItinerary(id: string, data: Partial<Itinerary>): Promise<Itinerary> {
  try {
    return await fetchWithTimeout(`${API_BASE_URL}/itineraries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    // For mock response, merge the update with the existing mock data
    if (mockItineraries[id]) {
      const updatedMock = {
        ...mockItineraries[id],
        ...data,
      };
      mockItineraries[id] = updatedMock as Itinerary;
      return handleApiError(error, updatedMock, `Failed to update itinerary ${id}`);
    }
    throw error;
  }
}

/**
 * Create a new itinerary
 */
export async function createItinerary(data: Omit<Itinerary, 'id'>): Promise<Itinerary> {
  try {
    return await fetchWithTimeout(`${API_BASE_URL}/itineraries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    // For mock, create a new ID and add to mock data
    const mockId = `itinerary-${Date.now()}`;
    const newItinerary = {
      id: mockId,
      ...data,
    } as Itinerary;
    
    mockItineraries[mockId] = newItinerary;
    mockSummaries.push({
      id: mockId,
      title: data.title,
      createdAt: new Date().toISOString(),
    });
    
    return handleApiError(error, newItinerary, 'Failed to create itinerary');
  }
}

/**
 * Delete an itinerary
 */
export async function deleteItinerary(id: string): Promise<boolean> {
  try {
    await fetchWithTimeout(`${API_BASE_URL}/itineraries/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    // For mock, remove from mock data
    if (mockItineraries[id]) {
      delete mockItineraries[id];
      const indexToRemove = mockSummaries.findIndex(summary => summary.id === id);
      if (indexToRemove !== -1) {
        mockSummaries.splice(indexToRemove, 1);
      }
      return handleApiError(error, true, `Failed to delete itinerary ${id}`);
    }
    throw error;
  }
}

/**
 * Update a specific section of an itinerary (budget, destinations, timeline, days)
 */
export async function updateItinerarySection(
  id: string, 
  section: 'budget' | 'destinations' | 'timeline' | 'days',
  data: any
): Promise<Itinerary> {
  try {
    return await fetchWithTimeout(`${API_BASE_URL}/itineraries/${id}/${section}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    // For mock response, update just the specific section
    if (mockItineraries[id]) {
      const updatedMock = {
        ...mockItineraries[id],
        [section]: data,
      };
      mockItineraries[id] = updatedMock as Itinerary;
      return handleApiError(error, updatedMock, `Failed to update ${section} for itinerary ${id}`);
    }
    throw error;
  }
}

/**
 * Get the ID of the most recently created itinerary
 */
export async function getMostRecentItineraryId(): Promise<string|null> {
  try {
    const itineraries = await getItineraries();
    if (itineraries.length === 0) return null;
    
    itineraries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return itineraries[0].id;
  } catch (error) {
    return handleApiError(error, null, 'Failed to get most recent itinerary');
  }
}