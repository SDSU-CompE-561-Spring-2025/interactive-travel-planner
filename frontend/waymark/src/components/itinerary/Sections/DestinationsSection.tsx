import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import DestinationsMap from '../../itinerary/DestinationsMap'
import { Itinerary, updateItinerarySection } from '../../../lib/api'

// Extend the API‐returned type with a local-only `color` field
interface Destination {
  name: string
  dates: string            // "YYYY-MM-DD,YYYY-MM-DD"
  lat?: number
  lng?: number
  color?: string
}

interface DestinationsSectionProps {
  itinerary: Partial<Itinerary>
  setItinerary: React.Dispatch<React.SetStateAction<Partial<Itinerary>>>
  syncDaysWithDestinations: (
    destinations: { dates: string }[],
    currentDays?: { date: string; activities: any[] }[]
  ) => { date: string; activities: any[] }[]
  showNotification: (type: 'success' | 'error', message: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  handleRemoveDestination: (index: number) => void
}

// The provided 11-color pastel palette
const pastelColors = [
  '#66C5CC', '#F6C571', '#F89C74', '#DCB0F2',
  '#87C55F', '#9EB9F3', '#FEBB81', '#C9D874',
  '#8DE0A4', '#B497E7', '#B3B3B3',
]

// Action button colors
const actionBlue = '#66C5CC'
const actionRed  = '#F89C74'

const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  itinerary,
  setItinerary,
  syncDaysWithDestinations,
  showNotification,
  loading,
  setLoading,
  handleRemoveDestination,
}) => {
  // Form state
  const [formOpen, setFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([])
  const [selected, setSelected] = useState<{ name: string; lat: number; lng: number } | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>(pastelColors[0])

  // Reset color when opening blank
  useEffect(() => {
    if (formOpen && editIndex === null) {
      setSelectedColor(pastelColors[0])
    }
  }, [formOpen, editIndex])

  // Parse "YYYY-MM-DD" as local midnight
  const parseLocalDate = (d: string) => {
    const [y, m, day] = d.split('-').map(Number)
    return new Date(y, m - 1, day)
  }

  // Format "June 25, 2023 → July 6, 2023"
  const formatDateRange = (dates: string) => {
    const [sStr, eStr] = dates.split(',').map(s => s.trim())
    const s = parseLocalDate(sStr), e = parseLocalDate(eStr)
    const opts = { year: 'numeric', month: 'long', day: 'numeric' } as const
    return `${s.toLocaleDateString('en-US', opts)} → ${e.toLocaleDateString('en-US', opts)}`
  }

  // Search Nominatim
  const handleSearch = async () => {
    if (!searchQuery) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=en&q=${encodeURIComponent(searchQuery)}`
      )
      const data = await res.json()
      setSearchResults(
        data.map((i: any) => ({
          name: i.display_name,
          lat: parseFloat(i.lat),
          lng: parseFloat(i.lon),
        }))
      )
    } catch {
      // ignore
    }
    setLoading(false)
  }

  // Add / update destination
  const handleSave = () => {
    if (!selected || !startDate || !endDate) return
    const newDest: Destination = {
      name: selected.name.split(',')[0],
      dates: `${startDate},${endDate}`,
      lat: selected.lat,
      lng: selected.lng,
      color: selectedColor,
    }
    const existing = (itinerary.destinations || []) as Destination[]
    const updated = editIndex != null
      ? [
          ...existing.slice(0, editIndex),
          newDest,
          ...existing.slice(editIndex + 1),
        ]
      : [...existing, newDest]

    // Update local state & days
    setItinerary(prev => ({
      ...prev,
      destinations: updated,
      days: syncDaysWithDestinations(updated, prev.days),
    }))

    // Persist to server (strip out color)
    if (itinerary.id && itinerary.id !== 'new-trip') {
      setLoading(true)
      const serverList = updated.map(({ name, dates, lat, lng }) => ({ name, dates, lat, lng }))
      updateItinerarySection(itinerary.id, 'destinations', serverList)
        .then(() => showNotification('success', 'Saved!'))
        .catch(() => showNotification('error', 'Save failed.'))
        .finally(() => setLoading(false))
    } else {
      showNotification('success', 'Saved!')
    }

    // Reset form
    setFormOpen(false)
    setSearchQuery('')
    setSearchResults([])
    setSelected(null)
    setStartDate('')
    setEndDate('')
    setEditIndex(null)
  }

  // Open blank form
  const openAdd = () => {
    setEditIndex(null)
    setSelected(null)
    setStartDate('')
    setEndDate('')
    setSearchQuery('')
    setFormOpen(true)
  }

  // Open for editing
  const openEdit = (i: number) => {
    const d = (itinerary.destinations || []) as Destination[]
    const dest = d[i]
    setEditIndex(i)
    setSelected({ name: dest.name, lat: dest.lat!, lng: dest.lng! })
    const [s, e] = dest.dates.split(',').map(x => x.trim())
    setStartDate(s)
    setEndDate(e)
    setSearchQuery(dest.name)
    setSelectedColor(dest.color ?? pastelColors[i % pastelColors.length])
    setFormOpen(true)
  }

  const dests = (itinerary.destinations || []) as Destination[]

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Destinations</h2>
        <button
          onClick={openAdd}
          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
          aria-label="Add Destination"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {/* Map */}
      <div className="h-[40rem] border rounded-lg overflow-hidden mb-6">
        <DestinationsMap
          destinations={dests}
          editable={false}
          onSave={() => Promise.resolve()}
        />
      </div>

      {/* Slide-down Form */}
      <div className={`transition-all duration-300 ease-out overflow-hidden ${
        formOpen ? 'max-h-[700px] opacity-100 mb-6' : 'max-h-0 opacity-0'
      }`}>
        <div
          className="border border-gray-200 rounded-lg overflow-hidden shadow-lg"
          style={{ borderLeft: `4px solid ${selectedColor}` }}
        >
          <div className="bg-white p-6">
            <h3 className="text-lg font-normal mb-4 text-gray-800">
              {editIndex != null ? 'Edit Destination' : 'Add Destination'}
            </h3>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search location…"
                className="w-full border p-2 rounded font-normal"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
              {searchResults.length > 0 && (
                <ul className="border rounded max-h-40 overflow-y-auto mt-2">
                  {searchResults.map((r, i) => (
                    <li
                      key={i}
                      className="p-2 hover:bg-gray-100 cursor-pointer font-normal"
                      onClick={() => {
                        setSelected(r)
                        setSearchQuery(r.name)
                        setSearchResults([])
                      }}
                    >
                      {r.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Color Picker */}
            <div className="mb-4">
              <label className="block text-sm font-normal mb-1 text-gray-700">
                Card Color
              </label>
              <div className="flex flex-wrap gap-2">
                {pastelColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full ${
                      selectedColor === c ? 'ring-2 ring-offset-1 ring-gray-800' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-normal mb-1 text-gray-700">Start</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded font-normal"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-normal mb-1 text-gray-700">End</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded font-normal"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setFormOpen(false)}
                className="px-3 py-1 text-sm font-normal border rounded-md hover:bg-red-50"
                style={{ color: actionRed, borderColor: actionRed }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selected || !startDate || !endDate}
                className="px-3 py-1 text-sm font-normal border rounded-md hover:bg-blue-50"
                style={{ color: actionBlue, borderColor: actionBlue }}
              >
                {editIndex != null ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dests.map((dest, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Pastel banner */}
            <div
              className="h-10 rounded-t-lg"
              style={{
                backgroundColor: dest.color || pastelColors[i % pastelColors.length],
              }}
            />
            <div className="bg-white p-5 flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <MapPin className="w-6 h-6 text-teal-600 mr-2" />
                  <h4 className="text-xl font-semibold text-gray-800">{dest.name}</h4>
                </div>
                <p className="text-sm font-bold text-gray-600">{formatDateRange(dest.dates)}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => openEdit(i)}
                  className="p-1 border border-gray-300 rounded-full hover:bg-gray-100"
                  aria-label="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleRemoveDestination(i)}
                  className="p-1 border border-gray-300 rounded-full hover:bg-gray-100"
                  aria-label="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DestinationsSection
