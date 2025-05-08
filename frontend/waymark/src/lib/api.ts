// Type definitions
export interface Itinerary {
  id: string;
  title: string;
  start: string;
  end: string;
  destinations: {
    id?: number | string;
    name: string;
    dates: string;  // "YYYY-MM-DD,YYYY-MM-DD"
    lat?: number;
    lng?: number;
    color?: string;
  }[];
  timeline: {
    date: string;
    label: string;
    type: string;
    sub?: string;
  }[];
  days: {
    date: string;
    activities: {
      time: string;
      title: string;
      notes?: string;
    }[];
  }[];
}

// API base URL - no need for /api prefix as your backend routes don't include it
const API_BASE = '';

// Fetch itinerary data
export async function getItinerary(id: string): Promise<Itinerary> {
  try {
    // First try to get from the actual API
    const response = await fetch(`${API_BASE}/trips/${id}`);
    
    if (response.ok) {
      const data = await response.json();
      
      // Transform the backend data to match our frontend structure
      return {
        id: data.id.toString(),
        title: data.title || 'My Trip',
        start: data.start_date || '',
        end: data.end_date || '',
        destinations: await fetchDestinations(id),
        timeline: [],
        days: []
      };
    }
  } catch (error) {
    console.error('Error fetching from API:', error);
  }
  
  // Fallback to localStorage if API fails or during development
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get from localStorage if available
      const stored = localStorage.getItem('waymark_itinerary');
      if (stored) {
        resolve(JSON.parse(stored));
      } else {
        resolve({
          id,
          title: 'New Trip',
          start: '',
          end: '',
          destinations: [],
          timeline: [],
          days: []
        });
      }
    }, 300);
  });
}

// Fetch all destinations for a trip
async function fetchDestinations(tripId: string) {
  try {
    const response = await fetch(`${API_BASE}/trips/${tripId}/destinations`);
    
    if (!response.ok) {
      console.error(`Failed to fetch destinations: ${response.status} ${response.statusText}`);
      return []; // Return empty array on error
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON, received:', contentType);
      // Return empty array when not getting JSON
      return [];
    }
    
    const data = await response.json();
    
    // Transform the data to match our frontend structure
    // Map through destinations and fetch dates for each
    const destinationsWithDates = await Promise.all(
      data.map(async (dest: any) => {
        try {
          // Fetch dates for this destination
          const datesResponse = await fetch(`${API_BASE}/destinations/${dest.id}/dates`);
          
          if (datesResponse.ok) {
            // Check if response is JSON
            const contentType = datesResponse.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              // Default dates if not JSON
              return {
                id: dest.id,
                name: dest.name,
                dates: '2025-01-01,2025-01-07', // Default dates
                lat: parseFloat(dest.lat) || undefined,
                lng: parseFloat(dest.lng) || undefined,
                color: undefined
              };
            }
            
            const datesData = await datesResponse.json();
            // Format dates as "YYYY-MM-DD,YYYY-MM-DD"
            return {
              id: dest.id,
              name: dest.name,
              dates: `${datesData.start_date},${datesData.end_date}`,
              lat: parseFloat(dest.lat) || undefined,
              lng: parseFloat(dest.lng) || undefined,
              color: undefined // Backend doesn't store color, frontend will assign
            };
          }
        } catch (error) {
          console.error(`Error fetching dates for destination ${dest.id}:`, error);
        }
        
        // If dates fetch fails, return destination with default dates
        return {
          id: dest.id,
          name: dest.name,
          dates: '2025-01-01,2025-01-07', // Default dates
          lat: parseFloat(dest.lat) || undefined,
          lng: parseFloat(dest.lng) || undefined,
          color: undefined
        };
      })
    );
    
    return destinationsWithDates;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

// Update entire itinerary
export async function updateItinerary(
  id: string, 
  data: Partial<Itinerary>
): Promise<void> {
  try {
    // Try to update via API
    await fetch(`${API_BASE}/trips/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: data.title,
        description: data.title, // Using title as description too
        start_date: data.start,
        end_date: data.end,
      })
    });
  } catch (error) {
    console.error('Error updating trip:', error);
  }
  
  // Always update localStorage for resilience
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem('waymark_itinerary');
      if (stored) {
        const current = JSON.parse(stored);
        const updated = { ...current, ...data };
        localStorage.setItem('waymark_itinerary', JSON.stringify(updated));
      } else {
        localStorage.setItem('waymark_itinerary', JSON.stringify({ id, ...data }));
      }
      resolve();
    }, 300);
  });
}

// Update a specific section of the itinerary
export async function updateItinerarySection(
  id: string,
  section: string,
  data: any
): Promise<void> {
  // For destinations, we handle them via the individual API endpoints
  if (section === 'destinations') {
    console.log('Destinations are handled via individual API endpoints');
    return Promise.resolve();
  }
  
  // For other sections, update locally
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem('waymark_itinerary');
      if (stored) {
        const current = JSON.parse(stored);
        const updated = { ...current, [section]: data };
        localStorage.setItem('waymark_itinerary', JSON.stringify(updated));
      } else {
        const newItinerary = { id, [section]: data };
        localStorage.setItem('waymark_itinerary', JSON.stringify(newItinerary));
      }
      resolve();
    }, 300);
  });
}