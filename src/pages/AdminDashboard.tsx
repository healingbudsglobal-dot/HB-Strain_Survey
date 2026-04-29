import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Search, Download, Users, TrendingUp, Calendar, MessageCircle, CheckCircle2, Circle, Settings } from "lucide-react";
import { motion } from "framer-motion";
import hbLogoWhite from "@/assets/hb-logo-white-full.png";
import { renderTemplate, buildWaLink, getLeadVars } from "@/lib/whatsappTemplate";

interface Lead {
  id: string;
  created_at: string;
  email: string;
  name: string | null;
  whatsapp: string | null;
  whatsapp_e164: string | null;
  whatsapp_opt_in: boolean;
  contacted: boolean;
  contacted_at: string | null;
  pipeline_status: string;
  province: string | null;
  matched_strain: string | null;
  compatibility: string | null;
  strain_shop_url: string | null;
  survey_answers: Record<string, string> | null;
}

interface LeadEvent {
  id: string;
  event_type: string;
  payload: Record<string, any>;
  created_at: string;
}

type PipelineStatus = "new" | "contacted" | "customer";
const PIPELINE_STAGES: { value: PipelineStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-muted text-muted-foreground" },
  { value: "contacted", label: "Contacted", color: "bg-amber-500/15 text-amber-700 dark:text-amber-400" },
  { value: "customer", label: "Customer", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
];

const FALLBACK_TEMPLATE =
  "Hi {{name}}, this is Healing Buds 🌿\n\nYour Bio-Map strain match is *{{strain}}* ({{compatibility}} compatibility).\n\nReply here for personalised dosing guidance.";
const FALLBACK_NUMBER = "+351939455949";


const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showUncontactedOnly, setShowUncontactedOnly] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [senderNumber, setSenderNumber] = useState<string>(FALLBACK_NUMBER);
  const [defaultTemplate, setDefaultTemplate] = useState<string>(FALLBACK_TEMPLATE);
  const [timeline, setTimeline] = useState<LeadEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const navigate = useNavigate();

  const buildWhatsAppLink = (lead: Lead): string | null => {
    const recipient = lead.whatsapp_e164 || lead.whatsapp;
    const message = renderTemplate(defaultTemplate, getLeadVars(lead));
    return buildWaLink(recipient, message);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      fetchLeads();
      loadConfig();
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  };

  const loadConfig = async () => {
    const [{ data: settings }, { data: tmpl }] = await Promise.all([
      supabase.from("app_settings").select("key, value").eq("key", "whatsapp_business_number").maybeSingle(),
      supabase.from("whatsapp_templates").select("body").eq("is_default", true).maybeSingle(),
    ]);
    if (settings?.value) setSenderNumber(String(settings.value));
    if (tmpl?.body) setDefaultTemplate(tmpl.body);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  // toggleContacted removed — replaced by setPipelineStatus

  const logEvent = async (leadId: string, event_type: string, payload: Record<string, any> = {}) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("lead_events").insert({
      lead_id: leadId,
      event_type,
      payload,
      created_by: user?.id ?? null,
    });
  };

  const setPipelineStatus = async (lead: Lead, next: PipelineStatus, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lead.pipeline_status === next) return;
    const prev = lead.pipeline_status;
    const contactedFlag = next !== "new";
    const contactedAt = contactedFlag ? new Date().toISOString() : null;
    setLeads((prevLeads) =>
      prevLeads.map((l) =>
        l.id === lead.id
          ? { ...l, pipeline_status: next, contacted: contactedFlag, contacted_at: contactedAt }
          : l
      )
    );
    if (selectedLead?.id === lead.id) {
      setSelectedLead({ ...lead, pipeline_status: next, contacted: contactedFlag, contacted_at: contactedAt });
    }
    await supabase
      .from("leads")
      .update({ pipeline_status: next, contacted: contactedFlag, contacted_at: contactedAt })
      .eq("id", lead.id);
    await logEvent(lead.id, "status_changed", { from: prev, to: next });
    if (selectedLead?.id === lead.id) loadTimeline(lead.id);
  };

  const openWhatsApp = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = buildWhatsAppLink(lead);
    if (!link) return;
    window.open(link, "_blank", "noopener,noreferrer");
    logEvent(lead.id, "whatsapp_clicked", { number: lead.whatsapp_e164 || lead.whatsapp });
    // Auto-advance to "contacted" if still new
    if (lead.pipeline_status === "new") setPipelineStatus(lead, "contacted");
  };

  const loadTimeline = async (leadId: string) => {
    setTimelineLoading(true);
    const { data } = await supabase
      .from("lead_events")
      .select("id, event_type, payload, created_at")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(50);
    setTimeline((data as LeadEvent[]) || []);
    setTimelineLoading(false);
  };

  const filteredLeads = leads
    .filter((l) => (showUncontactedOnly ? l.pipeline_status === "new" : true))
    .filter((l) => {
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        l.email.toLowerCase().includes(q) ||
        (l.name?.toLowerCase().includes(q) ?? false) ||
        (l.matched_strain?.toLowerCase().includes(q) ?? false) ||
        (l.province?.toLowerCase().includes(q) ?? false)
      );
    });

  const exportCSV = () => {
    const headers = ["Date", "Name", "Email", "WhatsApp", "Opt-In", "Contacted", "Province", "Strain", "Compatibility"];
    const rows = filteredLeads.map((l) => [
      new Date(l.created_at).toLocaleDateString("en-ZA"),
      l.name || "",
      l.email,
      l.whatsapp_e164 || l.whatsapp || "",
      l.whatsapp_opt_in ? "Yes" : "No",
      l.contacted ? "Yes" : "No",
      l.province || "",
      l.matched_strain || "",
      l.compatibility || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `healing-buds-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const todayCount = leads.filter(
    (l) => new Date(l.created_at).toDateString() === new Date().toDateString()
  ).length;

  const uncontactedCount = leads.filter((l) => !l.contacted && (l.whatsapp_e164 || l.whatsapp)).length;

  const surveyLabels: Record<string, string> = {
    exp_level: "Experience Level",
    primary_vibe: "Desired Vibe",
    specific_benefit: "Primary Benefit",
    body_impact: "Body Impact",
    terpene_pref: "Terpene Preference",
    consumption_format: "Consumption Method",
    time_of_day: "Time of Day",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={hbLogoWhite} alt="Healing Buds" className="h-7" />
            <span className="text-sm font-semibold text-muted-foreground">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] text-muted-foreground">
              Sender: <span className="text-foreground font-mono">{senderNumber}</span>
            </span>
            <Link
              to="/admin/settings"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{leads.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Today</span>
            </div>
            <p className="text-2xl font-bold text-[hsl(var(--accent-green))]">{todayCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">To Contact</span>
            </div>
            <p className="text-2xl font-bold text-[hsl(var(--brand-gold))]">{uncontactedCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Top Strain</span>
            </div>
            <p className="text-sm font-bold text-[hsl(var(--brand-gold))] truncate">
              {leads.length > 0
                ? Object.entries(
                    leads.reduce((acc, l) => {
                      if (l.matched_strain) acc[l.matched_strain] = (acc[l.matched_strain] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
                : "—"}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, strain, province…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-input pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowUncontactedOnly((v) => !v)}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                showUncontactedOnly
                  ? "border-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green)_/_0.1)] text-[hsl(var(--accent-green))]"
                  : "border-border text-foreground hover:bg-accent"
              }`}
            >
              {showUncontactedOnly ? "✓ Uncontacted" : "Uncontacted only"}
            </button>
            <button
              onClick={fetchLeads}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">Loading leads…</div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Users className="h-12 w-12 mb-3 opacity-30" />
            <p>{search || showUncontactedOnly ? "No leads match your filters" : "No leads yet"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground w-8"></th>
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">WhatsApp</th>
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground">Strain</th>
                  <th className="px-3 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const waLink = buildWhatsAppLink(lead);
                  const displayPhone = lead.whatsapp_e164 || lead.whatsapp;
                  return (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`border-b border-border hover:bg-accent/50 cursor-pointer transition-colors ${
                        lead.contacted ? "opacity-60" : ""
                      }`}
                      onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
                    >
                      <td className="px-3 py-3">
                        <button
                          onClick={(e) => toggleContacted(lead, e)}
                          title={lead.contacted ? "Mark uncontacted" : "Mark contacted"}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {lead.contacted ? (
                            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--accent-green))]" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString("en-ZA", { day: "2-digit", month: "short" })}
                      </td>
                      <td className="px-3 py-3 font-medium text-foreground">{lead.name || "—"}</td>
                      <td className="px-3 py-3 text-[hsl(var(--accent-green))] hidden sm:table-cell">{lead.email}</td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        {displayPhone ? (
                          <span className="font-mono text-xs text-foreground">
                            {displayPhone}
                            {lead.whatsapp_opt_in && (
                              <span className="ml-1.5 text-[10px] text-[hsl(var(--accent-green))]">✓ opt-in</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 font-semibold text-[hsl(var(--brand-gold))]">
                        {lead.matched_strain || "—"}
                        {lead.compatibility && (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">{lead.compatibility}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {waLink ? (
                          <button
                            onClick={(e) => openWhatsApp(lead, e)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 transition-all"
                            title={`Send WhatsApp from ${senderNumber}`}
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">No phone</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Lead detail panel */}
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{selectedLead.name || "Anonymous"}</h3>
                <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                {selectedLead.contacted && selectedLead.contacted_at && (
                  <p className="text-[11px] text-[hsl(var(--accent-green))] mt-1">
                    ✓ Contacted {new Date(selectedLead.contacted_at).toLocaleString("en-ZA")}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">WhatsApp</p>
                <p className="text-sm font-mono text-foreground">{selectedLead.whatsapp_e164 || selectedLead.whatsapp || "—"}</p>
                {selectedLead.whatsapp_opt_in && (
                  <p className="text-[10px] text-[hsl(var(--accent-green))]">✓ Opted in</p>
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Province</p>
                <p className="text-sm font-medium text-foreground">{selectedLead.province || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Strain</p>
                <p className="text-sm font-bold text-[hsl(var(--brand-gold))]">{selectedLead.matched_strain || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Compatibility</p>
                <p className="text-sm font-bold text-[hsl(var(--accent-green))]">{selectedLead.compatibility || "—"}</p>
              </div>
            </div>
            {selectedLead.survey_answers && Object.keys(selectedLead.survey_answers).length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Survey Answers</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {Object.entries(selectedLead.survey_answers).map(([key, val]) => (
                    <div key={key} className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{surveyLabels[key] || key}</p>
                      <p className="text-sm text-foreground">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
