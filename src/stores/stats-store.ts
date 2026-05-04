import { StatsSchema } from "@/schemas/stats-scheam";
import { create } from "zustand";
import { StatsService } from "@/services/stats-service";

interface StatsStore {
  stats: StatsSchema | null;
  isLoading: boolean;

  fetchStats: () => Promise<void>;
  resetStats: () => void;
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: null,
  isLoading: false,

  fetchStats: async () => {
    if (get().stats) return;

    try {
      set({ isLoading: true });

      const res = await StatsService.getStats();

      set({ stats: res.data });
    } catch (e) {
      console.error("Stats error:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  resetStats: () => set({ stats: null }),
}));