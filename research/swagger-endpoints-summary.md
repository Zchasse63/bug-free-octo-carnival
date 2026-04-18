# Strava API v3 - Complete Endpoint & Schema Reference

**Spec Version:** Swagger 2.0
**API Version:** 3.0.0
**Base URL:** `https://www.strava.com/api/v3`
**Authentication:** OAuth 2.0 (Authorization Code flow)

---

## OAuth Scopes

- **`activity:read`** -- Read the user's activity data for activities that are visible to Everyone and Followers, excluding privacy zone data
- **`activity:read_all`** -- The same access as activity:read, plus privacy zone data and access to read the user's activities with visibility set to Only You
- **`activity:write`** -- Access to create manual activities and uploads, and access to edit any activities that are visible to the app, based on activity read access level
- **`profile:read_all`** -- Read all profile information even if the user has set their profile visibility to Followers or Only You
- **`profile:write`** -- Update the user's weight and Functional Threshold Power (FTP), and access to star or unstar segments on their behalf
- **`read`** -- Read public segments, public routes, public profile data, public posts, public events, club feeds, and leaderboards
- **`read_all`** -- Read private routes, private segments, and private events for the user

**Authorization URL:** `https://www.strava.com/api/v3/oauth/authorize`
**Token URL:** `https://www.strava.com/api/v3/oauth/token`

---

## Endpoints

### Activities

#### 1. `POST /activities`

**Create an Activity** (`createActivity`)

> Creates a manual activity for an athlete, requires activity:write scope.

**Required Scopes:** `activity:write`

**Response Model:** `DetailedActivity`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `name` | formData | string | Yes | The name of the activity. |
| `type` | formData | string | No | Type of activity. For example - Run, Ride etc. |
| `sport_type` | formData | string | Yes | Sport type of activity. For example - Run, MountainBikeRide, Ride, etc. |
| `start_date_local` | formData | string | Yes | ISO 8601 formatted date time. |
| `elapsed_time` | formData | integer | Yes | In seconds. |
| `description` | formData | string | No | Description of the activity. |
| `distance` | formData | number | No | In meters. |
| `trainer` | formData | integer | No | Set to 1 to mark as a trainer activity. |
| `commute` | formData | integer | No | Set to 1 to mark as commute. |

---

#### 2. `GET /activities/{id}`

**Get Activity** (`getActivityById`)

> Returns the given activity that is owned by the authenticated athlete. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.

We strongly encourage you to display the appropriate attribution that identifies Garmin as the data source and the device name in your application. Please see example below from VeloViewer (that provides an attribution for a Garmin Forerunner device).

![Attribution](/images/device-attribution-image.png)

**Required Scopes:** `activity:read_all`, `activity:read`

**Response Model:** `DetailedActivity`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the activity. |
| `include_all_efforts` | query | boolean | No | To include all segments efforts. |

---

#### 3. `PUT /activities/{id}`

**Update Activity** (`updateActivityById`)

> Updates the given activity that is owned by the authenticated athlete. Requires activity:write. Also requires activity:read_all in order to update Only Me activities

**Required Scopes:** `activity:write`, `activity:read_all`, `activity:read`

**Response Model:** `DetailedActivity`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the activity. |
| `body` | body | UpdatableActivity | No |  |

---

#### 4. `GET /activities/{id}/comments`

**List Activity Comments** (`getCommentsByActivityId`)

> Returns the comments on the given activity. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.

**Required Scopes:** `activity:read_all`, `activity:read`

**Response Model:** `Array<Comment>`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the activity. |
| `page` | query | integer | No | Deprecated. Prefer to use after_cursor. |
| `per_page` | query | integer | No | Deprecated. Prefer to use page_size. |
| `page_size` | query | integer | No | Number of items per page. Defaults to 30. |
| `after_cursor` | query | string | No | Cursor of the last item in the previous page of results, used to request the subsequent page of results.  When omitted, the first page of results is fetched. |

---

#### 5. `GET /activities/{id}/kudos`

**List Activity Kudoers** (`getKudoersByActivityId`)

> Returns the athletes who kudoed an activity identified by an identifier. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.

**Required Scopes:** `activity:read_all`, `activity:read`

**Response Model:** `Array<SummaryAthlete>`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the activity. |

---

#### 6. `GET /activities/{id}/laps`

**List Activity Laps** (`getLapsByActivityId`)

> Returns the laps of an activity identified by an identifier. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.

**Required Scopes:** `activity:read_all`, `activity:read`

**Response Model:** `Array<Lap>`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the activity. |

---

#### 7. `GET /activities/{id}/zones`

**Get Activity Zones** (`getZonesByActivityId`)

> Summit Feature. Returns the zones of a given activity. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.

**Required Scopes:** `activity:read_all`, `activity:read`

**Response Model:** `Array<ActivityZone>`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the activity. |

---

#### 8. `GET /athlete/activities`

**List Athlete Activities** (`getLoggedInAthleteActivities`)

> Returns the activities of an athlete for a specific identifier. Requires activity:read. Only Me activities will be filtered out unless requested by a token with activity:read_all.

