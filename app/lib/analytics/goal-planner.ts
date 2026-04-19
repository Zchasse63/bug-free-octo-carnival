import { vdotFromPerformance, pacesFromVdot } from "@/lib/analytics/vdot";

/**
 * Goal reverse-engineer: given target finish time + distance, figure
 * out the required VDOT and whether the athlete is "on track" given
 * their current VDOT and the weeks remaining.
 */
export type GoalAnalysis = {
  target_vdot: number;
  current_vdot: number | null;
  gap: number | null;
  weeks_to_race: number | null;
  required_vdot_per_week: number | null;
  assessment: "ahead" | "on_track" | "stretch" | "aggressive" | "unrealistic";
  recommended_paces: ReturnType<typeof pacesFromVdot>;
  note: string;
};

export function analyzeGoal({
  current_vdot,
  target_distance_m,
  target_time_s,
  race_date,
}: {
  current_vdot: number | null;
  target_distance_m: number;
  target_time_s: number;
  race_date?: string;
}): GoalAnalysis {
  const targetVdot = vdotFromPerformance(target_distance_m, target_time_s);
  const gap = current_vdot !== null ? targetVdot - current_vdot : null;
  const weeksToRace = race_date
    ? Math.max(
        0,
        Math.ceil((new Date(race_date).getTime() - Date.now()) / (7 * 86400000)),
      )
    : null;

  let requiredPerWeek: number | null = null;
  let assessment: GoalAnalysis["assessment"] = "on_track";
  let note = "";

  if (gap !== null && weeksToRace !== null && weeksToRace > 0) {
    requiredPerWeek = Math.round((gap / weeksToRace) * 100) / 100;
    if (gap <= 0) {
      assessment = "ahead";
      note = `You're already at or above the required VDOT (${targetVdot.toFixed(1)}). Taper and execute.`;
    } else if (requiredPerWeek <= 0.1) {
      assessment = "on_track";
      note = `A ${gap.toFixed(1)}-point VDOT lift over ${weeksToRace} weeks is realistic for a trained athlete.`;
    } else if (requiredPerWeek <= 0.25) {
      assessment = "stretch";
      note = `This requires steady, uninterrupted training. Protect the plan.`;
    } else if (requiredPerWeek <= 0.5) {
      assessment = "aggressive";
      note = `You'll need everything to go right. Injuries or travel will derail this.`;
    } else {
      assessment = "unrealistic";
      note = `This VDOT gap is outside what's achievable in ${weeksToRace} weeks. Consider a softer time or a later race.`;
    }
  } else if (current_vdot !== null) {
    note = `Current VDOT ${current_vdot.toFixed(1)}, target ${targetVdot.toFixed(1)}.`;
    assessment = gap && gap > 0 ? "stretch" : "ahead";
  } else {
    note = `Target VDOT ${targetVdot.toFixed(1)}. Race a shorter tune-up so we can measure your current fitness.`;
    assessment = "stretch";
  }

  return {
    target_vdot: targetVdot,
    current_vdot,
    gap,
    weeks_to_race: weeksToRace,
    required_vdot_per_week: requiredPerWeek,
    assessment,
    recommended_paces: pacesFromVdot(targetVdot),
    note,
  };
}
