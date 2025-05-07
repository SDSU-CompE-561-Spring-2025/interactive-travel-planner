// Type definitions
export interface Itinerary {
  id: string;
  title: string;
  start: string;
  end: string;
  destinations: {
    name: string;
    dates: string;
    lat?: number;
    lng?: number;
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

// Mock implementation - replace with real API calls
export async function getItinerary(id: string): Promise<Itinerary> {
  // Simulating API call
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

export async function updateItinerary(
  id: string, 
  data: Partial<Itinerary>
): Promise<void> {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you would update the server here
      // For now, we'll just update localStorage
      const stored = localStorage.getItem('waymark_itinerary');
      if (stored) {
        const current = JSON.parse(stored);
        const updated = { ...current, ...data };
        localStorage.setItem('waymark_itinerary', JSON.stringify(updated));
      }
      resolve();
    }, 300);
  });
}

export async function updateItinerarySection(
  id: string,
  section: string,
  data: any
): Promise<void> {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you would update the server here
      // For now, we'll just update localStorage
      const stored = localStorage.getItem('waymark_itinerary');
      if (stored) {
        const current = JSON.parse(stored);
        const updated = { ...current, [section]: data };
        localStorage.setItem('waymark_itinerary', JSON.stringify(updated));
      }
      resolve();
    }, 300);
  });
}