**Required Scopes:** `activity:read_all`, `activity:read`

**Response Model:** `Array<SummaryActivity>`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `before` | query | integer | No | An epoch timestamp to use for filtering activities that have taken place before a certain time. |
| `after` | query | integer | No | An epoch timestamp to use for filtering activities that have taken place after a certain time. |

---

### Athletes

#### 9. `GET /athlete`

**Get Authenticated Athlete** (`getLoggedInAthlete`)

> Returns the currently authenticated athlete. Tokens with profile:read_all scope will receive a detailed athlete representation; all others will receive a summary representation.

**Required Scopes:** `profile:read_all`

**Response Model:** `DetailedAthlete`

*No named parameters.*

---

#### 10. `PUT /athlete`

**Update Athlete** (`updateLoggedInAthlete`)

> Update the currently authenticated athlete. Requires profile:write scope.

**Required Scopes:** `profile:write`

**Response Model:** `DetailedAthlete`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `weight` | path | number | Yes | The weight of the athlete in kilograms. |

---

#### 11. `GET /athlete/zones`

**Get Zones** (`getLoggedInAthleteZones`)

> Returns the the authenticated athlete's heart rate and power zones. Requires profile:read_all.

**Required Scopes:** `profile:read_all`

**Response Model:** `Zones`

*No named parameters.*

---

#### 12. `GET /athletes/{id}/stats`

**Get Athlete Stats** (`getStats`)

> Returns the activity stats of an athlete. Only includes data from activities set to Everyone visibilty.

**Required Scopes:** `(see description)`

**Response Model:** `ActivityStats`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the athlete. Must match the authenticated athlete. |

---

### Clubs

#### 13. `GET /athlete/clubs`

**List Athlete Clubs** (`getLoggedInAthleteClubs`)

> Returns a list of the clubs whose membership includes the authenticated athlete.

**Required Scopes:** `(see description)`

**Response Model:** `Array<SummaryClub>`

*No named parameters.*

---

#### 14. `GET /clubs/{id}`

**Get Club** (`getClubById`)

> Returns a given a club using its identifier.

**Required Scopes:** `(see description)`

**Response Model:** `DetailedClub`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the club. |

---

#### 15. `GET /clubs/{id}/activities`

**List Club Activities** (`getClubActivitiesById`)

> Retrieve recent activities from members of a specific club. The authenticated athlete must belong to the requested club in order to hit this endpoint. Pagination is supported. Athlete profile visibility is respected for all activities.

**Required Scopes:** `(see description)`

**Response Model:** `Array<ClubActivity>`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the club. |

---

#### 16. `GET /clubs/{id}/admins`

**List Club Administrators** (`getClubAdminsById`)

> Returns a list of the administrators of a given club.

**Required Scopes:** `(see description)`

**Response Model:** `Array<SummaryAthlete>`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the club. |

---

#### 17. `GET /clubs/{id}/members`

**List Club Members** (`getClubMembersById`)

> Returns a list of the athletes who are members of a given club.

**Required Scopes:** `(see description)`

**Response Model:** `Array<ClubAthlete>`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the club. |

---

### Gears

#### 18. `GET /gear/{id}`

**Get Equipment** (`getGearById`)

> Returns an equipment using its identifier.

**Required Scopes:** `(see description)`

**Response Model:** `DetailedGear`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | string | Yes | The identifier of the gear. |

---

### Routes

#### 19. `GET /athletes/{id}/routes`

**List Athlete Routes** (`getRoutesByAthleteId`)

> Returns a list of the routes created by the authenticated athlete. Private routes are filtered out unless requested by a token with read_all scope.

**Required Scopes:** `read_all`

**Response Model:** `Array<Route>`

*No named parameters.*

---

#### 20. `GET /routes/{id}`

**Get Route** (`getRouteById`)

> Returns a route using its identifier. Requires read_all scope for private routes.

**Required Scopes:** `read_all`

**Response Model:** `Route`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the route. |

---

#### 21. `GET /routes/{id}/export_gpx`

**Export Route GPX** (`getRouteAsGPX`)

> Returns a GPX file of the route. Requires read_all scope for private routes.

**Required Scopes:** `read_all`

**Response Model:** `A GPX file with the route.`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the route. |

---

#### 22. `GET /routes/{id}/export_tcx`

**Export Route TCX** (`getRouteAsTCX`)

> Returns a TCX file of the route. Requires read_all scope for private routes.

**Required Scopes:** `read_all`

**Response Model:** `A TCX file with the route.`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the route. |

---

### Segments

#### 23. `GET /segments/explore`

**Explore segments** (`exploreSegments`)

> Returns the top 10 segments matching a specified query.

**Required Scopes:** `(see description)`

**Response Model:** `ExplorerResponse`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `bounds` | query | array | Yes | The latitude and longitude for two points describing a rectangular boundary for the search: [southwest corner latitutde, southwest corner longitude, northeast corner latitude, northeast corner longitude] |
| `activity_type` | query | string | No | Desired activity type. Enum: `running`, `riding` |
| `min_cat` | query | integer | No | The minimum climbing category. |
| `max_cat` | query | integer | No | The maximum climbing category. |

