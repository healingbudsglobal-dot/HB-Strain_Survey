import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, RefreshCw } from "lucide-react";

interface EmailRow {
  id: string;
  created_at: string;
  recipient_email: string;
  template_name: string;
  subject: string | null;
  resend_id: string | null;
  status: string;
  error_message: string | null;
}

const ADMIN_EMAIL = "healingbudsglobal@gmail.com";

const statusBadge = (s: string) => {
  if (s === "sent") return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
  if (s === "failed") return "bg-red-500/15 text-red-700 dark:text-red-400";
  return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
};

export default function EmailLogPanel() {
  const [rows, setRows] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminOnly, setAdminOnly] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("email_send_log")
      .select("id,created_at,recipient_email,template_name,subject,resend_id,status,error_message")
      .order("created_at", { ascending: false })
      .limit(50);
    if (adminOnly) q = q.eq("recipient_email", ADMIN_EMAIL);
    const { data, error } = await q;
    if (error) console.error("email log fetch:", error);
    setRows((data ?? []) as EmailRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminOnly]);

  return (
    <section className="mb-6 rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-[hsl(var(--accent-green))]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Email Send Log
          </h3>
          <span className="text-xs text-muted-foreground">({rows.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={adminOnly}
              onChange={(e) => setAdminOnly(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Admin only ({ADMIN_EMAIL})
          </label>
          <button
            onClick={load}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-accent"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          {loading ? "Loading…" : "No emails logged yet."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-2 py-2">Sent</th>
                <th className="px-2 py-2">Template</th>
                <th className="px-2 py-2">Recipient</th>
                <th className="px-2 py-2">Subject</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="px-2 py-2 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}
                  </td>
                  <td className="px-2 py-2 text-xs">{r.template_name}</td>
                  <td className="px-2 py-2 text-xs">{r.recipient_email}</td>
                  <td className="px-2 py-2 text-xs">
                    <div className="max-w-[280px] truncate">{r.subject ?? "—"}</div>
                    {r.error_message && (
                      <div className="mt-1 text-[10px] text-red-500 truncate max-w-[280px]" title={r.error_message}>
                        {r.error_message}
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
