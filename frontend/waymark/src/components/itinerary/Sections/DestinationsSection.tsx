import React, { useState } from 'react'
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import DestinationsMap from '../../itinerary/DestinationsMap'
import { Itinerary, updateItinerarySection } from '../../../lib/api'

interface Destination {
  name: string
  dates: string  // formatted "YYYY-MM-DD,YYYY-MM-DD"
  lat?: number
  lng?: number
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

const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  itinerary,
  setItinerary,
  syncDaysWithDestinations,
  showNotification,
  loading,
  setLoading,
  handleRemoveDestination,
}) => {
  // form state
  const [formOpen, setFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<
    { name: string; lat: number; lng: number }[]
  >([])
  const [selected, setSelected] = useState<{
    name: string
    lat: number
    lng: number
  } | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)

  // perform a search against Nominatim
  const handleSearch = async () => {
    if (!searchQuery) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=en&q=${encodeURIComponent(
          searchQuery
        )}`
      )
      const data = await res.json()
      setSearchResults(
        data.map((item: any) => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }))
      )
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  // Corrected date formatter:
  const formatDateRange = (dates: string) => {
    const [startStr, endStr] = dates.split(',').map(d => new Date(d))
    const s = startStr
    const e = endStr

    const optsStart = { month: 'short', day: 'numeric' } as const
    const optsEndSameMonth = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    } as const
    const optsFull = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    } as const

    // If same month & year, shorten the start
    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
      return `${s.toLocaleDateString('en-US', optsStart)} — ${e.toLocaleDateString(
        'en-US',
        optsEndSameMonth
      )}`
    }
    // Otherwise, full both sides
    return `${s.toLocaleDateString('en-US', optsFull)} — ${e.toLocaleDateString(
      'en-US',
      optsFull
    )}`
  }

  // Add or update destination
  const handleSave = () => {
    if (!selected || !startDate || !endDate) return

    const newDest: Destination = {
      name: selected.name.split(',')[0],
      dates: `${startDate},${endDate}`,
      lat: selected.lat,
      lng: selected.lng,
    }

    const updatedList =
      editIndex != null
        ? [
            ...itinerary.destinations!.slice(0, editIndex),
            newDest,
            ...itinerary.destinations!.slice(editIndex + 1),
          ]
        : [...(itinerary.destinations || []), newDest]

    // update state + sync days
    setItinerary(prev => ({
      ...prev,
      destinations: updatedList,
      days: syncDaysWithDestinations(updatedList, prev.days),
    }))

    // persist if not a new-trip
    if (itinerary.id && itinerary.id !== 'new-trip') {
      setLoading(true)
      updateItinerarySection(itinerary.id, 'destinations', updatedList)
        .then(() => showNotification('success', 'Destinations saved!'))
        .catch(() => showNotification('error', 'Failed to save destinations.'))
        .finally(() => setLoading(false))
    } else {
      showNotification('success', 'Destinations saved!')
    }

    // reset and close form
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
  // Open form for editing existing
  const openEdit = (i: number) => {
    const d = itinerary.destinations![i]
    if (!d) return
    setEditIndex(i)
    setSelected({ name: d.name, lat: d.lat!, lng: d.lng! })
    const [s, e] = d.dates.split(',').map(x => x.trim())
    setStartDate(s)
    setEndDate(e)
    setSearchQuery(d.name)
    setFormOpen(true)
  }

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
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Map */}
      <div className="h-[40rem] border rounded-lg overflow-hidden mb-6">
        <DestinationsMap
          destinations={itinerary.destinations || []}
          editable={false}
          onSave={() => Promise.resolve()}
        />
      </div>

      {/* Slide-down form */}
      <div
        className={`transition-all duration-300 ease-out overflow-hidden ${
          formOpen
            ? 'max-h-[550px] opacity-100 mb-6'
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-4">
            {editIndex != null ? 'Edit Destination' : 'Add Destination'}
          </h3>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search location…"
              className="w-full border p-2 rounded"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            {searchResults.length > 0 && (
              <ul className="border rounded max-h-40 overflow-y-auto mt-2">
                {searchResults.map((r, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
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

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Start</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selected || !startDate || !endDate}
              className="px-4 py-2 bg-teal-500 text-white rounded disabled:opacity-50"
            >
              {editIndex != null ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Destination Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {itinerary.destinations?.map((dest, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex justify-between"
          >
            <div>
              <div className="flex items-center mb-2">
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-800">{dest.name}</h4>
              </div>
              <p className="text-gray-500">{formatDateRange(dest.dates)}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => openEdit(i)}
                className="p-1 text-gray-400 hover:text-blue-500 rounded-full"
                aria-label="Edit"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleRemoveDestination(i)}
                className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                aria-label="Remove"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DestinationsSection
