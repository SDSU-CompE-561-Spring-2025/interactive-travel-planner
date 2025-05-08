import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MapPin, Search, Calendar, X } from 'lucide-react'
import DestinationsMap from '../../itinerary/DestinationsMap'
import { Itinerary, updateItinerarySection } from '../../../lib/api'

interface Destination {
  id?: number | string
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

// Brand colours 
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
  const [formOpen, setFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([])
  const [selected, setSelected] = useState<{ name: string; lat: number; lng: number } | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>(pastelColors[0])

  // Reset form color on new entry
  useEffect(() => {
    if (formOpen && editIndex === null) {
      setSelectedColor(pastelColors[0])
    }
  }, [formOpen, editIndex])

  // Parse YYYY-MM-DD into Date
  const parseLocalDate = (d: string) => {
    const [y, m, day] = d.split('-').map(Number)
    return new Date(y, m - 1, day)
  }

  // Human-friendly range
  const formatDateRange = (dates: string) => {
    const [sStr, eStr] = dates.split(',').map(s => s.trim())
    const s = parseLocalDate(sStr)
    const e = parseLocalDate(eStr)
    const opts = { year: 'numeric', month: 'long', day: 'numeric' } as const
    return `${s.toLocaleDateString('en-US', opts)} → ${e.toLocaleDateString('en-US', opts)}`
  }

  // Geocoding search
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

  // Save new or edited destination
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

  // Open add form
  const openAdd = () => {
    setEditIndex(null)
    setSelected(null)
    setSearchQuery('')
    setStartDate('')
    setEndDate('')
    setFormOpen(true)
  }

  // Open edit form
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

  // Implementation for handleRemoveDestination
  const onRemoveDestination = async (index: number) => {
    // Get the destination to be removed
    const destToRemove = dests[index]
    const destinationId = destToRemove.id || index

    // Remove from local state first for immediate UI feedback
    const updatedDests = dests.filter((_, i) => i !== index)
    
    setItinerary(prev => ({
      ...prev,
      destinations: updatedDests,
      days: syncDaysWithDestinations(updatedDests, prev.days),
    }))
    
    // If we have an itinerary ID and it's not a new trip, make the API call
    if (itinerary.id && itinerary.id !== 'new-trip') {
      setLoading(true)
      
      try {
        // Make a DELETE request to the backend
        const response = await fetch(`/destinations/${destinationId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete destination')
        }
        
        showNotification('success', 'Destination removed successfully')
        
        // Update server-side destinations list
        const serverList = updatedDests.map(({ name, dates, lat, lng }) => ({ name, dates, lat, lng }))
        await updateItinerarySection(itinerary.id, 'destinations', serverList)
      } catch (error) {
        console.error('Error removing destination:', error)
        showNotification('error', 'Failed to remove destination')
        
        // Restore the destination in case of an error
        setItinerary(prev => ({
          ...prev,
          destinations: dests,
          days: syncDaysWithDestinations(dests, prev.days),
        }))
      } finally {
        setLoading(false)
      }
    } else {
      showNotification('success', 'Destination removed')
    }
    
    // Call the parent's handleRemoveDestination if provided
    if (handleRemoveDestination) {
      handleRemoveDestination(index)
    }
  }

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

      {/* Add/Edit Form */}
    {formOpen && (
      <div style={{
        backgroundColor: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        width: "100%",
        maxWidth: "36rem",
        margin: "0 auto 2rem auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        {/* Close Button */}
        <button
          onClick={() => setFormOpen(false)}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            color: "#6B7280",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Title */}
        <h3 style={{
          fontSize: "1.125rem",
          fontWeight: 500,
          textAlign: "center",
          color: "#1F2937",
          marginBottom: "1.5rem"
        }}>
          {editIndex != null ? 'Edit Destination' : 'Add Destination'}
        </h3>
        
        {/* Location Field */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ 
            display: "block", 
            fontSize: "0.875rem", 
            color: "#4B5563", 
            marginBottom: "0.5rem" 
          }}>
            Location
          </label>
          <div style={{ position: "relative" }}>
            <Search style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
              zIndex: 10
            }} />
            <input
              type="text"
              placeholder="Search place..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{
                width: "100%",
                paddingLeft: "2.5rem",
                paddingRight: "1rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                fontSize: "1rem",
                border: "1px solid #D1D5DB",
                borderRadius: "0.5rem",
                outline: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
          {searchResults.length > 0 && (
            <ul style={{
              marginTop: "0.25rem",
              border: "1px solid #E5E7EB",
              borderRadius: "0.5rem",
              maxHeight: "10rem",
              overflowY: "auto",
              backgroundColor: "white",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
            }}>
              {searchResults.map((r, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setSelected(r)
                    setSearchQuery(r.name.split(',')[0])
                    setSearchResults([])
                  }}
                  style={{
                    padding: "0.75rem",
                    fontSize: "0.875rem",
                    cursor: "pointer"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  {r.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Color Picker */}
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <span style={{ 
            display: "block", 
            fontSize: "0.875rem", 
            color: "#4B5563", 
            marginBottom: "0.5rem" 
          }}>
            Card Color
          </span>
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "0.5rem", 
            flexWrap: "wrap" 
          }}>
            {pastelColors.map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "9999px",
                  backgroundColor: c,
                  border: selectedColor === c ? "2px solid #9CA3AF" : "none",
                  transform: selectedColor === c ? "scale(1.1)" : "scale(1)",
                  transition: "transform 0.2s",
                  cursor: "pointer"
                }}
              />
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "1rem", 
          marginBottom: "2rem" 
        }}>
          <div>
            <label style={{ 
              display: "block", 
              fontSize: "0.875rem", 
              color: "#4B5563", 
              marginBottom: "0.25rem" 
            }}>
              Start Date
            </label>
            <div style={{ position: "relative" }}>
              <Calendar style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9CA3AF"
              }} />
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "2.5rem",
                  paddingRight: "0.75rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  fontSize: "0.875rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  outline: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>
          <div>
            <label style={{ 
              display: "block", 
              fontSize: "0.875rem", 
              color: "#4B5563", 
              marginBottom: "0.25rem" 
            }}>
              End Date
            </label>
            <div style={{ position: "relative" }}>
              <Calendar style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9CA3AF"
              }} />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "2.5rem",
                  paddingRight: "0.75rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  fontSize: "0.875rem",
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  outline: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "1.5rem" 
        }}>
          <button
            onClick={() => setFormOpen(false)}
            style={{
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              fontSize: "1rem",
              fontWeight: 500,
              borderRadius: "0.5rem",
              backgroundColor: "#E5E7EB",
              color: "#374151",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#D1D5DB"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#E5E7EB"}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selected || !startDate || !endDate}
            style={{
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              fontSize: "1rem",
              fontWeight: 500,
              borderRadius: "0.5rem",
              backgroundColor: "#2563EB",
              color: "white",
              border: "none",
              cursor: !selected || !startDate || !endDate ? "not-allowed" : "pointer",
              opacity: !selected || !startDate || !endDate ? 0.5 : 1,
              transition: "background-color 0.2s"
            }}
            onMouseOver={(e) => {
              if (selected && startDate && endDate) {
                e.currentTarget.style.backgroundColor = "#1D4ED8"
              }
            }}
            onMouseOut={(e) => {
              if (selected && startDate && endDate) {
                e.currentTarget.style.backgroundColor = "#2563EB"
              }
            }}
          >
            {editIndex != null ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    )}

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
                  onClick={() => onRemoveDestination(i)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition focus:outline-none"
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