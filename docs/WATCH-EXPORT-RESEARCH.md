# Watch Export Research — Phase 3 Deliverable

Status: research doc only. No code shipped. Used to inform Phase 4 iOS + watch work.

## Goal

Push Cadence's planned workouts to the athlete's watch so they can execute the session without opening the app. Pull workout data back if the watch is the source of truth.

## Platform options

### 1. Apple Watch (WorkoutKit)
- **Push direction:** strong. `WorkoutKit` lets iOS apps define custom workouts and sync them to paired watches via HealthKit. A planned_workouts row maps naturally to a `CustomWorkout` object with intervals.
- **Pull direction:** via HealthKit `HKWorkout` after the workout completes. Cadence gets structured lap/HR/pace data comparable to Strava's.
- **Blocker:** requires a native iOS app (Phase 4). Not achievable from pure web app.
- **Rough build cost:** 2-3 weeks of Swift work for a minimum Workout extension.

### 2. Garmin Connect IQ
- **Push direction:** Connect IQ has a workout-builder API; `.fit` files can be side-loaded via USB or pushed via Garmin Connect's Calendar API (requires Garmin Developer approval and partner status).
- **Pull direction:** .fit files pulled from Garmin Connect or directly via Garmin Connect IQ's SDK.
- **Blocker:** Garmin's developer program is slow to onboard and has a high bar for the Connect partner tier. `.fit` sideload works but is a rough user experience.
- **Rough build cost:** 1-2 weeks for .fit file generation + an app-to-watch handoff flow; longer if we pursue partner status.

### 3. COROS / Suunto / Polar
- **Push direction:** weakest. COROS has no public workout-push API as of early 2026. Suunto requires partner enrollment. Polar Flow has a workout export but documentation is thin.
- **Recommendation:** Deprioritize until we have traction with Garmin + Apple.

### 4. FIT file as universal fallback
- Generate a `.fit` file per planned workout. User uploads to their preferred platform's web UI.
- **Pros:** hits every watch brand; no partnerships needed.
- **Cons:** poor UX, friction-heavy.

## Recommended Phase 4 plan

1. **Week 1:** Ship `.fit` file download per planned_workout row. `next-fit-encoder` npm library can serialize.
2. **Week 2:** Native iOS app with WorkoutKit integration. Push plan to paired Apple Watch. Pull completed workouts via HealthKit.
3. **Week 3+:** Garmin Connect IQ — start with sideload workflow, pursue partner status in parallel.

## Data considerations

- Cadence's `planned_workouts.structure` column is already shaped for this: `{step, distance_m, duration_s, pace, reps, recovery_s}`. That maps 1:1 to Apple's `IntervalStep` and Garmin's workout steps.
- Pace must be convertible between `seconds/km` (our internal) and `m/s` (Apple) or `seconds/mile` (Garmin). Trivial conversions.
- HR zones: Apple and Garmin both accept zone-based targets. We already have `athlete_zones.hr_zones`.

## Open questions for Phase 4

- How does the iOS app handle auth? Probably passwordless magic-link via Supabase.
- Do we export every planned workout, or only "next 7 days"? Recommend latter to avoid clutter.
- Do we send the target pace range or just the workout type? Pace range is more useful but requires current VDOT at send time.
- Garmin: partner status cost / timeline? Research needed.
