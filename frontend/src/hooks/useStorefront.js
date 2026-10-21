import { useSyncExternalStore } from "react";
import { API_ORIGIN } from "../utils/productsApi";

let storefrontCache = null;
let storefrontRequest = null;
let refreshTimer = null;
const listeners = new Set();

const refreshStorefront = () => {
  if (storefrontRequest) return storefrontRequest;

  storefrontRequest = fetch(`${API_ORIGIN}/storefront`, { cache: "no-store" })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => {
      const nextStorefront = data?.storefront || null;
      const hasChanged = JSON.stringify(nextStorefront) !== JSON.stringify(storefrontCache);
      storefrontCache = nextStorefront;
      if (hasChanged) listeners.forEach((listener) => listener());
      return storefrontCache;
    })
    .catch(() => storefrontCache)
    .finally(() => {
      storefrontRequest = null;
    });

  return storefrontRequest;
};

const subscribe = (listener) => {
  listeners.add(listener);
  if (listeners.size === 1) {
    refreshStorefront();
    refreshTimer = window.setInterval(refreshStorefront, 5000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && refreshTimer) {
      window.clearInterval(refreshTimer);
      refreshTimer = null;
    }
  };
};

const getSnapshot = () => storefrontCache;

export const useStorefront = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
