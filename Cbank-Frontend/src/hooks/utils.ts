import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge
 * @param inputs - Class names or conditional class objects
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a more readable format
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Truncates a string to a specified length
 * @param str - String to truncate
 * @param length - Maximum length of the string
 * @returns Truncated string
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Debounces a function
 * @param func - Function to debounce
 * @param wait - Time to wait before calling the function
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generates a random color
 * @returns Random color in hexadecimal format
 */
export function getRandomColor(): string {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

/**
 * Checks if an object is empty
 * @param obj - Object to check
 * @returns Boolean indicating if the object is empty
 */
export function isObjectEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}
