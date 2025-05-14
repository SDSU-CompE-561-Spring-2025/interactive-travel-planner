'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Calendar, ArrowLeft, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import ProtectedRoute from '@/components/ProtectedRoute';
import type { Location } from '@/components/ItineraryMap';
import { DatePicker } from '@/components/ui/date-picker';

// Dynamically import the map component to avoid SSR issues
const ItineraryMap = dynamic(() => import('@/components/ItineraryMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl">
      <div className="text-gray-500 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
        <span>Loading map...</span>
      </div>
    </div>
  ),
});

interface SearchResult {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
}

interface CreateItineraryForm {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    locations: Location[];
}

export default function CreateItineraryPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [formData, setFormData] = useState<CreateItineraryForm>({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        locations: []
    });

    const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
    const [mapZoom, setMapZoom] = useState(2);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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
                    console.error('Search failed:', error);
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

    useEffect(() => {
        // If formData.start_date or end_date is set (from editing), sync to Date objects
        if (formData.start_date) setStartDate(new Date(formData.start_date));
        if (formData.end_date) setEndDate(new Date(formData.end_date));
        // eslint-disable-next-line
    }, []);

    const handleSearchResultSelect = (result: SearchResult) => {
        const newLocation: Location = {
            id: result.place_id,
            name: result.display_name,
            coordinates: [parseFloat(result.lat), parseFloat(result.lon)],
            description: '' // Remove description since we're not using it
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

            if (formData.locations.length === 0) {
                toast.error('Please add at least one location to your itinerary');
                return;
            }

            if (!startDate || !endDate) {
                toast.error('Please select both start and end dates');
                return;
            }

            const payload = {
                ...formData,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                trips: [parseInt(resolvedParams.id)],
                locations: formData.locations.map(loc => ({
                    name: loc.name,
                    coordinates: loc.coordinates,
                    description: loc.description
                }))
            };

            await axios.post(
                'http://localhost:8000/itineraries/',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success('Itinerary created successfully!');
            router.push(`/trips/${resolvedParams.id}`);
        } catch (error) {
            console.error('Failed to create itinerary:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { detail?: string } } };
                toast.error(`Failed to create itinerary: ${axiosError.response?.data?.detail || 'Unknown error'}`);
            } else {
                toast.error('Failed to create itinerary');
            }
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <Link href={`/trips/${resolvedParams.id}`}>
                            <Button variant="ghost" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Trip
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Itinerary</h1>

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
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Input
                                                    placeholder="Search for a location..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="pr-10"
                                                />
                                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            </div>
                                            
                                            {isSearching && (
                                                <div className="text-sm text-gray-500">Searching...</div>
                                            )}

                                            {searchResults.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                                                    {searchResults.map((result) => (
                                                        <button
                                                            key={result.place_id}
                                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                                            onClick={() => handleSearchResultSelect(result)}
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
                                                            <MapPin className="h-4 w-4 text-gray-500" />
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

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                                    disabled={!formData.name || !formData.start_date || !formData.end_date}
                                >
                                    Create Itinerary
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 