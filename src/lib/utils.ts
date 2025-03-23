import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Generate a random color
export const getRandomHSL = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 31) + 70;
  const lightness = Math.floor(Math.random() * 21) + 40;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// check if two dates are the same
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}