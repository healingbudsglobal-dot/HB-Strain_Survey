import { Link } from "react-router-dom";
import { ArrowLeft, Shield, ScrollText, Leaf, AlertTriangle } from "lucide-react";

const Legal = () => {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground px-5 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to quiz
        </Link>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent-green)_/_0.25)] bg-[hsl(var(--accent-green)_/_0.06)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--accent-green))] mb-3">
            <ScrollText className="h-3 w-3" /> Terms · Privacy · Disclaimer
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            The fine print, in plain English.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: 6 May 2026 · Governed by the laws of the Republic of South Africa.
          </p>
        </header>

        <section className="space-y-6 text-sm leading-relaxed text-foreground/85">
          {/* Adults only */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <Leaf className="h-5 w-5 mt-0.5 text-[hsl(var(--accent-green))] shrink-0" />
              <div>
                <h2 className="font-display text-lg font-bold mb-1">Adults 18+ only · South Africa only</h2>
                <p>
                  This site is intended for <strong>adults aged 18 or older</strong> who are physically present in
                  South Africa. By using it you confirm both. We do not knowingly serve minors and will not
                  process quiz results from anyone outside South Africa.
                </p>
              </div>
            </div>
          </div>

          {/* Private purposes */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold mb-2">A lifestyle preference quiz, nothing more</h2>
            <p className="mb-2">
              This quiz exists to help adults explore <em>their own taste, aroma and lifestyle preferences</em>{" "}
              within the framework of the <strong>Cannabis for Private Purposes Act 7 of 2024</strong> ("CfPPA"),
              which decriminalises private cultivation, possession and personal adult use in private.
            </p>
            <p>
              We do not sell, supply, deliver, advertise the sale of, or facilitate the trade of cannabis through
              this website. Commercial dealing in cannabis remains regulated and, outside of licensed channels,
              prohibited under South African law (including the Drugs and Drug Trafficking Act 140 of 1992 and
              the Medicines and Related Substances Act 101 of 1965).
            </p>
          </div>

          {/* Not medical advice */}
          <div className="rounded-2xl border border-[hsl(var(--destructive)_/_0.3)] bg-[hsl(var(--destructive)_/_0.04)] p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 text-[hsl(var(--destructive))] shrink-0" />
              <div>
                <h2 className="font-display text-lg font-bold mb-1">This is not medical advice</h2>
                <p>
                  Nothing on this site is intended to diagnose, treat, cure or prevent any disease, condition
                  or symptom. The quiz makes no health or therapeutic claims. We are simply matching{" "}
                  <em>preferences and tastes</em> — much like a coffee or wine pairing tool. If you have a
                  medical question, please speak to a registered healthcare professional. Medicinal cannabis
                  products in South Africa are governed by SAHPRA and require a valid prescription.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 mt-0.5 text-[hsl(var(--accent-green))] shrink-0" />
              <div>
                <h2 className="font-display text-lg font-bold mb-1">Your privacy (POPIA)</h2>
                <p className="mb-2">
                  We process your personal information in line with the{" "}
                  <strong>Protection of Personal Information Act 4 of 2013</strong> ("POPIA"). We collect only
                  what we need to give you your quiz match: your email, province, an age confirmation, your
                  quiz answers and — if you choose to share it — your name and WhatsApp number.
                </p>
                <p className="mb-2">
                  We use this information to (a) send your match, (b) follow up with relevant lifestyle content,
                  and (c) improve the matching engine. We do <strong>not</strong> sell your data. You can ask us
                  to access, correct or delete it at any time by emailing{" "}
                  <a className="underline" href="mailto:healingbudsglobal@gmail.com">
                    healingbudsglobal@gmail.com
                  </a>.
                </p>
                <p>
                  Operator / Responsible Party: <strong>Healing Buds</strong>, South Africa.
                </p>
              </div>
            </div>
          </div>

          {/* Marketing */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold mb-2">A note on marketing &amp; advertising</h2>
            <p>
              All copy on this site is written as <em>lifestyle and preference content for adults</em>. We
              deliberately avoid therapeutic claims, dosage guidance and depictions of consumption to remain
              consistent with the Advertising Regulatory Board (ARB) Code, the CfPPA's restrictions on
              advertising, and the content policies of major ad platforms. If you believe any wording crosses a
              line, please tell us and we will review it within 5 business days.
            </p>
          </div>

          {/* Liability */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold mb-2">Use at your own discretion</h2>
            <p>
              The quiz is provided <em>as is</em>, without warranty of any kind. To the fullest extent permitted
              by South African law, Healing Buds is not liable for any decision you make based on the quiz, nor
              for any direct, indirect or consequential loss arising from your use of the site.
            </p>
          </div>

          {/* Governing law */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold mb-2">Governing law</h2>
            <p>
              These terms are governed by the laws of the <strong>Republic of South Africa</strong>. Any
              dispute will be subject to the exclusive jurisdiction of the South African courts.
            </p>
          </div>
        </section>

        <footer className="mt-10 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Healing Buds · Made with care in South Africa.
        </footer>
      </div>
    </div>
  );
};

export default Legal;
