import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AuthResponse,
  LoginSchema, LoginSchemaType,
  RegisterSchemaType
} from "@/schemas/auth-schema";
import { AuthService } from "@/services/auth-service";
import {toast} from "sonner";

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rehydrated: boolean,

  login: (data: LoginSchemaType, router: any, t: any, redirect: string) => Promise<void>;
  register: (data: RegisterSchemaType, router: any, t: any) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthResponse | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      rehydrated: false,

      login: async (data, router, t, redirect) => {
        set({ isLoading: true });
        try {
          const response = await AuthService.login(data);

          if (response.code === 0) {
            toast.success("Login successful!");
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
            router.push(redirect);
          } else {
            toast.error(t(`errors.${response.code}`) || "Login failed. Please check your credentials and try again.");
            set({ isLoading: false });
          }
        } catch (error:any) {
          toast.error(t(`errors.${error?.code}`) || "Login failed. Please check your credentials and try again.");
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data, router, t) => {
        set({ isLoading: true });
        try {
          const response = await AuthService.register(data);

          if (response.code === 1) {
            toast.success(t("auth.register.success"));
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false
            });
            router.push("/");
          } else {
            toast.error(t(`errors.${response.code}`) || "Login failed. Please check your credentials and try again.");
            set({ isLoading: false });
          }
        } catch (error: any) {
          toast.error(t(`errors.${error?.code}`) || "Login failed. Please check your credentials and try again.");
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.rehydrated = true
        }
      }
    }
  )
);