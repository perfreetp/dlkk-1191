import { create } from 'zustand';
import type { User } from '../types';
import { mockUsers, defaultCurrentUserId } from '../data/users';

interface UserState {
  users: User[];
  currentUserId: string;
  setCurrentUserId: (userId: string) => void;
  getCurrentUser: () => User | undefined;
  getUserById: (userId: string) => User | undefined;
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUserId: defaultCurrentUserId,
  setCurrentUserId: (userId: string) => set({ currentUserId: userId }),
  getCurrentUser: () => {
    const { users, currentUserId } = get();
    return users.find(u => u.id === currentUserId);
  },
  getUserById: (userId: string) => {
    const { users } = get();
    return users.find(u => u.id === userId);
  },
  fetchUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    set({ users: mockUsers });
  },
}));
