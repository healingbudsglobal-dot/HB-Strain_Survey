export interface SurveyOption {
  label: string;
  icon?: string; // lucide icon name
}

export interface SurveyQuestion {
  id: string;
  question: string;
  subtitle?: string;
  section: string;
  options: SurveyOption[];
  type: "single" | "multi";
}

export const surveyQuestions: SurveyQuestion[] = [
  // ─── Section 1: Your Background ───
  {
    id: "exp_level",
    section: "Your Background",
    question: "How familiar are you with botanical wellness?",
    subtitle: "So we can find the right strength for you",
    type: "single",
    options: [
      { label: "First timer / Very new", icon: "baby" },
      { label: "Occasional (few times a year)", icon: "sprout" },
      { label: "Regular (few times a month)", icon: "leaf" },
      { label: "Experienced (few times a week)", icon: "trees" },
      { label: "Daily consumer", icon: "flame" },
    ],
  },
  {
    id: "effect_intensity",
    section: "Your Cannabis Background",
    question: "How strong do you like the effects?",
    subtitle: "From barely-there to fully immersive",
    type: "single",
    options: [
      { label: "Very mild (barely noticeable)", icon: "droplets" },
      { label: "Mild but noticeable", icon: "droplet" },
      { label: "Moderate balanced effect", icon: "sun" },
      { label: "Strong pronounced effect", icon: "flame" },
      { label: "Maximum intensity", icon: "flame-kindling" },
    ],
  },
  {
    id: "peak_duration",
    section: "Your Cannabis Background",
    question: "How long do you want the peak effects to last?",
    subtitle: "Duration shapes which compounds we prioritise",
    type: "single",
    options: [
      { label: "Short (30-60 min)", icon: "timer" },
      { label: "Medium (1-2 hours)", icon: "clock" },
      { label: "Long (2-4 hours)", icon: "hourglass" },
      { label: "Extended (4+ hours)", icon: "infinity" },
    ],
  },

  // ─── Section 2: Your Ideal Experience ───
  {
    id: "primary_vibe",
    section: "Your Ideal Experience",
    question: "What experience are you looking for?",
    subtitle: "This shapes your match more than anything",
    type: "single",
    options: [
      { label: "Energized & Productive", icon: "zap" },
      { label: "Relaxed & Stress-Free", icon: "wind" },
      { label: "Creative & Inspired", icon: "palette" },
      { label: "Deep Sleep & Sedation", icon: "moon" },
      { label: "Social & Talkative", icon: "users" },
      { label: "Focused & Clear", icon: "target" },
    ],
  },
  {
    id: "body_impact",
    section: "Your Ideal Experience",
    question: "How do you want the high to impact your physical body?",
    subtitle: "Physical sensation matters as much as mental effect",
    type: "single",
    options: [
      { label: "Light head change only", icon: "feather" },
      { label: "Gentle body relaxation", icon: "armchair" },
      { label: "Balanced physical and mental", icon: "scale" },
      { label: "Heavy body sensations", icon: "anchor" },
      { label: "Full-body immersion", icon: "waves" },
    ],
  },
  {
    id: "specific_benefit",
    section: "Your Ideal Experience",
    question: "Which lifestyle outcome matters most to you right now?",
    subtitle: "We'll weight this heavily in your match",
    type: "single",
    options: [
      { label: "Physical comfort & ease", icon: "activity" },
      { label: "Calm & unwind from a busy day", icon: "coffee" },
      { label: "Restful nights", icon: "moon" },
      { label: "Focus & flow state", icon: "crosshair" },
      { label: "Creative spark", icon: "palette" },
      { label: "Everyday balance", icon: "heart-pulse" },
      { label: "Confidence in social settings", icon: "users" },
    ],
  },
  {
    id: "paired_activity",
    section: "Your Ideal Experience",
    question: "What activity do you plan to pair with this experience?",
    subtitle: "Context shapes the ideal strain profile",
    type: "single",
    options: [
      { label: "Work/Study", icon: "laptop" },
      { label: "Creative projects", icon: "palette" },
      { label: "Socializing with friends", icon: "users" },
      { label: "Relaxing alone", icon: "bed" },
      { label: "Physical activity", icon: "dumbbell" },
      { label: "Meditation/Yoga", icon: "flower" },
      { label: "Watching movies/music", icon: "tv" },
      { label: "Sex/Intimacy", icon: "heart" },
    ],
  },

  // ─── Section 3: Your Body & Preferences ───
  {
    id: "thc_reaction",
    section: "Your Body & Preferences",
    question: "How does your body usually respond to stronger profiles?",
    subtitle: "We'll use this to keep your experience comfortable",
    type: "single",
    options: [
      { label: "Very sensitive – a tiny amount goes a long way", icon: "alert-triangle" },
      { label: "Average – standard profiles suit me", icon: "equal" },
      { label: "Higher tolerance – I prefer richer profiles", icon: "trending-up" },
      { label: "I can feel a bit on-edge if it's too strong", icon: "shield-alert" },
      { label: "I lean toward gentler, balanced ratios", icon: "scale" },
    ],
  },
  {
    id: "terpene_pref",
    section: "Your Body & Preferences",
    question: "Which aromas appeal to you?",
    subtitle: "Terpenes shape both flavour and how it feels",
    type: "single",
    options: [
      { label: "Citrus/Zesty (Limonene)", icon: "citrus" },
      { label: "Pine/Fresh (Pinene)", icon: "tree-pine" },
      { label: "Earthy/Spicy (Myrcene/Caryophyllene)", icon: "mountain" },
      { label: "Sweet/Floral (Linalool)", icon: "flower" },
      { label: "Gassy/Diesel", icon: "fuel" },
      { label: "No strong preference", icon: "shuffle" },
    ],
  },
  {
    id: "consumption_format",
    section: "Your Body & Preferences",
    question: "How do you prefer to consume?",
    subtitle: "We'll pass this to your consultant for tailored advice",
    type: "single",
    options: [
      { label: "Flower (joints/bowls)", icon: "leaf" },
      { label: "Vaporizing", icon: "wind" },
      { label: "Edibles", icon: "cookie" },
      { label: "Concentrates", icon: "flask-conical" },
      { label: "Tinctures/Oils", icon: "droplets" },
      { label: "Topicals", icon: "hand" },
      { label: "Open to trying different", icon: "shuffle" },
    ],
  },

  // ─── Section 4: Lifestyle & Context ───
  {
    id: "recovery_support",
    section: "Lifestyle & Context",
    question: "Is post-activity recovery part of your routine?",
    subtitle: "Optional — helps us explore complementary profiles",
    type: "single",
    options: [
      { label: "Yes – ongoing physical recovery", icon: "activity" },
      { label: "Yes – post-workout cooldown", icon: "dumbbell" },
      { label: "Yes – everyday tension & stiffness", icon: "bone" },
      { label: "Not a priority right now", icon: "circle-dashed" },
    ],
  },
  {
    id: "environment",
    section: "Lifestyle & Context",
    question: "What is your typical environment?",
    subtitle: "Setting influences the ideal effect profile",
    type: "single",
    options: [
      { label: "Quiet/private space", icon: "home" },
      { label: "Social setting", icon: "users" },
      { label: "Outdoors/nature", icon: "mountain-snow" },
      { label: "Active/busy environment", icon: "building" },
      { label: "Mixed situations", icon: "globe" },
    ],
  },
  {
    id: "time_of_day",
    section: "Lifestyle & Context",
    question: "When do you typically consume?",
    subtitle: "Morning strains differ from evening strains",
    type: "single",
    options: [
      { label: "Morning", icon: "sunrise" },
      { label: "Afternoon", icon: "sun" },
      { label: "Evening", icon: "sunset" },
      { label: "Night", icon: "moon-star" },
      { label: "Varies", icon: "clock" },
    ],
  },
  {
    id: "discretion",
    section: "Lifestyle & Context",
    question: "How important is discretion?",
    subtitle: "We'll note this for your consultant",
    type: "single",
    options: [
      { label: "Very important - low odor preferred", icon: "eye-off" },
      { label: "Moderately important", icon: "eye" },
      { label: "Not a concern", icon: "megaphone" },
    ],
  },
  {
    id: "effects_avoid",
    section: "Lifestyle & Context",
    question: "Any effects you want to avoid?",
    subtitle: "Select all that apply — we'll steer your match away",
    type: "multi",
    options: [
      { label: "Paranoia/Anxiety", icon: "alert-triangle" },
      { label: "Sleepiness", icon: "bed-double" },
      { label: "Racing thoughts", icon: "gauge" },
      { label: "Dry mouth/eyes", icon: "droplets" },
      { label: "Memory fog", icon: "cloud" },
      { label: "Munchies", icon: "utensils" },
      { label: "None of these", icon: "check-circle" },
    ],
  },
];
