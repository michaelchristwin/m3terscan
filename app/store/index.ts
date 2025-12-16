import { create } from "zustand";

interface TimeState {
  selectedMonth: number;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
}

interface CoordinatesState {
  lat: number;
  lng: number;
  setLat: (newLat: number) => void;
  setLng: (newLng: number) => void;
}

export const useTimeStore = create<TimeState>()((set) => ({
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  setSelectedYear: (newYear) => set(() => ({ selectedYear: newYear })),
  setSelectedMonth: (newMonth) => set(() => ({ selectedMonth: newMonth })),
}));

export const useMapStore = create<CoordinatesState>()((set) => ({
  lat: 6.5244,
  lng: 3.3792,
  setLat: (newLat) => set(() => ({ lat: newLat })),
  setLng: (newLng) => set(() => ({ lng: newLng })),
}));
