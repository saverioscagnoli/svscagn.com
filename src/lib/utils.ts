import { type ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function calcAge(birthday: Date, now = new Date()): number {
  let age = now.getFullYear() - birthday.getFullYear();
  const monthDiff = now.getMonth() - birthday.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birthday.getDate())
  ) {
    age--;
  }

  return age;
}

function rng(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function flip(): boolean {
  return Math.random() < 0.5;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng(0, arr.length - 1))];
}

function getRandomColor(): string {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
}

export { cn, calcAge, rng, flip, pick, getRandomColor };
