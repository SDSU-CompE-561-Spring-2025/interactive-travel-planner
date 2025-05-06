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
  
  export async function getItineraries(): Promise<ItinerarySummary[]> {
    const res = await fetch('http://localhost:8000/api/itineraries', { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to load itineraries')
    return res.json()
  }
  
  export async function getItinerary(id: string): Promise<Itinerary> {
    const res = await fetch(`http://localhost:8000/api/itineraries/${id}`)
    if (!res.ok) throw new Error(`Failed to fetch itinerary ${id}`)
    return res.json()
  }
  
  export async function getMostRecentItineraryId(): Promise<string|null> {
    const list = await getItineraries()
    if (list.length === 0) return null
    list.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return list[0].id
  }
  