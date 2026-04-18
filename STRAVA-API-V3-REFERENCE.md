# Strava API v3 - Complete Reference

> **Source of Truth** - Compiled from the official Strava Developer Portal, Swagger 2.0 spec, API reference docs, changelog, and community research.
> Generated: 2026-04-16

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication (OAuth 2.0)](#authentication-oauth-20)
3. [Rate Limits](#rate-limits)
4. [API Endpoints - Complete List](#api-endpoints---complete-list)
5. [Data Streams (Raw Sensor Data)](#data-streams-raw-sensor-data)
6. [Data Models - Complete Reference](#data-models---complete-reference)
7. [Webhooks](#webhooks)
8. [File Uploads](#file-uploads)
9. [Scopes & Permissions](#scopes--permissions)
10. [What You CAN Get (Personal Data)](#what-you-can-get-personal-data)
11. [What You CANNOT Get (Gatekept Data)](#what-you-cannot-get-gatekept-data)
12. [November 2024 API Agreement Changes](#november-2024-api-agreement-changes)
13. [Subscription vs Free Data Differences](#subscription-vs-free-data-differences)
14. [Sport Types & Activity Types](#sport-types--activity-types)
15. [Conventions](#conventions)
16. [Changelog Highlights](#changelog-highlights)
17. [Brand Guidelines Summary](#brand-guidelines-summary)

---

## Overview

- **Base URL**: `https://www.strava.com/api/v3`
- **Swagger Spec**: `https://developers.strava.com/swagger/swagger.json`
- **Swagger Version**: 2.0
- **API Version**: 3.0.0
- **Protocol**: HTTPS only (TLS 1.2+)
- **Response Format**: JSON (`application/json`)
- **Swagger Playground**: https://developers.strava.com/playground
- **Create/Manage App**: https://www.strava.com/settings/api
- **Community Hub**: https://communityhub.strava.com/developers-api-7

The Strava V3 API is publicly available and is the same interface used by the Strava mobile apps. It provides access to data on athletes, activities, segments, routes, clubs, and gear.

**For personal use**: You can access ALL of your own data. New apps start in "Single Player Mode" (athlete capacity of 1), meaning you can only authenticate yourself. To authenticate other athletes, you must submit a Developer Program form for review.

---

## Authentication (OAuth 2.0)

Strava uses OAuth 2.0 with short-lived access tokens (6-hour expiry) and refresh tokens.

### Endpoints

| Purpose | Method | URL |
|---------|--------|-----|
| Authorize (Web) | GET | `https://www.strava.com/oauth/authorize` |
| Authorize (Mobile) | GET | `https://www.strava.com/oauth/mobile/authorize` |
| Token Exchange | POST | `https://www.strava.com/oauth/token` |
| Deauthorize | POST | `https://www.strava.com/oauth/deauthorize` |

### Authorization Request Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `client_id` | Yes | Your application's ID |
| `redirect_uri` | Yes | URL for redirect after auth. `localhost` and `127.0.0.1` are whitelisted |
| `response_type` | Yes | Must be `code` |
| `approval_prompt` | No | `force` or `auto` (default: `auto`) |
| `scope` | Yes | Comma-delimited scopes (e.g., `activity:read_all,activity:write`) |
| `state` | No | Returned in redirect URI, useful for tracking |

### Token Exchange (Initial)

```bash
curl -X POST https://www.strava.com/api/v3/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=AUTHORIZATION_CODE \
  -d grant_type=authorization_code
```

**Response**:
```json
{
  "token_type": "Bearer",
  "expires_at": 1568775134,
  "expires_in": 21600,
  "refresh_token": "e5n567567...",
  "access_token": "a4b945687g...",
  "athlete": { /* summary athlete representation */ }
}
```

### Token Refresh

Access tokens expire every 6 hours. Refresh before they expire:

```bash
curl -X POST https://www.strava.com/api/v3/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d grant_type=refresh_token \
  -d refresh_token=YOUR_REFRESH_TOKEN
```

**Key behaviors**:
- If current access token has >1 hour remaining, existing token is returned
- A new refresh token may be returned with each request - always store the latest one
- Old refresh tokens are invalidated immediately when a new one is issued

### Using Access Tokens

Include in every request as a header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Simplest Setup for Personal Use

1. Go to https://www.strava.com/settings/api and create an app
2. Set Authorization Callback Domain to `localhost`
3. Use the provided access token for quick testing (expires every 6 hours)
4. For persistent access, implement the OAuth flow with refresh tokens
5. Request scopes: `read_all,activity:read_all,profile:read_all` for maximum data access

---

## Rate Limits

### Default Limits

| Limit Type | 15-Minute Window | Daily Limit |
|-----------|------------------|-------------|
| **Overall** | 200 requests | 2,000 requests |
| **Non-upload** (read endpoints) | 100 requests | 1,000 requests |

Upload endpoints excluded from "non-upload" limits:
- `POST /activities` (create)
- `POST /uploads` (create)
- `activities#upload_media`

### Timing
- 15-minute limits reset at :00, :15, :30, :45 past the hour
- Daily limits reset at midnight UTC
- Exceeding limits returns `429 Too Many Requests`
- Short-term violations still count toward long-term limits

### Response Headers

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | `15min_limit,daily_limit` |
| `X-RateLimit-Usage` | `15min_usage,daily_usage` |
| `X-ReadRateLimit-Limit` | Non-upload 15min and daily limits |
| `X-ReadRateLimit-Usage` | Non-upload 15min and daily usage |

### Athlete Capacity

New apps have athlete capacity of **1** ("Single Player Mode"). To add more users, submit the [Developer Program form](https://share.hsforms.com/1VXSwPUYqSH6IxK0y51FjHwcnkd8).

### Getting Rate Limits Raised

1. Must be approaching capacity (have demand)
2. Review and comply with API Agreement
3. Comply with Brand Guidelines
4. Submit for review with screenshots of Strava data usage in your app

---

## API Endpoints - Complete List

### Activities

| Method | Endpoint | Operation | Description |
|--------|----------|-----------|-------------|
| POST | `/activities` | createActivity | Create a manual activity. Requires `activity:write` |
| GET | `/activities/{id}` | getActivityById | Get detailed activity. Requires `activity:read` / `activity:read_all` |
| GET | `/activities/{id}/comments` | getCommentsByActivityId | List comments. Paginated with `page_size` + `after_cursor` |
| GET | `/activities/{id}/kudos` | getKudoersByActivityId | List athletes who kudoed |
| GET | `/activities/{id}/laps` | getLapsByActivityId | Get lap data |
| GET | `/athlete/activities` | getLoggedInAthleteActivities | List your activities. Filterable by `before`/`after` (epoch timestamps) |
| GET | `/activities/{id}/zones` | getZonesByActivityId | Get HR and power zones distribution |
| PUT | `/activities/{id}` | updateActivityById | Update activity name, description, type, gear, etc. |

**Key parameters for List Athlete Activities**:
- `before` - epoch timestamp, activities before this time
- `after` - epoch timestamp, activities after this time
- `page` - defaults to 1
- `per_page` - defaults to 30, max 200

### Athletes

| Method | Endpoint | Operation | Description |
|--------|----------|-----------|-------------|
| GET | `/athlete` | getLoggedInAthlete | Get authenticated athlete profile |
| GET | `/athlete/zones` | getLoggedInAthleteZones | Get HR and power zones |
| GET | `/athletes/{id}/stats` | getStats | Get athlete stats (totals, recent, YTD, all-time) |
| PUT | `/athlete` | updateLoggedInAthlete | Update weight only (`weight` parameter) |

### Clubs

| Method | Endpoint | Operation | Description |
|--------|----------|-----------|-------------|
| GET | `/clubs/{id}/activities` | getClubActivitiesById | List club activities |
| GET | `/clubs/{id}/admins` | getClubAdminsById | List club administrators |
| GET | `/clubs/{id}` | getClubById | Get club details |
| GET | `/clubs/{id}/members` | getClubMembersById | List club members |
| GET | `/athlete/clubs` | getLoggedInAthleteClubs | List clubs you belong to |

### Gears

| Method | Endpoint | Operation | Description |
|--------|----------|-----------|-------------|
| GET | `/gear/{id}` | getGearById | Get equipment details (brand, model, distance, etc.) |

### Routes

| Method | Endpoint | Operation | Description |
|--------|----------|-----------|-------------|
| GET | `/routes/{id}/export_gpx` | getRouteAsGPX | Export route as GPX file |
| GET | `/routes/{id}/export_tcx` | getRouteAsTCX | Export route as TCX file |
| GET | `/routes/{id}` | getRouteById | Get route details (includes waypoints) |
| GET | `/athletes/{id}/routes` | getRoutesByAthleteId | List athlete's routes |

### Segment Efforts

| Method | Endpoint | Operation | Description |
|--------|----------|-----------|-------------|
| GET | `/segment_efforts` | getEffortsBySegmentId | List efforts for a segment. Filter by `segment_id`, dates, athlete |
| GET | `/segment_efforts/{id}` | getSegmentEffortById | Get a specific segment effort |

### Segments

| Method | Endpoint | Operation | Description |
|--------|----------|-----------|-------------|
| GET | `/segments/explore` | exploreSegments | Find segments in a bounding box |
| GET | `/segments/starred` | getLoggedInAthleteStarredSegments | List your starred segments |
| GET | `/segments/{id}` | getSegmentById | Get segment details |
| PUT | `/segments/{id}/starred` | starSegment | Star/unstar a segment. Requires `profile:write` |

**Note**: Segment leaderboard endpoint (`/segments/{id}/leaderboard`) is NOT available since June 2020.

### Streams (Raw Data)

| Method | Endpoint | Operation | Description |
|--------|----------|-----------|-------------|
| GET | `/activities/{id}/streams` | getActivityStreams | Get activity streams (GPS, HR, power, etc.) |
| GET | `/routes/{id}/streams` | getRouteStreams | Get route streams |
| GET | `/segment_efforts/{id}/streams` | getSegmentEffortStreams | Get segment effort streams |
| GET | `/segments/{id}/streams` | getSegmentStreams | Get segment streams |

### Uploads

| Method | Endpoint | Operation | Description |
|--------|----------|-----------|-------------|
| POST | `/uploads` | createUpload | Upload an activity file (FIT, TCX, GPX) |
| GET | `/uploads/{id}` | getUploadById | Check upload processing status |

### Live Segments (Partner-only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/live/segments/{id}` | Get live segment data (requires licensing) |

---

## Data Streams (Raw Sensor Data)

Streams are the raw time-series data for activities. This is where you get the detailed second-by-second (or point-by-point) data.

### Available Stream Types

| Stream Key | Type | Unit | Description |
|-----------|------|------|-------------|
| `time` | integer[] | seconds | Time since activity start |
| `distance` | float[] | meters | Cumulative distance |
| `latlng` | [lat,lng][] | degrees | GPS coordinates |
| `altitude` | float[] | meters | Elevation |
| `velocity_smooth` | float[] | m/s | Smoothed velocity |
| `heartrate` | integer[] | bpm | Heart rate |
| `cadence` | integer[] | rpm | Cadence (pedal/step rate) |
| `watts` | integer[] | watts | Power output |
| `temp` | integer[] | celsius | Temperature |
| `moving` | boolean[] | - | Whether athlete was moving |
| `grade_smooth` | float[] | percent | Smoothed grade/gradient |

### How to Request Streams

```bash
curl -G "https://www.strava.com/api/v3/activities/{id}/streams" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d "keys=time,distance,latlng,altitude,heartrate,cadence,watts,temp,velocity_smooth,grade_smooth,moving" \
  -d "key_by_type=true"
```

**Parameters**:
- `keys` (required): Comma-separated list of desired stream types
- `key_by_type` (required): Must be `true`

### Stream Resolution

Each stream includes metadata:
- `original_size` - number of raw data points
- `resolution` - `low`, `medium`, or `high`
- `series_type` - `distance` or `time` (base series for downsampling)

### What streams are available depends on the recording device:
- **GPS watch/device**: latlng, altitude, distance, time, velocity_smooth, moving, grade_smooth
- **Heart rate monitor**: heartrate
- **Power meter**: watts
- **Cadence sensor**: cadence
- **Temperature sensor**: temp

---

## Data Models - Complete Reference

### DetailedActivity

The full activity representation returned by `GET /activities/{id}`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | long | Unique identifier |
| `external_id` | string | Identifier provided at upload time |
| `upload_id` | long | Upload identifier |
| `upload_id_str` | string | Upload ID as string (for 64-bit safety) |
| `athlete` | MetaAthlete | Athlete reference |
| `name` | string | Activity name |
| `distance` | float | Distance in meters |
| `moving_time` | integer | Moving time in seconds |
| `elapsed_time` | integer | Total elapsed time in seconds |
| `total_elevation_gain` | float | Total elevation gain in meters |
| `elev_high` | float | Highest elevation in meters |
| `elev_low` | float | Lowest elevation in meters |
| `type` | ActivityType | Deprecated - use sport_type |
| `sport_type` | SportType | Sport type (e.g., Run, MountainBikeRide) |
| `start_date` | DateTime | Activity start time (UTC) |
| `start_date_local` | DateTime | Activity start time (local timezone) |
| `timezone` | string | Timezone string |
| `start_latlng` | [lat,lng] | Start coordinates |
| `end_latlng` | [lat,lng] | End coordinates |
| `achievement_count` | integer | Number of achievements |
| `kudos_count` | integer | Number of kudos |
| `comment_count` | integer | Number of comments |
| `athlete_count` | integer | Number of athletes (group activities) |
| `photo_count` | integer | Instagram photo count |
| `total_photo_count` | integer | Total photos (Instagram + Strava) |
| `map` | PolylineMap | Encoded polyline map |
| `device_name` | string | Recording device name (added Oct 2025) |
| `trainer` | boolean | Recorded on trainer/stationary |
| `commute` | boolean | Marked as commute |
| `manual` | boolean | Created manually |
| `private` | boolean | Private activity |
| `flagged` | boolean | Flagged activity |
| `workout_type` | integer | Workout type code |
| `average_speed` | float | Average speed (m/s) |
| `max_speed` | float | Max speed (m/s) |
| `has_kudoed` | boolean | Whether you kudoed this |
| `hide_from_home` | boolean | Muted from feed |
| `gear_id` | string | Associated gear ID |
| `kilojoules` | float | Total work (kJ) - rides only |
| `average_watts` | float | Average power (W) - rides only |
| `device_watts` | boolean | True if power from device, false if estimated |
| `max_watts` | integer | Max watts - power meter only |
| `weighted_average_watts` | integer | Normalized Power equivalent - power meter only |
| `description` | string | Activity description |
| `photos` | PhotosSummary | Photo summary |
| `gear` | SummaryGear | Gear details |
| `calories` | float | Kilocalories consumed |
| `segment_efforts` | DetailedSegmentEffort[] | Segment effort data |
| `embed_token` | string | Token for embedding |
| `splits_metric` | Split[] | Metric splits (runs) |
| `splits_standard` | Split[] | Imperial splits (runs) |
| `laps` | Lap[] | Lap data |
| `best_efforts` | DetailedSegmentEffort[] | Best effort data |

### SummaryActivity

Returned in list endpoints (less detail than DetailedActivity). Contains all fields above EXCEPT: `description`, `photos`, `gear`, `calories`, `segment_efforts`, `embed_token`, `splits_metric`, `splits_standard`, `laps`, `best_efforts`.

**Additional fields in SummaryActivity**:
| Field | Type | Description |
|-------|------|-------------|
| `has_heartrate` | boolean | Whether activity has heart rate data |
| `average_heartrate` | float | Average HR (when has_heartrate=true) |
| `max_heartrate` | float | Max HR (when has_heartrate=true) |
| `suffer_score` | float | Relative effort score |
| `pr_count` | integer | Number of PRs achieved |

### DetailedAthlete

| Field | Type | Description |
|-------|------|-------------|
| `id` | long | Unique athlete ID |
| `resource_state` | integer | 1=meta, 2=summary, 3=detail |
| `firstname` | string | First name |
| `lastname` | string | Last name |
| `profile_medium` | string | 62x62 profile picture URL |
| `profile` | string | 124x124 profile picture URL |
| `city` | string | City |
| `state` | string | State/region |
| `country` | string | Country |
| `sex` | string | `M` or `F` |
| `premium` | boolean | Deprecated - use summit |
| `summit` | boolean | Has Strava subscription |
| `created_at` | DateTime | Account creation time |
| `updated_at` | DateTime | Last update time |
| `follower_count` | integer | Number of followers |
| `friend_count` | integer | Number of friends |
| `measurement_preference` | string | `feet` or `meters` |
| `ftp` | integer | Functional Threshold Power |
| `weight` | float | Weight (kg) |
| `clubs` | SummaryClub[] | Clubs |
| `bikes` | SummaryGear[] | Bikes |
| `shoes` | SummaryGear[] | Shoes |

**Note**: Email was removed from the athlete model on January 15, 2019.

### ActivityStats

| Field | Type | Description |
|-------|------|-------------|
| `biggest_ride_distance` | double | Longest ride ever |
| `biggest_climb_elevation_gain` | double | Biggest climb ever |
| `recent_ride_totals` | ActivityTotal | Last 4 weeks ride stats |
| `recent_run_totals` | ActivityTotal | Last 4 weeks run stats |
| `recent_swim_totals` | ActivityTotal | Last 4 weeks swim stats |
| `ytd_ride_totals` | ActivityTotal | Year-to-date ride stats |
| `ytd_run_totals` | ActivityTotal | Year-to-date run stats |
| `ytd_swim_totals` | ActivityTotal | Year-to-date swim stats |
| `all_ride_totals` | ActivityTotal | All-time ride stats |
| `all_run_totals` | ActivityTotal | All-time run stats |
| `all_swim_totals` | ActivityTotal | All-time swim stats |

### ActivityTotal

| Field | Type | Description |
|-------|------|-------------|
| `count` | integer | Number of activities |
| `distance` | float | Total distance (meters) |
| `moving_time` | integer | Total moving time (seconds) |
| `elapsed_time` | integer | Total elapsed time (seconds) |
| `elevation_gain` | float | Total elevation gain (meters) |
| `achievement_count` | integer | Total achievements |

### Lap

| Field | Type | Description |
|-------|------|-------------|
| `id` | long | Unique lap ID |
| `activity` | MetaActivity | Parent activity |
| `athlete` | MetaAthlete | Athlete |
| `average_cadence` | float | Average cadence |
| `average_speed` | float | Average speed (m/s) |
| `distance` | float | Distance (meters) |
| `elapsed_time` | integer | Elapsed time (seconds) |
| `start_index` | integer | Start index in activity stream |
| `end_index` | integer | End index in activity stream |
| `lap_index` | integer | Lap number |
| `max_speed` | float | Max speed (m/s) |
| `moving_time` | integer | Moving time (seconds) |
| `name` | string | Lap name |
| `pace_zone` | integer | Pace zone |
| `split` | integer | Split number |
| `start_date` | DateTime | Start time (UTC) |
| `start_date_local` | DateTime | Start time (local) |
| `total_elevation_gain` | float | Elevation gain (meters) |

### Split

| Field | Type | Description |
|-------|------|-------------|
| `average_speed` | float | Average speed (m/s) |
| `distance` | float | Distance (meters) |
| `elapsed_time` | integer | Elapsed time (seconds) |
| `elevation_difference` | float | Elevation change (meters) |
| `pace_zone` | integer | Pace zone |
| `moving_time` | integer | Moving time (seconds) |
| `split` | integer | Split number |
| `average_heartrate` | float | Average HR |
| `average_grade_adjusted_speed` | float | GAP (Grade Adjusted Pace) |

### DetailedSegmentEffort

| Field | Type | Description |
|-------|------|-------------|
| `id` | long | Effort ID |
| `activity_id` | long | Parent activity ID |
| `elapsed_time` | integer | Elapsed time (seconds) |
| `start_date` | DateTime | Start time (UTC) |
| `start_date_local` | DateTime | Start time (local) |
| `distance` | float | Distance (meters) |
| `is_kom` | boolean | Current KOM/QOM |
| `name` | string | Segment name |
| `activity` | MetaActivity | Activity reference |
| `athlete` | MetaAthlete | Athlete reference |
| `moving_time` | integer | Moving time (seconds) |
| `start_index` | integer | Start index in stream |
| `end_index` | integer | End index in stream |
| `average_cadence` | float | Average cadence |
| `average_watts` | float | Average power |
| `device_watts` | boolean | Power from device |
| `average_heartrate` | float | Average HR |
| `max_heartrate` | float | Max HR |
| `segment` | SummarySegment | Segment details |
| `kom_rank` | integer | Top-10 global rank (if applicable) |
| `pr_rank` | integer | Top-3 personal rank (if applicable) |
| `hidden` | boolean | Hidden effort |

### DetailedSegment

| Field | Type | Description |
|-------|------|-------------|
| `id` | long | Segment ID |
| `name` | string | Segment name |
| `activity_type` | string | `Ride` or `Run` |
| `distance` | float | Distance (meters) |
| `average_grade` | float | Average grade (%) |
| `maximum_grade` | float | Max grade (%) |
| `elevation_high` | float | Highest elevation (meters) |
| `elevation_low` | float | Lowest elevation (meters) |
| `start_latlng` | [lat,lng] | Start coordinates |
| `end_latlng` | [lat,lng] | End coordinates |
| `climb_category` | integer | 0-5 (5=HC, 0=uncategorized) |
| `city` | string | City |
| `state` | string | State/region |
| `country` | string | Country |
| `private` | boolean | Private segment |
| `athlete_pr_effort` | SummaryPRSegmentEffort | Your PR on this segment |
| `athlete_segment_stats` | SummarySegmentEffort | Your stats on this segment |
| `created_at` | DateTime | Creation time |
| `updated_at` | DateTime | Last update time |
| `total_elevation_gain` | float | Total elevation gain |
| `map` | PolylineMap | Polyline map |
| `effort_count` | integer | Total efforts on segment |
| `athlete_count` | integer | Unique athletes |
| `hazardous` | boolean | Hazardous segment |
| `star_count` | integer | Number of stars |

### Route

| Field | Type | Description |
|-------|------|-------------|
| `id` | long | Route ID |
| `id_str` | string | Route ID as string |
| `name` | string | Route name |
| `description` | string | Description |
| `athlete` | SummaryAthlete | Creator |
| `distance` | float | Distance (meters) |
| `elevation_gain` | float | Elevation gain (meters) |
| `map` | PolylineMap | Polyline map |
| `type` | integer | 1=ride, 2=run |
| `sub_type` | integer | 1=road, 2=mtb, 3=cx, 4=trail, 5=mixed |
| `private` | boolean | Private route |
| `starred` | boolean | Starred by you |
| `estimated_moving_time` | integer | Estimated moving time (seconds) |
| `segments` | SummarySegment[] | Segments in route |
| `waypoints` | Waypoint[] | Custom waypoints |
| `created_at` | DateTime | Creation time |
| `updated_at` | DateTime | Last update time |

### DetailedGear

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Gear ID |
| `resource_state` | integer | Detail level |
| `primary` | boolean | Default gear |
| `name` | string | Full name (Brand + Model + Nickname) |
| `distance` | float | Total distance logged |
| `brand_name` | string | Brand |
| `model_name` | string | Model |
| `frame_type` | integer | Frame type (bikes only) |
| `description` | string | Description |

### Comment

| Field | Type | Description |
|-------|------|-------------|
| `id` | long | Comment ID |
| `activity_id` | long | Activity ID |
| `text` | string | Comment content |
| `athlete` | SummaryAthlete | Comment author |
| `created_at` | DateTime | Creation time |
| `cursor` | string | Pagination cursor |

### Zones (Heart Rate & Power)

| Field | Type | Description |
|-------|------|-------------|
| `heart_rate` | HeartRateZoneRanges | HR zones |
| `power` | PowerZoneRanges | Power zones |

Each zone range contains: `min`, `max`, `time` (seconds spent in zone).

### ActivityZone (Zone Distribution for an Activity)

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `heartrate` or `power` |
| `sensor_based` | boolean | From sensor data |
| `distribution_buckets` | TimedZoneRange[] | Time in each zone |
| `points` | integer | Suffer score points |
| `score` | integer | Zone score |
| `custom_zones` | boolean | Using custom zones |
| `max` | integer | Max value |

### PolylineMap

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Map identifier |
| `polyline` | string | Google encoded polyline (detailed) |
| `summary_polyline` | string | Google encoded polyline (summary) |
| `resource_state` | integer | Detail level |

### PhotosSummary

| Field | Type | Description |
|-------|------|-------------|
| `count` | integer | Number of photos |
| `primary` | PhotosSummary_primary | Primary photo info |

---

## Webhooks

Webhooks enable real-time push notifications when activities are created, updated, or deleted, or when athletes deauthorize your app.

### Webhook Events

| Event | object_type | aspect_type | Details |
|-------|-------------|-------------|---------|
| Activity created | `activity` | `create` | New activity uploaded |
| Activity updated | `activity` | `update` | Title, type, or privacy changed |
| Activity deleted | `activity` | `delete` | Activity removed |
| App deauthorized | `athlete` | `update` | `updates: {"authorized": "false"}` |

### Webhook Payload

```json
{
  "aspect_type": "create",
  "event_time": 1549560669,
  "object_id": 1360128428,
  "object_type": "activity",
  "owner_id": 134815,
  "subscription_id": 120475,
  "updates": {}
}
```

### Managing Subscriptions

- Each app may have **only one** subscription
- **Create**: `POST https://www.strava.com/api/v3/push_subscriptions` (requires callback URL validation)
- **View**: `GET https://www.strava.com/api/v3/push_subscriptions?client_id=X&client_secret=Y`
- **Delete**: `DELETE https://www.strava.com/api/v3/push_subscriptions/{id}?client_id=X&client_secret=Y`

### Callback Validation

When you create a subscription, Strava sends a GET to your callback URL with:
- `hub.mode` = "subscribe"
- `hub.challenge` = random string
- `hub.verify_token` = your verify token

Your server must respond within 2 seconds with:
```json
{"hub.challenge": "the_challenge_string"}
```

### Event Processing Requirements

- Must respond with `200 OK` within 2 seconds
- Events are retried up to 3 times
- Process asynchronously if you need more time
- Privacy changes: apps with `activity:read` (not `read_all`) get `delete` when activity goes to "Only You" and `create` when it becomes visible again

---

## File Uploads

### Supported File Types
- **FIT** - Flexible and Interoperable Data Transfer (most complete)
- **TCX** - Training Center Database XML (supports power via extensions)
- **GPX** - GPS Exchange Format (supports extensions for HR, cadence, power, temp)

All files must include timestamps per trackpoint/record.

### Upload Endpoint

```bash
curl -X POST https://www.strava.com/api/v3/uploads \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -F sport_type="Run" \
  -F name="Morning Run" \
  -F description="Easy recovery" \
  -F data_type="fit" \
  -F file=@/path/to/activity.fit
```

### Upload Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `file` | Yes | The activity file (multipart/form-data) |
| `data_type` | Yes | `fit`, `fit.gz`, `tcx`, `tcx.gz`, `gpx`, `gpx.gz` |
| `sport_type` | No | Override detected sport type |
| `name` | No | Activity name |
| `description` | No | Activity description |
| `trainer` | No | 1 = stationary/trainer |
| `commute` | No | 1 = commute |
| `external_id` | No | Unique identifier |

### Upload Processing

Uploads are asynchronous:
1. POST returns an upload ID immediately
2. Poll `GET /uploads/{id}` to check status (recommended: 1 second intervals)
3. Mean processing time is under 2 seconds
4. When complete, response includes `activity_id`

### FIT File Attributes Used by Strava

**Session**: sport, sub_sport, total_elapsed_time, total_timer_time, total_distance, total_ascent, total_descent, total_calories, pool_length, avg_speed, max_speed, avg_heart_rate, avg_cadence, num_laps, total_work, avg_temperature, total_strides, total_cycles, avg_step_length

**Record (per-point data)**: timestamp, position_lat, position_long, altitude, enhanced_altitude, speed, enhanced_speed, heart_rate, cadence, distance, power, temperature

---

## Scopes & Permissions

| Scope | Description |
|-------|-------------|
| `read` | Public segments, routes, profiles, posts, events, club feeds, leaderboards |
| `read_all` | Private routes, segments, events |
| `profile:read_all` | Full profile even if set to Followers/Only You |
| `profile:write` | Update weight and FTP; star/unstar segments |
| `activity:read` | Activities visible to Everyone and Followers (excludes privacy zones) |
| `activity:read_all` | Same as activity:read PLUS privacy zone data AND Only You activities |
| `activity:write` | Create manual activities and uploads; edit visible activities |

### Recommended Scopes for Personal Data Analysis

```
activity:read_all,profile:read_all,read_all
```

This gives you access to ALL of your own data including private activities and privacy zones.

---

## What You CAN Get (Personal Data)

For your own data with full scopes, the API provides:

### Activity Data
- Complete GPS tracks (lat/lng streams at full resolution)
- Heart rate data (second-by-second stream)
- Power data (second-by-second, device or estimated)
- Cadence data (second-by-second)
- Temperature data (if sensor available)
- Velocity/speed (smoothed stream)
- Altitude/elevation (stream, corrected if no barometer)
- Grade/gradient (smoothed stream)
- Moving/stopped detection (boolean stream)
- Distance (cumulative stream)
- Lap data (auto and manual laps)
- Split data (per-km/mile for runs)
- Segment efforts and PRs
- Best efforts (running: 400m, 1/2 mile, 1K, 1 mile, 2 mile, 5K, 10K, 15K, 20K, half marathon, 30K, marathon)
- Zone distributions (HR and power)
- Calories
- Suffer score / relative effort
- Device name
- Gear used
- Photos
- Comments and kudos
- Map polylines (encoded)
- Privacy zone data (with `activity:read_all`)

### Athlete Data
- Profile information (name, location, photo)
- FTP (Functional Threshold Power)
- Weight
- HR and power zones (custom or default)
- Clubs, bikes, shoes
- Follower/friend counts
- Subscription status (`summit` field)
- All-time/YTD/recent stats (rides, runs, swims)

### Routes
- Full route details with waypoints
- GPX and TCX export
- Route streams (latlng, altitude, distance)

### Segments
- Segment details (grade, elevation, distance, map)
- Your PR effort on each segment
- Your effort count
- Segment effort streams
- Starred segments

---

## What You CANNOT Get (Gatekept Data)

These are data points visible in the Strava app/web that are **NOT available through the API**:

### Proprietary Calculations
- **Fitness score** (proprietary Training Impulse calculation)
- **Freshness score** (similar to CTL/ATL from TrainingPeaks)
- **Fatigue score**
- **Form score**
- **Training Load** (the combined fitness/freshness chart)
- **Relative Effort breakdown** (the detailed calculation, though `suffer_score` is available)
- **Matched Runs/Rides** (Strava's activity matching feature)
- **Estimated VO2 Max**
- **Race time estimates**

### Social/Community Data
- Other athletes' activity data (cannot query arbitrary athletes)
- Full segment leaderboards (removed for non-subscribers, endpoint deprecated)
- Global heatmap data
- Local legends data
- Flyby data
- Activity feed of people you follow (no feed endpoint)

### Features Behind Subscription
- Segment leaderboard data (`kom_rank` and related fields) - subscribers only
- Detailed segment effort data on certain endpoints - subscribers only
- Live Segments API - requires partner licensing

### Other Limitations
- No bulk export endpoint (must paginate through activities)
- No way to get ALL historical activities in one call (paginate with `per_page` max 200)
- Weekly/monthly aggregated metrics not directly available (must calculate from activities)
- No direct notification of new data (use webhooks instead of polling)
- Per-page limit of 200 items
- Email addresses removed from API (since Jan 2019)

### GDPR Bulk Export Alternative

Strava offers a GDPR data export at https://www.strava.com/athlete/delete_your_account (don't delete - just download). This export includes:
- All original activity files (FIT/GPX/TCX)
- Profile data
- Photos
- Comments
- Messages
- More comprehensive than API for historical bulk data

---

## November 2024 API Agreement Changes

**Effective November 15, 2024** - Major restrictions were added:

### Key Changes

1. **Display Restriction**: Third-party apps can no longer display a user's Strava activity data to anyone other than the user themselves. Breaks coaching apps, comparison apps, and social features.

2. **AI Prohibition**: Explicit prohibition on using any data obtained via Strava's API in AI models or similar applications. Quote: "We're updating our terms to explicitly prohibit third parties from using any data obtained via Strava's API in artificial intelligence models or other similar applications."

3. **Analytics Ban**: New language prohibiting processing Strava data for analytics, analyses, customer insights, or product improvements. Quote: "You may not process or disclose Strava Data...for the purposes of, including but not limited to, analytics, analyses, customer insights generation, and products or services improvements."

### Impact for Personal Use

For personal use analyzing your own data:
- **You are still fine** to access your own data via the API
- The restrictions primarily target third-party applications serving multiple users
- "Single Player Mode" (capacity 1) apps are essentially personal tools
- The spirit of the restrictions is preventing commercial exploitation, not personal data access
- However, the letter of the law is very broad and could theoretically apply to any data processing

### Community Reaction

- DC Rainmaker published a major article calling it "Strava's Big Changes Aim To Kill Off Apps"
- Apps like Intervals.icu had to hide coaching features related to Strava data
- VeloViewer and similar analytics apps were significantly impacted
- GDPR concerns raised about data portability rights (Article 20)
- Strava gave apps only 30 days to comply
- Multiple apps migrated to pulling data directly from device manufacturers (Garmin, Wahoo) instead

---

## Subscription vs Free Data Differences

Since May 2020, certain data is only available for Strava subscribers:

### Subscriber-Only via API
- Segment leaderboard endpoint (`/segments/{id}/leaderboard`) - **completely removed**
- `kom_rank` field on segment efforts
- Segment effort & leaderboard data in these endpoints:
  - `/segments/{id}` (certain fields)
  - `/segment_efforts`
  - `/segment_efforts/{id}/streams`
  - `/activities/{id}` (certain segment effort fields)

### Available Regardless of Subscription
- Individual segment efforts
- Segment efforts within activities
- Personal achievements (PRs)
- Top 10 leaderboard rankings (at time of upload)
- All activity data, streams, and stats

---

## Sport Types & Activity Types

### SportType (Preferred - use this)

`AlpineSki`, `BackcountrySki`, `Badminton`, `Canoeing`, `Crossfit`, `EBikeRide`, `Elliptical`, `EMountainBikeRide`, `Golf`, `GravelRide`, `Handcycle`, `HighIntensityIntervalTraining`, `Hike`, `IceSkate`, `InlineSkate`, `Kayaking`, `Kitesurf`, `MountainBikeRide`, `NordicSki`, `Pickleball`, `Pilates`, `Racquetball`, `Ride`, `RockClimbing`, `RollerSki`, `Rowing`, `Run`, `Sail`, `Skateboard`, `Snowboard`, `Snowshoe`, `Soccer`, `Squash`, `StairStepper`, `StandUpPaddling`, `Surfing`, `Swim`, `TableTennis`, `Tennis`, `TrailRun`, `Velomobile`, `VirtualRide`, `VirtualRow`, `VirtualRun`, `Walk`, `WeightTraining`, `Wheelchair`, `Windsurf`, `Workout`, `Yoga`

### ActivityType (Deprecated but still supported)

Same as above minus the newer types like `MountainBikeRide`, `EMountainBikeRide`, `GravelRide`, `TrailRun`, `Badminton`, `Pickleball`, `Racquetball`, `Squash`, `TableTennis`, `Tennis`, `VirtualRow`, `HighIntensityIntervalTraining`, `Pilates`.

When both `type` and `sport_type` are present, `type` is ignored.

---

## Conventions

### Object Representations

Three levels of detail, indicated by `resource_state`:
1. **Meta** (resource_state: 1) - Just an ID
2. **Summary** (resource_state: 2) - Key fields
3. **Detailed** (resource_state: 3) - All fields

### Pagination

- Default page size: 30
- Max page size: 200
- Parameters: `page` (1-based) and `per_page`
- Iterate until an empty page is returned
- For comments: use `page_size` + `after_cursor` (newer pagination)

### Polylines

GPS paths are encoded using the [Google Encoded Polyline Algorithm](https://developers.google.com/maps/documentation/utilities/polylinealgorithm).

### Dates

ISO 8601 format: `2018-06-24T09:54:13Z` or `2018-06-24T09:54:13-07:00`

`start_date_local` is UTC-formatted local time (display as UTC to show correct local time).

Activities with hidden start times show: `"start_date_local": "2024-07-02T00:00:01Z"` (midnight + 1 second).

### IDs

All IDs are 64-bit integers. Use `id_str` fields if your platform can't handle 64-bit integers natively.

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 401 | Unauthorized |
| 402 | Payment Required (subscription feature) |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error - check https://status.strava.com |

---

## Changelog Highlights

| Date | Change |
|------|--------|
| Oct 2025 | `device_name` added to activity summary |
| Jul 2024 | Hidden start times return midnight+1s |
| Jan 2024 | Route `waypoints` introduced |
| Jun 2022 | `sport_type` introduced (preferred over `type`) |
| Feb 2022 | `start_latitude`/`start_longitude` deprecated, use `start_latlng` |
| Oct 2021 | Running Races endpoints deprecated and removed |
| Oct 2021 | `hide_from_home` added for muting activities |
| May 2020 | Segment API changes - leaderboard removed, subscriber-only data |
| Jun 2020 | All IDs changed to 64-bit |
| Oct 2019 | Forever tokens rejected, OAuth refresh required |
| Jan 2019 | Email removed from athlete model |
| Oct 2018 | New OAuth with refresh tokens and granular scopes |

---

## Brand Guidelines Summary

If building a visible application:
- Use official "Connect with Strava" buttons (orange or white)
- Display "Powered by Strava" or "Compatible with Strava" logos
- Never imply Strava sponsorship or development
- Never use Strava logos as your app icon
- Link back to Strava data sources with "View on Strava" text
- Brand color: `#FC5200` (orange)
- Download assets at https://developers.strava.com/guidelines
- Must comply with API Agreement: https://www.strava.com/legal/api

---

## Quick Reference: Common Personal Use Patterns

### Get all your activities
```bash
# Page through all activities (max 200 per page)
curl -G "https://www.strava.com/api/v3/athlete/activities" \
  -H "Authorization: Bearer TOKEN" \
  -d "per_page=200" -d "page=1"
```

### Get detailed activity with all data
```bash
curl -G "https://www.strava.com/api/v3/activities/{id}" \
  -H "Authorization: Bearer TOKEN" \
  -d "include_all_efforts=true"
```

### Get all streams for an activity
```bash
curl -G "https://www.strava.com/api/v3/activities/{id}/streams" \
  -H "Authorization: Bearer TOKEN" \
  -d "keys=time,distance,latlng,altitude,heartrate,cadence,watts,temp,velocity_smooth,grade_smooth,moving" \
  -d "key_by_type=true"
```

### Get your profile and zones
```bash
curl -G "https://www.strava.com/api/v3/athlete" \
  -H "Authorization: Bearer TOKEN"

curl -G "https://www.strava.com/api/v3/athlete/zones" \
  -H "Authorization: Bearer TOKEN"
```

### Get your all-time stats
```bash
curl -G "https://www.strava.com/api/v3/athletes/{your_athlete_id}/stats" \
  -H "Authorization: Bearer TOKEN"
```

---

*Raw source files in `.firecrawl/` and `research/` directories. Swagger spec at `research/strava-swagger-spec.json`.*
