import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Broadcasts the current user's presence on a shared channel.
 * Call this once at app level so the user appears online.
 */
export function usePresenceBroadcast() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel("online-users", {
      config: { presence: { key: user.id } },
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ user_id: user.id });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
}
