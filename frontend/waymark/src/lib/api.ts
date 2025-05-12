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

// Mock data for development
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
      {
        date: 'May 16, Friday',
        activities: [
          {
            title: 'Vatican Museums',
            time: '9:00 AM',
            duration: '3h',
            notes: 'Skip-the-line tickets purchased',
          },
          {
            title: 'Lunch at Pizzeria Napoli',
            time: '12:30 PM',
            duration: '1h',
          },
          {
            title: 'Spanish Steps & Trevi Fountain',
            time: '2:30 PM',
            duration: '2h',
          },
          {
            title: 'Dinner at La Pergola',
            time: '8:00 PM',
            duration: '2h',
            notes: 'Michelin star restaurant, formal attire required',
          },
        ],
      },
      {
        date: 'May 17, Saturday',
        activities: [
          {
            title: 'Roman Forum',
            time: '10:00 AM',
            duration: '2h',
          },
          {
            title: 'Lunch at Mercato Centrale',
            time: '12:30 PM',
            duration: '1h',
          },
          {
            title: 'Shopping on Via del Corso',
            time: '2:00 PM',
            duration: '3h',
          },
          {
            title: 'Aperitivo at Terrazza Borromini',
            time: '6:00 PM',
            duration: '1h',
            notes: 'Rooftop bar with panoramic views',
          },
          {
            title: 'Dinner at Hostaria dell\'Orso',
            time: '8:00 PM',
            duration: '2h',
          },
        ],
      },
      {
        date: 'May 18, Sunday',
        activities: [
          {
            title: 'Check out from Hotel Roma',
            time: '8:00 AM',
            duration: '30m',
          },
          {
            title: 'Train to Florence',
            time: '9:15 AM',
            duration: '1.5h',
          },
          {
            title: 'Check in at Florence Apartment',
            time: '11:30 AM',
            duration: '30m',
          },
          {
            title: 'Visit Uffizi Gallery',
            time: '2:00 PM',
            duration: '3h',
            notes: 'Tickets purchased online',
          },
          {
            title: 'Dinner at Osteria Santo Spirito',
            time: '7:30 PM',
            duration: '1.5h',
          },
        ],
      },
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
      {
        mode: 'train',
        provider: 'Trenitalia',
        from: 'Rome Termini',
        to: 'Florence SMN',
        date: 'May 18, 2025 - 09:15 AM',
        code: 'FR9421',
        details: 'Coach 4, Seats 15-16',
      },
      {
        mode: 'train',
        provider: 'Trenitalia',
        from: 'Florence SMN',
        to: 'Venice S. Lucia',
        date: 'May 21, 2025 - 11:00 AM',
        code: 'FR9576',
        details: 'Coach 5, Seats 21-22',
      },
      {
        mode: 'flight',
        provider: 'Alitalia',
        from: 'Venice VCE',
        to: 'Home Airport',
        date: 'May 25, 2025 - 3:45 PM',
        code: 'AZ456',
        details: 'Terminal 1, Seat 22C',
      },
    ],
  },
  'japan-2025': {
    id: 'japan-2025',
    title: 'Japan Exploration 2025',
    start: 'June 10, 2025',
    end: 'June 24, 2025',
    budget: {
      total: 8000,
      spent: 3200,
    },
    destinations: [
      {
        name: 'Tokyo',
        dates: 'June 10-15, 2025',
        coords: [35.6762, 139.6503],
      },
      {
        name: 'Kyoto',
        dates: 'June 15-20, 2025',
        coords: [35.0116, 135.7680],
      },
      {
        name: 'Osaka',
        dates: 'June 20-24, 2025',
        coords: [34.6937, 135.5023],
      },
    ],
    timeline: [
      {
        type: 'flight',
        label: 'Flight to Tokyo',
        date: 'June 10, 2025',
        sub: 'Arrival at 2:15 PM',
      },
      {
        type: 'stay',
        label: 'Shinjuku Hotel',
        date: 'June 10-15, 2025',
      },
      {
        type: 'train',
        label: 'Shinkansen to Kyoto',
        date: 'June 15, 2025',
        sub: 'Departure at 10:30 AM',
      },
      {
        type: 'stay',
        label: 'Kyoto Ryokan',
        date: 'June 15-20, 2025',
      },
      {
        type: 'train',
        label: 'Train to Osaka',
        date: 'June 20, 2025',
        sub: 'Departure at 9:45 AM',
      },
      {
        type: 'stay',
        label: 'Osaka Bay Hotel',
        date: 'June 20-24, 2025',
      },
      {
        type: 'flight',
        label: 'Flight home',
        date: 'June 24, 2025',
        sub: 'Departure at 11:20 AM',
      },
    ],
    days: [
      {
        date: 'June 10, Tuesday',
        activities: [
          {
            title: 'Arrive in Tokyo',
            time: '2:15 PM',
            duration: '1h',
            notes: 'Take airport limousine bus to hotel',
          },
          {
            title: 'Check in at Shinjuku Hotel',
            time: '4:00 PM',
            duration: '30m',
          },
          {
            title: 'Explore Shinjuku Area',
            time: '5:30 PM',
            duration: '2h',
          },
          {
            title: 'Dinner at Omoide Yokocho',
            time: '8:00 PM',
            duration: '1.5h',
            notes: 'Try yakitori at the memory lane alleys',
          },
        ],
      },
      {
        date: 'June 11, Wednesday',
        activities: [
          {
            title: 'Tsukiji Outer Market',
            time: '8:00 AM',
            duration: '2h',
            notes: 'Breakfast at the market',
          },
          {
            title: 'Senso-ji Temple',
            time: '11:00 AM',
            duration: '1.5h',
          },
          {
            title: 'Lunch at Asakusa',
            time: '1:00 PM',
            duration: '1h',
          },
          {
            title: 'Tokyo Skytree',
            time: '3:00 PM',
            duration: '2h',
            notes: 'Tickets purchased online',
          },
          {
            title: 'Akihabara Electronic District',
            time: '5:30 PM',
            duration: '2h',
          },
          {
            title: 'Dinner at Robot Restaurant',
            time: '8:00 PM',
            duration: '2h',
            notes: 'Show and dinner reservation confirmed',
          },
        ],
      },
    ],
    transports: [
      {
        mode: 'flight',
        provider: 'Japan Airlines',
        from: 'Home Airport',
        to: 'Tokyo NRT',
        date: 'June 10, 2025 - 10:45 AM',
        code: 'JL019',
        details: 'Terminal 2, Seat 23K',
      },
      {
        mode: 'train',
        provider: 'JR East',
        from: 'Tokyo Station',
        to: 'Kyoto Station',
        date: 'June 15, 2025 - 10:30 AM',
        code: 'NOZOMI 213',
        details: 'Car 8, Seats 3A-3B',
      },
      {
        mode: 'train',
        provider: 'JR West',
        from: 'Kyoto Station',
        to: 'Osaka Station',
        date: 'June 20, 2025 - 9:45 AM',
        code: 'JR Special Rapid',
        details: 'Car 4, Unreserved seating',
      },
      {
        mode: 'flight',
        provider: 'Japan Airlines',
        from: 'Osaka KIX',
        to: 'Home Airport',
        date: 'June 24, 2025 - 11:20 AM',
        code: 'JL023',
        details: 'Terminal 1, Seat 14H',
      },
    ],
  },
};