---

#### 24. `GET /segments/starred`

**List Starred Segments** (`getLoggedInAthleteStarredSegments`)

> List of the authenticated athlete's starred segments. Private segments are filtered out unless requested by a token with read_all scope.

**Required Scopes:** `read_all`

**Response Model:** `Array<SummarySegment>`

*No named parameters.*

---

#### 25. `GET /segments/{id}`

**Get Segment** (`getSegmentById`)

> Returns the specified segment. read_all scope required in order to retrieve athlete-specific segment information, or to retrieve private segments.

**Required Scopes:** `read_all`

**Response Model:** `DetailedSegment`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the segment. |

---

#### 26. `PUT /segments/{id}/starred`

**Star Segment** (`starSegment`)

> Stars/Unstars the given segment for the authenticated athlete. Requires profile:write scope.

**Required Scopes:** `profile:write`

**Response Model:** `DetailedSegment`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the segment to star. |
| `starred` | formData | boolean | Yes | If true, star the segment; if false, unstar the segment. |

---

### SegmentEfforts

#### 27. `GET /segment_efforts`

**List Segment Efforts** (`getEffortsBySegmentId`)

> Returns a set of the authenticated athlete's segment efforts for a given segment.  Requires subscription.

**Required Scopes:** `(see description)`

**Response Model:** `Array<DetailedSegmentEffort>`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `segment_id` | query | integer | Yes | The identifier of the segment. |
| `start_date_local` | query | string | No | ISO 8601 formatted date time. |
| `end_date_local` | query | string | No | ISO 8601 formatted date time. |

---

#### 28. `GET /segment_efforts/{id}`

**Get Segment Effort** (`getSegmentEffortById`)

> Returns a segment effort from an activity that is owned by the authenticated athlete. Requires subscription.

**Required Scopes:** `(see description)`

**Response Model:** `DetailedSegmentEffort`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the segment effort. |

---

### Streams

#### 29. `GET /activities/{id}/streams`

**Get Activity Streams** (`getActivityStreams`)

> Returns the given activity's streams. Requires activity:read scope. Requires activity:read_all scope for Only Me activities.

**Required Scopes:** `activity:read_all`, `activity:read`

**Response Model:** `StreamSet`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the activity. |
| `keys` | query | array | Yes | Desired stream types. Enum: `time`, `distance`, `latlng`, `altitude`, `velocity_smooth`, `heartrate`, `cadence`, `watts`, `temp`, `moving`, `grade_smooth` |
| `key_by_type` | query | boolean | Yes | Must be true. |

---

#### 30. `GET /routes/{id}/streams`

**Get Route Streams** (`getRouteStreams`)

> Returns the given route's streams. Requires read_all scope for private routes.

**Required Scopes:** `read_all`

**Response Model:** `StreamSet`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the route. |

---

#### 31. `GET /segment_efforts/{id}/streams`

**Get Segment Effort Streams** (`getSegmentEffortStreams`)

> Returns a set of streams for a segment effort completed by the authenticated athlete. Requires read_all scope.

**Required Scopes:** `read_all`

**Response Model:** `StreamSet`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the segment effort. |
| `keys` | query | array | Yes | The types of streams to return. Enum: `time`, `distance`, `latlng`, `altitude`, `velocity_smooth`, `heartrate`, `cadence`, `watts`, `temp`, `moving`, `grade_smooth` |
| `key_by_type` | query | boolean | Yes | Must be true. |

---

#### 32. `GET /segments/{id}/streams`

**Get Segment Streams** (`getSegmentStreams`)

> Returns the given segment's streams. Requires read_all scope for private segments.

**Required Scopes:** `read_all`

**Response Model:** `StreamSet`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `id` | path | integer | Yes | The identifier of the segment. |
| `keys` | query | array | Yes | The types of streams to return. Enum: `distance`, `latlng`, `altitude` |
| `key_by_type` | query | boolean | Yes | Must be true. |

---

### Uploads

#### 33. `POST /uploads`

**Upload Activity** (`createUpload`)

> Uploads a new data file to create an activity from. Requires activity:write scope.

**Required Scopes:** `activity:write`

**Response Model:** `Upload`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `file` | formData | file | No | The uploaded file. |
| `name` | formData | string | No | The desired name of the resulting activity. |
| `description` | formData | string | No | The desired description of the resulting activity. |
| `trainer` | formData | string | No | Whether the resulting activity should be marked as having been performed on a trainer. |
| `commute` | formData | string | No | Whether the resulting activity should be tagged as a commute. |
| `data_type` | formData | string | No | The format of the uploaded file. Enum: `fit`, `fit.gz`, `tcx`, `tcx.gz`, `gpx`, `gpx.gz` |
| `external_id` | formData | string | No | The desired external identifier of the resulting activity. |

---

#### 34. `GET /uploads/{uploadId}`

**Get Upload** (`getUploadById`)

