import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Star, Trash2, Save, Loader2, Phone, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import hbLogoWhite from "@/assets/hb-logo-white-full.png";
import {
  TEMPLATE_VARIABLES,
  renderTemplate,
  extractVariables,
  getSampleVars,
} from "@/lib/whatsappTemplate";

interface Template {
  id: string;
  name: string;
  body: string;
  is_default: boolean;
  variables: string[];
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingNumber, setSavingNumber] = useState(false);
  const [savingChannel, setSavingChannel] = useState(false);

  const [waNumber, setWaNumber] = useState("");
  const [channelPriority, setChannelPriority] = useState("whatsapp_first");
  const [templates, setTemplates] = useState<Template[]>([]);
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      await Promise.all([loadSettings(), loadTemplates()]);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const loadSettings = async () => {
    const { data } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", ["whatsapp_business_number", "channel_priority"]);
    data?.forEach((row: any) => {
      if (row.key === "whatsapp_business_number") setWaNumber(String(row.value || ""));
      if (row.key === "channel_priority") setChannelPriority(String(row.value || "whatsapp_first"));
    });
  };

  const loadTemplates = async () => {
    const { data } = await supabase
      .from("whatsapp_templates")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });
    if (data) {
      setTemplates(
        data.map((t: any) => ({
          id: t.id,
          name: t.name,
          body: t.body,
          is_default: t.is_default,
          variables: Array.isArray(t.variables) ? t.variables : [],
        }))
      );
    }
  };

  const saveNumber = async () => {
    setSavingNumber(true);
    const { error } = await supabase
      .from("app_settings")
      .update({ value: waNumber, updated_at: new Date().toISOString() })
      .eq("key", "whatsapp_business_number");
    setSavingNumber(false);
    if (error) toast.error("Could not save number");
    else toast.success("WhatsApp number updated");
  };

  const saveChannel = async (next: string) => {
    setChannelPriority(next);
    setSavingChannel(true);
    const { error } = await supabase
      .from("app_settings")
      .update({ value: next, updated_at: new Date().toISOString() })
      .eq("key", "channel_priority");
    setSavingChannel(false);
    if (error) toast.error("Could not save channel");
    else toast.success("Channel priority updated");
  };

  const updateTemplateField = (id: string, field: keyof Template, value: any) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const saveTemplate = async (t: Template) => {
    const variables = extractVariables(t.body);
    const { error } = await supabase
      .from("whatsapp_templates")
      .update({
        name: t.name,
        body: t.body,
        variables,
        updated_at: new Date().toISOString(),
      })
      .eq("id", t.id);
    if (error) toast.error(`Save failed: ${error.message}`);
    else {
      toast.success("Template saved");
      updateTemplateField(t.id, "variables", variables);
    }
  };

  const setDefault = async (id: string) => {
    // Clear all, then set chosen
    await supabase.from("whatsapp_templates").update({ is_default: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    const { error } = await supabase.from("whatsapp_templates").update({ is_default: true }).eq("id", id);
    if (error) {
      toast.error("Could not set default");
      return;
    }
    toast.success("Default template updated");
    setTemplates((prev) => prev.map((t) => ({ ...t, is_default: t.id === id })));
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    const { error } = await supabase.from("whatsapp_templates").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else {
      toast.success("Template deleted");
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const addTemplate = async () => {
    const { data, error } = await supabase
      .from("whatsapp_templates")
      .insert({
        name: "New Template",
        body: "Hi {{name}}, ",
        variables: ["name"],
        is_default: false,
      })
      .select()
      .single();
    if (error || !data) {
      toast.error("Could not create template");
      return;
    }
    setTemplates((prev) => [
      ...prev,
      {
        id: data.id,
        name: data.name,
        body: data.body,
        is_default: data.is_default,
        variables: Array.isArray(data.variables) ? (data.variables as string[]) : [],
      },
    ]);
  };

  const insertVariable = (templateId: string, varKey: string) => {
    const ta = textareaRefs.current[templateId];
    if (!ta) return;
    const insert = `{{${varKey}}}`;
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    const t = templates.find((x) => x.id === templateId);
    if (!t) return;
    const next = t.body.slice(0, start) + insert + t.body.slice(end);
    updateTemplateField(templateId, "body", next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + insert.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={hbLogoWhite} alt="Healing Buds" className="h-7" />
            <span className="text-sm font-semibold text-muted-foreground">Admin · Settings</span>
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-8">
        {/* Channel & Number */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Channel & Sender</h2>
          </div>

          <label className="block text-sm font-medium text-foreground mb-1">
            Business WhatsApp Number
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Used as the sender shown in admin and (later) for auto-send. Use full E.164 format, e.g. <code>+351939455949</code>.
          </p>
          <div className="flex gap-2">
            <input
              type="tel"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="+351939455949"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={saveNumber}
              disabled={savingNumber}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {savingNumber ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
          </div>

          <div className="mt-5 pt-5 border-t border-border">
            <label className="block text-sm font-medium text-foreground mb-2">
              Delivery Channel Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { v: "whatsapp_first", label: "WhatsApp first" },
                { v: "email_first", label: "Email first" },
                { v: "user_choice", label: "User picks" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => saveChannel(opt.v)}
                  disabled={savingChannel}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    channelPriority === opt.v
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-accent"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Templates */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Message Templates</h2>
            </div>
            <button
              onClick={addTemplate}
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              <Plus className="h-4 w-4" /> New
            </button>
          </div>

          <div className="space-y-4">
            {templates.map((t) => {
              const sample = getSampleVars();
              const preview = renderTemplate(t.body, sample);
              return (
                <div key={t.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <input
                      value={t.name}
                      onChange={(e) => updateTemplateField(t.id, "name", e.target.value)}
                      className="flex-1 min-w-[180px] rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    {t.is_default ? (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                        <Star className="h-3 w-3 fill-current" /> Default
                      </span>
                    ) : (
                      <button
                        onClick={() => setDefault(t.id)}
                        className="px-3 py-1.5 rounded-md border border-input bg-background text-xs font-medium text-foreground hover:bg-accent"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteTemplate(t.id)}
                      disabled={t.is_default}
                      title={t.is_default ? "Cannot delete the default template" : "Delete"}
                      className="p-1.5 rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <textarea
                    ref={(el) => (textareaRefs.current[t.id] = el)}
                    value={t.body}
                    onChange={(e) => updateTemplateField(t.id, "body", e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                    placeholder="Hi {{name}}, your match is {{strain}}..."
                  />

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">Insert:</span>
                    {TEMPLATE_VARIABLES.map((v) => (
                      <button
                        key={v.key}
                        onClick={() => insertVariable(t.id, v.key)}
                        className="px-2 py-1 rounded-md bg-muted text-xs font-mono text-foreground hover:bg-accent transition-colors"
                      >
                        {`{{${v.key}}}`}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 rounded-lg bg-muted/50 p-3 border border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                      Preview (sample data)
                    </p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{preview}</p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => saveTemplate(t)}
                      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                    >
                      <Save className="h-4 w-4" /> Save Template
                    </button>
                  </div>
                </div>
              );
            })}
            {templates.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No templates yet. Click "New" to create one.
              </p>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default AdminSettings;
