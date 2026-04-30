import {AuthService} from "@/services/auth-service";

let refreshPromise: Promise<any> | null = null

export const getOrCreateRefreshPromise = (
  onSuccess: () => void,
  onFailure: () => void
) => {
  if (refreshPromise) return refreshPromise

  refreshPromise = AuthService.refresh()
    .then(onSuccess)
    .catch(onFailure)
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}