import { useEffect, useState } from "react";
import { API_ORIGIN } from "../utils/productsApi";

let storefrontCache = null;
let storefrontRequest = null;

export const useStorefront = () => {
  const [storefront, setStorefront] = useState(storefrontCache);

  useEffect(() => {
    if (storefrontCache) {
      setStorefront(storefrontCache);
      return;
    }
    if (!storefrontRequest) {
      storefrontRequest = fetch(`${API_ORIGIN}/storefront`)
        .then((response) => response.ok ? response.json() : null)
        .then((data) => {
          storefrontCache = data?.storefront || null;
          return storefrontCache;
        })
        .finally(() => {
          storefrontRequest = null;
        });
    }
    let active = true;
    storefrontRequest
      .then((data) => {
        if (active) setStorefront(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return storefront;
};
