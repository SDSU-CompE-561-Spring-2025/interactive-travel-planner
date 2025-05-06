// src/store/plannerStore.ts
import { create } from 'zustand';

interface PlannerState {
    tripName: string;
    budget: string;
    activities: string[];
    destination: string;
    dates: { start: string; end: string };
    collaborators: string[]; 
    setField: (field: string, value: any) => void;
  }

  export const usePlannerStore = create<PlannerState>((set) => ({
    tripName: '',
    budget: '',
    activities: [],
    destination: '',
    dates: { start: '', end: '' },
    collaborators: [], 
    setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  }));
  