> Returns an upload for a given identifier. Requires activity:write scope.

**Required Scopes:** `activity:write`

**Response Model:** `Upload`

| Parameter | In | Type | Required | Description |
|---|---|---|---|---|
| `uploadId` | path | integer | Yes | The identifier of the upload. |

---

## Data Models (Definitions)

All models defined in the specification:

### `ActivityStats`

> A set of rolled-up statistics and totals for an athlete

| Property | Type | Description |
|---|---|---|
| `all_ride_totals` | `ActivityTotal` | The all time ride stats for the athlete. |
| `all_run_totals` | `ActivityTotal` | The all time run stats for the athlete. |
| `all_swim_totals` | `ActivityTotal` | The all time swim stats for the athlete. |
| `biggest_climb_elevation_gain` | `number` | The highest climb ridden by the athlete. |
| `biggest_ride_distance` | `number` | The longest distance ridden by the athlete. |
| `recent_ride_totals` | `ActivityTotal` | The recent (last 4 weeks) ride stats for the athlete. |
| `recent_run_totals` | `ActivityTotal` | The recent (last 4 weeks) run stats for the athlete. |
| `recent_swim_totals` | `ActivityTotal` | The recent (last 4 weeks) swim stats for the athlete. |
| `ytd_ride_totals` | `ActivityTotal` | The year to date ride stats for the athlete. |
| `ytd_run_totals` | `ActivityTotal` | The year to date run stats for the athlete. |
| `ytd_swim_totals` | `ActivityTotal` | The year to date swim stats for the athlete. |

### `ActivityZone`

| Property | Type | Description |
|---|---|---|
| `custom_zones` | `boolean` |  |
| `distribution_buckets` | `TimedZoneDistribution` |  |
| `max` | `integer` |  |
| `points` | `integer` |  |
| `score` | `integer` |  |
| `sensor_based` | `boolean` |  |
| `type` | `string` |  Enum: `heartrate`, `power` |

### `AltitudeStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<number>` | The sequence of altitude values for this stream, in meters |

### `BaseStream`

| Property | Type | Description |
|---|---|---|
| `original_size` | `integer` | The number of data points in this stream |
| `resolution` | `string` | The level of detail (sampling) in which this stream was returned Enum: `low`, `medium`, `high` |
| `series_type` | `string` | The base series used in the case the stream was downsampled Enum: `distance`, `time` |

### `CadenceStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<integer>` | The sequence of cadence values for this stream, in rotations per minute |

### `ClubActivity`

| Property | Type | Description |
|---|---|---|
| `athlete` | `MetaAthlete` |  |
| `distance` | `number` | The activity's distance, in meters |
| `elapsed_time` | `integer` | The activity's elapsed time, in seconds |
| `moving_time` | `integer` | The activity's moving time, in seconds |
| `name` | `string` | The name of the activity |
| `sport_type` | `SportType` |  |
| `total_elevation_gain` | `number` | The activity's total elevation gain. |
| `type` | `ActivityType` | Deprecated. Prefer to use sport_type |
| `workout_type` | `integer` | The activity's workout type |

### `ClubAnnouncement`

| Property | Type | Description |
|---|---|---|
| `athlete` | `SummaryAthlete` |  |
| `club_id` | `integer` | The unique identifier of the club this announcements was made in. |
| `created_at` | `string` | The time at which this announcement was created. |
| `id` | `integer` | The unique identifier of this announcement. |
| `message` | `string` | The content of this announcement |

### `ClubAthlete`

| Property | Type | Description |
|---|---|---|
| `admin` | `boolean` | Whether the athlete is a club admin. |
| `firstname` | `string` | The athlete's first name. |
| `lastname` | `string` | The athlete's last initial. |
| `member` | `string` | The athlete's member status. |
| `owner` | `boolean` | Whether the athlete is club owner. |
| `resource_state` | `integer` | Resource state, indicates level of detail. Possible values: 1 -> "meta", 2 -> "summary", 3 -> "detail" |

### `Comment`

| Property | Type | Description |
|---|---|---|
| `activity_id` | `integer` | The identifier of the activity this comment is related to |
| `athlete` | `SummaryAthlete` |  |
| `created_at` | `string` | The time at which this comment was created. |
| `id` | `integer` | The unique identifier of this comment |
| `text` | `string` | The content of the comment |

### `DetailedActivity`

**Extends:** `SummaryActivity`

| Property | Type | Description |
|---|---|---|
| `best_efforts` | `Array<DetailedSegmentEffort>` |  |
| `calories` | `number` | The number of kilocalories consumed during this activity |
| `description` | `string` | The description of the activity |
| `device_name` | `string` | The name of the device used to record the activity |
| `embed_token` | `string` | The token used to embed a Strava activity |
| `gear` | `SummaryGear` |  |
| `laps` | `Array<Lap>` |  |
| `photos` | `PhotosSummary` |  |
| `segment_efforts` | `Array<DetailedSegmentEffort>` |  |
| `splits_metric` | `Array<Split>` | The splits of this activity in metric units (for runs) |
| `splits_standard` | `Array<Split>` | The splits of this activity in imperial units (for runs) |

