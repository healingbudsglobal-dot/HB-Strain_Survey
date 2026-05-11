import { strains, type Strain } from "@/data/strains";

export interface StrainMatch {
  strain: Strain;
  score: number;
  compatibility: number; // 0-100
}

/**
 * Weighted strain matching engine — Precision Bio-Mapping v2.
 * Maps 15 survey answers to strain attributes and returns the best match.
 * Informational only (no scoring): consumption_format, discretion, recovery_support, effects_avoid.
 */
export function matchStrain(answers: Record<string, string>): StrainMatch {
  const availableStrains = strains.filter((s) => s.available);
  const scored = availableStrains.map((strain) => {
    let score = 0;

    // ═══ HIGH WEIGHT (3 pts each) ═══

    // primary_vibe — single biggest factor
    const vibe = answers.primary_vibe;
    if (vibe === "Energized & Productive" && (strain.effects.includes("Energetic") || strain.effects.includes("Focused") || strain.effects.includes("Uplifted"))) score += 3;
    if (vibe === "Relaxed & Stress-Free" && strain.effects.includes("Relaxed")) score += 3;
    if (vibe === "Creative & Inspired" && (strain.effects.includes("Euphoric") || strain.effects.includes("Giggly") || strain.effects.includes("Uplifted"))) score += 3;
    if (vibe === "Deep Sleep & Sedation" && strain.effects.includes("Sleepy")) score += 3;
    if (vibe === "Social & Talkative" && (strain.effects.includes("Happy") || strain.effects.includes("Uplifted") || strain.effects.includes("Giggly"))) score += 3;
    if (vibe === "Focused & Clear" && (strain.effects.includes("Focused") || strain.effects.includes("Energetic"))) score += 3;

    // body_impact
    const body = answers.body_impact;
    if (body === "Heavy body sensations" && (strain.effects.includes("Sleepy") || strain.effects.includes("Relaxed")) && strain.type === "indica") score += 3;
    if (body === "Light head change only" && (strain.effects.includes("Focused") || strain.effects.includes("Euphoric") || strain.effects.includes("Uplifted"))) score += 3;
    if (body === "Gentle body relaxation" && strain.effects.includes("Relaxed")) score += 3;
    if (body === "Balanced physical and mental" && strain.type === "hybrid") score += 3;
    if (body === "Full-body immersion" && strain.type === "indica" && strain.effects.includes("Sleepy")) score += 3;

    // terpene_pref — flavour mapping
    const terp = answers.terpene_pref;
    if (terp === "Citrus/Zesty (Limonene)" && strain.flavours.some((f) => ["Citrus", "Pineapple", "Tropical"].includes(f))) score += 3;
    if (terp === "Sweet/Floral (Linalool)" && strain.flavours.some((f) => ["Floral", "Candy", "Creamy", "Vanilla", "Sweet"].includes(f))) score += 3;
    if (terp === "Earthy/Spicy (Myrcene/Caryophyllene)" && strain.flavours.some((f) => ["Earthy", "Pine", "Spicy", "Herbal", "Nutty"].includes(f))) score += 3;
    if (terp === "Pine/Fresh (Pinene)" && strain.flavours.some((f) => ["Pine", "Herbal", "Earthy"].includes(f))) score += 3;
    if (terp === "Gassy/Diesel" && strain.flavours.some((f) => ["Diesel", "Gassy", "Chemical", "Pungent"].includes(f))) score += 3;
    // "No strong preference" — no score

    // ═══ MEDIUM WEIGHT (2 pts each) ═══

    // thc_reaction — safety
    const thc = answers.thc_reaction;
    if (thc === "I need higher doses for effects" && strain.thc >= 24) score += 2;
    if (thc === "I have average tolerance" && strain.thc >= 18 && strain.thc <= 24) score += 2;
    if (thc === "I am very sensitive (can feel 2.5mg)" && strain.thc < 20) score += 2;
    if (thc === "I sometimes feel anxious/paranoid" && strain.thc < 22) score += 2;
    if (thc === "I prefer CBD-dominant or 1:1 ratios" && strain.cbd > 0) score += 2;

    // specific_benefit
    const benefit = answers.specific_benefit;
    if (benefit === "Pain management" && (strain.effects.includes("Relaxed") || strain.cbd > 0)) score += 2;
    if (benefit === "Anxiety/Stress relief" && strain.effects.includes("Relaxed") && strain.thc < 24) score += 2;
    if (benefit === "Sleep aid" && (strain.effects.includes("Sleepy") || strain.type === "indica")) score += 2;
    if (benefit === "Focus/ADHD support" && (strain.effects.includes("Focused") || strain.effects.includes("Energetic"))) score += 2;
    if (benefit === "Creativity boost" && (strain.effects.includes("Euphoric") || strain.effects.includes("Uplifted"))) score += 2;
    if (benefit === "General wellness" && strain.type === "hybrid") score += 2;
    if (benefit === "Social anxiety relief" && (strain.effects.includes("Happy") || strain.effects.includes("Uplifted")) && strain.thc < 24) score += 2;

    // time_of_day
    const time = answers.time_of_day;
    if (time === "Morning" && (strain.effects.includes("Energetic") || strain.effects.includes("Focused") || strain.effects.includes("Uplifted"))) score += 2;
    if (time === "Afternoon" && strain.type === "hybrid") score += 2;
    if (time === "Evening" && strain.effects.includes("Relaxed")) score += 2;
    if (time === "Night" && (strain.effects.includes("Sleepy") || strain.effects.includes("Relaxed"))) score += 2;
    if (time === "Varies") score += 1;

    // environment
    const env = answers.environment;
    if (env === "Social setting" && (strain.effects.includes("Giggly") || strain.effects.includes("Happy") || strain.effects.includes("Euphoric"))) score += 2;
    if (env === "Quiet/private space" && (strain.effects.includes("Relaxed") || strain.effects.includes("Sleepy"))) score += 2;
    if (env === "Outdoors/nature" && (strain.effects.includes("Uplifted") || strain.effects.includes("Energetic"))) score += 2;
    if (env === "Active/busy environment" && strain.effects.includes("Focused")) score += 2;
    if (env === "Mixed situations") score += 1;

    // ═══ LOW WEIGHT (1 pt each) ═══

    // exp_level — tolerance proxy
    const exp = answers.exp_level;
    if (exp === "Daily consumer" && strain.thc >= 23) score += 1;
    if (exp === "Experienced (few times a week)" && strain.thc >= 22) score += 1;
    if (exp === "Regular (few times a month)") score += 1;
    if (exp === "Occasional (few times a year)" && strain.thc < 22) score += 1;
    if (exp === "First timer / Very new" && strain.thc < 20) score += 1;

    // effect_intensity
    const intensity = answers.effect_intensity;
    if (intensity === "Maximum intensity" && strain.thc >= 25) score += 1;
    if (intensity === "Strong pronounced effect" && strain.thc >= 22) score += 1;
    if (intensity === "Moderate balanced effect" && strain.thc >= 18 && strain.thc < 24) score += 1;
    if (intensity === "Mild but noticeable" && strain.thc < 22) score += 1;
    if (intensity === "Very mild (barely noticeable)" && strain.thc < 18) score += 1;

    // peak_duration
    const duration = answers.peak_duration;
    if (duration === "Short (30-60 min)" && strain.thc < 20) score += 1;
    if (duration === "Medium (1-2 hours)") score += 1;
    if (duration === "Long (2-4 hours)" && strain.thc >= 22) score += 1;
    if (duration === "Extended (4+ hours)" && strain.thc >= 24) score += 1;

    // paired_activity
    const activity = answers.paired_activity;
    if (activity === "Work/Study" && (strain.effects.includes("Focused") || strain.effects.includes("Energetic"))) score += 1;
    if (activity === "Creative projects" && (strain.effects.includes("Euphoric") || strain.effects.includes("Uplifted"))) score += 1;
    if (activity === "Socializing with friends" && (strain.effects.includes("Giggly") || strain.effects.includes("Happy") || strain.effects.includes("Euphoric"))) score += 1;
    if (activity === "Relaxing alone" && (strain.effects.includes("Relaxed") || strain.effects.includes("Sleepy"))) score += 1;
    if (activity === "Physical activity" && (strain.effects.includes("Energetic") || strain.effects.includes("Uplifted"))) score += 1;
    if (activity === "Meditation/Yoga" && strain.effects.includes("Relaxed")) score += 1;
    if (activity === "Watching movies/music" && (strain.effects.includes("Euphoric") || strain.effects.includes("Relaxed"))) score += 1;
    if (activity === "Sex/Intimacy" && (strain.effects.includes("Euphoric") || strain.effects.includes("Happy"))) score += 1;

    return { strain, score };
  });

  // Deterministic tie-break: hash answers so different users with the same top
  // score don't all collapse onto the first strain in source order.
  const seed = Object.values(answers).join("|");
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  hash = Math.abs(hash);

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Tie: prefer strain whose THC is closest to a target derived from intensity
    const intensity = answers.effect_intensity;
    const targetThc =
      intensity === "Maximum intensity" ? 26 :
      intensity === "Strong pronounced effect" ? 23 :
      intensity === "Mild but noticeable" ? 18 :
      intensity === "Very mild (barely noticeable)" ? 15 : 21;
    const da = Math.abs(a.strain.thc - targetThc);
    const db = Math.abs(b.strain.thc - targetThc);
    if (da !== db) return da - db;
    // Final tie: stable hash-based pick across the catalog
    const ha = (hash + a.strain.name.length) % 7;
    const hb = (hash + b.strain.name.length) % 7;
    return ha - hb;
  });

  const best = scored[0];
  // Max possible: 4 high×3 + 4 med×2 + 4 low×1 = 12+8+4 = 24
  const maxScore = 24;
  const compatibility = Math.min(Math.round((best.score / maxScore) * 100), 99);

  return {
    strain: best.strain,
    score: best.score,
    // Show the real score (no artificial 65% floor) so different answers
    // produce visibly different compatibility values.
    compatibility,
  };
}
