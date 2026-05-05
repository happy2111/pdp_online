"use client";

import { useEffect } from "react";
import {useAuthStore} from "@/stores/auth-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((s) => s.initAuth);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    initializeAuth();
  }, []);

  if (!initialized) {
    return<div className="flex items-center justify-center min-h-screen bg-background/50 backdrop-blur-sm">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>;
  }

  return <>{children}</>;
}