### `DetailedAthlete`

**Extends:** `SummaryAthlete`

| Property | Type | Description |
|---|---|---|
| `bikes` | `Array<SummaryGear>` | The athlete's bikes. |
| `clubs` | `Array<SummaryClub>` | The athlete's clubs. |
| `follower_count` | `integer` | The athlete's follower count. |
| `friend_count` | `integer` | The athlete's friend count. |
| `ftp` | `integer` | The athlete's FTP (Functional Threshold Power). |
| `measurement_preference` | `string` | The athlete's preferred unit system. Enum: `feet`, `meters` |
| `shoes` | `Array<SummaryGear>` | The athlete's shoes. |
| `weight` | `number` | The athlete's weight. |

### `DetailedClub`

**Extends:** `SummaryClub`

| Property | Type | Description |
|---|---|---|
| `admin` | `boolean` | Whether the currently logged-in athlete is an administrator of this club. |
| `following_count` | `integer` | The number of athletes in the club that the logged-in athlete follows. |
| `membership` | `string` | The membership status of the logged-in athlete. Enum: `member`, `pending` |
| `owner` | `boolean` | Whether the currently logged-in athlete is the owner of this club. |

### `DetailedGear`

**Extends:** `SummaryGear`

| Property | Type | Description |
|---|---|---|
| `brand_name` | `string` | The gear's brand name. |
| `description` | `string` | The gear's description. |
| `frame_type` | `integer` | The gear's frame type (bike only). |
| `model_name` | `string` | The gear's model name. |

### `DetailedSegment`

**Extends:** `SummarySegment`

| Property | Type | Description |
|---|---|---|
| `athlete_count` | `integer` | The number of unique athletes who have an effort for this segment |
| `created_at` | `string` | The time at which the segment was created. |
| `effort_count` | `integer` | The total number of efforts for this segment |
| `hazardous` | `boolean` | Whether this segment is considered hazardous |
| `map` | `PolylineMap` |  |
| `star_count` | `integer` | The number of stars for this segment |
| `total_elevation_gain` | `number` | The segment's total elevation gain. |
| `updated_at` | `string` | The time at which the segment was last updated. |

### `DetailedSegmentEffort`

**Extends:** `SummarySegmentEffort`

| Property | Type | Description |
|---|---|---|
| `activity` | `MetaActivity` |  |
| `athlete` | `MetaAthlete` |  |
| `average_cadence` | `number` | The effort's average cadence |
| `average_heartrate` | `number` | The heart heart rate of the athlete during this effort |
| `average_watts` | `number` | The average wattage of this effort |
| `device_watts` | `boolean` | For riding efforts, whether the wattage was reported by a dedicated recording device |
| `end_index` | `integer` | The end index of this effort in its activity's stream |
| `hidden` | `boolean` | Whether this effort should be hidden when viewed within an activity |
| `kom_rank` | `integer` | The rank of the effort on the global leaderboard if it belongs in the top 10 at the time of upload |
| `max_heartrate` | `number` | The maximum heart rate of the athlete during this effort |
| `moving_time` | `integer` | The effort's moving time |
| `name` | `string` | The name of the segment on which this effort was performed |
| `pr_rank` | `integer` | The rank of the effort on the athlete's leaderboard if it belongs in the top 3 at the time of upload |
| `segment` | `SummarySegment` |  |
| `start_index` | `integer` | The start index of this effort in its activity's stream |

### `DistanceStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<number>` | The sequence of distance values for this stream, in meters |

### `Error`

| Property | Type | Description |
|---|---|---|
| `code` | `string` | The code associated with this error. |
| `field` | `string` | The specific field or aspect of the resource associated with this error. |
| `resource` | `string` | The type of resource associated with this error. |

### `ExplorerResponse`

| Property | Type | Description |
|---|---|---|
| `segments` | `Array<ExplorerSegment>` | The set of segments matching an explorer request |

### `ExplorerSegment`

| Property | Type | Description |
|---|---|---|
| `avg_grade` | `number` | The segment's average grade, in percents |
| `climb_category` | `integer` | The category of the climb [0, 5]. Higher is harder ie. 5 is Hors catégorie, 0 is uncategorized in climb_category. If climb_category = 5, climb_category_desc = HC. If climb_category = 2, climb_category_desc = 3. |
| `climb_category_desc` | `string` | The description for the category of the climb Enum: `NC`, `4`, `3`, `2`, `1`, `HC` |
| `distance` | `number` | The segment's distance, in meters |
| `elev_difference` | `number` | The segments's evelation difference, in meters |
| `end_latlng` | `LatLng` |  |
| `id` | `integer` | The unique identifier of this segment |
| `name` | `string` | The name of this segment |
| `points` | `string` | The polyline of the segment |
| `start_latlng` | `LatLng` |  |

### `Fault`

> Encapsulates the errors that may be returned from the API.

