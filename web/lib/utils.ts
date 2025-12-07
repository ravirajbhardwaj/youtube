import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};