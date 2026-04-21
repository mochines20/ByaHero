import { create } from "zustand";

export type Trip = {
  id: string;
  origin: string;
  destination: string;
  transportType: "jeepney" | "mrt" | "lrt" | "bus" | "etrike" | "walk" | "grab";
  fare: number;
  travelTime: number;
  tripDate: string;
  notes?: string;
};

type TripStore = {
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  removeTrip: (id: string) => void;
};

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  setTrips: (trips) => set({ trips }),
  addTrip: (trip) => set((s) => ({ trips: [trip, ...s.trips] })),
  removeTrip: (id) => set((s) => ({ trips: s.trips.filter((t) => t.id !== id) })),
}));
