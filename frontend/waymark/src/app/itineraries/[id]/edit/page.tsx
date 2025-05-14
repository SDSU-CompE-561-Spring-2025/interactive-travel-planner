'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { DatePicker } from '@/components/ui/date-picker';
import ProtectedRoute from '@/components/ProtectedRoute';
import type { Location } from '@/components/ItineraryMap';
import dynamic from 'next/dynamic';

const ItineraryMap = dynamic(() => import('@/components/ItineraryMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl">Loading map...</div>,
});

interface SearchResult {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
}

interface EditItineraryForm {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    locations: Location[];
    trips?: any[];
}

export default function EditItineraryPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [formData, setFormData] = useState<EditItineraryForm>({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        locations: []
    });
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
    const [mapZoom, setMapZoom] = useState(2);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Load itinerary data
    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }
                const response = await axios.get(`http://localhost:8000/itineraries/${resolvedParams.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const itin = response.data;
                setFormData({
                    name: itin.name,
                    description: itin.description,
                    start_date: itin.start_date,
                    end_date: itin.end_date,
                    locations: (itin.locations || []).map((loc: any) => ({
                        id: loc.id.toString(),
                        name: loc.name,
                        coordinates: [loc.latitude, loc.longitude],
                        description: loc.description || ''
                    })),
                    trips: (itin.trips || []).map((trip: any) => typeof trip === 'object' ? trip.id : trip)
                });
                setStartDate(new Date(itin.start_date));
                setEndDate(new Date(itin.end_date));
                if (itin.locations && itin.locations.length > 0) {
                    const lastLoc = itin.locations[itin.locations.length - 1];
                    setMapCenter([lastLoc.latitude, lastLoc.longitude]);
                    setMapZoom(12);
                }
            } catch (error) {
                toast.error('Failed to load itinerary');
                router.back();
            }
        };
        fetchItinerary();
    }, [resolvedParams.id, router]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 2) {
                setIsSearching(true);
                try {
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
                    );
                    setSearchResults(response.data);
                } catch (error) {
                    toast.error('Failed to search locations');
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchResultSelect = (result: SearchResult) => {
        const newLocation: Location = {
            id: result.place_id,
            name: result.display_name,
            coordinates: [parseFloat(result.lat), parseFloat(result.lon)],
            description: ''
        };
        setFormData(prev => ({
            ...prev,
            locations: [...prev.locations, newLocation]
        }));
        setSearchQuery('');
        setSearchResults([]);
        setMapCenter([parseFloat(result.lat), parseFloat(result.lon)]);
        setMapZoom(12);
        toast.success('Location added!');
    };

    const handleSelectLocation = (location: Location) => {
        setSelectedLocation(location);
        setMapCenter(location.coordinates);
        setMapZoom(12);
    };

    const removeLocation = (locationId: string) => {
        setFormData(prev => ({
            ...prev,
            locations: prev.locations.filter(loc => loc.id !== locationId)
        }));
        if (selectedLocation?.id === locationId) {
            setSelectedLocation(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            if (!startDate || !endDate) {
                toast.error('Please select both start and end dates');
                return;
            }
            if (formData.locations.length === 0) {
                toast.error('Please add at least one location');
                return;
            }
            if (!formData.trips || !Array.isArray(formData.trips) || formData.trips.length === 0) {
                toast.error('This itinerary is not associated with a trip. Please contact support.');
                return;
            }
            const payload = {
                ...formData,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                trips: formData.trips.map(Number),
                locations: formData.locations.map(loc => ({
                    name: loc.name,
                    coordinates: loc.coordinates,
                    description: loc.description
                }))
            };
            console.log('Submitting itinerary update payload:', payload);
            await axios.put(`http://localhost:8000/itineraries/${resolvedParams.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Itinerary updated!');
            router.push(`/itineraries/${resolvedParams.id}`);
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: any } };
                let detail = axiosError.response?.data?.detail;
                if (typeof detail === 'object') {
                    detail = JSON.stringify(detail);
                }
                toast.error(`Failed to update itinerary: ${detail || JSON.stringify(axiosError.response?.data) || 'Unknown error'}`);
            } else {
                toast.error('Failed to update itinerary');
            }
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Itinerary</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Itinerary Name
                                        </label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Start Date
                                            </label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => {
                                                    setStartDate(date);
                                                    setFormData(prev => ({ ...prev, start_date: date ? date.toISOString() : '' }));
                                                }}
                                                minDate={new Date()}
                                                placeholderText="Select start date"
                                                className="w-full px-4 py-3 rounded-lg border border-[#4ba46c]/30 focus:outline-none focus:ring-2 focus:ring-[#f3a034] bg-white text-[#377c68] text-left"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                End Date
                                            </label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => {
                                                    setEndDate(date);
                                                    setFormData(prev => ({ ...prev, end_date: date ? date.toISOString() : '' }));
                                                }}
                                                minDate={startDate || new Date()}
                                                placeholderText="Select end date"
                                                className="w-full px-4 py-3 rounded-lg border border-[#4ba46c]/30 focus:outline-none focus:ring-2 focus:ring-[#f3a034] bg-white text-[#377c68] text-left"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Add Location
                                        </label>
                                        <div className="space-y-2 relative">
                                            <div className="relative">
                                                <Input
                                                    placeholder="Search for a location..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pr-10"
                                                    disabled={false}
                                                />
                                            </div>
                                            {isSearching && (
                                                <div className="text-sm text-gray-500">Searching...</div>
                                            )}
                                            {searchResults.length > 0 && (
                                                <div className="absolute z-[9999] w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                                    {searchResults.map((result) => (
                                                        <button
                                                            key={result.place_id}
                                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                                            onClick={() => {
                                                                handleSearchResultSelect(result);
                                                                setMapCenter([parseFloat(result.lat), parseFloat(result.lon)]);
                                                                setMapZoom(12);
                                                            }}
                                                        >
                                                            <div className="text-sm font-medium">{result.display_name}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {formData.locations.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Added Locations
                                            </label>
                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {formData.locations.map((location) => (
                                                    <div
                                                        key={location.id}
                                                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-500">📍</span>
                                                            <span className="text-sm">{location.name}</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeLocation(location.id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
                                    <ItineraryMap
                                        locations={formData.locations}
                                        center={mapCenter}
                                        zoom={mapZoom}
                                        onSelectLocation={handleSelectLocation}
                                        onMapMove={(center, zoom) => {
                                            setMapCenter(center);
                                            setMapZoom(zoom);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 