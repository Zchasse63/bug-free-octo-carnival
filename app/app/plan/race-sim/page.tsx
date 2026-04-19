import { RaceSimForm } from "@/components/race-sim-form";

export default function PlanRaceSimPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Race day simulator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          VDOT-based prediction with heat, elevation, and form adjustments.
        </p>
      </div>
      <RaceSimForm />
    </>
  );
}
