/**
 * WhatsApp template helpers — render {{variables}} and build wa.me links.
 * Variables are read from app_settings.whatsapp_business_number and
 * the default row in whatsapp_templates.
 */

export const TEMPLATE_VARIABLES = [
  { key: "name", label: "Name", sample: "Sarah" },
  { key: "strain", label: "Strain", sample: "Blue Dream" },
  { key: "compatibility", label: "Compatibility", sample: "94%" },
  { key: "shop_url", label: "Shop URL", sample: "https://healingbuds.co.za/shop" },
  { key: "province", label: "Province", sample: "Gauteng" },
  { key: "thc", label: "THC %", sample: "18" },
  { key: "cbd", label: "CBD %", sample: "1" },
  { key: "strain_type", label: "Strain Type", sample: "Hybrid" },
  { key: "email", label: "Customer Email", sample: "sarah@example.com" },
  { key: "whatsapp", label: "Customer WhatsApp", sample: "+27 82 123 4567" },
] as const;

export type TemplateVarKey = (typeof TEMPLATE_VARIABLES)[number]["key"];

export interface LeadLike {
  name?: string | null;
  matched_strain?: string | null;
  compatibility?: string | null;
  strain_shop_url?: string | null;
  province?: string | null;
  strain_thc?: string | null;
  strain_cbd?: string | null;
  email?: string | null;
  whatsapp?: string | null;
}

export const getLeadVars = (lead: LeadLike): Record<TemplateVarKey, string> => ({
  name: (lead.name || "there").split(" ")[0],
  strain: lead.matched_strain || "your strain match",
  compatibility: lead.compatibility || "",
  shop_url: lead.strain_shop_url || "",
  province: lead.province || "",
  thc: lead.strain_thc || "",
  cbd: lead.strain_cbd || "",
  strain_type: "",
  email: lead.email || "",
  whatsapp: lead.whatsapp || "",
});

export const getSampleVars = (): Record<TemplateVarKey, string> =>
  TEMPLATE_VARIABLES.reduce(
    (acc, v) => ({ ...acc, [v.key]: v.sample }),
    {} as Record<TemplateVarKey, string>
  );

export const renderTemplate = (
  body: string,
  vars: Record<string, string>
): string =>
  body.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => vars[key] ?? "");

export const extractVariables = (body: string): string[] => {
  const set = new Set<string>();
  const re = /\{\{\s*(\w+)\s*\}\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) set.add(m[1]);
  return Array.from(set);
};

export const buildWaLink = (
  recipientNumber: string | null | undefined,
  message: string
): string | null => {
  if (!recipientNumber) return null;
  const digits = recipientNumber.replace(/[^0-9]/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

export const FALLBACK_WA_TEMPLATE =
  "🌿 *NEW BIO-MAPPING LEAD* 🌿\n━━━━━━━━━━━━━━━\n\n👤 *Customer*\n• Name: {{name}}\n• WhatsApp: {{whatsapp}}\n• Email: {{email}}\n• Province: {{province}}\n\n🎯 *Match Result*\n• Strain: *{{strain}}*\n• Type: {{strain_type}}\n• Compatibility: *{{compatibility}}*\n\n🧪 *Product Specs*\n• THC: {{thc}}%\n• CBD: {{cbd}}%\n• Shop: {{shop_url}}\n\n━━━━━━━━━━━━━━━\n_Please follow up with this lead._";

export const CUSTOMER_FALLBACK_WA_TEMPLATE =
  "🌿 *Your Healing Buds Match* 🌿\n━━━━━━━━━━━━━━━\n\nHi {{name}}! Here's your personal bio-mapping result:\n\n🎯 *Your #1 Match*\n• {{strain}} ({{strain_type}})\n• Compatibility: *{{compatibility}}*\n• THC {{thc}}% · CBD {{cbd}}%\n\n📍 Province: {{province}}\n\n━━━━━━━━━━━━━━━\nKeep this for your records — our consultants will be in touch shortly. 💚";

// Hardcoded fallback business number (matches app_settings seed value)
export const FALLBACK_BUSINESS_NUMBER = "+351939455949";

import { supabase } from "@/integrations/supabase/client";

let cached: { businessNumber: string; body: string } | null = null;

export const loadDefaultWaConfig = async (): Promise<{ businessNumber: string; body: string }> => {
  if (cached) return cached;
  try {
    const [settingRes, tplRes] = await Promise.all([
      supabase.from("app_settings").select("value").eq("key", "whatsapp_business_number").maybeSingle(),
      supabase.from("whatsapp_templates").select("body").eq("is_default", true).maybeSingle(),
    ]);
    const raw = settingRes.data?.value as unknown;
    const num = typeof raw === "string" ? raw : (raw && typeof raw === "object" ? String(raw) : "");
    cached = {
      businessNumber: num || FALLBACK_BUSINESS_NUMBER,
      body: tplRes.data?.body || FALLBACK_WA_TEMPLATE,
    };
  } catch {
    cached = { businessNumber: FALLBACK_BUSINESS_NUMBER, body: FALLBACK_WA_TEMPLATE };
  }
  return cached;
};

export const buildMatchWaLink = (
  businessNumber: string,
  body: string,
  vars: Record<string, string>
): string | null => buildWaLink(businessNumber, renderTemplate(body, vars));

export const buildCustomerWaLink = (
  customerNumber: string | null | undefined,
  vars: Record<string, string>
): string | null =>
  buildWaLink(customerNumber, renderTemplate(CUSTOMER_FALLBACK_WA_TEMPLATE, vars));