// Mock summary data
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

// Function to simulate a network delay for more realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all itineraries (summary information)
 *
 * NOTE: This implementation tries the real API first,
 * and falls back to mock data if the API is unavailable
 */
export async function getItineraries(): Promise<ItinerarySummary[]> {
  try {
    // First try the real API
    const res = await fetch('http://localhost:8000/api/itineraries', {
      cache: 'no-store',
      // Add a short timeout to fail quickly if the server is down
      signal: AbortSignal.timeout(1000)
    });

    if (!res.ok) throw new Error('Failed to load itineraries');
    return res.json();
  } catch (error) {
    // If the API call fails, log the error and return mock data
    console.warn('API unavailable, using mock data:', error);
    // Simulate network delay
    await delay(300);
    return [...mockSummaries];
  }
}

/**
 * Get an itinerary by its ID
 *
 * NOTE: This implementation tries the real API first,
 * and falls back to mock data if the API is unavailable
 */
export async function getItinerary(id: string): Promise<Itinerary> {
  try {
    // First try the real API
    const res = await fetch(`http://localhost:8000/api/itineraries/${id}`, {
      // Add a short timeout to fail quickly if the server is down
      signal: AbortSignal.timeout(1000)
    });

    if (!res.ok) throw new Error(`Failed to fetch itinerary ${id}`);
    return res.json();
  } catch (error) {
    // If the API call fails, log the error and return mock data
    console.warn(`API unavailable, using mock data for itinerary ${id}:`, error);
    // Simulate network delay
    await delay(300);

    // Return the requested itinerary if it exists in our mock data
    if (mockItineraries[id]) {
      return mockItineraries[id];
    }

    // If the requested ID doesn't exist, return the first mock itinerary
    const fallbackId = Object.keys(mockItineraries)[0];
    return mockItineraries[fallbackId];
  }
}

/**
 * Get the ID of the most recently created itinerary
 *
 * This implementation works with both real and mock data
 */
export async function getMostRecentItineraryId(): Promise<string|null> {
  const list = await getItineraries();
  if (list.length === 0) return null;

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return list[0].id;
}
