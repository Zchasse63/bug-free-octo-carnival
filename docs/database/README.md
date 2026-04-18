# Database Migrations

Source of truth: Supabase project `qasppaclbeamqsatgbtq` (`Fit Data`). Applied via the Supabase MCP `apply_migration` tool. This directory holds record-keeping copies for review — the database itself is authoritative.

## Applied migrations (Phase 1 Week 1)

| Version | Name | Purpose |
|---------|------|---------|
| 20260418163605 | 001_extensions | Enable `vector` extension for pgvector |
| 20260418163826 | 002_core_tables | Create all 32 tables in FK-safe order |
| 20260418163846 | 003_helper_functions | `auth_athlete_id()` and `viewable_athlete_ids()` |
| 20260418163933 | 004_rls_policies | Enable RLS on all 32 tables, apply 62 policies |
| 20260418163950 | 005_hnsw_indexes | HNSW vector indexes on `activity_embeddings` and `knowledge_base` |
| 20260418164047 | 006_seed_context_factor_definitions | Seed 52 builtin context factors |
| 20260418164133 | 007_tighten_factor_defs_insert | Narrow INSERT policy to authenticated role (interim) |
| 20260418164156 | 008_restrict_factor_defs_to_service_role | Drop INSERT policy — service role writes via RLS bypass |

## Tables

32 total. 19 active in Phase 1, 10 dormant (populated in later phases), 3 new tables added during Week 1 implementation to fulfill the data-agnostic + RAG claims in CLAUDE.md:

- `knowledge_base` — RAG source for coach personality, training philosophies, running vocabulary (seeded Week 5)
- `data_imports` — multi-source ingestion tracking (Strava, Garmin, Apple Health, CSV, manual)
- `training_gaps` — detected gaps in training history

Also added: `activities.data_source` column (defaults to `'strava'`).

## Verified

- 32 tables present, all with RLS enabled
- 62 policies attached (no orphan tables)
- 2 HNSW indexes present
- `auth_athlete_id()` and `viewable_athlete_ids()` compile and return null/0 without an auth user
- Supabase security advisors: **0 findings**

## To regenerate TypeScript types after schema changes

Use the Supabase MCP `generate_typescript_types` tool and write output to `app/lib/supabase/types.ts`.
