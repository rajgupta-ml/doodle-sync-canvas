
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

// Simple user session management
export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "typing";
  color: string;
}

const COLORS = [
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
];

export function generateUser(): User {
  return {
    id: uuidv4(),
    name: faker.person.fullName(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(7)}`,
    status: "online",
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

// Simulated current user
export const currentUser = generateUser();

// Simulated team members
export const teamMembers: User[] = Array(3)
  .fill(0)
  .map(() => generateUser());

// All users including current user
export const allUsers = [currentUser, ...teamMembers];