| Property | Type | Description |
|---|---|---|
| `errors` | `Array<Error>` | The set of specific errors associated with this fault, if any. |
| `message` | `string` | The message of the fault. |

### `HeartRateZoneRanges`

| Property | Type | Description |
|---|---|---|
| `custom_zones` | `boolean` | Whether the athlete has set their own custom heart rate zones |
| `zones` | `ZoneRanges` |  |

### `HeartrateStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<integer>` | The sequence of heart rate values for this stream, in beats per minute |

### `Lap`

| Property | Type | Description |
|---|---|---|
| `activity` | `MetaActivity` |  |
| `athlete` | `MetaAthlete` |  |
| `average_cadence` | `number` | The lap's average cadence |
| `average_speed` | `number` | The lap's average speed |
| `distance` | `number` | The lap's distance, in meters |
| `elapsed_time` | `integer` | The lap's elapsed time, in seconds |
| `end_index` | `integer` | The end index of this effort in its activity's stream |
| `id` | `integer` | The unique identifier of this lap |
| `lap_index` | `integer` | The index of this lap in the activity it belongs to |
| `max_speed` | `number` | The maximum speed of this lat, in meters per second |
| `moving_time` | `integer` | The lap's moving time, in seconds |
| `name` | `string` | The name of the lap |
| `pace_zone` | `integer` | The athlete's pace zone during this lap |
| `split` | `integer` |  |
| `start_date` | `string` | The time at which the lap was started. |
| `start_date_local` | `string` | The time at which the lap was started in the local timezone. |
| `start_index` | `integer` | The start index of this effort in its activity's stream |
| `total_elevation_gain` | `number` | The elevation gain of this lap, in meters |

### `LatLngStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<LatLng>` | The sequence of lat/long values for this stream |

### `MembershipApplication`

| Property | Type | Description |
|---|---|---|
| `active` | `boolean` | Whether the membership is currently active |
| `membership` | `string` | The membership status of this application Enum: `member`, `pending` |
| `success` | `boolean` | Whether the application for membership was successfully submitted |

### `MetaActivity`

| Property | Type | Description |
|---|---|---|
| `id` | `integer` | The unique identifier of the activity |

### `MetaAthlete`

| Property | Type | Description |
|---|---|---|
| `id` | `integer` | The unique identifier of the athlete |

### `MetaClub`

| Property | Type | Description |
|---|---|---|
| `id` | `integer` | The club's unique identifier. |
| `name` | `string` | The club's name. |
| `resource_state` | `integer` | Resource state, indicates level of detail. Possible values: 1 -> "meta", 2 -> "summary", 3 -> "detail" |

### `MovingStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<boolean>` | The sequence of moving values for this stream, as boolean values |

### `PowerStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<integer>` | The sequence of power values for this stream, in watts |

### `PowerZoneRanges`

| Property | Type | Description |
|---|---|---|
| `zones` | `ZoneRanges` |  |

### `Route`

| Property | Type | Description |
|---|---|---|
| `athlete` | `SummaryAthlete` |  |
| `created_at` | `string` | The time at which the route was created |
| `description` | `string` | The description of the route |
| `distance` | `number` | The route's distance, in meters |
| `elevation_gain` | `number` | The route's elevation gain. |
| `estimated_moving_time` | `integer` | Estimated time in seconds for the authenticated athlete to complete route |
| `id` | `integer` | The unique identifier of this route |
| `id_str` | `string` | The unique identifier of the route in string format |
| `map` | `PolylineMap` |  |
| `name` | `string` | The name of this route |
| `private` | `boolean` | Whether this route is private |
| `segments` | `Array<SummarySegment>` | The segments traversed by this route |
| `starred` | `boolean` | Whether this route is starred by the logged-in athlete |
| `sub_type` | `integer` | This route's sub-type (1 for road, 2 for mountain bike, 3 for cross, 4 for trail, 5 for mixed) |
| `timestamp` | `integer` | An epoch timestamp of when the route was created |
| `type` | `integer` | This route's type (1 for ride, 2 for runs) |
| `updated_at` | `string` | The time at which the route was last updated |
| `waypoints` | `Array<Waypoint>` | The custom waypoints along this route |

### `SmoothGradeStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<number>` | The sequence of grade values for this stream, as percents of a grade |

### `SmoothVelocityStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<number>` | The sequence of velocity values for this stream, in meters per second |

### `StreamSet`

| Property | Type | Description |
|---|---|---|
| `altitude` | `AltitudeStream` |  |
| `cadence` | `CadenceStream` |  |
| `distance` | `DistanceStream` |  |
| `grade_smooth` | `SmoothGradeStream` |  |
| `heartrate` | `HeartrateStream` |  |
| `latlng` | `LatLngStream` |  |
| `moving` | `MovingStream` |  |
| `temp` | `TemperatureStream` |  |
| `time` | `TimeStream` |  |
| `velocity_smooth` | `SmoothVelocityStream` |  |
| `watts` | `PowerStream` |  |

### `StreamType`

> An enumeration of the supported types of streams.

