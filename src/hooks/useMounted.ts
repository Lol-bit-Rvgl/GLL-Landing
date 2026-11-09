"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Indica si el componente ya montó en el cliente sin llamar setState dentro de
 * un efecto. Evita el patrón `useEffect(() => setMounted(true), [])` y mantiene
 * el primer render del servidor estable.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
