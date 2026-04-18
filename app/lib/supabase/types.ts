export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          achievement_count: number | null
          athlete_id: number
          average_cadence: number | null
          average_heartrate: number | null
          average_speed: number | null
          average_watts: number | null
          calories: number | null
          comment_count: number | null
          commute: boolean | null
          created_at: string | null
          data_source: string
          description: string | null
          detail_fetched: boolean | null
          device_name: string | null
          device_watts: boolean | null
          distance_meters: number | null
          elapsed_time: number
          elev_high: number | null
          elev_low: number | null
          embedding_needs_update: boolean | null
          end_lat: number | null
          end_lng: number | null
          estimated_vdot: number | null
          external_id: string | null
          flagged: boolean | null
          gear_id: string | null
          has_heartrate: boolean | null
          id: number
          intensity_factor: number | null
          is_race: boolean | null
          kilojoules: number | null
          kudos_count: number | null
          manual: boolean | null
          map_polyline: string | null
          map_polyline_summary: string | null
          max_heartrate: number | null
          max_speed: number | null
          max_watts: number | null
          moving_time: number
          name: string
          pace_per_km_seconds: number | null
          pr_count: number | null
          sport_type: string
          start_date: string
          start_date_local: string
          start_lat: number | null
          start_lng: number | null
          streams_fetched: boolean | null
          suffer_score: number | null
          timezone: string | null
          total_elevation_gain: number | null
          trainer: boolean | null
          training_load: number | null
          updated_at: string | null
          upload_id: number | null
          visibility: string | null
          weighted_average_watts: number | null
          workout_classification: string | null
          workout_type: number | null
        }
        Insert: {
          achievement_count?: number | null
          athlete_id: number
          average_cadence?: number | null
          average_heartrate?: number | null
          average_speed?: number | null
          average_watts?: number | null
          calories?: number | null
          comment_count?: number | null
          commute?: boolean | null
          created_at?: string | null
          data_source?: string
          description?: string | null
          detail_fetched?: boolean | null
          device_name?: string | null
          device_watts?: boolean | null
          distance_meters?: number | null
          elapsed_time: number
          elev_high?: number | null
          elev_low?: number | null
          embedding_needs_update?: boolean | null
          end_lat?: number | null
          end_lng?: number | null
          estimated_vdot?: number | null
          external_id?: string | null
          flagged?: boolean | null
          gear_id?: string | null
          has_heartrate?: boolean | null
          id: number
          intensity_factor?: number | null
          is_race?: boolean | null
          kilojoules?: number | null
          kudos_count?: number | null
          manual?: boolean | null
          map_polyline?: string | null
          map_polyline_summary?: string | null
          max_heartrate?: number | null
          max_speed?: number | null
          max_watts?: number | null
          moving_time: number
          name: string
          pace_per_km_seconds?: number | null
          pr_count?: number | null
          sport_type: string
          start_date: string
          start_date_local: string
          start_lat?: number | null
          start_lng?: number | null
          streams_fetched?: boolean | null
          suffer_score?: number | null
          timezone?: string | null
          total_elevation_gain?: number | null
          trainer?: boolean | null
          training_load?: number | null
          updated_at?: string | null
          upload_id?: number | null
          visibility?: string | null
          weighted_average_watts?: number | null
          workout_classification?: string | null
          workout_type?: number | null
        }
        Update: {
          achievement_count?: number | null
          athlete_id?: number
          average_cadence?: number | null
          average_heartrate?: number | null
          average_speed?: number | null
          average_watts?: number | null
          calories?: number | null
          comment_count?: number | null
          commute?: boolean | null
          created_at?: string | null
          data_source?: string
          description?: string | null
          detail_fetched?: boolean | null
          device_name?: string | null
          device_watts?: boolean | null
          distance_meters?: number | null
          elapsed_time?: number
          elev_high?: number | null
          elev_low?: number | null
          embedding_needs_update?: boolean | null
          end_lat?: number | null
          end_lng?: number | null
          estimated_vdot?: number | null
          external_id?: string | null
          flagged?: boolean | null
          gear_id?: string | null
          has_heartrate?: boolean | null
          id?: number
          intensity_factor?: number | null
          is_race?: boolean | null
          kilojoules?: number | null
          kudos_count?: number | null
          manual?: boolean | null
          map_polyline?: string | null
          map_polyline_summary?: string | null
          max_heartrate?: number | null
          max_speed?: number | null
          max_watts?: number | null
          moving_time?: number
          name?: string
          pace_per_km_seconds?: number | null
          pr_count?: number | null
          sport_type?: string
          start_date?: string
          start_date_local?: string
          start_lat?: number | null
          start_lng?: number | null
          streams_fetched?: boolean | null
          suffer_score?: number | null
          timezone?: string | null
          total_elevation_gain?: number | null
          trainer?: boolean | null
          training_load?: number | null
          updated_at?: string | null
          upload_id?: number | null
          visibility?: string | null
          weighted_average_watts?: number | null
          workout_classification?: string | null
          workout_type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_gear_id_fkey"
            columns: ["gear_id"]
            isOneToOne: false
            referencedRelation: "gear"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_context_factors: {
        Row: {
          activity_id: number
          athlete_id: number
          category: string
          confidence: number | null
          created_at: string | null
          factor_key: string
          factor_value: string | null
          id: number
          raw_text_excerpt: string | null
          source: string
        }
        Insert: {
          activity_id: number
          athlete_id: number
          category: string
          confidence?: number | null
          created_at?: string | null
          factor_key: string
          factor_value?: string | null
          id?: number
          raw_text_excerpt?: string | null
          source: string
        }
        Update: {
          activity_id?: number
          athlete_id?: number
          category?: string
          confidence?: number | null
          created_at?: string | null
          factor_key?: string
          factor_value?: string | null
          id?: number
          raw_text_excerpt?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_context_factors_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_context_factors_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_context_factors_factor_key_fkey"
            columns: ["factor_key"]
            isOneToOne: false
            referencedRelation: "context_factor_definitions"
            referencedColumns: ["factor_key"]
          },
        ]
      }
      activity_embeddings: {
        Row: {
          activity_id: number
          athlete_id: number
          created_at: string | null
          embedding: string | null
          embedding_model: string
          summary_text: string
          updated_at: string | null
        }
        Insert: {
          activity_id: number
          athlete_id: number
          created_at?: string | null
          embedding?: string | null
          embedding_model?: string
          summary_text: string
          updated_at?: string | null
        }
        Update: {
          activity_id?: number
          athlete_id?: number
          created_at?: string | null
          embedding?: string | null
          embedding_model?: string
          summary_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_embeddings_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: true
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_embeddings_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_laps: {
        Row: {
          activity_id: number
          athlete_id: number
          average_cadence: number | null
          average_heartrate: number | null
          average_speed: number | null
          created_at: string | null
          distance_meters: number | null
          elapsed_time: number | null
          end_index: number | null
          id: number
          lap_index: number
          max_heartrate: number | null
          max_speed: number | null
          moving_time: number | null
          name: string | null
          pace_zone: number | null
          start_date: string | null
          start_date_local: string | null
          start_index: number | null
          total_elevation_gain: number | null
        }
        Insert: {
          activity_id: number
          athlete_id: number
          average_cadence?: number | null
          average_heartrate?: number | null
          average_speed?: number | null
          created_at?: string | null
          distance_meters?: number | null
          elapsed_time?: number | null
          end_index?: number | null
          id: number
          lap_index: number
          max_heartrate?: number | null
          max_speed?: number | null
          moving_time?: number | null
          name?: string | null
          pace_zone?: number | null
          start_date?: string | null
          start_date_local?: string | null
          start_index?: number | null
          total_elevation_gain?: number | null
        }
        Update: {
          activity_id?: number
          athlete_id?: number
          average_cadence?: number | null
          average_heartrate?: number | null
          average_speed?: number | null
          created_at?: string | null
          distance_meters?: number | null
          elapsed_time?: number | null
          end_index?: number | null
          id?: number
          lap_index?: number
          max_heartrate?: number | null
          max_speed?: number | null
          moving_time?: number | null
          name?: string | null
          pace_zone?: number | null
          start_date?: string | null
          start_date_local?: string | null
          start_index?: number | null
          total_elevation_gain?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_laps_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_laps_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_notes: {
        Row: {
          activity_id: number
          ai_parsed_tags: string[] | null
          athlete_id: number
          created_at: string | null
          id: string
          input_method: string | null
          key_factors: Json | null
          perceived_effort: number | null
          raw_text: string
          sentiment: string | null
          updated_at: string | null
          voice_transcript: string | null
        }
        Insert: {
          activity_id: number
          ai_parsed_tags?: string[] | null
          athlete_id: number
          created_at?: string | null
          id?: string
          input_method?: string | null
          key_factors?: Json | null
          perceived_effort?: number | null
          raw_text: string
          sentiment?: string | null
          updated_at?: string | null
          voice_transcript?: string | null
        }
        Update: {
          activity_id?: number
          ai_parsed_tags?: string[] | null
          athlete_id?: number
          created_at?: string | null
          id?: string
          input_method?: string | null
          key_factors?: Json | null
          perceived_effort?: number | null
          raw_text?: string
          sentiment?: string | null
          updated_at?: string | null
          voice_transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_notes_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_notes_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_splits: {
        Row: {
          activity_id: number
          athlete_id: number
          average_grade_adjusted_speed: number | null
          average_heartrate: number | null
          average_speed: number | null
          created_at: string | null
          distance_meters: number | null
          elapsed_time: number | null
          elevation_difference: number | null
          id: number
          moving_time: number | null
          pace_zone: number | null
          split_number: number
          unit_system: string
        }
        Insert: {
          activity_id: number
          athlete_id: number
          average_grade_adjusted_speed?: number | null
          average_heartrate?: number | null
          average_speed?: number | null
          created_at?: string | null
          distance_meters?: number | null
          elapsed_time?: number | null
          elevation_difference?: number | null
          id?: number
          moving_time?: number | null
          pace_zone?: number | null
          split_number: number
          unit_system: string
        }
        Update: {
          activity_id?: number
          athlete_id?: number
          average_grade_adjusted_speed?: number | null
          average_heartrate?: number | null
          average_speed?: number | null
          created_at?: string | null
          distance_meters?: number | null
          elapsed_time?: number | null
          elevation_difference?: number | null
          id?: number
          moving_time?: number | null
          pace_zone?: number | null
          split_number?: number
          unit_system?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_splits_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_splits_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_streams: {
        Row: {
          activity_id: number
          altitude_data: Json | null
          athlete_id: number
          cadence_data: Json | null
          created_at: string | null
          distance_data: Json | null
          grade_data: Json | null
          heartrate_data: Json | null
          latlng_data: Json | null
          moving_data: Json | null
          point_count: number | null
          recorded_streams: string[] | null
          resolution: string | null
          temp_data: Json | null
          time_data: Json | null
          updated_at: string | null
          velocity_data: Json | null
          watts_data: Json | null
        }
        Insert: {
          activity_id: number
          altitude_data?: Json | null
          athlete_id: number
          cadence_data?: Json | null
          created_at?: string | null
          distance_data?: Json | null
          grade_data?: Json | null
          heartrate_data?: Json | null
          latlng_data?: Json | null
          moving_data?: Json | null
          point_count?: number | null
          recorded_streams?: string[] | null
          resolution?: string | null
          temp_data?: Json | null
          time_data?: Json | null
          updated_at?: string | null
          velocity_data?: Json | null
          watts_data?: Json | null
        }
        Update: {
          activity_id?: number
          altitude_data?: Json | null
          athlete_id?: number
          cadence_data?: Json | null
          created_at?: string | null
          distance_data?: Json | null
          grade_data?: Json | null
          heartrate_data?: Json | null
          latlng_data?: Json | null
          moving_data?: Json | null
          point_count?: number | null
          recorded_streams?: string[] | null
          resolution?: string | null
          temp_data?: Json | null
          time_data?: Json | null
          updated_at?: string | null
          velocity_data?: Json | null
          watts_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_streams_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: true
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_streams_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_weather: {
        Row: {
          activity_id: number
          aqi: number | null
          athlete_id: number
          conditions: string | null
          dew_point_c: number | null
          feels_like_c: number | null
          fetched_at: string | null
          humidity_pct: number | null
          precipitation: string | null
          temperature_c: number | null
          uv_index: number | null
          weather_source: string | null
          wind_direction: string | null
          wind_speed_kmh: number | null
        }
        Insert: {
          activity_id: number
          aqi?: number | null
          athlete_id: number
          conditions?: string | null
          dew_point_c?: number | null
          feels_like_c?: number | null
          fetched_at?: string | null
          humidity_pct?: number | null
          precipitation?: string | null
          temperature_c?: number | null
          uv_index?: number | null
          weather_source?: string | null
          wind_direction?: string | null
          wind_speed_kmh?: number | null
        }
        Update: {
          activity_id?: number
          aqi?: number | null
          athlete_id?: number
          conditions?: string | null
          dew_point_c?: number | null
          feels_like_c?: number | null
          fetched_at?: string | null
          humidity_pct?: number | null
          precipitation?: string | null
          temperature_c?: number | null
          uv_index?: number | null
          weather_source?: string | null
          wind_direction?: string | null
          wind_speed_kmh?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_weather_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: true
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_weather_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insights: {
        Row: {
          activity_id: number | null
          athlete_id: number
          body: string
          bookmarked: boolean | null
          created_at: string | null
          dismissed_at: string | null
          generated_at: string | null
          id: string
          insight_type: string
          model_used: string | null
          prompt_version: string | null
          scope: string
          scope_ref_id: string | null
          severity: string | null
          tags: string[] | null
          title: string
          trigger: string
        }
        Insert: {
          activity_id?: number | null
          athlete_id: number
          body: string
          bookmarked?: boolean | null
          created_at?: string | null
          dismissed_at?: string | null
          generated_at?: string | null
          id?: string
          insight_type: string
          model_used?: string | null
          prompt_version?: string | null
          scope: string
          scope_ref_id?: string | null
          severity?: string | null
          tags?: string[] | null
          title: string
          trigger: string
        }
        Update: {
          activity_id?: number | null
          athlete_id?: number
          body?: string
          bookmarked?: boolean | null
          created_at?: string | null
          dismissed_at?: string | null
          generated_at?: string | null
          id?: string
          insight_type?: string
          model_used?: string | null
          prompt_version?: string | null
          scope?: string
          scope_ref_id?: string | null
          severity?: string | null
          tags?: string[] | null
          title?: string
          trigger?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_response_profiles: {
        Row: {
          analysis_data: Json | null
          athlete_id: number
          avg_recovery_hours_easy: number | null
          avg_recovery_hours_hard: number | null
          avg_recovery_hours_long: number | null
          best_responding_workout_types: string[] | null
          created_at: string | null
          heat_tolerance: string | null
          id: string
          injury_risk_factors: Json | null
          last_computed_at: string | null
          model_version: string | null
          optimal_quality_days_per_week: number | null
          optimal_weekly_volume_km: number | null
          preferred_run_time_of_day: string | null
          recovery_rate_category: string | null
          updated_at: string | null
        }
        Insert: {
          analysis_data?: Json | null
          athlete_id: number
          avg_recovery_hours_easy?: number | null
          avg_recovery_hours_hard?: number | null
          avg_recovery_hours_long?: number | null
          best_responding_workout_types?: string[] | null
          created_at?: string | null
          heat_tolerance?: string | null
          id?: string
          injury_risk_factors?: Json | null
          last_computed_at?: string | null
          model_version?: string | null
          optimal_quality_days_per_week?: number | null
          optimal_weekly_volume_km?: number | null
          preferred_run_time_of_day?: string | null
          recovery_rate_category?: string | null
          updated_at?: string | null
        }
        Update: {
          analysis_data?: Json | null
          athlete_id?: number
          avg_recovery_hours_easy?: number | null
          avg_recovery_hours_hard?: number | null
          avg_recovery_hours_long?: number | null
          best_responding_workout_types?: string[] | null
          created_at?: string | null
          heat_tolerance?: string | null
          id?: string
          injury_risk_factors?: Json | null
          last_computed_at?: string | null
          model_version?: string | null
          optimal_quality_days_per_week?: number | null
          optimal_weekly_volume_km?: number | null
          preferred_run_time_of_day?: string | null
          recovery_rate_category?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_response_profiles_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: true
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_zones: {
        Row: {
          athlete_id: number
          created_at: string | null
          custom_hr_zones: boolean | null
          effective_date: string
          estimated_vdot: number | null
          ftp_at_time: number | null
          hr_zones: Json | null
          id: number
          power_zones: Json | null
        }
        Insert: {
          athlete_id: number
          created_at?: string | null
          custom_hr_zones?: boolean | null
          effective_date: string
          estimated_vdot?: number | null
          ftp_at_time?: number | null
          hr_zones?: Json | null
          id?: number
          power_zones?: Json | null
        }
        Update: {
          athlete_id?: number
          created_at?: string | null
          custom_hr_zones?: boolean | null
          effective_date?: string
          estimated_vdot?: number | null
          ftp_at_time?: number | null
          hr_zones?: Json | null
          id?: number
          power_zones?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_zones_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      athletes: {
        Row: {
          access_token: string
          auth_user_id: string | null
          city: string | null
          country: string | null
          created_at: string | null
          firstname: string | null
          ftp: number | null
          id: number
          initial_sync_complete: boolean | null
          last_sync_at: string | null
          lastname: string | null
          measurement_preference: string | null
          onboarding_complete: boolean | null
          profile_url: string | null
          refresh_token: string
          role: string | null
          sex: string | null
          state: string | null
          strava_id: number
          summit: boolean | null
          sync_cursor_epoch: number | null
          token_expires_at: string
          token_scope: string | null
          token_status: string | null
          updated_at: string | null
          username: string | null
          weight_kg: number | null
        }
        Insert: {
          access_token: string
          auth_user_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          firstname?: string | null
          ftp?: number | null
          id: number
          initial_sync_complete?: boolean | null
          last_sync_at?: string | null
          lastname?: string | null
          measurement_preference?: string | null
          onboarding_complete?: boolean | null
          profile_url?: string | null
          refresh_token: string
          role?: string | null
          sex?: string | null
          state?: string | null
          strava_id: number
          summit?: boolean | null
          sync_cursor_epoch?: number | null
          token_expires_at: string
          token_scope?: string | null
          token_status?: string | null
          updated_at?: string | null
          username?: string | null
          weight_kg?: number | null
        }
        Update: {
          access_token?: string
          auth_user_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          firstname?: string | null
          ftp?: number | null
          id?: number
          initial_sync_complete?: boolean | null
          last_sync_at?: string | null
          lastname?: string | null
          measurement_preference?: string | null
          onboarding_complete?: boolean | null
          profile_url?: string | null
          refresh_token?: string
          role?: string | null
          sex?: string | null
          state?: string | null
          strava_id?: number
          summit?: boolean | null
          sync_cursor_epoch?: number | null
          token_expires_at?: string
          token_scope?: string | null
          token_status?: string | null
          updated_at?: string | null
          username?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      best_efforts: {
        Row: {
          activity_id: number
          athlete_id: number
          created_at: string | null
          distance_meters: number | null
          elapsed_time: number
          end_index: number | null
          id: number
          moving_time: number | null
          name: string
          pr_rank: number | null
          start_date: string | null
          start_date_local: string | null
          start_index: number | null
        }
        Insert: {
          activity_id: number
          athlete_id: number
          created_at?: string | null
          distance_meters?: number | null
          elapsed_time: number
          end_index?: number | null
          id: number
          moving_time?: number | null
          name: string
          pr_rank?: number | null
          start_date?: string | null
          start_date_local?: string | null
          start_index?: number | null
        }
        Update: {
          activity_id?: number
          athlete_id?: number
          created_at?: string | null
          distance_meters?: number | null
          elapsed_time?: number
          end_index?: number | null
          id?: number
          moving_time?: number | null
          name?: string
          pr_rank?: number | null
          start_date?: string | null
          start_date_local?: string | null
          start_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "best_efforts_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "best_efforts_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_athletes: {
        Row: {
          accepted_at: string | null
          athlete_id: number
          coach_id: number
          created_at: string | null
          id: string
          invited_at: string | null
          permissions: Json | null
          status: string | null
        }
        Insert: {
          accepted_at?: string | null
          athlete_id: number
          coach_id: number
          created_at?: string | null
          id?: string
          invited_at?: string | null
          permissions?: Json | null
          status?: string | null
        }
        Update: {
          accepted_at?: string | null
          athlete_id?: number
          coach_id?: number
          created_at?: string | null
          id?: string
          invited_at?: string | null
          permissions?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_athletes_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_athletes_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      context_factor_definitions: {
        Row: {
          category: string
          data_type: string | null
          description: string | null
          display_name: string
          factor_key: string
          first_seen_at: string | null
          is_builtin: boolean | null
          unit: string | null
          usage_count: number | null
        }
        Insert: {
          category: string
          data_type?: string | null
          description?: string | null
          display_name: string
          factor_key: string
          first_seen_at?: string | null
          is_builtin?: boolean | null
          unit?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string
          data_type?: string | null
          description?: string | null
          display_name?: string
          factor_key?: string
          first_seen_at?: string | null
          is_builtin?: boolean | null
          unit?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          athlete_id: number
          context_snapshot: Json | null
          conversation_type: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_message_at: string | null
          message_count: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          athlete_id: number
          context_snapshot?: Json | null
          conversation_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          message_count?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          athlete_id?: number
          context_snapshot?: Json | null
          conversation_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_message_at?: string | null
          message_count?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      data_imports: {
        Row: {
          activities_failed: number | null
          activities_imported: number | null
          athlete_id: number
          completed_at: string | null
          created_at: string | null
          data_source: string
          date_range_end: string | null
          date_range_start: string | null
          error_log: Json | null
          id: string
          import_type: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          activities_failed?: number | null
          activities_imported?: number | null
          athlete_id: number
          completed_at?: string | null
          created_at?: string | null
          data_source: string
          date_range_end?: string | null
          date_range_start?: string | null
          error_log?: Json | null
          id?: string
          import_type: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          activities_failed?: number | null
          activities_imported?: number | null
          athlete_id?: number
          completed_at?: string | null
          created_at?: string | null
          data_source?: string
          date_range_end?: string | null
          date_range_start?: string | null
          error_log?: Json | null
          id?: string
          import_type?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_imports_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      gear: {
        Row: {
          athlete_id: number
          brand_name: string | null
          created_at: string | null
          description: string | null
          distance_meters: number | null
          gear_type: string
          id: string
          is_primary: boolean | null
          model_name: string | null
          name: string
          retired: boolean | null
          updated_at: string | null
        }
        Insert: {
          athlete_id: number
          brand_name?: string | null
          created_at?: string | null
          description?: string | null
          distance_meters?: number | null
          gear_type: string
          id: string
          is_primary?: boolean | null
          model_name?: string | null
          name: string
          retired?: boolean | null
          updated_at?: string | null
        }
        Update: {
          athlete_id?: number
          brand_name?: string | null
          created_at?: string | null
          description?: string | null
          distance_meters?: number | null
          gear_type?: string
          id?: string
          is_primary?: boolean | null
          model_name?: string | null
          name?: string
          retired?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gear_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          category: string
          content: string
          created_at: string | null
          embedding: string | null
          embedding_model: string | null
          id: string
          metadata: Json | null
          source_doc: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          embedding?: string | null
          embedding_model?: string | null
          id?: string
          metadata?: Json | null
          source_doc?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          embedding?: string | null
          embedding_model?: string | null
          id?: string
          metadata?: Json | null
          source_doc?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          activity_id: number | null
          athlete_id: number
          completion_tokens: number | null
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          insight_id: string | null
          message_type: string | null
          model_used: string | null
          planned_workout_id: string | null
          prompt_tokens: number | null
          role: string
          tool_calls: Json | null
          voice_audio_url: string | null
        }
        Insert: {
          activity_id?: number | null
          athlete_id: number
          completion_tokens?: number | null
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          insight_id?: string | null
          message_type?: string | null
          model_used?: string | null
          planned_workout_id?: string | null
          prompt_tokens?: number | null
          role: string
          tool_calls?: Json | null
          voice_audio_url?: string | null
        }
        Update: {
          activity_id?: number | null
          athlete_id?: number
          completion_tokens?: number | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          insight_id?: string | null
          message_type?: string | null
          model_used?: string | null
          planned_workout_id?: string | null
          prompt_tokens?: number | null
          role?: string
          tool_calls?: Json | null
          voice_audio_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "ai_insights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_planned_workout_id_fkey"
            columns: ["planned_workout_id"]
            isOneToOne: false
            referencedRelation: "planned_workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_summaries: {
        Row: {
          ai_summary: string | null
          athlete_id: number
          avg_suffer_score: number | null
          avg_weekly_distance: number | null
          computed_at: string | null
          estimated_vdot: number | null
          fatigue_score: number | null
          fitness_score: number | null
          form_score: number | null
          id: number
          month: number
          pr_count: number | null
          run_count: number | null
          run_distance_meters: number | null
          run_elevation_gain: number | null
          run_moving_time: number | null
          total_activities: number | null
          total_training_load: number | null
          year: number
        }
        Insert: {
          ai_summary?: string | null
          athlete_id: number
          avg_suffer_score?: number | null
          avg_weekly_distance?: number | null
          computed_at?: string | null
          estimated_vdot?: number | null
          fatigue_score?: number | null
          fitness_score?: number | null
          form_score?: number | null
          id?: number
          month: number
          pr_count?: number | null
          run_count?: number | null
          run_distance_meters?: number | null
          run_elevation_gain?: number | null
          run_moving_time?: number | null
          total_activities?: number | null
          total_training_load?: number | null
          year: number
        }
        Update: {
          ai_summary?: string | null
          athlete_id?: number
          avg_suffer_score?: number | null
          avg_weekly_distance?: number | null
          computed_at?: string | null
          estimated_vdot?: number | null
          fatigue_score?: number | null
          fitness_score?: number | null
          form_score?: number | null
          id?: number
          month?: number
          pr_count?: number | null
          run_count?: number | null
          run_distance_meters?: number | null
          run_elevation_gain?: number | null
          run_moving_time?: number | null
          total_activities?: number | null
          total_training_load?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_summaries_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_responses: {
        Row: {
          athlete_id: number
          created_at: string | null
          id: string
          question_key: string
          question_text: string
          response_type: string | null
          response_value: string
        }
        Insert: {
          athlete_id: number
          created_at?: string | null
          id?: string
          question_key: string
          question_text: string
          response_type?: string | null
          response_value: string
        }
        Update: {
          athlete_id?: number
          created_at?: string | null
          id?: string
          question_key?: string
          question_text?: string
          response_type?: string | null
          response_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_responses_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      planned_workouts: {
        Row: {
          actual_activity_id: number | null
          ai_adjustment_reason: string | null
          athlete_id: number
          created_at: string | null
          day_of_week: number
          description: string | null
          deviation_notes: string | null
          id: string
          plan_id: string
          planned_date: string
          status: string | null
          structure: Json | null
          target_distance_meters: number | null
          target_duration: number | null
          target_pace_range: Json | null
          title: string
          updated_at: string | null
          workout_type: string
        }
        Insert: {
          actual_activity_id?: number | null
          ai_adjustment_reason?: string | null
          athlete_id: number
          created_at?: string | null
          day_of_week: number
          description?: string | null
          deviation_notes?: string | null
          id?: string
          plan_id: string
          planned_date: string
          status?: string | null
          structure?: Json | null
          target_distance_meters?: number | null
          target_duration?: number | null
          target_pace_range?: Json | null
          title: string
          updated_at?: string | null
          workout_type: string
        }
        Update: {
          actual_activity_id?: number | null
          ai_adjustment_reason?: string | null
          athlete_id?: number
          created_at?: string | null
          day_of_week?: number
          description?: string | null
          deviation_notes?: string | null
          id?: string
          plan_id?: string
          planned_date?: string
          status?: string | null
          structure?: Json | null
          target_distance_meters?: number | null
          target_duration?: number | null
          target_pace_range?: Json | null
          title?: string
          updated_at?: string | null
          workout_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "planned_workouts_actual_activity_id_fkey"
            columns: ["actual_activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_workouts_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_workouts_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      race_predictions: {
        Row: {
          analysis_text: string | null
          athlete_id: number
          confidence_range: Json | null
          course_profile: Json | null
          course_source: string | null
          created_at: string | null
          current_ctl: number | null
          current_tsb: number | null
          current_vdot: number | null
          id: string
          model_used: string | null
          pace_strategy: Json | null
          predicted_humidity: number | null
          predicted_temp_f: number | null
          predicted_time_seconds: number
          race_date: string | null
          race_distance_meters: number
          race_name: string | null
          shoe_recommendation: string | null
          training_plan_id: string | null
        }
        Insert: {
          analysis_text?: string | null
          athlete_id: number
          confidence_range?: Json | null
          course_profile?: Json | null
          course_source?: string | null
          created_at?: string | null
          current_ctl?: number | null
          current_tsb?: number | null
          current_vdot?: number | null
          id?: string
          model_used?: string | null
          pace_strategy?: Json | null
          predicted_humidity?: number | null
          predicted_temp_f?: number | null
          predicted_time_seconds: number
          race_date?: string | null
          race_distance_meters: number
          race_name?: string | null
          shoe_recommendation?: string | null
          training_plan_id?: string | null
        }
        Update: {
          analysis_text?: string | null
          athlete_id?: number
          confidence_range?: Json | null
          course_profile?: Json | null
          course_source?: string | null
          created_at?: string | null
          current_ctl?: number | null
          current_tsb?: number | null
          current_vdot?: number | null
          id?: string
          model_used?: string | null
          pace_strategy?: Json | null
          predicted_humidity?: number | null
          predicted_temp_f?: number | null
          predicted_time_seconds?: number
          race_date?: string | null
          race_distance_meters?: number
          race_name?: string | null
          shoe_recommendation?: string | null
          training_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "race_predictions_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_predictions_training_plan_id_fkey"
            columns: ["training_plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      segment_efforts: {
        Row: {
          activity_id: number
          athlete_id: number
          average_cadence: number | null
          average_heartrate: number | null
          average_watts: number | null
          created_at: string | null
          distance_meters: number | null
          elapsed_time: number
          end_index: number | null
          id: number
          is_kom: boolean | null
          kom_rank: number | null
          max_heartrate: number | null
          moving_time: number | null
          pr_rank: number | null
          segment_id: number
          segment_name: string | null
          start_date: string | null
          start_date_local: string | null
          start_index: number | null
        }
        Insert: {
          activity_id: number
          athlete_id: number
          average_cadence?: number | null
          average_heartrate?: number | null
          average_watts?: number | null
          created_at?: string | null
          distance_meters?: number | null
          elapsed_time: number
          end_index?: number | null
          id: number
          is_kom?: boolean | null
          kom_rank?: number | null
          max_heartrate?: number | null
          moving_time?: number | null
          pr_rank?: number | null
          segment_id: number
          segment_name?: string | null
          start_date?: string | null
          start_date_local?: string | null
          start_index?: number | null
        }
        Update: {
          activity_id?: number
          athlete_id?: number
          average_cadence?: number | null
          average_heartrate?: number | null
          average_watts?: number | null
          created_at?: string | null
          distance_meters?: number | null
          elapsed_time?: number
          end_index?: number | null
          id?: number
          is_kom?: boolean | null
          kom_rank?: number | null
          max_heartrate?: number | null
          moving_time?: number | null
          pr_rank?: number | null
          segment_id?: number
          segment_name?: string | null
          start_date?: string | null
          start_date_local?: string | null
          start_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "segment_efforts_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "segment_efforts_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_log: {
        Row: {
          activities_failed: number | null
          activities_synced: number | null
          athlete_id: number
          completed_at: string | null
          error_message: string | null
          id: number
          rate_limit_hit: boolean | null
          started_at: string | null
          status: string
          strava_rate_remaining: Json | null
          sync_type: string
        }
        Insert: {
          activities_failed?: number | null
          activities_synced?: number | null
          athlete_id: number
          completed_at?: string | null
          error_message?: string | null
          id?: number
          rate_limit_hit?: boolean | null
          started_at?: string | null
          status: string
          strava_rate_remaining?: Json | null
          sync_type: string
        }
        Update: {
          activities_failed?: number | null
          activities_synced?: number | null
          athlete_id?: number
          completed_at?: string | null
          error_message?: string | null
          id?: number
          rate_limit_hit?: boolean | null
          started_at?: string | null
          status?: string
          strava_rate_remaining?: Json | null
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_log_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          athlete_id: number
          id: string
          joined_at: string | null
          role: string | null
          team_id: string
        }
        Insert: {
          athlete_id: number
          id?: string
          joined_at?: string | null
          role?: string | null
          team_id: string
        }
        Update: {
          athlete_id?: number
          id?: string
          joined_at?: string | null
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_messages: {
        Row: {
          activity_id: number | null
          author_id: number
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          team_id: string
        }
        Insert: {
          activity_id?: number | null
          author_id: number
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          team_id: string
        }
        Update: {
          activity_id?: number | null
          author_id?: number
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_messages_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_messages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          invite_code: string | null
          invite_code_expires_at: string | null
          invite_code_max_uses: number | null
          invite_code_use_count: number | null
          is_public: boolean | null
          name: string
          owner_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          invite_code?: string | null
          invite_code_expires_at?: string | null
          invite_code_max_uses?: number | null
          invite_code_use_count?: number | null
          is_public?: boolean | null
          name: string
          owner_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          invite_code?: string | null
          invite_code_expires_at?: string | null
          invite_code_max_uses?: number | null
          invite_code_use_count?: number | null
          is_public?: boolean | null
          name?: string
          owner_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      training_gaps: {
        Row: {
          athlete_id: number
          coach_noted: boolean | null
          created_at: string | null
          gap_days: number | null
          gap_end: string
          gap_start: string
          id: string
          reason: string | null
          user_noted: boolean | null
        }
        Insert: {
          athlete_id: number
          coach_noted?: boolean | null
          created_at?: string | null
          gap_days?: number | null
          gap_end: string
          gap_start: string
          id?: string
          reason?: string | null
          user_noted?: boolean | null
        }
        Update: {
          athlete_id?: number
          coach_noted?: boolean | null
          created_at?: string | null
          gap_days?: number | null
          gap_end?: string
          gap_start?: string
          id?: string
          reason?: string | null
          user_noted?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "training_gaps_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plans: {
        Row: {
          athlete_id: number
          created_at: string | null
          current_phase: string | null
          end_date: string | null
          generated_by: string | null
          goal: string | null
          goal_race_date: string | null
          goal_race_distance: string | null
          goal_time_seconds: number | null
          id: string
          model_version: string | null
          name: string
          plan_config: Json
          plan_type: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          athlete_id: number
          created_at?: string | null
          current_phase?: string | null
          end_date?: string | null
          generated_by?: string | null
          goal?: string | null
          goal_race_date?: string | null
          goal_race_distance?: string | null
          goal_time_seconds?: number | null
          id?: string
          model_version?: string | null
          name: string
          plan_config: Json
          plan_type?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          athlete_id?: number
          created_at?: string | null
          current_phase?: string | null
          end_date?: string | null
          generated_by?: string | null
          goal?: string | null
          goal_race_date?: string | null
          goal_race_distance?: string | null
          goal_time_seconds?: number | null
          id?: string
          model_version?: string | null
          name?: string
          plan_config?: Json
          plan_type?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_plans_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_summaries: {
        Row: {
          acwr: number | null
          ai_summary: string | null
          athlete_id: number
          avg_run_heartrate: number | null
          avg_run_pace_seconds_per_km: number | null
          avg_suffer_score: number | null
          computed_at: string | null
          hiit_count: number | null
          hiit_duration: number | null
          hr_zone_distribution: Json | null
          id: number
          injury_risk_level: string | null
          intensity_distribution: Json | null
          long_run_date: string | null
          long_run_distance_meters: number | null
          other_count: number | null
          other_duration: number | null
          run_count: number | null
          run_distance_meters: number | null
          run_elevation_gain: number | null
          run_moving_time: number | null
          strength_count: number | null
          strength_duration: number | null
          total_activities: number | null
          total_suffer_score: number | null
          total_training_load: number | null
          week_number: number | null
          week_start: string
          workout_type_distribution: Json | null
          year: number | null
        }
        Insert: {
          acwr?: number | null
          ai_summary?: string | null
          athlete_id: number
          avg_run_heartrate?: number | null
          avg_run_pace_seconds_per_km?: number | null
          avg_suffer_score?: number | null
          computed_at?: string | null
          hiit_count?: number | null
          hiit_duration?: number | null
          hr_zone_distribution?: Json | null
          id?: number
          injury_risk_level?: string | null
          intensity_distribution?: Json | null
          long_run_date?: string | null
          long_run_distance_meters?: number | null
          other_count?: number | null
          other_duration?: number | null
          run_count?: number | null
          run_distance_meters?: number | null
          run_elevation_gain?: number | null
          run_moving_time?: number | null
          strength_count?: number | null
          strength_duration?: number | null
          total_activities?: number | null
          total_suffer_score?: number | null
          total_training_load?: number | null
          week_number?: number | null
          week_start: string
          workout_type_distribution?: Json | null
          year?: number | null
        }
        Update: {
          acwr?: number | null
          ai_summary?: string | null
          athlete_id?: number
          avg_run_heartrate?: number | null
          avg_run_pace_seconds_per_km?: number | null
          avg_suffer_score?: number | null
          computed_at?: string | null
          hiit_count?: number | null
          hiit_duration?: number | null
          hr_zone_distribution?: Json | null
          id?: number
          injury_risk_level?: string | null
          intensity_distribution?: Json | null
          long_run_date?: string | null
          long_run_distance_meters?: number | null
          other_count?: number | null
          other_duration?: number | null
          run_count?: number | null
          run_distance_meters?: number | null
          run_elevation_gain?: number | null
          run_moving_time?: number | null
          strength_count?: number | null
          strength_duration?: number | null
          total_activities?: number | null
          total_suffer_score?: number | null
          total_training_load?: number | null
          week_number?: number | null
          week_start?: string
          workout_type_distribution?: Json | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_summaries_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athletes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_athlete_id: { Args: never; Returns: number }
      match_activities: {
        Args: {
          athlete_id_in: number
          match_count?: number
          query_embedding: string
        }
        Returns: {
          activity_id: number
          similarity: number
          summary_text: string
        }[]
      }
      match_knowledge: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          category: string
          content: string
          similarity: number
          title: string
        }[]
      }
      viewable_athlete_ids: { Args: never; Returns: number[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

