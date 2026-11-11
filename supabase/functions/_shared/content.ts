import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import type { PricingCatalog, PricingDelivery } from "./pricing.ts";
import defaults from "./default-content.json" with { type: "json" };

export interface ServerSettings {
  catalog: PricingCatalog;
  delivery: PricingDelivery & { onlinePayment: boolean; payLater: boolean; onlineMethods: string[] };
  whatsapp: string;
}

/** Catalogue et livraison publiés depuis le dashboard, ou ceux d'origine si rien n'a été enregistré. */
export async function loadSettings(db: SupabaseClient): Promise<ServerSettings> {
  const { data } = await db.from("site_content").select("data").eq("id", "main").maybeSingle();
  const stored = (data?.data ?? {}) as Record<string, any>;
  const catalog = stored.catalog ?? {};
  return {
    catalog: {
      products: Array.isArray(catalog.products) ? catalog.products : defaults.catalog.products,
      ranges: Array.isArray(catalog.ranges) ? catalog.ranges : defaults.catalog.ranges,
      duos: Array.isArray(catalog.duos) ? catalog.duos : defaults.catalog.duos,
    },
    delivery: { ...defaults.delivery, ...(stored.delivery ?? {}) },
    whatsapp: stored.contact?.whatsapp ?? "2250100848479",
  };
}
