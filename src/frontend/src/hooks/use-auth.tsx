import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Identity } from "@icp-sdk/core/agent";

export interface AuthState {
  /** The current identity (undefined if not logged in) */
  identity: Identity | undefined;
  /** True when identity is available */
  isAuthenticated: boolean;
  /** True while identity is being initialized from storage */
  isInitializing: boolean;
  /** Start Internet Identity login flow */
  login: () => void;
  /** Clear identity and log out */
  logout: () => void;
  /** Principal as string, or null if not authenticated */
  principalText: string | null;
}

/**
 * Wraps InternetIdentity context with convenience helpers.
 */
export function useAuth(): AuthState {
  const { identity, login, clear, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const principalText = identity ? identity.getPrincipal().toText() : null;

  return {
    identity,
    isAuthenticated,
    isInitializing,
    login,
    logout: clear,
    principalText,
  };
}
