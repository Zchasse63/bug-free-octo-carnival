import { WorkoutBuilderForm } from "@/components/workout-builder-form";

export default function PlanBuildPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Build workout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe a session in plain English. Claude will structure it.
        </p>
      </div>
      <WorkoutBuilderForm />
    </>
  );
}
