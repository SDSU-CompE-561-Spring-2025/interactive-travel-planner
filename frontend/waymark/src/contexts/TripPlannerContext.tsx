'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TripPlannerData {
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    activities: string[];
    budget: number;
    collaborators: string[];
    color: string;
}

interface TripPlannerContextType {
    tripData: TripPlannerData;
    updateTripData: (field: keyof TripPlannerData, value: any) => void;
    resetTripData: () => void;
}

const defaultTripData: TripPlannerData = {
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    activities: [],
    budget: 0,
    collaborators: [],
    color: '#e9f1ef',
};

const TripPlannerContext = createContext<TripPlannerContextType | undefined>(undefined);

export function TripPlannerProvider({ children }: { children: ReactNode }) {
    const [tripData, setTripData] = useState<TripPlannerData>(defaultTripData);

    const updateTripData = (field: keyof TripPlannerData, value: any) => {
        setTripData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetTripData = () => {
        setTripData(defaultTripData);
    };

    return (
        <TripPlannerContext.Provider value={{ tripData, updateTripData, resetTripData }}>
            {children}
        </TripPlannerContext.Provider>
    );
}

export function useTripPlanner() {
    const context = useContext(TripPlannerContext);
    if (context === undefined) {
        throw new Error('useTripPlanner must be used within a TripPlannerProvider');
    }
    return context;
}
