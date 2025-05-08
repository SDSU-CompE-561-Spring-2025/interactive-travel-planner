import { create } from 'zustand';

// src/store/plannerStore.ts
import { create } from 'zustand';

// UUID for tripID
type UUID = string;

interface Collaborator {
    id: string;
    name: string;
  }
  
  interface PlannerState {
    tripId: UUID | null;
    tripName: string;
    budget: string;
    activities: string[];
    destination: string;
    dates: { start: string; end: string };
    collaborators: Collaborator[];
    returnToReview: boolean;
    setField: (field: string, value: any) => void;
  }
  

  export const usePlannerStore = create<PlannerState>((set) => ({
    tripId: null,
    tripName: '',
    budget: '',
    activities: [],
    destination: '',
    dates: { start: '', end: '' },
    collaborators: [], 
    returnToReview: false,
    setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  }));
  