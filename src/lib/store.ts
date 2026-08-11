import { useSyncExternalStore } from "react";
import type { CartItem } from "./design";
import type { RegionCode } from "./catalog";

type State = { cart: CartItem[]; region: RegionCode };

const KEY = "jannar-state-v1";
let state: State = { cart: [], region: "PS" };
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

function commit(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const serverSnapshot: State = { cart: [], region: "PS" };
const getSnapshot = () => {
  load();
  return state;
};

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

export const addToCart = (item: CartItem) => commit({ ...state, cart: [...state.cart, item] });
export const removeFromCart = (id: string) =>
  commit({ ...state, cart: state.cart.filter((i) => i.id !== id) });
export const setQty = (id: string, qty: number) =>
  commit({
    ...state,
    cart: state.cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
  });
export const clearCart = () => commit({ ...state, cart: [] });
export const setRegion = (region: RegionCode) => commit({ ...state, region });