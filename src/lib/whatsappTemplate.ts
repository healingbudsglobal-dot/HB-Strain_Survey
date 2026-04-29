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
] as const;

export type TemplateVarKey = (typeof TEMPLATE_VARIABLES)[number]["key"];

export interface LeadLike {
  name?: string | null;
  matched_strain?: string | null;
  compatibility?: string | null;
  strain_shop_url?: string | null;
  province?: string | null;
}

export const getLeadVars = (lead: LeadLike): Record<TemplateVarKey, string> => ({
  name: (lead.name || "there").split(" ")[0],
  strain: lead.matched_strain || "your strain match",
  compatibility: lead.compatibility || "",
  shop_url: lead.strain_shop_url || "",
  province: lead.province || "",
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
