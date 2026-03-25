"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: { id: string; phone: string; name: string | null; language: string } | null;
  businessId: string | null;
  setAuth: (data: { token: string; refreshToken: string; user: any; businessId?: string }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      businessId: null,
      setAuth: (data) =>
        set({
          token: data.token,
          refreshToken: data.refreshToken,
          user: data.user,
          businessId: data.businessId || null,
        }),
      logout: () =>
        set({ token: null, refreshToken: null, user: null, businessId: null }),
      isAuthenticated: () => !!get().token,
    }),
    { name: "badhiya-auth" },
  ),
);
