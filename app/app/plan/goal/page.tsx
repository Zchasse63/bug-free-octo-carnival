import { GoalAnalyzer } from "@/components/goal-analyzer";

export default function PlanGoalPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Analyze goal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reverse-engineer a race goal into the Running score you&apos;ll
          need, the weekly fitness gains required, and an honest
          feasibility read.
        </p>
      </div>
      <GoalAnalyzer />
    </>
  );
}