**Type:** enum
**Values:** `time`, `distance`, `latlng`, `altitude`, `velocity_smooth`, `heartrate`, `cadence`, `watts`, `temp`, `moving`, `grade_smooth`

### `SummaryActivity`

**Extends:** `MetaActivity`

| Property | Type | Description |
|---|---|---|
| `achievement_count` | `integer` | The number of achievements gained during this activity |
| `athlete` | `MetaAthlete` |  |
| `athlete_count` | `integer` | The number of athletes for taking part in a group activity |
| `average_speed` | `number` | The activity's average speed, in meters per second |
| `average_watts` | `number` | Average power output in watts during this activity. Rides only |
| `comment_count` | `integer` | The number of comments for this activity |
| `commute` | `boolean` | Whether this activity is a commute |
| `device_name` | `string` | The name of the device used to record the activity |
| `device_watts` | `boolean` | Whether the watts are from a power meter, false if estimated |
| `distance` | `number` | The activity's distance, in meters |
| `elapsed_time` | `integer` | The activity's elapsed time, in seconds |
| `elev_high` | `number` | The activity's highest elevation, in meters |
| `elev_low` | `number` | The activity's lowest elevation, in meters |
| `end_latlng` | `LatLng` |  |
| `external_id` | `string` | The identifier provided at upload time |
| `flagged` | `boolean` | Whether this activity is flagged |
| `gear_id` | `string` | The id of the gear for the activity |
| `has_kudoed` | `boolean` | Whether the logged-in athlete has kudoed this activity |
| `hide_from_home` | `boolean` | Whether the activity is muted |
| `kilojoules` | `number` | The total work done in kilojoules during this activity. Rides only |
| `kudos_count` | `integer` | The number of kudos given for this activity |
| `manual` | `boolean` | Whether this activity was created manually |
| `map` | `PolylineMap` |  |
| `max_speed` | `number` | The activity's max speed, in meters per second |
| `max_watts` | `integer` | Rides with power meter data only |
| `moving_time` | `integer` | The activity's moving time, in seconds |
| `name` | `string` | The name of the activity |
| `photo_count` | `integer` | The number of Instagram photos for this activity |
| `private` | `boolean` | Whether this activity is private |
| `sport_type` | `SportType` |  |
| `start_date` | `string` | The time at which the activity was started. |
| `start_date_local` | `string` | The time at which the activity was started in the local timezone. |
| `start_latlng` | `LatLng` |  |
| `timezone` | `string` | The timezone of the activity |
| `total_elevation_gain` | `number` | The activity's total elevation gain. |
| `total_photo_count` | `integer` | The number of Instagram and Strava photos for this activity |
| `trainer` | `boolean` | Whether this activity was recorded on a training machine |
| `type` | `ActivityType` | Deprecated. Prefer to use sport_type |
| `upload_id` | `integer` | The identifier of the upload that resulted in this activity |
| `upload_id_str` | `string` | The unique identifier of the upload in string format |
| `weighted_average_watts` | `integer` | Similar to Normalized Power. Rides with power meter data only |
| `workout_type` | `integer` | The activity's workout type |

### `SummaryAthlete`

**Extends:** `MetaAthlete`

| Property | Type | Description |
|---|---|---|
| `city` | `string` | The athlete's city. |
| `country` | `string` | The athlete's country. |
| `created_at` | `string` | The time at which the athlete was created. |
| `firstname` | `string` | The athlete's first name. |
| `lastname` | `string` | The athlete's last name. |
| `premium` | `boolean` | Deprecated.  Use summit field instead. Whether the athlete has any Summit subscription. |
| `profile` | `string` | URL to a 124x124 pixel profile picture. |
| `profile_medium` | `string` | URL to a 62x62 pixel profile picture. |
| `resource_state` | `integer` | Resource state, indicates level of detail. Possible values: 1 -> "meta", 2 -> "summary", 3 -> "detail" |
| `sex` | `string` | The athlete's sex. Enum: `M`, `F` |
| `state` | `string` | The athlete's state or geographical region. |
| `summit` | `boolean` | Whether the athlete has any Summit subscription. |
| `updated_at` | `string` | The time at which the athlete was last updated. |

### `SummaryClub`

**Extends:** `MetaClub`

| Property | Type | Description |
|---|---|---|
| `activity_types` | `Array<ActivityType>` | The activity types that count for a club. This takes precedence over sport_type. |
| `city` | `string` | The club's city. |
| `country` | `string` | The club's country. |
| `cover_photo` | `string` | URL to a ~1185x580 pixel cover photo. |
| `cover_photo_small` | `string` | URL to a ~360x176  pixel cover photo. |
| `featured` | `boolean` | Whether the club is featured or not. |
| `member_count` | `integer` | The club's member count. |
| `private` | `boolean` | Whether the club is private. |
| `profile_medium` | `string` | URL to a 60x60 pixel profile picture. |
| `sport_type` | `string` | Deprecated. Prefer to use activity_types. Enum: `cycling`, `running`, `triathlon`, `other` |
| `state` | `string` | The club's state or geographical region. |
| `url` | `string` | The club's vanity URL. |
| `verified` | `boolean` | Whether the club is verified or not. |

