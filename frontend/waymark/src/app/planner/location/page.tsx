'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { useTripPlanner } from '@/contexts/TripPlannerContext';
import { ProgressBar } from '@/components/ProgressBar';

// Mock data - replace with actual API call in production
const POPULAR_DESTINATIONS = [
    { id: 1, name: 'Paris, France' },
    { id: 2, name: 'London, United Kingdom' },
    { id: 3, name: 'Tokyo, Japan' },
    { id: 4, name: 'New York City, USA' },
    { id: 5, name: 'Rome, Italy' },
    { id: 6, name: 'Barcelona, Spain' },
    { id: 7, name: 'Amsterdam, Netherlands' },
    { id: 8, name: 'Berlin, Germany' },
    { id: 9, name: 'Vienna, Austria' },
    { id: 10, name: 'Prague, Czech Republic' },
    { id: 11, name: 'Venice, Italy' },
    { id: 12, name: 'Florence, Italy' },
    { id: 13, name: 'Madrid, Spain' },
    { id: 14, name: 'Lisbon, Portugal' },
    { id: 15, name: 'Copenhagen, Denmark' },
    { id: 16, name: 'Stockholm, Sweden' },
    { id: 17, name: 'Oslo, Norway' },
    { id: 18, name: 'Helsinki, Finland' },
    { id: 19, name: 'Dublin, Ireland' },
    { id: 20, name: 'Edinburgh, Scotland' },
    { id: 21, name: 'Brussels, Belgium' },
    { id: 22, name: 'Munich, Germany' },
    { id: 23, name: 'Milan, Italy' },
    { id: 24, name: 'Athens, Greece' },
    { id: 25, name: 'Istanbul, Turkey' },
    { id: 26, name: 'Moscow, Russia' },
    { id: 27, name: 'St. Petersburg, Russia' },
    { id: 28, name: 'Warsaw, Poland' },
    { id: 29, name: 'Budapest, Hungary' },
    { id: 30, name: 'Krakow, Poland' },
    { id: 31, name: 'Seoul, South Korea' },
    { id: 32, name: 'Beijing, China' },
    { id: 33, name: 'Shanghai, China' },
    { id: 34, name: 'Hong Kong' },
    { id: 35, name: 'Singapore' },
    { id: 36, name: 'Bangkok, Thailand' },
    { id: 37, name: 'Hanoi, Vietnam' },
    { id: 38, name: 'Ho Chi Minh City, Vietnam' },
    { id: 39, name: 'Jakarta, Indonesia' },
    { id: 40, name: 'Manila, Philippines' },
    { id: 41, name: 'Kuala Lumpur, Malaysia' },
    { id: 42, name: 'Mumbai, India' },
    { id: 43, name: 'Delhi, India' },
    { id: 44, name: 'Dubai, UAE' },
    { id: 45, name: 'Abu Dhabi, UAE' },
    { id: 46, name: 'Doha, Qatar' },
    { id: 47, name: 'Tel Aviv, Israel' },
    { id: 48, name: 'Cairo, Egypt' },
    { id: 49, name: 'Marrakech, Morocco' },
    { id: 50, name: 'Cape Town, South Africa' },
    { id: 51, name: 'Sydney, Australia' },
    { id: 52, name: 'Melbourne, Australia' },
    { id: 53, name: 'Brisbane, Australia' },
    { id: 54, name: 'Perth, Australia' },
    { id: 55, name: 'Auckland, New Zealand' },
    { id: 56, name: 'Wellington, New Zealand' },
    { id: 57, name: 'Los Angeles, USA' },
    { id: 58, name: 'San Francisco, USA' },
    { id: 59, name: 'Chicago, USA' },
    { id: 60, name: 'Miami, USA' },
    { id: 61, name: 'Santorini, Greece' },
    { id: 62, name: 'Mykonos, Greece' },
    { id: 63, name: 'Bali, Indonesia' },
    { id: 64, name: 'Maldives' },
    { id: 65, name: 'Phuket, Thailand' },
    { id: 66, name: 'Maui, USA' },
    { id: 67, name: 'Cancun, Mexico' },
    { id: 68, name: 'Tulum, Mexico' },
    { id: 69, name: 'Amalfi Coast, Italy' },
    { id: 70, name: 'Cinque Terre, Italy' },
    { id: 71, name: 'Dubrovnik, Croatia' },
    { id: 72, name: 'Split, Croatia' },
    { id: 73, name: 'Ibiza, Spain' },
    { id: 74, name: 'Mallorca, Spain' },
    { id: 75, name: 'Bora Bora, French Polynesia' },
    { id: 76, name: 'Tahiti, French Polynesia' },
    { id: 77, name: 'Fiji' },
    { id: 78, name: 'Seychelles' },
    { id: 79, name: 'Mauritius' },
    { id: 80, name: 'Zanzibar, Tanzania' },
    { id: 81, name: 'Machu Picchu, Peru' },
    { id: 82, name: 'Cusco, Peru' },
    { id: 83, name: 'Rio de Janeiro, Brazil' },
    { id: 84, name: 'Galapagos Islands, Ecuador' },
    { id: 85, name: 'Easter Island, Chile' },
    { id: 86, name: 'Patagonia, Argentina' },
    { id: 87, name: 'Banff, Canada' },
    { id: 88, name: 'Lake Louise, Canada' },
    { id: 89, name: 'Yellowstone, USA' },
    { id: 90, name: 'Grand Canyon, USA' },
    { id: 91, name: 'Yosemite, USA' },
    { id: 92, name: 'Zion National Park, USA' },
    { id: 93, name: 'Hawaii Big Island, USA' },
    { id: 94, name: 'Kauai, USA' },
    { id: 95, name: 'Cappadocia, Turkey' },
    { id: 96, name: 'Petra, Jordan' },
    { id: 97, name: 'Jerusalem, Israel' },
    { id: 98, name: 'Luxor, Egypt' },
    { id: 99, name: 'Giza, Egypt' },
    { id: 100, name: 'Sahara Desert, Morocco' },
    { id: 101, name: 'Chefchaouen, Morocco' },
    { id: 102, name: 'Victoria Falls, Zimbabwe' },
    { id: 103, name: 'Mount Kilimanjaro, Tanzania' },
    { id: 104, name: 'Kruger National Park, South Africa' },
    { id: 105, name: 'Angkor Wat, Cambodia' },
    { id: 106, name: 'Ha Long Bay, Vietnam' },
    { id: 107, name: 'Sapa, Vietnam' },
    { id: 108, name: 'Chiang Mai, Thailand' },
    { id: 109, name: 'Phi Phi Islands, Thailand' },
    { id: 110, name: 'Kyoto, Japan' },
    { id: 111, name: 'Mount Fuji, Japan' },
    { id: 112, name: 'Osaka, Japan' },
    { id: 113, name: 'Jeju Island, South Korea' },
    { id: 114, name: 'Great Wall of China' },
    { id: 115, name: 'Zhangjiajie, China' },
    { id: 116, name: 'Guilin, China' },
    { id: 117, name: 'Palawan, Philippines' },
    { id: 118, name: 'Boracay, Philippines' },
    { id: 119, name: 'Siem Reap, Cambodia' },
    { id: 120, name: 'Luang Prabang, Laos' },
    { id: 121, name: 'Yangon, Myanmar' },
    { id: 122, name: 'Bagan, Myanmar' },
    { id: 123, name: 'Kathmandu, Nepal' },
    { id: 124, name: 'Pokhara, Nepal' },
    { id: 125, name: 'Everest Base Camp, Nepal' },
    { id: 126, name: 'Taj Mahal, India' },
    { id: 127, name: 'Jaipur, India' },
    { id: 128, name: 'Varanasi, India' },
    { id: 129, name: 'Udaipur, India' },
    { id: 130, name: 'Goa, India' },
    { id: 131, name: 'Kerala Backwaters, India' },
    { id: 132, name: 'Mecca, Saudi Arabia' },
    { id: 133, name: 'Burj Khalifa, UAE' },
    { id: 134, name: 'Santorini, Greece' },
    { id: 135, name: 'Acropolis, Greece' },
    { id: 136, name: 'Swiss Alps, Switzerland' },
    { id: 137, name: 'Zermatt, Switzerland' },
    { id: 138, name: 'Lake Como, Italy' },
    { id: 139, name: 'Tuscany, Italy' },
    { id: 140, name: 'Provence, France' },
    { id: 141, name: 'French Riviera, France' },
    { id: 142, name: 'Mont Saint-Michel, France' },
    { id: 143, name: 'Neuschwanstein Castle, Germany' },
    { id: 144, name: 'Black Forest, Germany' },
    { id: 145, name: 'Hallstatt, Austria' },
    { id: 146, name: 'Bruges, Belgium' },
    { id: 147, name: 'Keukenhof Gardens, Netherlands' },
    { id: 148, name: 'Northern Lights, Iceland' },
    { id: 149, name: 'Blue Lagoon, Iceland' },
    { id: 150, name: 'Norwegian Fjords, Norway' },
    { id: 151, name: 'Stockholm Archipelago, Sweden' },
    { id: 152, name: 'St. Petersburg Palaces, Russia' },
    { id: 153, name: 'Transylvania, Romania' },
    { id: 154, name: 'Plitvice Lakes, Croatia' },
    { id: 155, name: 'Bled Lake, Slovenia' },
    { id: 156, name: 'Mostar Bridge, Bosnia' },
    { id: 157, name: 'Kotor, Montenegro' },
    { id: 158, name: 'Meteora, Greece' },
    { id: 159, name: 'Alhambra, Spain' },
    { id: 160, name: 'Sagrada Familia, Spain' },
    { id: 495, name: 'Reykjavik, Iceland' },
    { id: 496, name: 'Nassau, Bahamas' },
    { id: 497, name: 'San Juan, Puerto Rico' },
    { id: 498, name: 'Havana, Cuba' },
    { id: 499, name: 'Kingston, Jamaica' },
    { id: 500, name: 'Port of Spain, Trinidad and Tobago' }
];

