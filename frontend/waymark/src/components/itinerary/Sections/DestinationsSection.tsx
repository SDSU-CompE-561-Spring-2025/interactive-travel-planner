import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MapPin, Search, Calendar } from 'lucide-react'
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

const pastelColors = [
  '#66C5CC', '#F6C571', '#F89C74', '#DCB0F2',
  '#87C55F', '#9EB9F3', '#FEBB81', '#C9D874',
  '#8DE0A4', '#B497E7', '#B3B3B3',
]

// Centralised brand colours → tweak once, everywhere updates
const BRAND = {
  primary: 'bg-blue-500',
  primaryHover: 'hover:bg-blue-600',
  danger: 'text-red-500',
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
  /* ------------------------ Local state ------------------------ */
  const [formOpen, setFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([])
  const [selected, setSelected] = useState<{ name: string; lat: number; lng: number } | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>(pastelColors[0])

  // Reset colour on new entry
  useEffect(() => {
    if (formOpen && editIndex === null) setSelectedColor(pastelColors[0])
  }, [formOpen, editIndex])

  /* ------------------------ Helpers ------------------------ */
  const parseLocalDate = (d: string) => {
    const [y, m, day] = d.split('-').map(Number)
    return new Date(y, m - 1, day)
  }

  const formatDateRange = (dates: string) => {
    const [sStr, eStr] = dates.split(',').map(s => s.trim())
    const s = parseLocalDate(sStr), e = parseLocalDate(eStr)
    const opts = { year: 'numeric', month: 'long', day: 'numeric' } as const
    return `${s.toLocaleDateString('en-US', opts)} → ${e.toLocaleDateString('en-US', opts)}`
  }

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
    } catch {}
    setLoading(false)
  }

  // Stable sorted list for map & cards
  const dests = React.useMemo(() => {
    return [...(itinerary.destinations || []) as Destination[]]
      .sort((a, b) => parseLocalDate(a.dates.split(',')[0]).getTime() - parseLocalDate(b.dates.split(',')[0]).getTime())
  }, [itinerary.destinations])

  const handleSave = () => {
    if (!selected || !startDate || !endDate) return
    const newDest: Destination = {
      name: selected.name.split(',')[0],
      dates: `${startDate},${endDate}`,
      lat: selected.lat,
      lng: selected.lng,
      color: selectedColor,
    }

    const updated: Destination[] = editIndex != null
      ? dests.map((d, i) => i === editIndex ? newDest : d)
      : [...dests, newDest]

    setItinerary(prev => ({
      ...prev,
      destinations: updated,
      days: syncDaysWithDestinations(updated, prev.days),
    }))

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

  /* ------------------------ Handlers to open form ------------------------ */
  const openAdd = () => {
    setEditIndex(null)
    setSelected(null)
    setStartDate('')
    setEndDate('')
    setSearchQuery('')
    setFormOpen(true)
  }

  const openEdit = (i: number) => {
    const dest = dests[i]
    setEditIndex(i)
    setSelected({ name: dest.name, lat: dest.lat!, lng: dest.lng! })
    const [s, e] = dest.dates.split(',').map(x => x.trim())
    setStartDate(s)
    setEndDate(e)
    setSearchQuery(dest.name)
    setSelectedColor(dest.color || pastelColors[i % pastelColors.length])
    setFormOpen(true)
  }

  /* ======================================================= */
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Destinations</h2>
        <button
          onClick={openAdd}
          className="p-2 rounded-full shadow-sm bg-blue-50 text-blue-500 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Map */}
      <div className="h-[40rem] border rounded-2xl overflow-hidden mb-8 shadow-sm">
        <DestinationsMap destinations={dests} editable={false} onSave={() => Promise.resolve()} />
      </div>

      {/* Slide-down Add/Edit Form */}
      <div
        className={`transition-all duration-300 ease-out overflow-hidden ${
          formOpen ? 'max-h-[750px] opacity-100 mb-8' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 relative"
          style={{ borderLeft: `6px solid ${selectedColor}` }}
        >
          {/* Close × */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => setFormOpen(false)}
          >
            ×
          </button>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            {editIndex != null ? 'Edit Destination' : 'Add Destination'}
          </h3>

          {/* Search Bar */}
          <div className="mb-6 relative max-w-sm">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Where to?"
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            {searchResults.length > 0 && (
              <ul className="mt-1 w-full absolute bg-white border border-gray-200 rounded-md max-h-48 overflow-y-auto shadow-lg z-10">
                {searchResults.map((r, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                    onClick={() => {
                      setSelected(r)
                      setSearchQuery(r.name.split(',')[0])
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
          <div className="mb-6 max-w-md">
            <span className="block text-sm font-medium text-gray-700 mb-3">Card Color</span>
            <div className="flex flex-wrap gap-3">
              {pastelColors.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedColor === c
                      ? 'ring-2 ring-gray-400 scale-110'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="grid gap-6 sm:grid-cols-2 mb-8 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setFormOpen(false)}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:text-gray-800 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selected || !startDate || !endDate}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-md shadow ${BRAND.primary} ${BRAND.primaryHover} transition disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {editIndex != null ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Destination Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dests.map((dest, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
          >
            <div
              className="h-10 rounded-t-2xl"
              style={{ backgroundColor: dest.color || pastelColors[i % pastelColors.length] }}
            />
            <div className="p-5 flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <h4 className="text-base font-medium text-gray-800 truncate max-w-[10rem]" title={dest.name}>
                    {dest.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-600">{formatDateRange(dest.dates)}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEdit(i)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRemoveDestination(i)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                >
                  <Trash2 className="w-4 h-4" />
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


