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

  login: (data: LoginSchemaType, router: any, t: any) => Promise<void>;
  register: (data: RegisterSchemaType, router: any, t: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data, router, t) => {
        set({ isLoading: true });
        try {
          const response = await AuthService.login(data);

          if (response.code === 200) {
            toast.success("Login successful!");
            router.push("/");
          } else {
            toast.error(t(`errors.${response.code}`) || "Login failed. Please check your credentials and try again.");
          }

          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
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

          if (response.code === 200) {
            toast.success(t("auth.register.success"));
            router.push("/");
          }else {
            toast.error(t(`errors.${response.code}`) || "Login failed. Please check your credentials and try again.");
          }
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error: any) {
          toast.error(t(`errors.${error?.code}`) || "Login failed. Please check your credentials and try again.");
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);