export default function LocationStep() {
    const router = useRouter();
    const { tripData, updateTripData } = useTripPlanner();
    const [location, setLocation] = useState(tripData.location || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState(POPULAR_DESTINATIONS);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close suggestions when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (searchTerm: string) => {
        setLocation(searchTerm);
        setError('');
        
        if (searchTerm.trim() === '') {
            setSuggestions(POPULAR_DESTINATIONS);
        } else {
            const filtered = POPULAR_DESTINATIONS.filter(dest => 
                dest.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filtered);
        }
        setShowSuggestions(true);
    };

    const handleSelectLocation = (destination: typeof POPULAR_DESTINATIONS[0]) => {
        setLocation(destination.name);
        setShowSuggestions(false);
        setError('');
    };

    const handleNext = () => {
        if (!location.trim()) {
            setError('Please select a destination');
            return;
        }
        updateTripData('location', location.trim());
        router.push('/planner/activities');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#fff8f0] py-12"
        >
            <div className="max-w-4xl mx-auto px-4">
                <ProgressBar currentStep="location" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-md mx-auto"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#f3a034]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MapPin className="h-8 w-8 text-[#f3a034]" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#377c68] mb-4">
                            Where to?
                        </h1>
                        <p className="text-lg text-[#4ba46c]">
                            Choose your dream destination
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4ba46c]" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={location}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Search destinations..."
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#4ba46c]/30 focus:outline-none focus:ring-2 focus:ring-[#f3a034] bg-white text-[#377c68]"
                                />
                            </div>

                            <AnimatePresence>
                                {showSuggestions && (
                                    <motion.div
                                        ref={suggestionsRef}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-[#4ba46c]/10 overflow-hidden max-h-[300px] overflow-y-auto"
                                    >
                                        {suggestions.length > 0 ? (
                                            suggestions.map((destination) => (
                                                <div
                                                    key={destination.id}
                                                    onClick={() => handleSelectLocation(destination)}
                                                    className="px-4 py-3 hover:bg-[#fff8f0] cursor-pointer transition-colors duration-150 border-b border-[#4ba46c]/10 last:border-b-0"
                                                >
                                                    <div className="font-medium text-[#377c68]">
                                                        {destination.name}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-3 text-center text-[#377c68]">
                                                No destinations found
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 mt-1">{error}</p>
                        )}

                        <div className="flex justify-between gap-4 pt-4">
                            <motion.button
                                onClick={() => router.push('/planner/dates')}
                                className="px-6 py-3 rounded-lg text-[#377c68] hover:text-[#4ba46c] transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Back
                            </motion.button>
                            <motion.button
                                onClick={handleNext}
                                className="bg-[#f3a034] text-white px-8 py-3 rounded-lg shadow-lg hover:bg-[#f3a034]/90 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Next Step
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
} 