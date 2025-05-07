import React, { useState } from 'react'
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { Itinerary, updateItinerarySection } from '../../../lib/api'
import DestinationsMap from '../../itinerary/DestinationsMap'

interface Destination {
  name: string
  dates: string
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

  // run search
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

  // add or save
  const handleSave = () => {
    if (!selected || !startDate || !endDate) return
    const newDest: Destination = {
      name: selected.name.split(',')[0],
      dates: `${startDate},${endDate}`,
      lat: selected.lat,
      lng: selected.lng,
    }
    const updatedList =
      editIndex !== null
        ? [
            // replace existing
            ...itinerary.destinations!.slice(0, editIndex),
            newDest,
            ...itinerary.destinations!.slice(editIndex + 1),
          ]
        : [...(itinerary.destinations || []), newDest]

    // update state & days
    setItinerary(prev => ({
      ...prev,
      destinations: updatedList,
      days: syncDaysWithDestinations(updatedList, prev.days),
    }))

    // persist
    if (itinerary.id && itinerary.id !== 'new-trip') {
      setLoading(true)
      updateItinerarySection(itinerary.id, 'destinations', updatedList)
        .then(() => showNotification('success', 'Destinations saved!'))
        .catch(() => showNotification('error', 'Failed to save.'))
        .finally(() => setLoading(false))
    } else {
      showNotification('success', 'Destinations saved!')
    }

    // reset form
    setFormOpen(false)
    setSearchQuery('')
    setSearchResults([])
    setSelected(null)
    setStartDate('')
    setEndDate('')
    setEditIndex(null)
  }

  // open add
  const openAdd = () => {
    setEditIndex(null)
    setSelected(null)
    setStartDate('')
    setEndDate('')
    setFormOpen(true)
  }

  // open edit
  const openEdit = (i: number) => {
    const dest = itinerary.destinations?.[i]
    if (!dest) return
    setEditIndex(i)
    setSelected({ name: dest.name, lat: dest.lat!, lng: dest.lng! })
    const [s, e] = dest.dates.split(',').map(s => s.trim())
    setStartDate(s)
    setEndDate(e)
    setSearchQuery(dest.name)
    setFormOpen(true)
  }

  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Destinations</h2>
        <button
          onClick={openAdd}
          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
          aria-label="Add Destination"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* map */}
      <div className="border rounded-lg shadow-sm overflow-hidden bg-gray-50 h-[40rem]">
        <DestinationsMap
          destinations={itinerary.destinations || []}
          editable={false}
          onSave={() => Promise.resolve()}
        />
      </div>

      {/* slide-down form */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          formOpen
            ? 'max-h-[500px] opacity-100 mt-6'
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-4">
            {editIndex !== null ? 'Edit Destination' : 'Add Destination'}
          </h3>

          {/* search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search location..."
              className="border p-2 rounded w-full"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            {searchResults.length > 0 && (
              <ul className="border max-h-40 overflow-y-auto mt-2 rounded">
                {searchResults.map((res, idx) => (
                  <li
                    key={idx}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelected(res)
                      setSearchResults([])
                      setSearchQuery(res.name)
                    }}
                  >
                    {res.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* dates */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Start</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* actions */}
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
              {editIndex !== null ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* list */}
      {itinerary.destinations?.length ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {itinerary.destinations.map((dest, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex justify-between items-start"
            >
              <div>
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mr-3">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-gray-800 text-lg">
                    {dest.name}
                  </h3>
                </div>
                <p className="text-gray-500">{dest.dates}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEdit(i)}
                  className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"
                  aria-label="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleRemoveDestination(i)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                  aria-label="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-10 text-center bg-gray-50 mt-6">
          <div className="w-20 h-20 mx-auto mb-5 bg-teal-100 rounded-full flex items-center justify-center">
            <MapPin className="h-10 w-10 text-teal-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-3">
            No destinations yet
          </h3>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Add places you plan to visit on your trip
          </p>
          <button
            onClick={openAdd}
            className="inline-flex items-center px-5 py-2.5 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Destinations
          </button>
        </div>
      )}
    </div>
  )
}

export default DestinationsSection
