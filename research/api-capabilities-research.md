# Strava API v3 -- Comprehensive Capabilities Research

**Research Date:** April 2026
**Purpose:** Determine what personal data a solo developer can access through the Strava API for analyzing their own activity data, and identify what Strava holds back.

---

## Table of Contents

1. [API Access Tiers](#1-api-access-tiers)
2. [Authentication for Personal Use](#2-authentication-for-personal-use)
3. [Available Endpoints -- Full Inventory](#3-available-endpoints--full-inventory)
4. [Personal Activity Data You CAN Get](#4-personal-activity-data-you-can-get)
5. [Streams / GPS / Sensor Data](#5-streams--gps--sensor-data)
6. [What the API Does NOT Give You (But the App Does)](#6-what-the-api-does-not-give-you-but-the-app-does)
7. [Premium / Subscriber-Gated Data in the API](#7-premium--subscriber-gated-data-in-the-api)
8. [Bulk Export (GDPR) vs API Comparison](#8-bulk-export-gdpr-vs-api-comparison)
9. [Rate Limits](#9-rate-limits)
10. [Webhook Capabilities](#10-webhook-capabilities)
11. [November 2024 API Agreement Changes](#11-november-2024-api-agreement-changes)
12. [Recent API Changelog](#12-recent-api-changelog)
13. [Community Insights and Gotchas](#13-community-insights-and-gotchas)
14. [Recommended Libraries and Tools](#14-recommended-libraries-and-tools)
15. [Bottom Line Assessment](#15-bottom-line-assessment)

---

## 1. API Access Tiers

### Single Player Mode (Personal Use)

All newly created apps automatically start in **"Single Player Mode"** with an athlete capacity of **1**. This is the tier that matters for personal use.

- **No app review required** -- you can use it immediately for your own data
- **No additional athletes** can authorize your app until you submit for review
- **Full API access** to your own data within rate limits
- **Free** -- no cost to use the API for personal projects

### Multi-User / Developer Program

If you want other athletes to use your app:

- Must submit a **Developer Program form** for review
- All existing apps were required to submit by **March 4, 2024**
- Review checks: API agreement compliance, branding guidelines, athlete privacy, rate limits
- Approval grants increased athlete capacity and potentially higher rate limits
- Strava provides feedback if your app is not compliant

### Commercial / Partner Tier

- Dedicated partner account managers
- Higher rate limits (negotiated)
- Access to partner-specific features (e.g., Strava Live Segments for hardware partners)
- Requires formal partnership agreement

**Key takeaway:** For analyzing your own data, Single Player Mode gives you everything you need with zero bureaucracy.

Sources:
- [Strava Developer Program](https://communityhub.strava.com/developers-knowledge-base-14/our-developer-program-3203)
- [Getting Started](https://developers.strava.com/docs/getting-started/)

---

## 2. Authentication for Personal Use

### OAuth 2.0 Flow (Required)

Even for personal use, you must go through OAuth 2.0. There is no API key shortcut.

**Step-by-step for personal/local use:**

1. **Create an app** at [strava.com/settings/api](https://www.strava.com/settings/api)
   - Set Authorization Callback Domain to `localhost`
   - You receive a **Client ID** and **Client Secret**

2. **Build the authorization URL** and paste it into your browser:
   ```
   https://www.strava.com/oauth/authorize?client_id=YOUR_ID&response_type=code&redirect_uri=http://localhost&scope=read_all,activity:read_all,profile:read_all,activity:write&approval_prompt=force
   ```

3. **Extract the authorization code** from the redirect URL in your browser's address bar

4. **Exchange for tokens** via POST:
   ```
   POST https://www.strava.com/oauth/token
   client_id=YOUR_ID
   client_secret=YOUR_SECRET
   code=AUTHORIZATION_CODE
   grant_type=authorization_code
   ```

5. **Store both tokens** -- you get an access token (expires in 6 hours) and a refresh token (long-lived)

6. **Refresh when needed** -- POST to the same token endpoint with `grant_type=refresh_token`

### Available Scopes

| Scope | What It Grants |
|-------|---------------|
| `read` | Public segments, routes, profiles, posts, events, club feeds, leaderboards |
| `read_all` | Private routes, private segments, private events |
| `profile:read_all` | Full profile info even if set to Followers/Only You |
| `profile:write` | Update weight and FTP, star/unstar segments |
| `activity:read` | Activities visible to Everyone and Followers (no privacy zone data) |
| `activity:read_all` | **Everything** -- all activities including "Only You" visibility + privacy zone data |
| `activity:write` | Create manual activities, upload files, edit activities |

**For personal use, request ALL scopes.** There is no reason not to -- it is your own data.

### Token Details

- **Access tokens** expire after **6 hours** (21,600 seconds)
- **Refresh tokens** are long-lived but may change on each refresh
- Old refresh tokens are **immediately invalidated** when a new one is issued
- Tokens are Bearer tokens: `Authorization: Bearer {access_token}`

### Quick Testing

The [Swagger Playground](https://developers.strava.com/playground) is the fastest way to test API calls. Authorize with your Client ID and Secret directly in the browser.

Sources:
- [Strava Authentication Docs](https://developers.strava.com/docs/authentication/)
- [Getting Started](https://developers.strava.com/docs/getting-started/)

---

## 3. Available Endpoints -- Full Inventory

### Activities
| Endpoint | Method | Returns |
|----------|--------|---------|
| `/activities` | POST | Create a manual activity |
| `/activities/{id}` | GET | DetailedActivity (full data) |
| `/activities/{id}` | PUT | Update an activity |
| `/activities/{id}/comments` | GET | List comments |
| `/activities/{id}/kudos` | GET | List kudoers |
| `/activities/{id}/laps` | GET | Lap data |
| `/activities/{id}/zones` | GET | Heart rate and power zone distribution |
| `/athlete/activities` | GET | List all your activities (SummaryActivity) |

### Athletes
| Endpoint | Method | Returns |
|----------|--------|---------|
| `/athlete` | GET | Your full profile (DetailedAthlete) |
| `/athlete` | PUT | Update your profile |
| `/athlete/zones` | GET | Your HR and power zones |
| `/athletes/{id}/stats` | GET | Lifetime and recent stats |

### Segments
| Endpoint | Method | Returns |
|----------|--------|---------|
| `/segments/explore` | GET | Discover segments in an area |
| `/segments/{id}` | GET | Segment details |
| `/segments/{id}/starred` | POST | Star/unstar a segment |
| `/segments/{id}/all_efforts` | GET | Your efforts on a segment |
| `/athlete/segments/starred` | GET | Your starred segments |

### Segment Efforts
| Endpoint | Method | Returns |
|----------|--------|---------|
| `/segment_efforts/{id}` | GET | Detailed effort data |

### Streams (Time-Series Data)
| Endpoint | Method | Returns |
|----------|--------|---------|
| `/activities/{id}/streams` | GET | Activity sensor/GPS streams |
| `/routes/{id}/streams` | GET | Route path streams |
| `/segment_efforts/{id}/streams` | GET | Effort streams |
| `/segments/{id}/streams` | GET | Segment path streams |

### Routes
| Endpoint | Method | Returns |
|----------|--------|---------|
| `/routes/{id}` | GET | Route details |
| `/routes/{id}/export_gpx` | GET | Export route as GPX |
| `/routes/{id}/export_tcx` | GET | Export route as TCX |
| `/athletes/{id}/routes` | GET | List your routes |

### Clubs
| Endpoint | Method | Returns |
|----------|--------|---------|
| `/clubs/{id}` | GET | Club details |
| `/clubs/{id}/activities` | GET | Club activity feed |
| `/clubs/{id}/admins` | GET | Club admins |
| `/clubs/{id}/members` | GET | Club members |
| `/athlete/clubs` | GET | Your clubs |

### Gear
| Endpoint | Method | Returns |
|----------|--------|---------|
| `/gear/{id}` | GET | Equipment details |

### Uploads
| Endpoint | Method | Returns |
|----------|--------|---------|
| `/uploads` | POST | Upload an activity file (FIT, TCX, GPX) |
| `/uploads/{id}` | GET | Check upload status |

Sources:
- [Strava API v3 Reference](https://developers.strava.com/docs/reference/)

---

## 4. Personal Activity Data You CAN Get

### DetailedActivity Fields (from GET /activities/{id})

When you fetch a single activity with full detail, you get:

**Core Metrics:**
- `distance` (meters), `moving_time` (seconds), `elapsed_time` (seconds)
- `total_elevation_gain` (meters), `elev_high`, `elev_low`
- `average_speed`, `max_speed` (meters/second)
- `calories` (float)

**Heart Rate (if recorded):**
- `has_heartrate` (boolean)
- `average_heartrate`, `max_heartrate`

**Power (if recorded):**
- `average_watts`, `max_watts`, `weighted_average_watts`
- `kilojoules`
- `device_watts` (true if from a real power meter vs estimated)

**Effort / Training Load:**
- `suffer_score` (this is Relative Effort -- **subscriber-only field**)

**Location / GPS:**
- `start_latlng`, `end_latlng`
- `map` (contains encoded polyline of the route)
- `timezone`

**Metadata:**
- `name`, `description`, `private_note`
- `type` / `sport_type`
- `start_date`, `start_date_local`
- `trainer` (indoor), `commute`, `manual`
- `gear_id` + full `gear` object
- `device_name` (added October 2025)
- `workout_type`
- `visibility` (`everyone`, `followers_only`, `only_me`)
- `embed_token`

**Social:**
- `kudos_count`, `comment_count`, `athlete_count`, `photo_count`
- `achievement_count`, `pr_count`
- `has_kudoed`

**Structured Data:**
- `segment_efforts` -- array of DetailedSegmentEffort for every segment matched
- `best_efforts` -- best effort times for standard distances (e.g., 400m, 1k, 1 mile, 5k, 10k, half marathon, marathon)
- `splits_metric` / `splits_standard` -- per-km or per-mile splits
- `laps` -- lap data from your device
- `photos` -- photo summary with URLs

### SummaryActivity (from GET /athlete/activities)

The list endpoint returns less data per activity. It includes most core metrics but omits:
- `description`, `calories`, `segment_efforts`, `best_efforts`
- `splits_metric/standard`, `laps`, `photos`, `embed_token`

You need to call GET `/activities/{id}` for each activity to get full detail.

### Activity Zones (from GET /activities/{id}/zones)

Returns time spent in each heart rate zone and power zone for the activity. **Requires the authenticated athlete to be a Strava subscriber** for the full zone breakdown.

### Athlete Stats (from GET /athletes/{id}/stats)

Aggregated lifetime and recent (4-week) stats:
- Total ride/run/swim count, distance, moving time, elevation gain
- Biggest ride distance, biggest climb elevation

Sources:
- [Strava API Reference](https://developers.strava.com/docs/reference/)
- [DetailedActivity Model](https://github.com/sshevlyagin/strava-api-v3.1/blob/master/docs/DetailedActivity.md)

---

## 5. Streams / GPS / Sensor Data

This is where the real depth is. Streams are **second-by-second time-series data** for your activities.

### Available Stream Types

| Stream Key | Data | Unit |
|-----------|------|------|
| `time` | Seconds from start | seconds |
| `latlng` | GPS coordinates | [lat, lng] pairs |
| `distance` | Cumulative distance | meters |
| `altitude` | Elevation | meters |
| `velocity_smooth` | Smoothed speed | meters/second |
| `heartrate` | Heart rate | bpm |
| `cadence` | Cadence | rpm (cycling) or spm (running) |
| `watts` | Power output | watts |
| `temp` | Temperature | degrees Celsius |
| `moving` | Moving flag | boolean |
| `grade_smooth` | Smoothed gradient | percent |

### How to Request Streams

```
GET /activities/{id}/streams?keys=time,latlng,heartrate,watts,cadence,altitude,distance,velocity_smooth,temp,moving,grade_smooth&key_by_type=true
```

Request multiple stream types in a single call. Any stream not recorded for that activity is simply omitted from the response.

### What You Get

- **GPS tracks**: Full latitude/longitude at every recording interval (typically every 1 second)
- **Heart rate**: Every recorded HR data point
- **Power**: Every power reading from your power meter
- **Cadence**: Full cadence stream
- **Temperature**: If your device records it
- **Altitude**: Strava-corrected elevation data
- **Grade**: Calculated gradient for every point

### Stream Availability

Streams are only returned for activities you own (as the authenticated athlete). The data depends on what your device actually recorded -- if you rode without a heart rate monitor, there is no `heartrate` stream.

### Also Available For

- **Segment efforts**: `GET /segment_efforts/{id}/streams` -- the portion of your stream that corresponds to a segment
- **Segments themselves**: `GET /segments/{id}/streams` -- the reference path of the segment
- **Routes**: `GET /routes/{id}/streams` -- route path data

**Verdict: Streams give you essentially the same raw data that Strava has. This is the most complete data access the API offers.**

Sources:
- [Strava API Reference - Streams](https://developers.strava.com/docs/reference/)
- [Stravalib Documentation](https://stravalib.readthedocs.io/en/v1.3.3/reference/api/stravalib.client.Client.get_activity_streams.html)

---

## 6. What the API Does NOT Give You (But the App Does)

This is the critical section. Here is everything Strava shows you in the app/website that **is not available through the API**:

### Completely Missing from API

| Feature | App Has It? | API Access? | Notes |
|---------|------------|-------------|-------|
| **Fitness Score (CTL)** | Yes (subscribers) | **NO** | Must calculate yourself from suffer_score/power data |
| **Freshness Score** | Yes (subscribers) | **NO** | Must calculate yourself |
| **Form Score (TSB)** | Yes (subscribers) | **NO** | Must calculate yourself |
| **Training Load** | Yes (subscribers) | **NO** | Not directly exposed; can approximate from weighted power |
| **Relative Effort trend/chart** | Yes | **NO** | Individual suffer_score per activity is available, but not the trend |
| **Power Curve** | Yes (subscribers) | **NO** | Must build yourself from stream data |
| **Fitness & Freshness Graph** | Yes (subscribers) | **NO** | Must build yourself entirely |
| **Weekly/Monthly Distance Totals** | Yes | **NO** | Must aggregate from individual activities |
| **Weekly/Monthly Elevation Totals** | Yes | **NO** | Must aggregate from individual activities |
| **Training Log View** | Yes (subscribers) | **NO** | Must build yourself |
| **Goals** | Yes (subscribers) | **NO** | No endpoint exists |
| **Training Plans** | Yes (subscribers) | **NO** | No endpoint exists |
| **Matched Activities** | Yes | **NO** | No endpoint to find activities on the same route |
| **Local Legends** | Yes | **NO** | No endpoint |
| **Global Heatmap** | Yes | **NO** | No public API for heatmap data |
| **Flyby / Who Passed You** | Deprecated | **NO** | Feature was removed from Strava |
| **Segment Leaderboards** | Yes (subscribers) | **REMOVED** | Endpoint was removed in June 2020 |
| **Age/Weight Group Leaderboard Filters** | Yes (subscribers) | **NO** | Was subscriber-only before removal |
| **Beacon (Live Location)** | Yes (subscribers) | **NO** | Safety feature, not API-accessible |
| **Route Recommendations** | Yes (subscribers) | **NO** | Not API-accessible |
| **Personal Heatmap** | Yes (subscribers) | **NO** | Must build from GPS streams |

### Available but Require Calculation

| Feature | Raw Data Available? | Effort to Recreate |
|---------|-------------------|-------------------|
| Fitness/Freshness/Form | suffer_score + power streams | **High** -- Strava uses undisclosed formulas based on Banister impulse-response model |
| Power Curve | watts streams | **Medium** -- iterate through streams to find best power for each duration |
| Weekly/Monthly rollups | Individual activity data | **Low** -- simple aggregation |
| Elevation profiles | altitude streams | **Low** -- plot directly |
| Pace/Speed charts | velocity_smooth streams | **Low** -- plot directly |
| Personal heatmap | latlng streams | **Medium** -- aggregate all GPS data, use mapping library |

### Cannot Download Original Activity Files via API

A critical limitation: **the API does not provide endpoints to download original FIT/TCX/GPX files** for your activities. You can:
- Download streams (second-by-second data) and reconstruct files
- Export **routes** as GPX/TCX (but routes are not activities)
- Use the **web interface** to manually export individual activities (Export Original / Export GPX)
- Use the **bulk export** to get all original files

Sources:
- [Strava Community - Fitness Endpoint Request](https://communityhub.strava.com/developers-api-7/api-endpoint-to-retrieve-fitness-8274)
- [Strava Community - Relative Effort and Private Notes](https://communityhub.strava.com/developers-api-7/retrieving-relative-effort-and-private-notes-10216)
- [Segment Changes](https://developers.strava.com/docs/segment-changes/)
- [Limitations Blog Post by Zach Robertson](https://www.zachrobertson.tech/blog/strava-api)

---

## 7. Premium / Subscriber-Gated Data in the API

Some API data is only returned if the authenticated athlete has a **Strava subscription** (currently ~$12/month or ~$80/year):

### Subscriber-Only Fields

| Data | Endpoint | Free User Gets |
|------|----------|---------------|
| `suffer_score` (Relative Effort) | Activity detail + list | `null` |
| `kom_rank` on segments | Segment efforts | Omitted |
| Activity Zones (full breakdown) | `/activities/{id}/zones` | Limited or error |
| Segment leaderboard age/weight filters | Was on leaderboard endpoint | Endpoint removed entirely |
| Segment effort streams | `/segment_efforts/{id}/streams` | May return error for non-subscribers |

### Still Available for Free Users

- All core activity metrics (distance, time, speed, elevation, etc.)
- Heart rate averages and maximums
- Power averages and maximums
- GPS streams (latlng)
- All sensor streams (heartrate, watts, cadence, temp)
- Personal PRs and achievements
- Top 10 segment rankings
- Individual segment effort data
- Photos
- Gear data
- Clubs and routes

**Key insight:** For personal analytics, the raw data (streams, activity metrics) is available to free users. The subscriber paywall primarily affects `suffer_score`, zone breakdowns, and segment leaderboard features. If you have a power meter, you can calculate most training metrics yourself from the raw streams.

Sources:
- [Segment Changes Documentation](https://developers.strava.com/docs/segment-changes/)
- [Strava Community Discussions](https://communityhub.strava.com/developers-api-7)

---

## 8. Bulk Export (GDPR) vs API Comparison

### How to Get the Bulk Export

1. Go to [strava.com/athlete/delete_your_account](https://www.strava.com/athlete/delete_your_account) (you do NOT need to delete your account)
2. Click "Request Your Archive"
3. Wait for email (can take a few hours)
4. Download the ZIP file

### What the Bulk Export Contains

| Content | Format | Notes |
|---------|--------|-------|
| **activities.csv** | CSV (83 columns) | Summary of every activity with all metrics |
| **Activity files** | Original format (FIT/TCX/GPX) | Every activity in the format it was uploaded |
| **Photos** | Image files | All uploaded photos |
| **Routes** | GPX files | All created routes |
| **Profile data** | JSON | Account info and settings |
| **Posts and comments** | JSON/CSV | Social interactions |
| **Gear** | CSV/JSON | Shoes, bikes, etc. |
| **Goals** | CSV/JSON | Goal settings |
| **Synced contacts** | CSV | Contact data |
| **Kudos and starred segments** | CSV | Actions you have performed |
| **Privacy settings** | CSV | Per-activity privacy controls |
| **Device names** | CSV | Devices used to record |

### Bulk Export vs API -- Head to Head

| Capability | Bulk Export | API |
|-----------|------------|-----|
| Original FIT/TCX/GPX files | **YES** | **NO** |
| Second-by-second streams | Embedded in FIT files | **YES** (structured JSON) |
| Activity summary metrics | **YES** (83 fields in CSV) | **YES** (as JSON) |
| Real-time / incremental | **NO** (one-time snapshot) | **YES** (poll or webhook) |
| Photos | **YES** | **YES** (URLs only) |
| Segment efforts | **NO** | **YES** |
| Segment data | **NO** | **YES** |
| KOM data | **NO** (explicitly excluded) | Partial (subscriber) |
| Routes | **YES** (GPX) | **YES** (GPX/TCX + data) |
| Social data (posts, comments) | **YES** | Limited (per-activity only) |
| Goals | **YES** | **NO** |
| Structured/queryable | **NO** (flat files) | **YES** (JSON API) |
| Automation | **NO** (manual request) | **YES** |

### Best Strategy: Use Both

1. **Start with bulk export** to get your complete historical archive with original files
2. **Use the API going forward** for incremental updates and structured queries
3. Parse the FIT files from the export for data that the API does not provide (original device data, manufacturer-specific fields)

Sources:
- [Strava Data Export Support](https://support.strava.com/hc/en-us/articles/216918437-Exporting-your-Data-and-Bulk-Export)
- [StrideSync Export Guide](https://www.stridesync.co/blog/best-way-to-export-strava-data-long-term-storage)

---

## 9. Rate Limits

### Default Limits (Single Player Mode)

| Limit Type | 15-Minute Window | Daily |
|-----------|-----------------|-------|
| **Overall** (all requests) | 200 requests | 2,000 requests |
| **Read** (GET endpoints only) | 100 requests | 1,000 requests |

Upload/write endpoints (POST activities, POST uploads) have the overall limit but are exempt from the read limit.

### Rate Limit Reset Schedule

- **15-minute limits** reset at :00, :15, :30, :45 past each hour
- **Daily limits** reset at **midnight UTC**

### Response Headers

Every API response includes four rate limit headers:

```
X-RateLimit-Limit: 200,2000        # Overall 15-min and daily caps
X-RateLimit-Usage: 45,350          # Current 15-min and daily usage
X-ReadRateLimit-Limit: 100,1000    # Read-specific caps
X-ReadRateLimit-Usage: 30,200      # Current read usage
```

### When You Hit the Limit

- API returns **HTTP 429 Too Many Requests**
- Requests that violate the short-term limit **still count toward the daily limit**
- No automatic retry -- you must wait for the window to reset

### Practical Impact for Personal Use

With 1,000 read requests per day, you can:
- Fetch ~1,000 individual activity details per day (one request each)
- Or list 200 activities per page x 5 pages = 1,000 activities in 5 requests
- Fetching streams for each activity costs 1 request per activity

**For initial backfill of years of data:** If you have 2,000 activities and want full detail + streams for each, that is 4,000 requests. At 1,000/day, it takes ~4 days to backfill everything. Plan accordingly.

### Requesting Higher Limits

Requires: approaching current capacity, completing the Developer Program form, API terms compliance, and brand guideline compliance. For personal single-player use, the default limits are generally sufficient.

Sources:
- [Rate Limits Documentation](https://developers.strava.com/docs/rate-limits/)
- [Rate Limits Community Hub](https://communityhub.strava.com/developers-knowledge-base-14/rate-limits-3201)

---

## 10. Webhook Capabilities

### What Webhooks Provide

Real-time push notifications when activities are created, updated, or deleted -- eliminating the need to poll.

### Supported Events

| Object Type | Event | Trigger |
|------------|-------|---------|
| Activity | `create` | New activity uploaded/saved |
| Activity | `update` | Title, type, or privacy changed |
| Activity | `delete` | Activity deleted |
| Athlete | `update` | Athlete deauthorizes your app |

### Webhook Payload

```json
{
  "object_type": "activity",
  "object_id": 1234567890,
  "aspect_type": "create",
  "updates": {},
  "owner_id": 12345,
  "subscription_id": 1,
  "event_time": 1714000000
}
```

**Important:** The webhook payload contains **only the event metadata** -- not the actual activity data. You must make a separate API call to fetch the activity details.

### Subscription Limits

- **One subscription per application** (covers all authorized athletes)
- Callback URL max length: 255 characters
- Must acknowledge with HTTP 200 **within 2 seconds**
- Failed deliveries retry up to **3 times**

### Setup Requirements

1. Your app needs a publicly accessible HTTPS endpoint
2. Strava validates the endpoint with a GET request containing a `hub.challenge` parameter
3. Your server must echo the challenge back in JSON

### For Personal Use

Webhooks require a server that can receive HTTP requests. Options:
- A cheap VPS or cloud function (AWS Lambda, Cloudflare Worker, etc.)
- ngrok tunnel for development
- A Raspberry Pi with port forwarding

This is the proper way to get notified of new activities instead of polling, but it adds infrastructure complexity for a personal project.

Sources:
- [Webhook Events API](https://developers.strava.com/docs/webhooks/)
- [Webhook Example](https://developers.strava.com/docs/webhookexample/)

---

## 11. November 2024 API Agreement Changes

### What Changed (Effective November 11, 2024)

Strava made significant changes to their API agreement with only 30 days' notice:

1. **No Displaying Data to Other Users**
   Third-party apps can no longer display a user's Strava activity data to anyone other than the user themselves. This killed public leaderboards, social feeds, and coach views in many apps.

2. **AI/ML Training Prohibition**
   Explicit ban on using any API data "for any model training related to artificial intelligence, machine learning or similar applications." This was already implicit but is now explicit.

3. **Analytics Restrictions**
   Broad prohibition on processing data "for the purposes of, including but not limited to, analytics, analyses, customer insights generation." This language is vague and caused confusion.

### Impact on Personal Use

**Minimal direct impact.** These restrictions target multi-user apps that display one user's data to other users. For a personal project where you are the only user accessing your own data:

- You can still pull all your own data
- You can still analyze it however you want
- You can still build personal dashboards
- You cannot share the raw data publicly or train AI models with it

### Community Reaction

- Massive backlash from developers and users
- Coaching platforms (Intervals.icu, Final Surge, Xert, TrainerRoad) were significantly affected
- VeloViewer lost segment comparison features
- Users canceled premium subscriptions in protest
- Contradictory enforcement -- some apps were approved while similar apps were restricted
- DC Rainmaker published a detailed critical analysis

Sources:
- [Strava Press Release](https://press.strava.com/articles/updates-to-stravas-api-agreement)
- [DC Rainmaker Analysis](https://www.dcrainmaker.com/2024/11/stravas-changes-to-kill-off-apps.html)
- [Marathon Handbook Coverage](https://marathonhandbook.com/strava-api-changes/)
- [Strava Support Article](https://support.strava.com/hc/en-us/articles/31798729397773-API-Agreement-Update-How-Data-Appears-on-3rd-Party-Apps)

---

## 12. Recent API Changelog

| Date | Change |
|------|--------|
| **October 27, 2025** | `device_name` field added to activity summary endpoint |
| **July 3, 2024** | Activities with concealed start times return midnight+1s timestamp |
| **January 8, 2024** | Routes now support `waypoints` (custom waypoints from route builder) |
| **November 9, 2023** | Webhook subscription DELETE updated to accept query parameters |
| **August 22, 2023** | Gear `name` attribute now returns full designation (brand + model + nickname) |
| **June 2020** | Segment leaderboard endpoint removed; segment effort/leaderboard data gated to subscribers |
| **December 2015** | `suffer_score` added to activity summaries |

**Notable:** The API has seen very few functional additions in recent years. Strava appears to be adding restrictions rather than capabilities.

Sources:
- [Strava API Changelog](https://developers.strava.com/docs/changelog/)
- [Segment Changes](https://developers.strava.com/docs/segment-changes/)

---

## 13. Community Insights and Gotchas

### Gotcha: SummaryActivity vs DetailedActivity

The list endpoint (`/athlete/activities`) returns **SummaryActivity** objects with fewer fields. To get full data (description, calories, segment efforts, best efforts, splits, laps), you must make a **separate GET request per activity**. This is the most common rate limit issue for backfills.

### Gotcha: Pagination Max is 200

The maximum `per_page` value is 200. To get all activities, loop through pages until you receive fewer than 200 results. Use `before` and `after` epoch timestamps for date-range filtering.

### Gotcha: Heart Rate Data Not Always Present

Some activities may not have heart rate data even if your device supports it. The `has_heartrate` boolean tells you. Indoor activities, manual entries, and activities from basic GPS watches will lack HR streams.

### Gotcha: latlng Streams Missing for Some Activity Types

Strength training, yoga, and other indoor activities do not have GPS data. The API simply omits the `latlng` stream -- it does not return an error.

### Gotcha: Privacy Zones

Without `activity:read_all` scope, GPS data within your configured privacy zones is stripped from streams. Always use `activity:read_all` for personal use.

### Gotcha: Token Refresh Changes the Refresh Token

When you refresh your access token, the refresh token itself may change. Always store the new refresh token from the response, or you will lock yourself out.

### Gotcha: Cloudflare Blocking

In August 2024, users reported Strava's Cloudflare setup blocking API calls from certain cloud providers (AWS, GCP). Requests from personal computers still worked. If hosting on a cloud provider, you may need to handle this.

### Gotcha: Activity Type vs Sport Type

The `type` field is being deprecated in favor of `sport_type`, which is more granular. Use `sport_type` for new development.

### Community Recommendations

- **Use stravalib (Python)** for the best developer experience with built-in rate limiting
- **Cache aggressively** -- activity data rarely changes after upload
- **Backfill during off-hours** to avoid rate limit friction
- **Store raw JSON** from the API to avoid re-fetching
- **Combine bulk export + API** for the most complete dataset

Sources:
- [Strava Community Hub - Developers](https://communityhub.strava.com/developers-api-7)
- [Strava Community - latlng Issues](https://communityhub.strava.com/developers-api-7/strava-api-activities-streams-api-not-returning-latlng-8199)
- [Strava Community - Heart Rate Missing](https://communityhub.strava.com/developers-api-7/api-answer-changed-average-heartrate-and-max-heartrate-are-missing-amongst-others-9375)

---

## 14. Recommended Libraries and Tools

### Python

| Library | Description | Link |
|---------|------------|------|
| **stravalib** | Most popular, strongly-typed models, built-in rate limiting, unit conversion | [github.com/stravalib/stravalib](https://github.com/stravalib/stravalib) |
| **stravaio** | Lighter alternative, fluent data handling, Jupyter-friendly | [github.com/sladkovm/stravaio](https://github.com/sladkovm/stravaio) |

### Other Languages

| Library | Language | Link |
|---------|----------|------|
| **node-strava-v3** | Node.js | [github.com/node-strava/node-strava-v3](https://github.com/node-strava/node-strava-v3) |
| **rStrava** | R | [CRAN](https://cran.r-project.org/web/packages/rStrava/) |
| **go.strava** | Go | [github.com/strava/go.strava](https://github.com/strava/go.strava) |

### Backup / Export Tools

| Tool | Purpose | Link |
|------|---------|------|
| **strava-backup** | Automated backup of all Strava data via API | [github.com/pR0Ps/strava-backup](https://github.com/pR0Ps/strava-backup) |
| **fit2gpx** | Convert bulk export FIT files to GPX | [github.com/dodo-saba/fit2gpx](https://github.com/dodo-saba/fit2gpx) |

### Analysis Platforms (That Use the API)

- **VeloViewer** -- deep segment and activity analysis (affected by Nov 2024 changes)
- **Intervals.icu** -- training analytics and planning (affected by Nov 2024 changes)
- **Grafana Strava Datasource** -- visualize Strava data in Grafana dashboards

---

## 15. Bottom Line Assessment

### Does the API give you everything the app shows?

**No, but it gives you most of the raw data needed to build it yourself.**

### What you GET through the API:

- All core activity metrics (distance, time, speed, elevation, calories)
- All heart rate data (averages, maxes, and full second-by-second streams)
- All power data (averages, weighted, and full second-by-second streams)
- Full GPS tracks (latitude/longitude streams)
- Cadence, temperature, grade data
- Segment efforts and personal records
- Laps and splits
- Photos (URLs)
- Gear information
- Routes with export capabilities
- Club data
- Athlete profile and zones
- Webhook notifications for new activities

### What you DO NOT GET (and cannot recreate):

- **Segment leaderboards** (endpoint removed)
- **Goals and training plans** (no endpoint)
- **Matched activities** (no endpoint)
- **Local Legends status** (no endpoint)
- **Global/personal heatmap** (no endpoint, but you can build your own from GPS streams)
- **Route recommendations** (no endpoint)
- **Original activity files** (FIT/TCX/GPX -- use bulk export instead)

### What you DO NOT GET (but CAN recreate from raw data):

- **Fitness/Freshness/Form scores** -- calculate from suffer_score and power data using Banister impulse-response model (Strava's exact formula is undisclosed, but you can get close)
- **Power curve** -- compute from watts streams
- **Training Load** -- compute from weighted power and FTP
- **Weekly/monthly aggregations** -- trivial to calculate
- **Personal heatmap** -- aggregate all latlng streams
- **Elevation profiles** -- plot altitude streams

### The Strava Tax

Strava's approach is clear: they give you the raw ingredient data but withhold the cooked analytics. This is intentional -- Fitness & Freshness, Power Curve, and Training Load are premium subscription features, and providing them via API would undercut that business model.

For a motivated developer, this is actually fine. The raw streams contain everything you need to build analytics that are arguably **better** than what Strava provides, because you can customize the formulas, time windows, and visualizations to your exact needs.

### Recommended Approach for Personal Use

1. **Create a Strava app** in Single Player Mode (free, instant)
2. **Request all scopes** during OAuth
3. **Do a bulk export** first to get original FIT files and complete history
4. **Backfill via API** to get structured JSON data for all activities + streams
5. **Set up a webhook** (or a simple cron polling job) for new activities going forward
6. **Store everything locally** in a database -- activity JSON, stream data, and parsed FIT files
7. **Build your analytics** on top of the local data, free from rate limits and API dependencies

This gives you a more complete dataset than any single approach and makes you independent of Strava's API availability.
