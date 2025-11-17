import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function calculateAge(birthday: Date, now = new Date()): number {
  let age = now.getFullYear() - birthday.getFullYear();
  let monthDiff = now.getMonth() - birthday.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birthday.getDate())
  ) {
    age--;
  }

  return age;
}

export { cn, calculateAge };
