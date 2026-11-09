"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/hooks/useMounted";

export interface LanyardSpotify {
  track_id: string;
  song: string;
  artist: string;
  album_art_url: string;
  album?: string;
}

export interface LanyardActivity {
  type: number;
  name: string;
  state?: string;
  details?: string;
  id?: string;
}

export interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: LanyardSpotify | null;
}

interface LanyardResponse {
  success: boolean;
  data?: LanyardData;
}

/**
 * Presencia Discord compartida por cualquier vista que necesite Lanyard.
 *
 * El ID se pasa desde `member.integrations.lanyardUserId`. Si no hay ID, el
 * hook queda inactivo sin lanzar peticiones. El estado `mounted` se resuelve con
 * `useSyncExternalStore` para evitar setState sincrónico dentro de un efecto.
 */
export function useLanyard(userId?: string) {
  const mounted = useMounted();
  const [data, setData] = useState<LanyardData | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    const fetchPresence = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        if (!res.ok) return;
        const json = (await res.json()) as LanyardResponse;
        if (active && json.success && json.data) {
          setData(json.data);
        }
      } catch {
        // Fallback silencioso en caso de error de red.
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [userId]);

  return { data, mounted };
}
