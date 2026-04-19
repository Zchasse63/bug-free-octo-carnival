export type OnboardingQuestion = {
  key: string;
  prompt: string;
  response_type: "text" | "choice" | "number" | "date";
  choices?: string[];
  placeholder?: string;
};

export const ONBOARDING: OnboardingQuestion[] = [
  {
    key: "years_running",
    prompt: "How many years have you been running consistently?",
    response_type: "choice",
    choices: ["<1", "1-3", "3-5", "5-10", "10+"],
  },
  {
    key: "weekly_mileage",
    prompt: "What's a typical training week in miles?",
    response_type: "choice",
    choices: ["<15", "15-25", "25-40", "40-60", "60-80", "80+"],
  },
  {
    key: "primary_goal",
    prompt: "What matters most right now?",
    response_type: "choice",
    choices: [
      "Race a specific distance",
      "General fitness",
      "Come back from injury",
      "Lose weight / body composition",
      "Enjoy running, no goal",
    ],
  },
  {
    key: "goal_race_distance",
    prompt: "If racing, what distance? (skip if not racing)",
    response_type: "choice",
    choices: ["5K", "10K", "Half marathon", "Marathon", "Ultra", "Not racing"],
  },
  {
    key: "goal_race_date",
    prompt: "When is the race? (skip if not racing)",
    response_type: "date",
  },
  {
    key: "quality_days_preference",
    prompt: "How many hard/quality runs per week feels right?",
    response_type: "choice",
    choices: ["0-1", "2", "3", "4+"],
  },
  {
    key: "long_run_day",
    prompt: "Which day of the week do you usually do your long run?",
    response_type: "choice",
    choices: ["Sunday", "Saturday", "Another weekday", "Varies"],
  },
  {
    key: "injury_history",
    prompt: "Any recurring injuries or areas to protect? (free text)",
    response_type: "text",
    placeholder: "e.g., right IT band flares up with too much downhill",
  },
  {
    key: "coaching_philosophy_preference",
    prompt: "How structured do you want your plan?",
    response_type: "choice",
    choices: [
      "Rigid — prescribe every workout",
      "Structured but flexible",
      "Loose — just give me weekly guidance",
    ],
  },
  {
    key: "heat_tolerance",
    prompt: "How do you handle heat?",
    response_type: "choice",
    choices: ["Poorly", "Fine, mostly", "Well, acclimated"],
  },
];