### `SummaryGear`

| Property | Type | Description |
|---|---|---|
| `distance` | `number` | The distance logged with this gear. |
| `id` | `string` | The gear's unique identifier. |
| `name` | `string` | The gear's name. |
| `primary` | `boolean` | Whether this gear's is the owner's default one. |
| `resource_state` | `integer` | Resource state, indicates level of detail. Possible values: 2 -> "summary", 3 -> "detail" |

### `SummaryPRSegmentEffort`

| Property | Type | Description |
|---|---|---|
| `effort_count` | `integer` | Number of efforts by the authenticated athlete on this segment. |
| `pr_activity_id` | `integer` | The unique identifier of the activity related to the PR effort. |
| `pr_date` | `string` | The time at which the PR effort was started. |
| `pr_elapsed_time` | `integer` | The elapsed time ot the PR effort. |

### `SummarySegment`

| Property | Type | Description |
|---|---|---|
| `activity_type` | `string` |  Enum: `Ride`, `Run` |
| `athlete_pr_effort` | `SummaryPRSegmentEffort` |  |
| `athlete_segment_stats` | `SummarySegmentEffort` |  |
| `average_grade` | `number` | The segment's average grade, in percents |
| `city` | `string` | The segments's city. |
| `climb_category` | `integer` | The category of the climb [0, 5]. Higher is harder ie. 5 is Hors catégorie, 0 is uncategorized in climb_category. |
| `country` | `string` | The segment's country. |
| `distance` | `number` | The segment's distance, in meters |
| `elevation_high` | `number` | The segments's highest elevation, in meters |
| `elevation_low` | `number` | The segments's lowest elevation, in meters |
| `end_latlng` | `LatLng` |  |
| `id` | `integer` | The unique identifier of this segment |
| `maximum_grade` | `number` | The segments's maximum grade, in percents |
| `name` | `string` | The name of this segment |
| `private` | `boolean` | Whether this segment is private. |
| `start_latlng` | `LatLng` |  |
| `state` | `string` | The segments's state or geographical region. |

### `SummarySegmentEffort`

| Property | Type | Description |
|---|---|---|
| `activity_id` | `integer` | The unique identifier of the activity related to this effort |
| `distance` | `number` | The effort's distance in meters |
| `elapsed_time` | `integer` | The effort's elapsed time |
| `id` | `integer` | The unique identifier of this effort |
| `is_kom` | `boolean` | Whether this effort is the current best on the leaderboard |
| `start_date` | `string` | The time at which the effort was started. |
| `start_date_local` | `string` | The time at which the effort was started in the local timezone. |

### `TemperatureStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<integer>` | The sequence of temperature values for this stream, in celsius degrees |

### `TimeStream`

**Extends:** `BaseStream`

| Property | Type | Description |
|---|---|---|
| `data` | `Array<integer>` | The sequence of time values for this stream, in seconds |

### `TimedZoneDistribution`

> Stores the exclusive ranges representing zones and the time spent in each.

*No properties defined (see parent model).*

### `TimedZoneRange`

> A union type representing the time spent in a given zone.

**Extends:** `ZoneRange`

| Property | Type | Description |
|---|---|---|
| `time` | `integer` | The number of seconds spent in this zone |

### `UpdatableActivity`

| Property | Type | Description |
|---|---|---|
| `commute` | `boolean` | Whether this activity is a commute |
| `description` | `string` | The description of the activity |
| `gear_id` | `string` | Identifier for the gear associated with the activity. ‘none’ clears gear from activity |
| `hide_from_home` | `boolean` | Whether this activity is muted |
| `name` | `string` | The name of the activity |
| `sport_type` | `SportType` |  |
| `trainer` | `boolean` | Whether this activity was recorded on a training machine |
| `type` | `ActivityType` | Deprecated. Prefer to use sport_type. In a request where both type and sport_type are present, this field will be ignored |

### `Upload`

| Property | Type | Description |
|---|---|---|
| `activity_id` | `integer` | The identifier of the activity this upload resulted into |
| `error` | `string` | The error associated with this upload |
| `external_id` | `string` | The external identifier of the upload |
| `id` | `integer` | The unique identifier of the upload |
| `id_str` | `string` | The unique identifier of the upload in string format |
| `status` | `string` | The status of this upload |

### `ZoneRange`

| Property | Type | Description |
|---|---|---|
| `max` | `integer` | The maximum value in the range. |
| `min` | `integer` | The minimum value in the range. |

### `ZoneRanges`

*No properties defined (see parent model).*

### `Zones`

| Property | Type | Description |
|---|---|---|
| `heart_rate` | `HeartRateZoneRanges` |  |
| `power` | `PowerZoneRanges` |  |

---

## Summary Statistics

- **Total Endpoints:** 34
- **Total Data Models:** 52
- **API Version:** 3.0.0
- **Spec Format:** Swagger 2.0
- **Base URL:** https://www.strava.com/api/v3
