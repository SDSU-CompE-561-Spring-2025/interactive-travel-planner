// src/store/plannerStore.ts
import { create } from 'zustand';

interface Collaborator {
    id: string;
    name: string;
  }
  
  interface PlannerState {
    tripId: number | null;
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
    tripId: 0,
    tripName: '',
    budget: '',
    activities: [],
    destination: '',
    dates: { start: '', end: '' },
    collaborators: [], 
    returnToReview: false,
    setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  }));
  