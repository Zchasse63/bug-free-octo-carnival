# Strava API v3 — Complete Developer Portal Reference

> Source: https://developers.strava.com (scraped April 2026)
> This document contains the complete content from every page of the Strava Developer Portal,
> including all API endpoints, data models, authentication flows, webhook specs, and guidelines.

---

# Table of Contents

1. [Home Page — The Strava API](#1-home-page--the-strava-api)
2. [Getting Started Guide](#2-getting-started-guide)
3. [General API Documentation (Conventions & Overview)](#3-general-api-documentation)
4. [Authentication (OAuth 2.0)](#4-authentication-oauth-20)
5. [Webhook Events API](#5-webhook-events-api)
6. [Rate Limits](#6-rate-limits)
7. [Activity Uploads](#7-activity-uploads)
8. [API Reference — All Endpoints](#8-api-reference--all-endpoints)
9. [Data Models (Swagger Schemas)](#9-data-models-swagger-schemas)
10. [Enumerations (Activity Types, Sport Types)](#10-enumerations)
11. [Brand Guidelines](#11-brand-guidelines)
12. [API Agreement (Legal)](#12-api-agreement-legal)
13. [Swagger Playground](#13-swagger-playground)
14. [Community & Support](#14-community--support)

---

# 1. Home Page — The Strava API

Source: https://developers.strava.com

## Primary Description

The Strava API is a publicly available V3 API. Strava athletes upload millions of activities every day, and the interface enables developers to access this data for various applications.

## Key Resources & Links

- **Getting Started Guide**: /docs/getting-started
- **API Documentation**: /docs/reference
- **Create & Manage Your App**: https://strava.com/settings/api
- **API Playground**: /playground
- **Client Code Libraries**: https://developers.strava.com/docs/#client-code

## Strava Apps

Thousands of developers globally use Strava data. View the App Directory: https://www.strava.com/apps

## Legal & Guidelines

- Strava API Agreement: https://www.strava.com/legal/api
- Brand Guidelines: /guidelines

## Engineering & Careers

- Strava Engineering Blog: https://medium.com/strava-engineering
- Careers at Strava: https://boards.greenhouse.io/strava

## Community

- Developer Community Hub: https://communityhub.strava.com/developers-api-7

---

# 2. Getting Started Guide

Source: https://developers.strava.com/docs/getting-started

## Introduction

Welcome to the Strava API! This is a brief overview of how to use our API.

The guide covers REST API data including athletes, segments, routes, clubs, and gear.

### Table of Contents
- Basic info about the API
- How to create an account
- How to make a cURL request
- How to authenticate with OAuth 2.0
- How to use the Swagger Playground
- Why Do I Need Webhooks?
- How to Get Support

## A. Basic API Information

The Strava REST API is free to use but doesn't allow retrieval of data for all public athletes. To access athlete data, developers must create an application and request OAuth 2.0 authorization from users.

**Rate Limits:**
The default rate limit allows 200 requests every 15 minutes, with up to 2,000 requests per day.

**Quick Links:**
- Rate limits and pagination
- Uploading files
- Terms of Service
- Brand Guidelines

**Example Applications:**
- Create a print of your activity
- Add weather for your activities
- Listen for new Strava activities using webhooks
- Measure athletic performance

## B. How to Create an Account

1. Register at https://www.strava.com/register
2. After login, visit https://www.strava.com/settings/api and create an app
3. View the "My API Application" page containing:
   - Category (chosen application category)
   - Club (if associated)
   - Client ID (application ID)
   - Client Secret (keep confidential)
   - Authorization token (changes every six hours)
   - Refresh token (keep confidential)
   - Rate limits display
   - Authorization Callback Domain (set to localhost for development, real domain for production)

## C. How to Make a cURL Request

1. Access the Strava API endpoint for profile information at https://developers.strava.com/docs/reference/#api-Athletes-getLoggedInAthlete
2. Include access tokens via header: `Authorization: Bearer #{access_token}`
3. Obtain access tokens from https://www.strava.com/settings/api (tokens expire after six hours)

**Sample cURL Request:**
```bash
curl -X GET \
  https://www.strava.com/api/v3/athlete \
  -H 'Authorization: Bearer YOURACCESSTOKEN'
```

Postman can be used as an alternative interface.

## D. How to Authenticate with OAuth 2.0

OAuth 2.0 allows developers to interact with Strava athletes without having to store sensitive information.

**Process:**
1. Application initiates OAuth
2. Athlete logs into Strava and grants consent
3. Strava redirects athlete to application URL with authorization code
4. Application exchanges authorization code for tokens

**Steps for Demonstration:**

1. Copy Client ID from https://www.strava.com/settings/api
2. Construct authorization URL:

```
http://www.strava.com/oauth/authorize?client_id=[REPLACE_WITH_YOUR_CLIENT_ID]&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read
```

3. Navigate to URL in browser
4. Click "Authorize" on authorization page
5. Extract authorization code from resulting URL
6. Exchange authorization code for tokens via POST request:

```bash
curl -X POST https://www.strava.com/oauth/token \
  -F client_id=YOURCLIENTID \
  -F client_secret=YOURCLIENTSECRET \
  -F code=AUTHORIZATIONCODE \
  -F grant_type=authorization_code
```

**Sample Response:**
```json
{
    "token_type": "Bearer",
    "expires_at": 1562908002,
    "expires_in": 21600,
    "refresh_token": "REFRESHTOKEN",
    "access_token": "ACCESSTOKEN",
    "athlete": {
        "id": 123456,
        "username": "MeowTheCat",
        "resource_state": 2,
        "firstname": "Meow",
        "lastname": "TheCat",
        "city": "",
        "state": "",
        "country": null
    }
}
```

## E. How to Use the Swagger Playground

1. Set "Authorization Callback Domain" to developers.strava.com
2. Visit https://developers.strava.com/playground
3. Click the green "Authorize" button
4. Enter Client ID and Client Secret from https://www.strava.com/settings/api

## F. Why Do I Need Webhooks?

- Comply with API terms regarding deauthorization notifications
- Avoid rate limit issues by subscribing to updates instead of polling
- Monitor when activities change from public to private
- Instructions available at https://developers.strava.com/docs/webhooks

## G. How to Get Support

**Documentation Resources:**
- Authentication: https://developers.strava.com/docs/authentication
- Webhooks: https://developers.strava.com/docs/webhooks
- API Reference: https://developers.strava.com/docs/reference
- Basic Information: https://developers.strava.com/docs

**Community:**
Developer community hub: https://communityhub.strava.com/t5/developer-discussions/bd-p/developer-discussions

**Security Notice:**
Never share access tokens, refresh tokens, authorization codes, or your client secret in a public forum.

---

# 3. General API Documentation

Source: https://developers.strava.com/docs

## Overview

The Strava V3 API is a publicly available interface allowing developers access to the rich Strava dataset.

## Access Requirements

All API calls require an `access_token`. Users obtain tokens by creating applications at https://www.strava.com/settings/api. Segment and leaderboard data are publicly available; other user data requires authorization.

## Client Code Generation

Java runtime is necessary. Install Swagger Codegen 2.X via:

**macOS:**
```bash
brew install swagger-codegen@2 maven
```

**Generation command:**
```bash
swagger-codegen generate \
  -i https://developers.strava.com/swagger/swagger.json \
  -l java \
  -o generated/java
```

Parameters:
- `--input-spec`: Use https://developers.strava.com/swagger/swagger.json
- `--config`: Optional configuration file
- `--lang`: Target programming language
- `--output`: Destination directory

## API Conventions

### Object Representations (Resource States)

The API uses three object representation levels based on the `resource_state` attribute:

| resource_state | Level | Description |
|----------------|-------|-------------|
| 1 | Meta | Minimal representation (usually just an ID) |
| 2 | Summary | Abbreviated representation |
| 3 | Detailed | Full representation with all fields |

### Pagination

- Default: 30 items per page
- Parameters: `page` (default: 1), `per_page` (max: 200)
- Iterate until empty response is returned
- No total count is provided

### Polylines

Activity, segment, and route requests include string encodings of the latitude and longitude points using the Google encoded polyline algorithm format.

### Dates

ISO 8601 standard format. Examples:
- `2015-08-23T15:46:20Z`
- `2018-06-24T09:54:13-07:00`

`start_date_local` represents the UTC version of the local start time.

### HTTP Methods

| Method | Description |
|--------|-------------|
| HEAD | Header information only |
| GET | Retrieve resources |
| POST | Create resources / custom actions |
| PUT | Update / replace resources |
| DELETE | Remove resources |

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Successful request |
| 201 | Resource successfully created |
| 401 | Unauthorized |
| 403 | Forbidden access |
| 404 | Not found / unauthorized to view |
| 429 | Rate limit exceeded |
| 500 | Strava issues (check https://status.strava.com) |

---

# 4. Authentication (OAuth 2.0)

Source: https://developers.strava.com/docs/authentication

## Overview

Strava implements OAuth2 for authentication to the V3 API, allowing external applications to request authorization to a user's data. Developers must register applications to receive a client ID and client secret.

## Authorization Endpoints

| Platform | Endpoint |
|----------|----------|
| Web | `GET https://www.strava.com/oauth/authorize` |
| Mobile | `GET https://www.strava.com/oauth/mobile/authorize` |

## Request Access Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| client_id | integer | Yes | Application's ID from registration |
| redirect_uri | string | Yes | URL for post-authentication redirect; localhost and 127.0.0.1 whitelisted |
| response_type | string | Yes | Must be "code" |
| approval_prompt | string | No | "force" or "auto" (default: auto) |
| scope | string | Yes | Comma-delimited requested permissions |
| state | string | No | Returned in redirect URI for CSRF protection |

## Available Scopes

| Scope | Access Granted |
|-------|---------------|
| `read` | Public segments, routes, profiles, posts, events, club feeds, leaderboards |
| `read_all` | Private routes, segments, events |
| `profile:read_all` | All profile data regardless of visibility settings |
| `profile:write` | Update weight/FTP; star/unstar segments |
| `activity:read` | Visible activities (Everyone/Followers), excluding privacy zones |
| `activity:read_all` | Same as activity:read plus privacy zones and "Only You" visibility |
| `activity:write` | Create/upload manual activities; edit visible activities |

## Token Exchange

**Endpoint:** `POST https://www.strava.com/api/v3/oauth/token`

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| client_id | integer | Yes | Application's ID |
| client_secret | string | Yes | Application's secret |
| code | string | Yes | Authorization code from redirect |
| grant_type | string | Yes | Must be "authorization_code" |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| token_type | string | Always "Bearer" |
| expires_at | integer | Epoch seconds when access token expires |
| expires_in | integer | Seconds until expiration |
| refresh_token | string | Token for obtaining new access tokens |
| access_token | string | Short-lived API token (6 hours) |
| athlete | object | Summary athlete information |

### Example cURL

```bash
curl -X POST https://www.strava.com/api/v3/oauth/token \
  -d client_id=ReplaceWithClientID \
  -d client_secret=ReplaceWithClientSecret \
  -d code=ReplaceWithCode \
  -d grant_type=authorization_code
```

### Example Response

```json
{
  "token_type": "Bearer",
  "expires_at": 1568775134,
  "expires_in": 21600,
  "refresh_token": "e5n567567...",
  "access_token": "a4b945687g...",
  "athlete": {
    "id": 1234567890987654321,
    "username": "marianne_t",
    "resource_state": 3,
    "firstname": "Marianne",
    "lastname": "Teutenberg",
    "city": "San Francisco",
    "state": "CA",
    "country": "US",
    "sex": "F",
    "premium": true,
    "created_at": "2017-11-14T02:30:05Z",
    "updated_at": "2018-02-06T19:32:20Z",
    "badge_type_id": 4,
    "profile_medium": "https://xxxxxx.cloudfront.net/pictures/athletes/123456789/123456789/2/medium.jpg",
    "profile": "https://xxxxx.cloudfront.net/pictures/athletes/123456789/123456789/2/large.jpg",
    "friend": null,
    "follower": null,
    "follower_count": 5,
    "friend_count": 5,
    "mutual_friend_count": 0,
    "athlete_type": 1,
    "date_preference": "%m/%d/%Y",
    "measurement_preference": "feet",
    "clubs": [],
    "ftp": null,
    "weight": 0,
    "bikes": [
      {
        "id": "b12345678987655",
        "primary": true,
        "name": "EMC",
        "resource_state": 2,
        "distance": 0
      }
    ],
    "shoes": [
      {
        "id": "g12345678987655",
        "primary": true,
        "name": "adidas",
        "resource_state": 2,
        "distance": 4904
      }
    ]
  }
}
```

## Refresh Token Flow

**Endpoint:** `POST https://www.strava.com/oauth/token`

Access tokens expire in six hours and require refreshing. If the application has an access token for the user that expires in more than one hour, the existing access token will be returned.

Every time you get a new access token, a new refresh token is also returned.

### Request Parameters

| Parameter | Type | Required |
|-----------|------|----------|
| client_id | integer | Yes |
| client_secret | string | Yes |
| grant_type | string | Yes (must be "refresh_token") |
| refresh_token | string | Yes |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| token_type | string | "Bearer" |
| access_token | string | New short-lived token |
| expires_at | integer | Epoch expiration time |
| expires_in | integer | Seconds until expiration |
| refresh_token | string | New refresh token |

### Example cURL

```bash
curl -X POST https://www.strava.com/api/v3/oauth/token \
  -d client_id=ReplaceWithClientID \
  -d client_secret=ReplaceWithClientSecret \
  -d grant_type=refresh_token \
  -d refresh_token=ReplaceWithRefreshToken
```

### Example Response

```json
{
  "token_type": "Bearer",
  "access_token": "a9b723...",
  "expires_at": 1568775134,
  "expires_in": 20566,
  "refresh_token": "b5c569..."
}
```

## Making API Requests

Use the Authorization header:

```
Authorization: Bearer {access_token}
```

**Example:**
```bash
curl -G https://www.strava.com/api/v3/athlete \
  -H "Authorization: Bearer ReplaceWithAccessToken"
```

## Deauthorization

**Endpoint:** `POST https://www.strava.com/oauth/deauthorize`

| Parameter | Type | Required |
|-----------|------|----------|
| access_token | string | Yes |

This invalidates all tokens and removes the application from user settings.

## Mobile Implementation

### Android

Redirect to `https://www.strava.com/oauth/mobile/authorize` via Implicit Intent:

```kotlin
val intentUri = Uri.parse("https://www.strava.com/oauth/mobile/authorize")
        .buildUpon()
        .appendQueryParameter("client_id", "1234321")
        .appendQueryParameter("redirect_uri", "https://www.yourapp.com")
        .appendQueryParameter("response_type", "code")
        .appendQueryParameter("approval_prompt", "auto")
        .appendQueryParameter("scope", "activity:write,read")
        .build()

val intent = Intent(Intent.ACTION_VIEW, intentUri)
startActivity(intent)
```

### iOS

Use URL schemes (prefer native Strava app if installed):

```swift
let appOAuthUrlStravaScheme = URL(string: "strava://oauth/mobile/authorize?client_id=1234321&redirect_uri=YourApp%3A%2F%2Fwww.yourapp.com%2Fen-US&response_type=code&approval_prompt=auto&scope=activity%3Awrite%2Cread&state=test")!

let webOAuthUrl = URL(string: "https://www.strava.com/oauth/mobile/authorize?client_id=1234321&redirect_uri=YourApp%3A%2F%2Fwww.yourapp.com%2Fen-US&response_type=code&approval_prompt=auto&scope=activity%3Awrite%2Cread&state=test")!

@IBAction func authenticate() {
    if UIApplication.shared.canOpenURL(appOAuthUrlstravaScheme) {
        UIApplication.shared.open(appOAuthUrlstravaScheme, options: [:])
    } else {
        authSession = SFAuthenticationSession(url: webOAuthUrl, callbackURLScheme: "YourApp://") { url, error in
            // Handle callback
        }
        authSession?.start()
    }
}
```

### Mobile Requirements
- Redirect to web if Strava app unavailable
- Requires Strava app v75.0+
- Supports refresh tokens and short-lived access tokens
- Does not support forever access tokens

## Token Storage Recommendations

Store short-lived access tokens and refresh tokens in separate tables. Preserve accepted scopes for troubleshooting purposes.

---

# 5. Webhook Events API

Source: https://developers.strava.com/docs/webhooks

## Overview

Webhook subscriptions allow an application to subscribe to events that occur within Strava, with real-time push notifications replacing the need for polling.

## Supported Events

| Object Type | Aspect Type | Description |
|-------------|-------------|-------------|
| activity | create | Athlete creates a new activity |
| activity | update | Title, type, or privacy changes |
| activity | delete | Activity is deleted |
| athlete | update | Athlete deauthorizes application (`"authorized": "false"`) |

**Privacy note:** Receiving privacy-related events requires `activity:read_all` scope.

## Event Payload Structure

POST requests to your callback URL contain these fields:

| Field | Type | Description |
|-------|------|-------------|
| object_type | string | "activity" or "athlete" |
| object_id | long integer | Activity ID or athlete ID |
| aspect_type | string | "create", "update", or "delete" |
| updates | hash | Key-value pairs for changes; for deauthorization: `{"authorized": "false"}` |
| owner_id | long integer | Athlete's ID |
| subscription_id | integer | Push subscription ID |
| event_time | long integer | Unix timestamp of event occurrence |

### Example Event Payload

```json
{
    "aspect_type": "update",
    "event_time": 1516126040,
    "object_id": 1360128428,
    "object_type": "activity",
    "owner_id": 134815,
    "subscription_id": 120475,
    "updates": {
        "title": "Messy"
    }
}
```

## Callback Requirements

- Must respond with HTTP 200 status within 2 seconds
- Failed responses trigger automatic retries (up to 3 total attempts)
- Asynchronous processing recommended for intensive operations

## Subscription Management

**Endpoint:** `https://www.strava.com/api/v3/push_subscriptions`

Each application supports only ONE subscription, which receives events from all authorized athletes.

### Create Subscription (POST)

**Two-step process:**

**Step 1:** POST request with form parameters:

| Parameter | Type | Required | Details |
|-----------|------|----------|---------|
| client_id | integer | Yes | Application ID |
| client_secret | string | Yes | Application secret |
| callback_url | string | Yes | Webhook endpoint (max 255 characters) |
| verify_token | string | Yes | Client-chosen security token |

```bash
curl -X POST https://www.strava.com/api/v3/push_subscriptions \
  -F client_id=5 \
  -F client_secret=7b2946535949ae70f015d696d8ac602830ece412 \
  -F callback_url=http://a-valid.com/url \
  -F verify_token=STRAVA
```

**Step 2:** Strava validates callback via GET request:

```
GET https://mycallbackurl.com?hub.verify_token=STRAVA&hub.challenge=15f7d1a91c1f40f8a748fd134752feb3&hub.mode=subscribe
```

Validation query parameters:

| Parameter | Type | Details |
|-----------|------|---------|
| hub.mode | string | Always "subscribe" |
| hub.challenge | string | Random string to echo back |
| hub.verify_token | string | Matches your submitted verify_token |

**Your validation response must:**
- Return HTTP status 200
- Echo the `hub.challenge` value in JSON body
- Complete within 2 seconds

```json
{ "hub.challenge": "15f7d1a91c1f40f8a748fd134752feb3" }
```

**Successful creation response:**
```json
{
  "id": 1
}
```

### View Subscription (GET)

```bash
curl -G https://www.strava.com/api/v3/push_subscriptions \
  -d client_id=5 \
  -d client_secret=7b2946535949ae70f015d696d8ac602830ece412
```

| Parameter | Type | Required |
|-----------|------|----------|
| client_id | integer | Yes |
| client_secret | string | Yes |

### Delete Subscription (DELETE)

```bash
curl -X DELETE "https://www.strava.com/api/v3/push_subscriptions/12345?client_id=5&client_secret=7b2946535949ae70f015d696d8ac602830ece412"
```

**Endpoint:** `DELETE https://www.strava.com/api/v3/push_subscriptions/{id}`

| Parameter | Type | Required |
|-----------|------|----------|
| id | integer (path) | Yes |
| client_id | integer (query) | Yes |
| client_secret | string (query) | Yes |

**Response:** 204 No Content on success

## Scope Requirements for Events

- **`activity:read_all`** — Required to receive "Only You" visibility activity updates
- **`activity:read` or `activity:read_all`** — Required to receive "Everyone" or "Followers Only" visibility updates
- Applications with only `activity:read` scope receive `delete` events when visibility changes to "Only You" and `create` events when changing away from it

## Privacy Handling

Per the Strava API Agreement, applications must respect an activity's privacy.

## Troubleshooting

### Unable to create subscription:
- Check for existing subscription; delete if present
- Test callback URL responds within 2 seconds using validation URL format
- Verify 200 status and correct `hub.challenge` echo in response

### Not receiving events:
- Verify athlete scope authorizations
- Implement logging at network edge
- Manually test callback with sample POST:

```bash
curl -X POST {your-callback-url} \
  -H 'Content-Type: application/json' \
  -d '{
    "aspect_type": "create",
    "event_time": 1549560669,
    "object_id": 0000000000,
    "object_type": "activity",
    "owner_id": 9999999,
    "subscription_id": 999999
  }'
```

---

# 6. Rate Limits

Source: https://developers.strava.com/docs/rate-limits

## Default Rate Limits

| Window | Overall Limit | Non-Upload Limit |
|--------|--------------|------------------|
| 15-minute | 200 requests | 100 requests |
| Daily | 2,000 requests | 1,000 requests |

## Endpoints Excluded from Non-Upload Limits

These bypass the reduced non-upload restrictions:
- `POST /activities` (activities#create)
- `POST /uploads` (uploads#create)
- `activities#upload_media`

## Reset Schedule

- **15-minute window:** Resets at natural 15-minute intervals corresponding to 0, 15, 30, and 45 minutes after the hour
- **Daily limit:** Resets at midnight UTC

## HTTP Response Headers

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Two comma-separated values: 15-minute limit, daily limit |
| `X-RateLimit-Usage` | Two comma-separated values: 15-minute usage, daily usage |
| `X-ReadRateLimit-Limit` | Read-specific ceiling values |
| `X-ReadRateLimit-Usage` | Read-specific consumption metrics |

## Exceeding Limits

Violation triggers HTTP `429 Too Many Requests` with a JSON error response body.

## Athlete Capacity (Single Player Mode)

New applications launch with capacity of 1 athlete ("Single Player Mode"), limiting access to the developer's own data only. Expansion requires completion of the Developer Program form.

## Rate Limit Increase Process

Four mandatory steps:
1. **Demonstrate demand** — Approach capacity thresholds
2. **Review API terms** — Updated November 11, 2024
3. **Comply with brand guidelines** — Follow all branding requirements
4. **Submit Developer Program form** — Include application screenshots

---

# 7. Activity Uploads

Source: https://developers.strava.com/docs/uploads

## Overview

Strava's upload system operates asynchronously. Files are submitted via multipart/form-data POST requests that perform initial validation and queue the file for processing. The activity won't appear in API results until processing completes successfully.

A one-second or longer polling interval is recommended. The mean processing time is currently under 2 seconds.

## Supported File Formats

All formats require timestamps for each trackpoint or record.

### FIT (Flexible and Interoperable Data Transfer)

Strava complies with the FIT Activity File specification (FIT_FILE_TYPE = 4). All files must include timestamps with trackpoints; latitude/longitude, elevation, and heart rate are optional. Activity types are detected from `session.sport` and `session.sub_sport` values.

Recognized message types: file_id, session, lap, record, event, hr, length, split, activity.

### TCX (Training Center Database XML)

Garmin's Training Center format (version 2 supported). Supports power data but lacks temperature capability. Strava extracts runcadence and watts from trackpoint extensions. Recognized activity types: biking, running, hiking, walking, swimming only.

### GPX (GPS Exchange Format)

Follows version 1.1 standards. Base GPX lacks heartrate, cadence, distance, and temperature support. Strava recognizes extensions from:
- Garmin Track Point Extension v1
- Cluetrust GPX extension
- General extension tags

## Upload Endpoint

**`POST https://www.strava.com/api/v3/uploads`**

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | multipart/form-data | Yes | The activity file |
| data_type | string | Yes | fit, fit.gz, tcx, tcx.gz, gpx, gpx.gz |
| sport_type | string | No | Case-sensitive activity type override |
| name | string | No | Activity title |
| description | string | No | Activity description |
| trainer | integer | No | Set to 1 for stationary activities |
| commute | integer | No | Set to 1 to mark as commute |
| external_id | string | No | Unique identifier |
| activity_type | string | No | **Deprecated** — use sport_type instead |

### Example Request

```bash
curl -X POST https://www.strava.com/api/v3/uploads \
    -H "Authorization: Bearer abcd123abcd123abcd123abcd123" \
    -F activity_type="walk" \
    -F name="Test Walk" \
    -F description="Test description" \
    -F trainer=0 \
    -F commute=0 \
    -F data_type="gpx" \
    -F external_id="98765" \
    -F file=@/path/to/walk.gpx
```

### Example Response (201 Created)

```json
{
  "id": 123456,
  "id_str": "123456",
  "external_id": "98765.gpx",
  "error": null,
  "status": "Your activity is still being processed.",
  "activity_id": null
}
```

## Status Check Endpoint

**`GET https://www.strava.com/api/v3/uploads/{uploadId}`**

### Upload Status Object

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Upload identifier (use id_str for 64-bit safety) |
| id_str | string | String format of upload ID |
| external_id | string | The provided external identifier |
| error | string | Null on success; error message on failure |
| status | string | Processing status description |
| activity_id | integer | Null until processing completes |

### Example Polling Request

```bash
curl -G https://www.strava.com/api/v3/uploads/123456 \
    -H "Authorization: Bearer 83ebeabdec09f6670863766f792ead24d61fe3f9"
```

### Success Response

```json
{
  "id": 123456,
  "id_str": "123456",
  "external_id": "98765.gpx",
  "error": null,
  "status": "Your activity is ready.",
  "activity_id": 153243126
}
```

### Error Response

```json
{
  "id": 123456,
  "id_str": "123456",
  "external_id": null,
  "error": "Test_Walk.gpx duplicate of activity 21234316",
  "status": "There was an error processing your activity.",
  "activity_id": null
}
```

## Status Values

- `Your activity is still being processed.`
- `Your activity is ready.`
- `The created activity has been deleted.`
- `There was an error processing your activity.`

## Error Handling

Check the `error` attribute for null to determine upload success. Error and status messages are human-readable English and may include escaped HTML.

---

# 8. API Reference — All Endpoints

Source: https://developers.strava.com/swagger/swagger.json

**Base URL:** `https://www.strava.com/api/v3`
**Protocol:** HTTPS only
**Format:** JSON

## Global Parameters

| Parameter | In | Type | Default | Description |
|-----------|----|------|---------|-------------|
| page | query | integer | 1 | Page number |
| per_page | query | integer | 30 | Items per page (max 200) |

---

## Activities

### POST /activities — Create an Activity

Creates a manual activity for an athlete. Requires `activity:write` scope.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| name | formData | string | Yes | The name of the activity |
| sport_type | formData | string | Yes | Sport type (e.g. Run, MountainBikeRide, Ride) |
| start_date_local | formData | date-time | Yes | ISO 8601 formatted date time |
| elapsed_time | formData | integer | Yes | In seconds |
| type | formData | string | No | Type of activity (e.g. Run, Ride). Deprecated |
| description | formData | string | No | Description of the activity |
| distance | formData | float | No | In meters |
| trainer | formData | integer | No | Set to 1 to mark as trainer activity |
| commute | formData | integer | No | Set to 1 to mark as commute |

**Response:** 201 — DetailedActivity

**Example Response:**
```json
{
    "id": 123456778928065,
    "resource_state": 3,
    "external_id": null,
    "upload_id": null,
    "athlete": { "id": 12343545645788, "resource_state": 1 },
    "name": "Chill Day",
    "distance": 0,
    "moving_time": 18373,
    "elapsed_time": 18373,
    "total_elevation_gain": 0,
    "type": "Ride",
    "sport_type": "MountainBikeRide",
    "start_date": "2018-02-20T18:02:13Z",
    "start_date_local": "2018-02-20T10:02:13Z",
    "timezone": "(GMT-08:00) America/Los_Angeles",
    "utc_offset": -28800,
    "achievement_count": 0,
    "kudos_count": 0,
    "comment_count": 0,
    "athlete_count": 1,
    "photo_count": 0,
    "map": { "id": "a12345678908766", "polyline": null, "resource_state": 3 },
    "trainer": false,
    "commute": false,
    "manual": true,
    "private": false,
    "flagged": false,
    "gear_id": "b453542543",
    "from_accepted_tag": null,
    "average_speed": 0,
    "max_speed": 0,
    "device_watts": false,
    "has_heartrate": false,
    "pr_count": 0,
    "total_photo_count": 0,
    "has_kudoed": false,
    "workout_type": null,
    "description": null,
    "calories": 0,
    "segment_efforts": []
}
```

---

### GET /activities/{id} — Get Activity

Returns the given activity that is owned by the authenticated athlete. Requires `activity:read` for Everyone and Followers activities. Requires `activity:read_all` for Only Me activities.

**Note:** Strava strongly encourages displaying appropriate attribution that identifies Garmin as the data source and the device name in your application.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the activity |
| include_all_efforts | query | boolean | No | Include all segment efforts in response |

**Response:** 200 — DetailedActivity

---

### PUT /activities/{id} — Update Activity

Updates the given activity that is owned by the authenticated athlete. Requires `activity:write`. Also requires `activity:read_all` in order to update Only Me activities.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the activity |
| body | body | UpdatableActivity | No | Activity update fields |

**Response:** 200 — DetailedActivity

---

### GET /activities/{id}/comments — List Activity Comments

Returns the comments on the given activity. Requires `activity:read` for Everyone and Followers activities. Requires `activity:read_all` for Only Me activities.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the activity |
| page | query | integer | No | Deprecated, use after_cursor instead |
| per_page | query | integer | No | Deprecated, use page_size instead |
| page_size | query | integer | No | Items per page (default 30, max 200) |
| after_cursor | query | string | No | Cursor for pagination |

**Response:** 200 — array of Comment

---

### GET /activities/{id}/kudos — List Activity Kudoers

Returns the athletes who kudoed an activity. Requires `activity:read` for Everyone and Followers activities. Requires `activity:read_all` for Only Me activities.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the activity |
| page | query | integer | No | Page number (default 1) |
| per_page | query | integer | No | Items per page (default 30) |

**Response:** 200 — array of SummaryAthlete

---

### GET /activities/{id}/laps — List Activity Laps

Returns the laps of an activity. Requires `activity:read` for Everyone and Followers activities. Requires `activity:read_all` for Only Me activities.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the activity |

**Response:** 200 — array of Lap

---

### GET /activities/{id}/zones — Get Activity Zones

Summit Feature. Returns the zones of a given activity. Requires `activity:read` for Everyone and Followers activities. Requires `activity:read_all` for Only Me activities.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the activity |

**Response:** 200 — array of ActivityZone

---

### GET /athlete/activities — List Athlete Activities

Returns the activities of an athlete. Requires `activity:read`. Only Me activities will be filtered out unless requested by a token with `activity:read_all`.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| before | query | integer | No | Epoch timestamp; filter activities before this time |
| after | query | integer | No | Epoch timestamp; filter activities after this time |
| page | query | integer | No | Page number (default 1) |
| per_page | query | integer | No | Items per page (default 30) |

**Response:** 200 — array of SummaryActivity

---

## Athletes

### GET /athlete — Get Authenticated Athlete

Returns the currently authenticated athlete. Tokens with `profile:read_all` scope will receive a detailed athlete representation; all others will receive a summary representation.

**Parameters:** None

**Response:** 200 — DetailedAthlete

**Example Response:**
```json
{
    "id": 1234567890987654321,
    "username": "marianne_t",
    "resource_state": 3,
    "firstname": "Marianne",
    "lastname": "Teutenberg",
    "city": "San Francisco",
    "state": "CA",
    "country": "US",
    "sex": "F",
    "premium": true,
    "created_at": "2017-11-14T02:30:05Z",
    "updated_at": "2018-02-06T19:32:20Z",
    "badge_type_id": 4,
    "profile_medium": "https://xxxxxx.cloudfront.net/pictures/athletes/123456789/123456789/2/medium.jpg",
    "profile": "https://xxxxx.cloudfront.net/pictures/athletes/123456789/123456789/2/large.jpg",
    "friend": null,
    "follower": null,
    "follower_count": 5,
    "friend_count": 5,
    "mutual_friend_count": 0,
    "athlete_type": 1,
    "date_preference": "%m/%d/%Y",
    "measurement_preference": "feet",
    "clubs": [],
    "ftp": null,
    "weight": 0,
    "bikes": [
        { "id": "b12345678987655", "primary": true, "name": "EMC", "resource_state": 2, "distance": 0 }
    ],
    "shoes": [
        { "id": "g12345678987655", "primary": true, "name": "adidas", "resource_state": 2, "distance": 4904 }
    ]
}
```

---

### PUT /athlete — Update Athlete

Update the currently authenticated athlete. Requires `profile:write` scope.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| weight | path | float | Yes | The weight of the athlete in kilograms |

**Response:** 200 — DetailedAthlete

---

### GET /athlete/zones — Get Zones

Returns the authenticated athlete's heart rate and power zones. Requires `profile:read_all`.

**Parameters:** None

**Response:** 200 — Zones

**Example Response:**
```json
[
    {
        "distribution_buckets": [
            { "max": 0, "min": 0, "time": 1498 },
            { "max": 50, "min": 0, "time": 62 },
            { "max": 100, "min": 50, "time": 169 },
            { "max": 150, "min": 100, "time": 536 },
            { "max": 200, "min": 150, "time": 672 },
            { "max": 250, "min": 200, "time": 821 },
            { "max": 300, "min": 250, "time": 529 },
            { "max": 350, "min": 300, "time": 251 },
            { "max": 400, "min": 350, "time": 80 },
            { "max": 450, "min": 400, "time": 81 },
            { "max": -1, "min": 450, "time": 343 }
        ],
        "type": "power",
        "resource_state": 3,
        "sensor_based": true
    }
]
```

---

### GET /athletes/{id}/stats — Get Athlete Stats

Returns the activity stats of an athlete. Only includes data from activities set to Everyone visibility.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the athlete. Must match the authenticated athlete. |

**Response:** 200 — ActivityStats

---

## Clubs

### GET /clubs/{id} — Get Club

Returns a given club using its identifier.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the club |

**Response:** 200 — DetailedClub

---

### GET /clubs/{id}/activities — List Club Activities

Retrieve recent activities from members of a specific club. The authenticated athlete must belong to the requested club. Pagination is supported. Athlete profile visibility is respected.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the club |
| page | query | integer | No | Page number |
| per_page | query | integer | No | Items per page (default 30) |

**Response:** 200 — array of ClubActivity

---

### GET /clubs/{id}/admins — List Club Administrators

Returns a list of the administrators of a given club.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the club |
| page | query | integer | No | Page number |
| per_page | query | integer | No | Items per page (default 30) |

**Response:** 200 — array of SummaryAthlete

---

### GET /clubs/{id}/members — List Club Members

Returns a list of the athletes who are members of a given club.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the club |
| page | query | integer | No | Page number |
| per_page | query | integer | No | Items per page (default 30) |

**Response:** 200 — array of ClubAthlete

---

### GET /athlete/clubs — List Athlete Clubs

Returns a list of the clubs whose membership includes the authenticated athlete.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| page | query | integer | No | Page number |
| per_page | query | integer | No | Items per page (default 30) |

**Response:** 200 — array of SummaryClub

---

## Gears

### GET /gear/{id} — Get Equipment

Returns an equipment using its identifier.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | string | Yes | The identifier of the gear |

**Response:** 200 — DetailedGear

---

## Routes

### GET /routes/{id} — Get Route

Returns a route using its identifier. Requires `read_all` scope for private routes.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the route |

**Response:** 200 — Route

---

### GET /routes/{id}/export_gpx — Export Route GPX

Returns a GPX file of the route. Requires `read_all` scope for private routes.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the route |

**Response:** 200 — GPX file

---

### GET /routes/{id}/export_tcx — Export Route TCX

Returns a TCX file of the route. Requires `read_all` scope for private routes.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the route |

**Response:** 200 — TCX file

---

### GET /athletes/{id}/routes — List Athlete Routes

Returns a list of the routes created by the authenticated athlete. Private routes are filtered out unless requested by a token with `read_all` scope.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| page | query | integer | No | Page number |
| per_page | query | integer | No | Items per page (default 30) |

**Response:** 200 — array of Route

---

## Segments

### GET /segments/{id} — Get Segment

Returns the specified segment. `read_all` scope required in order to retrieve athlete-specific segment information, or to retrieve private segments.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the segment |

**Response:** 200 — DetailedSegment

**Example Response:**
```json
{
    "id": 229781,
    "resource_state": 3,
    "name": "Hawk Hill",
    "activity_type": "Ride",
    "distance": 2684.82,
    "average_grade": 5.7,
    "maximum_grade": 14.2,
    "elevation_high": 245.3,
    "elevation_low": 92.4,
    "start_latlng": [37.8331119, -122.4834356],
    "end_latlng": [37.8280722, -122.4981393],
    "climb_category": 1,
    "city": "San Francisco",
    "state": "CA",
    "country": "United States",
    "private": false,
    "hazardous": false,
    "starred": false,
    "created_at": "2009-09-21T20:29:41Z",
    "updated_at": "2018-02-15T09:04:18Z",
    "total_elevation_gain": 155.733,
    "map": {
        "id": "s229781",
        "polyline": "}g|eFnpqjVl@En@Md@HbAd@d@^h@Xx@VbARjBDh@OPQf@w@d@k@XKXDFPH\\EbGT`AV`@v@|@NTNb@?XOb@cAxAWLuE@eAFMBoAv@eBt@q@b@}@tAeAt@i@dAC`AFZj@dB?~@[h@MbAVn@b@b@\\d@Eh@Qb@_@d@eB|@c@h@WfBK|AMpA?VF\\\\t@f@t@h@j@|@b@hCb@b@XTd@Bl@GtA?jAL`ALp@Tr@RXd@Rx@Pn@^Zh@Tx@Zf@`@FTCzDy@f@Yx@m@n@Op@VJr@",
        "resource_state": 3
    },
    "effort_count": 309974,
    "athlete_count": 30623,
    "star_count": 2428,
    "athlete_segment_stats": {
        "pr_elapsed_time": 553,
        "pr_date": "1993-04-03",
        "effort_count": 2
    }
}
```

---

### GET /segments/starred — List Starred Segments

List of the authenticated athlete's starred segments. Private segments are filtered out unless requested by a token with `read_all` scope.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| page | query | integer | No | Page number |
| per_page | query | integer | No | Items per page (default 30) |

**Response:** 200 — array of SummarySegment

---

### PUT /segments/{id}/starred — Star Segment

Stars/Unstars the given segment for the authenticated athlete. Requires `profile:write` scope.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the segment to star |
| starred | formData | boolean | Yes | If true, star the segment; if false, unstar |

**Response:** 200 — DetailedSegment

---

### GET /segments/explore — Explore Segments

Returns the top 10 segments matching a specified query.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| bounds | query | array[float] | Yes | [sw_lat, sw_lng, ne_lat, ne_lng] — CSV format, 4 values |
| activity_type | query | string | No | "running" or "riding" |
| min_cat | query | integer | No | Minimum climbing category (0-5) |
| max_cat | query | integer | No | Maximum climbing category (0-5) |

**Response:** 200 — ExplorerResponse

---

## Segment Efforts

### GET /segment_efforts — List Segment Efforts

Returns a set of the authenticated athlete's segment efforts for a given segment. Requires subscription.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| segment_id | query | integer | Yes | The identifier of the segment |
| start_date_local | query | date-time | No | ISO 8601 formatted date time |
| end_date_local | query | date-time | No | ISO 8601 formatted date time |
| per_page | query | integer | No | Items per page (default 30) |

**Response:** 200 — array of DetailedSegmentEffort

**Example Response:**
```json
[
    {
        "id": 123456789,
        "resource_state": 2,
        "name": "Alpe d'Huez",
        "activity": { "id": 1234567890, "resource_state": 1 },
        "athlete": { "id": 123445678689, "resource_state": 1 },
        "elapsed_time": 1657,
        "moving_time": 1642,
        "start_date": "2007-09-15T08:15:29Z",
        "start_date_local": "2007-09-15T09:15:29Z",
        "distance": 6148.92,
        "start_index": 1102,
        "end_index": 1366,
        "device_watts": false,
        "average_watts": 220.2,
        "segment": {
            "id": 788127,
            "resource_state": 2,
            "name": "Alpe d'Huez",
            "activity_type": "Ride",
            "distance": 6297.46,
            "average_grade": 4.8,
            "maximum_grade": 16.3,
            "elevation_high": 416,
            "elevation_low": 104.6,
            "start_latlng": [52.98501000581467, -3.1869720001197367],
            "end_latlng": [53.02204074375785, -3.2039630001245737],
            "climb_category": 2,
            "city": "Le Bourg D'Oisans",
            "state": "RA",
            "country": "France",
            "private": false,
            "hazardous": false,
            "starred": false
        },
        "kom_rank": null,
        "pr_rank": null,
        "achievements": []
    }
]
```

---

### GET /segment_efforts/{id} — Get Segment Effort

Returns a segment effort from an activity that is owned by the authenticated athlete. Requires subscription.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the segment effort |

**Response:** 200 — DetailedSegmentEffort

---

## Streams

### GET /activities/{id}/streams — Get Activity Streams

Returns the given activity's streams. Requires `activity:read` scope. Requires `activity:read_all` scope for Only Me activities.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the activity |
| keys | query | array[StreamType] | Yes | Stream types to return (comma-separated) |
| key_by_type | query | boolean | Yes | Must be true |

**Response:** 200 — StreamSet

---

### GET /routes/{id}/streams — Get Route Streams

Returns the given route's streams. Requires `read_all` scope for private routes.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the route |

**Response:** 200 — StreamSet

---

### GET /segment_efforts/{id}/streams — Get Segment Effort Streams

Returns a set of streams for a segment effort completed by the authenticated athlete. Requires `read_all` scope.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the segment effort |
| keys | query | array[StreamType] | Yes | Stream types to return |
| key_by_type | query | boolean | Yes | Must be true |

**Response:** 200 — StreamSet

---

### GET /segments/{id}/streams — Get Segment Streams

Returns the given segment's streams. Requires `read_all` scope for private segments.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| id | path | int64 | Yes | The identifier of the segment |
| keys | query | array[StreamType] | Yes | Stream types to return |
| key_by_type | query | boolean | Yes | Must be true |

**Response:** 200 — StreamSet

---

## Uploads

### POST /uploads — Upload Activity

Uploads a new data file to create an activity from. Requires `activity:write` scope.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| file | formData | file | No | The uploaded activity data file |
| name | formData | string | No | Activity name |
| description | formData | string | No | Activity description |
| trainer | formData | string | No | Trainer flag |
| commute | formData | string | No | Commute flag |
| data_type | formData | string | No | File type: fit, fit.gz, tcx, tcx.gz, gpx, gpx.gz |
| external_id | formData | string | No | External identifier |

**Response:** 201 — Upload

---

### GET /uploads/{uploadId} — Get Upload

Returns an upload for a given identifier. Requires `activity:write` scope.

**Parameters:**

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| uploadId | path | int64 | Yes | The identifier of the upload |

**Response:** 200 — Upload

---

# 9. Data Models (Swagger Schemas)

All model definitions extracted from the official Swagger specification at https://developers.strava.com/swagger/

## MetaActivity

| Field | Type | Description |
|-------|------|-------------|
| id | integer | The unique identifier of the activity |

## SummaryActivity

Extends: MetaActivity

| Field | Type | Description |
|-------|------|-------------|
| external_id | string | The identifier provided at upload time |
| upload_id | integer | The identifier of the upload that resulted in this activity |
| athlete | MetaAthlete | The athlete who performed the activity |
| name | string | The name of the activity |
| distance | number | The activity's distance, in meters |
| moving_time | integer | The activity's moving time, in seconds |
| elapsed_time | integer | The activity's elapsed time, in seconds |
| total_elevation_gain | number | The activity's total elevation gain |
| elev_high | number | The activity's highest elevation, in meters |
| elev_low | number | The activity's lowest elevation, in meters |
| type | ActivityType | Deprecated. Prefer to use sport_type |
| sport_type | SportType | The sport type of the activity |
| start_date | string | The time at which the activity was started |
| start_date_local | string | The time at which the activity was started in the local timezone |
| timezone | string | The timezone of the activity |
| start_latlng | LatLng | Start coordinates |
| end_latlng | LatLng | End coordinates |
| achievement_count | integer | The number of achievements gained during this activity |
| kudos_count | integer | The number of kudos given for this activity |
| comment_count | integer | The number of comments for this activity |
| athlete_count | integer | The number of athletes for taking part in a group activity |
| photo_count | integer | The number of Instagram photos for this activity |
| total_photo_count | integer | The number of Instagram and Strava photos for this activity |
| map | PolylineMap | Map data for the activity |
| device_name | string | The name of the device used to record the activity |
| trainer | boolean | Whether this activity was recorded on a training machine |
| commute | boolean | Whether this activity is a commute |
| manual | boolean | Whether this activity was created manually |
| private | boolean | Whether this activity is private |
| flagged | boolean | Whether this activity is flagged |
| workout_type | integer | The activity's workout type |
| upload_id_str | string | The unique identifier of the upload in string format |
| average_speed | number | The activity's average speed, in meters per second |
| max_speed | number | The activity's max speed, in meters per second |
| has_kudoed | boolean | Whether the logged-in athlete has kudoed this activity |
| hide_from_home | boolean | Whether the activity is muted |
| gear_id | string | The id of the gear for the activity |
| kilojoules | number | The total work done in kilojoules during this activity. Rides only |
| average_watts | number | Average power output in watts during this activity. Rides only |
| device_watts | boolean | Whether the watts are from a power meter, false if estimated |
| max_watts | integer | Rides with power meter data only |
| weighted_average_watts | integer | Similar to Normalized Power. Rides with power meter data only |

## DetailedActivity

Extends: SummaryActivity

| Field | Type | Description |
|-------|------|-------------|
| description | string | The description of the activity |
| photos | PhotosSummary | Photos associated with the activity |
| gear | SummaryGear | Gear used for the activity |
| calories | number | The number of kilocalories consumed during this activity |
| segment_efforts | array[DetailedSegmentEffort] | Segment efforts during the activity |
| device_name | string | The name of the device used to record the activity |
| embed_token | string | The token used to embed a Strava activity |
| splits_metric | array[Split] | The splits of this activity in metric units (for runs) |
| splits_standard | array[Split] | The splits of this activity in imperial units (for runs) |
| laps | array[Lap] | Lap data for the activity |
| best_efforts | array[DetailedSegmentEffort] | Best efforts during the activity |

## UpdatableActivity

| Field | Type | Description |
|-------|------|-------------|
| commute | boolean | Whether this activity is a commute |
| trainer | boolean | Whether this activity was recorded on a training machine |
| hide_from_home | boolean | Whether this activity is muted |
| description | string | The description of the activity |
| name | string | The name of the activity |
| type | ActivityType | Deprecated. Prefer to use sport_type |
| sport_type | SportType | The sport type of the activity |
| gear_id | string | Identifier for the gear. 'none' clears gear from activity |

## ClubActivity

| Field | Type | Description |
|-------|------|-------------|
| athlete | MetaAthlete | The performing athlete |
| name | string | The name of the activity |
| distance | number | The activity's distance, in meters |
| moving_time | integer | The activity's moving time, in seconds |
| elapsed_time | integer | The activity's elapsed time, in seconds |
| total_elevation_gain | number | The activity's total elevation gain |
| type | ActivityType | Deprecated. Prefer to use sport_type |
| sport_type | SportType | The sport type |
| workout_type | integer | The activity's workout type |

## MetaAthlete

| Field | Type | Description |
|-------|------|-------------|
| id | integer | The unique identifier of the athlete |

## SummaryAthlete

Extends: MetaAthlete

| Field | Type | Description |
|-------|------|-------------|
| resource_state | integer | 1=meta, 2=summary, 3=detail |
| firstname | string | The athlete's first name |
| lastname | string | The athlete's last name |
| profile_medium | string | URL to a 62x62 pixel profile picture |
| profile | string | URL to a 124x124 pixel profile picture |
| city | string | The athlete's city |
| state | string | The athlete's state or geographical region |
| country | string | The athlete's country |
| sex | string | The athlete's sex |
| premium | boolean | Deprecated. Use summit field instead |
| summit | boolean | Whether the athlete has any Summit subscription |
| created_at | string | The time at which the athlete was created |
| updated_at | string | The time at which the athlete was last updated |

## DetailedAthlete

Extends: SummaryAthlete

| Field | Type | Description |
|-------|------|-------------|
| follower_count | integer | The athlete's follower count |
| friend_count | integer | The athlete's friend count |
| measurement_preference | string | The athlete's preferred unit system |
| ftp | integer | The athlete's FTP (Functional Threshold Power) |
| weight | number | The athlete's weight |
| clubs | array[SummaryClub] | The athlete's clubs |
| bikes | array[SummaryGear] | The athlete's bikes |
| shoes | array[SummaryGear] | The athlete's shoes |

## ClubAthlete

| Field | Type | Description |
|-------|------|-------------|
| resource_state | integer | 1=meta, 2=summary, 3=detail |
| firstname | string | The athlete's first name |
| lastname | string | The athlete's last initial |
| member | string | The athlete's member status |
| admin | boolean | Whether the athlete is a club admin |
| owner | boolean | Whether the athlete is club owner |

## MetaClub

| Field | Type | Description |
|-------|------|-------------|
| id | integer | The club's unique identifier |
| resource_state | integer | 1=meta, 2=summary, 3=detail |
| name | string | The club's name |

## SummaryClub

Extends: MetaClub

| Field | Type | Description |
|-------|------|-------------|
| profile_medium | string | URL to a 60x60 pixel profile picture |
| cover_photo | string | URL to a ~1185x580 pixel cover photo |
| cover_photo_small | string | URL to a ~360x176 pixel cover photo |
| sport_type | string | Deprecated. Prefer to use activity_types |
| activity_types | array[ActivityType] | The activity types that count for a club |
| city | string | The club's city |
| state | string | The club's state or geographical region |
| country | string | The club's country |
| private | boolean | Whether the club is private |
| member_count | integer | The club's member count |
| featured | boolean | Whether the club is featured |
| verified | boolean | Whether the club is verified |
| url | string | The club's vanity URL |

## DetailedClub

Extends: SummaryClub

| Field | Type | Description |
|-------|------|-------------|
| membership | string | The membership status of the logged-in athlete |
| admin | boolean | Whether the currently logged-in athlete is an administrator |
| owner | boolean | Whether the currently logged-in athlete is the owner |
| following_count | integer | The number of athletes in the club that the logged-in athlete follows |

## ClubAnnouncement

| Field | Type | Description |
|-------|------|-------------|
| id | integer | The unique identifier of this announcement |
| club_id | integer | The unique identifier of the club |
| athlete | SummaryAthlete | The announcing athlete |
| created_at | string | The time at which this announcement was created |
| message | string | The content of this announcement |

## MembershipApplication

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Whether the application was successfully submitted |
| active | boolean | Whether the membership is currently active |
| membership | string | "member" or "pending" |

## Comment

| Field | Type | Description |
|-------|------|-------------|
| id | integer | The unique identifier of this comment |
| activity_id | integer | The identifier of the related activity |
| text | string | The content of the comment |
| athlete | SummaryAthlete | The commenting athlete |
| created_at | string | The time at which this comment was created |

## SummaryGear

| Field | Type | Description |
|-------|------|-------------|
| id | string | The gear's unique identifier |
| resource_state | integer | 2=summary, 3=detail |
| primary | boolean | Whether this is the owner's default gear |
| name | string | The gear's name |
| distance | number | The distance logged with this gear |

## DetailedGear

Extends: SummaryGear

| Field | Type | Description |
|-------|------|-------------|
| brand_name | string | The gear's brand name |
| model_name | string | The gear's model name |
| frame_type | integer | The gear's frame type (bike only) |
| description | string | The gear's description |

## Route

| Field | Type | Description |
|-------|------|-------------|
| athlete | SummaryAthlete | The route's creator |
| description | string | The description of the route |
| distance | number | The route's distance, in meters |
| elevation_gain | number | The route's elevation gain |
| id | integer | The unique identifier of this route |
| id_str | string | The unique identifier in string format |
| map | PolylineMap | Map data |
| name | string | The name of this route |
| private | boolean | Whether this route is private |
| starred | boolean | Whether this route is starred by the logged-in athlete |
| timestamp | integer | Epoch timestamp of when the route was created |
| type | integer | 1 for ride, 2 for run |
| sub_type | integer | 1=road, 2=mountain bike, 3=cross, 4=trail, 5=mixed |
| created_at | string | Creation time |
| updated_at | string | Last update time |
| estimated_moving_time | integer | Estimated time in seconds for the authenticated athlete |
| segments | array[SummarySegment] | The segments traversed by this route |
| waypoints | array[Waypoint] | The custom waypoints along this route |

## SummarySegment

| Field | Type | Description |
|-------|------|-------------|
| id | integer | The unique identifier of this segment |
| name | string | The name of this segment |
| activity_type | string | "Ride" or "Run" |
| distance | number | The segment's distance, in meters |
| average_grade | number | The segment's average grade, in percents |
| maximum_grade | number | The segment's maximum grade, in percents |
| elevation_high | number | The segment's highest elevation, in meters |
| elevation_low | number | The segment's lowest elevation, in meters |
| start_latlng | LatLng | Start coordinates |
| end_latlng | LatLng | End coordinates |
| climb_category | integer | [0,5] — 5 is Hors categorie, 0 is uncategorized |
| city | string | The segment's city |
| state | string | The segment's state or geographical region |
| country | string | The segment's country |
| private | boolean | Whether this segment is private |
| athlete_pr_effort | SummaryPRSegmentEffort | The athlete's PR effort |
| athlete_segment_stats | SummarySegmentEffort | The athlete's stats on this segment |

## DetailedSegment

Extends: SummarySegment

| Field | Type | Description |
|-------|------|-------------|
| created_at | string | The time at which the segment was created |
| updated_at | string | The time at which the segment was last updated |
| total_elevation_gain | number | The segment's total elevation gain |
| map | PolylineMap | Map data |
| effort_count | integer | The total number of efforts for this segment |
| athlete_count | integer | The number of unique athletes with an effort |
| hazardous | boolean | Whether this segment is considered hazardous |
| star_count | integer | The number of stars for this segment |

## ExplorerSegment

| Field | Type | Description |
|-------|------|-------------|
| id | integer | The unique identifier |
| name | string | The name |
| climb_category | integer | [0,5] category |
| climb_category_desc | string | "NC", "4", "3", "2", "1", or "HC" |
| avg_grade | number | Average grade in percents |
| start_latlng | LatLng | Start coordinates |
| end_latlng | LatLng | End coordinates |
| elev_difference | number | Elevation difference in meters |
| distance | number | Distance in meters |
| points | string | Polyline of the segment |
| starred | boolean | Whether starred |

## ExplorerResponse

| Field | Type | Description |
|-------|------|-------------|
| segments | array[ExplorerSegment] | The set of segments matching the request |

## SummarySegmentEffort

| Field | Type | Description |
|-------|------|-------------|
| id | integer | The unique identifier |
| activity_id | integer | The related activity's identifier |
| elapsed_time | integer | The effort's elapsed time |
| start_date | string | Start time |
| start_date_local | string | Start time in local timezone |
| distance | number | Distance in meters |
| is_kom | boolean | Whether this is the current best on the leaderboard |

## SummaryPRSegmentEffort

| Field | Type | Description |
|-------|------|-------------|
| pr_activity_id | integer | The activity ID of the PR effort |
| pr_elapsed_time | integer | The elapsed time of the PR effort |
| pr_date | string | The date of the PR effort |
| effort_count | integer | Number of efforts by this athlete on this segment |

## DetailedSegmentEffort

Extends: SummarySegmentEffort

| Field | Type | Description |
|-------|------|-------------|
| name | string | The name of the segment |
| activity | MetaActivity | The related activity |
| athlete | MetaAthlete | The performing athlete |
| moving_time | integer | The effort's moving time |
| start_index | integer | Start index in the activity's stream |
| end_index | integer | End index in the activity's stream |
| average_cadence | number | Average cadence |
| average_watts | number | Average wattage |
| device_watts | boolean | Whether watts are from a power meter |
| average_heartrate | number | Average heart rate |
| max_heartrate | number | Maximum heart rate |
| segment | SummarySegment | The segment |
| kom_rank | integer | Global leaderboard rank (top 10 only) |
| pr_rank | integer | Athlete's leaderboard rank (top 3 only) |
| hidden | boolean | Whether this effort should be hidden |

## Lap

| Field | Type | Description |
|-------|------|-------------|
| id | integer | The unique identifier |
| activity | MetaActivity | The parent activity |
| athlete | MetaAthlete | The performing athlete |
| average_cadence | number | The lap's average cadence |
| average_speed | number | The lap's average speed |
| distance | number | Distance in meters |
| elapsed_time | integer | Elapsed time in seconds |
| start_index | integer | Start index in activity's stream |
| end_index | integer | End index in activity's stream |
| lap_index | integer | Index of this lap in the activity |
| max_speed | number | Maximum speed in meters per second |
| moving_time | integer | Moving time in seconds |
| name | string | The name of the lap |
| pace_zone | integer | The pace zone |
| split | integer | Split number |
| start_date | string | Start time |
| start_date_local | string | Start time in local timezone |
| total_elevation_gain | number | Elevation gain in meters |

## Split

| Field | Type | Description |
|-------|------|-------------|
| average_speed | float | Average speed in meters per second |
| distance | float | Distance in meters |
| elapsed_time | integer | Elapsed time in seconds |
| elevation_difference | float | Elevation difference in meters |
| pace_zone | integer | Pacing zone |
| moving_time | integer | Moving time in seconds |
| split | integer | Split number |

## Upload

| Field | Type | Description |
|-------|------|-------------|
| id | integer | The unique identifier of the upload |
| id_str | string | The unique identifier in string format |
| external_id | string | The external identifier |
| error | string | The error (null on success) |
| status | string | The status of the upload |
| activity_id | integer | The resulting activity ID |

## PolylineMap

| Field | Type | Description |
|-------|------|-------------|
| id | string | The identifier of the map |
| polyline | string | The polyline (detailed representation only) |
| summary_polyline | string | The summary polyline |

## LatLng

A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers.

Type: `array[float]` (minItems: 2, maxItems: 2)

## Waypoint

| Field | Type | Description |
|-------|------|-------------|
| latlng | LatLng | Location along the route closest to the waypoint |
| target_latlng | LatLng | Location off-route (optional) |
| categories | array[string] | Categories the waypoint belongs to |
| title | string | A title for the waypoint |
| description | string | A description (optional) |
| distance_into_route | float | Meters along the route where the waypoint is located |

## PhotosSummary

| Field | Type | Description |
|-------|------|-------------|
| count | integer | The number of photos |
| primary | object | Primary photo with id, source, unique_id, urls |

## ActivityStats

A set of rolled-up statistics and totals for an athlete.

| Field | Type | Description |
|-------|------|-------------|
| biggest_ride_distance | number | The longest distance ridden |
| biggest_climb_elevation_gain | number | The highest climb ridden |
| recent_ride_totals | ActivityTotal | Recent (last 4 weeks) ride stats |
| recent_run_totals | ActivityTotal | Recent (last 4 weeks) run stats |
| recent_swim_totals | ActivityTotal | Recent (last 4 weeks) swim stats |
| ytd_ride_totals | ActivityTotal | Year to date ride stats |
| ytd_run_totals | ActivityTotal | Year to date run stats |
| ytd_swim_totals | ActivityTotal | Year to date swim stats |
| all_ride_totals | ActivityTotal | All time ride stats |
| all_run_totals | ActivityTotal | All time run stats |
| all_swim_totals | ActivityTotal | All time swim stats |

## ActivityTotal

A roll-up of metrics pertaining to a set of activities. Values are in seconds and meters.

| Field | Type | Description |
|-------|------|-------------|
| count | integer | The number of activities |
| distance | float | The total distance covered |
| moving_time | integer | The total moving time |
| elapsed_time | integer | The total elapsed time |
| elevation_gain | float | The total elevation gain |
| achievement_count | integer | The total number of achievements |

## ActivityZone

| Field | Type | Description |
|-------|------|-------------|
| score | integer | Zone score |
| distribution_buckets | TimedZoneDistribution | Time distribution across zones |
| type | string | "heartrate" or "power" |
| sensor_based | boolean | Whether from a sensor |
| points | integer | Zone points |
| custom_zones | boolean | Whether custom zones are used |
| max | integer | Maximum value |

## Zones

| Field | Type | Description |
|-------|------|-------------|
| heart_rate | HeartRateZoneRanges | Heart rate zone ranges |
| power | PowerZoneRanges | Power zone ranges |

## HeartRateZoneRanges

| Field | Type | Description |
|-------|------|-------------|
| custom_zones | boolean | Whether the athlete has custom HR zones |
| zones | ZoneRanges | The zone ranges |

## PowerZoneRanges

| Field | Type | Description |
|-------|------|-------------|
| zones | ZoneRanges | The zone ranges |

## ZoneRange

| Field | Type | Description |
|-------|------|-------------|
| min | integer | The minimum value in the range |
| max | integer | The maximum value in the range |

## ZoneRanges

Type: array of ZoneRange

## TimedZoneDistribution

Stores the exclusive ranges representing zones and the time spent in each.

Type: array of TimedZoneRange

## TimedZoneRange

Extends: ZoneRange

| Field | Type | Description |
|-------|------|-------------|
| time | integer | The number of seconds spent in this zone |

## StreamSet

| Field | Type | Description |
|-------|------|-------------|
| time | TimeStream | Time data |
| distance | DistanceStream | Distance data |
| latlng | LatLngStream | GPS coordinates |
| altitude | AltitudeStream | Elevation data |
| velocity_smooth | SmoothVelocityStream | Smoothed velocity |
| heartrate | HeartrateStream | Heart rate data |
| cadence | CadenceStream | Cadence data |
| watts | PowerStream | Power data |
| temp | TemperatureStream | Temperature data |
| moving | MovingStream | Moving/stopped data |
| grade_smooth | SmoothGradeStream | Smoothed grade data |

## BaseStream

| Field | Type | Description |
|-------|------|-------------|
| original_size | integer | The number of data points in this stream |
| resolution | string | "low", "medium", or "high" |
| series_type | string | "distance" or "time" |

## Stream Types (all extend BaseStream)

| Stream | Data Type | Unit |
|--------|-----------|------|
| TimeStream | array[integer] | seconds |
| DistanceStream | array[number] | meters |
| LatLngStream | array[LatLng] | lat/lng pairs |
| AltitudeStream | array[number] | meters |
| SmoothVelocityStream | array[number] | meters per second |
| HeartrateStream | array[integer] | beats per minute |
| CadenceStream | array[integer] | rotations per minute |
| PowerStream | array[integer] | watts |
| TemperatureStream | array[integer] | celsius degrees |
| MovingStream | array[boolean] | true/false |
| SmoothGradeStream | array[number] | percent grade |

## StreamType (Enum)

An enumeration of the supported types of streams: time, distance, latlng, altitude, velocity_smooth, heartrate, cadence, watts, temp, moving, grade_smooth

## Fault

Encapsulates the errors that may be returned from the API.

| Field | Type | Description |
|-------|------|-------------|
| errors | array[Error] | Specific errors associated with this fault |
| message | string | The message of the fault |

## Error

| Field | Type | Description |
|-------|------|-------------|
| code | string | The code associated with this error |
| field | string | The specific field or aspect of the resource |
| resource | string | The type of resource associated with this error |

---

# 10. Enumerations

## ActivityType (Deprecated — prefer SportType)

An enumeration of the types an activity may have. Note that this enumeration does not include new sport types (e.g. MountainBikeRide, EMountainBikeRide); activities with these sport types will have the corresponding activity type (e.g. Ride for MountainBikeRide, EBikeRide for EMountainBikeRide).

Values:
- AlpineSki
- BackcountrySki
- Canoeing
- Crossfit
- EBikeRide
- Elliptical
- Golf
- Handcycle
- Hike
- IceSkate
- InlineSkate
- Kayaking
- Kitesurf
- NordicSki
- Ride
- RockClimbing
- RollerSki
- Rowing
- Run
- Sail
- Skateboard
- Snowboard
- Snowshoe
- Soccer
- StairStepper
- StandUpPaddling
- Surfing
- Swim
- Velomobile
- VirtualRide
- VirtualRun
- Walk
- WeightTraining
- Wheelchair
- Windsurf
- Workout
- Yoga

## SportType (Preferred)

An enumeration of the sport types an activity may have. Distinct from ActivityType in that it has new types (e.g. MountainBikeRide).

Values:
- AlpineSki
- BackcountrySki
- Badminton
- Canoeing
- Crossfit
- EBikeRide
- Elliptical
- EMountainBikeRide
- Golf
- GravelRide
- Handcycle
- HighIntensityIntervalTraining
- Hike
- IceSkate
- InlineSkate
- Kayaking
- Kitesurf
- MountainBikeRide
- NordicSki
- Pickleball
- Pilates
- Racquetball
- Ride
- RockClimbing
- RollerSki
- Rowing
- Run
- Sail
- Skateboard
- Snowboard
- Snowshoe
- Soccer
- Squash
- StairStepper
- StandUpPaddling
- Surfing
- Swim
- TableTennis
- Tennis
- TrailRun
- Velomobile
- VirtualRide
- VirtualRow
- VirtualRun
- Walk
- WeightTraining
- Wheelchair
- Windsurf
- Workout
- Yoga

## Climb Category

| Value | Description |
|-------|-------------|
| 0 | Uncategorized (NC) |
| 1 | Category 4 |
| 2 | Category 3 |
| 3 | Category 2 |
| 4 | Category 1 |
| 5 | Hors Categorie (HC) |

## Route Type

| Value | Description |
|-------|-------------|
| 1 | Ride |
| 2 | Run |

## Route Sub-Type

| Value | Description |
|-------|-------------|
| 1 | Road |
| 2 | Mountain Bike |
| 3 | Cross |
| 4 | Trail |
| 5 | Mixed |

---

# 11. Brand Guidelines

Source: https://developers.strava.com/guidelines

Last revised: September 29, 2025

## Introduction

Apps attributing Strava usage must avoid implying Strava developed or sponsored the application and must follow brand guidelines. Compliance with the Strava API Agreement and branding guidelines is required.

Contact: developers@strava.com

## Section 1: Use of Logos

### 1.1 Connect with Strava Buttons

Apps using OAuth must link to `https://www.strava.com/oauth/authorize` or the mobile authorize endpoint.

Downloadable button package includes:
- 2 color variants (orange and white)
- EPS, SVG, PNG formats
- Button dimensions: 48px @1x, 96px @2x

### 1.2 Strava API Logos

Apps displaying "Powered by Strava" or "Compatible with Strava" logos must comply. Available downloads include:
- 3 color options (orange, white, black)
- EPS, SVG, PNG formats
- Horizontal and stacked versions

## Section 2: Additional Logo Rules

- No suggestion that Strava developed or sponsored the application
- Logos must be separate from and not more prominent than your application's branding
- Never use logo parts as application icons
- Never modify, alter, or animate logos

## Section 3: Linking to Strava Data

Links to original Strava data must use "View on Strava" text format with specific styling requirements:
- Bold, underline, or orange #FC5200

## Section 4: Use of Strava Name and Trademark

- Truthful references to Strava in descriptions are permitted
- The name cannot appear in application titles
- Cannot suggest official endorsement
- Approved phrases: "Powered by Strava" or "Compatible with Strava"

---

# 12. API Agreement (Legal)

Source: https://www.strava.com/legal/api

Effective: October 9, 2025

## Key Provisions

### Registration & API Tokens
- Developers must maintain confidential API tokens for single applications only
- Unauthorized access must be reported within 24 hours

### Permitted Use Limitations
- May not create applications that compete with Strava
- May not replicate Strava's functionality
- May not use data for AI/machine learning training
- Quote: "You may not use the Strava API Materials...for any model training related to artificial intelligence."

### Data Handling Requirements
- User data displays restricted to that specific user only (except Community Applications under 10,000 users)
- No data sales, aggregation for analytics, or combination with other datasets
- Data deletion must occur within 48 hours of user request
- Cache limits: seven-day maximum retention

### Security & Compliance
- Must implement "commercially reasonable" security measures
- Notify Strava of breaches within 24 hours
- GDPR and UK GDPR compliance required

### Termination Rights
- Strava reserves unilateral right to modify, suspend, or terminate API access without compensation or notice

### Liability Limitations
- Strava disclaims all warranties
- Liability limited to the greater of: fees paid in the last year or $100

### Governing Law
- California law applies (or Irish law for EEA users)
- Exclusive jurisdiction in San Francisco County courts

---

# 13. Swagger Playground

Source: https://developers.strava.com/playground

The Swagger Playground is an interactive API documentation interface built on SwaggerUI.

## Configuration

- Swagger spec URL: `https://developers.strava.com/swagger/swagger.json`
- OAuth2 redirect URL: `https://developers.strava.com/oauth2-redirect/`
- Supports deep linking
- Layout: StandaloneLayout with DownloadUrl plugin

## How to Use

1. Go to https://www.strava.com/settings/api
2. Change "Authorization Callback Domain" to `developers.strava.com`
3. Visit https://developers.strava.com/playground
4. Click the green "Authorize" button
5. Enter your Client ID and Client Secret
6. Select scopes and authorize
7. Test API endpoints interactively

## Limitations

- Only supports Swagger 2.0
- Known issue: can only select one scope at a time

---

# 14. Community & Support

## Developer Community Hub
- URL: https://communityhub.strava.com/developers-api-7
- Discussion forum: https://communityhub.strava.com/t5/developer-discussions/bd-p/developer-discussions

## Documentation Links
- Main docs: https://developers.strava.com/docs
- Authentication: https://developers.strava.com/docs/authentication
- Webhooks: https://developers.strava.com/docs/webhooks
- API Reference: https://developers.strava.com/docs/reference
- Uploads: https://developers.strava.com/docs/uploads
- Rate Limits: https://developers.strava.com/docs/rate-limits
- Getting Started: https://developers.strava.com/docs/getting-started
- Brand Guidelines: https://developers.strava.com/guidelines

## External Resources
- Strava App Directory: https://www.strava.com/apps
- API Agreement: https://www.strava.com/legal/api
- Strava Status Page: https://status.strava.com
- Strava Engineering Blog: https://medium.com/strava-engineering
- Careers: https://boards.greenhouse.io/strava

## App Management
- Create & Manage Your App: https://www.strava.com/settings/api

## Swagger Resources
- Swagger JSON Spec: https://developers.strava.com/swagger/swagger.json
- Swagger Playground: https://developers.strava.com/playground

## Security Notice
Never share access tokens, refresh tokens, authorization codes, or your client secret in a public forum.

---

# Appendix A: Complete Endpoint Quick Reference

| Method | Path | Operation | Tags |
|--------|------|-----------|------|
| POST | /activities | Create an Activity | Activities |
| GET | /activities/{id} | Get Activity | Activities |
| PUT | /activities/{id} | Update Activity | Activities |
| GET | /activities/{id}/comments | List Activity Comments | Activities |
| GET | /activities/{id}/kudos | List Activity Kudoers | Activities |
| GET | /activities/{id}/laps | List Activity Laps | Activities |
| GET | /activities/{id}/streams | Get Activity Streams | Streams |
| GET | /activities/{id}/zones | Get Activity Zones | Activities |
| GET | /athlete | Get Authenticated Athlete | Athletes |
| PUT | /athlete | Update Athlete | Athletes |
| GET | /athlete/activities | List Athlete Activities | Activities |
| GET | /athlete/clubs | List Athlete Clubs | Clubs |
| GET | /athlete/zones | Get Zones | Athletes |
| GET | /athletes/{id}/routes | List Athlete Routes | Routes |
| GET | /athletes/{id}/stats | Get Athlete Stats | Athletes |
| GET | /clubs/{id} | Get Club | Clubs |
| GET | /clubs/{id}/activities | List Club Activities | Clubs |
| GET | /clubs/{id}/admins | List Club Administrators | Clubs |
| GET | /clubs/{id}/members | List Club Members | Clubs |
| GET | /gear/{id} | Get Equipment | Gears |
| GET | /routes/{id} | Get Route | Routes |
| GET | /routes/{id}/export_gpx | Export Route GPX | Routes |
| GET | /routes/{id}/export_tcx | Export Route TCX | Routes |
| GET | /routes/{id}/streams | Get Route Streams | Streams |
| GET | /segment_efforts | List Segment Efforts | SegmentEfforts |
| GET | /segment_efforts/{id} | Get Segment Effort | SegmentEfforts |
| GET | /segment_efforts/{id}/streams | Get Segment Effort Streams | Streams |
| GET | /segments/explore | Explore Segments | Segments |
| GET | /segments/starred | List Starred Segments | Segments |
| GET | /segments/{id} | Get Segment | Segments |
| PUT | /segments/{id}/starred | Star Segment | Segments |
| GET | /segments/{id}/streams | Get Segment Streams | Streams |
| POST | /uploads | Upload Activity | Uploads |
| GET | /uploads/{uploadId} | Get Upload | Uploads |

---

# Appendix B: Scope Quick Reference

| Scope | Access |
|-------|--------|
| read | Public segments, routes, profiles, posts, events, club feeds, leaderboards |
| read_all | Private routes, segments, events |
| profile:read_all | All profile data regardless of visibility |
| profile:write | Update weight/FTP; star/unstar segments |
| activity:read | Visible activities excluding privacy zones |
| activity:read_all | All activities including privacy zones and Only You |
| activity:write | Create/upload/edit activities |

---

# Appendix C: Raw Swagger Specification

The complete OpenAPI/Swagger 2.0 specification is available at:
https://developers.strava.com/swagger/swagger.json

A local copy has been saved to: .firecrawl/swagger.json (102,965 bytes)

Individual schema files are also available:
- https://developers.strava.com/swagger/activity.json
- https://developers.strava.com/swagger/activity_stats.json
- https://developers.strava.com/swagger/activity_total.json
- https://developers.strava.com/swagger/activity_type.json
- https://developers.strava.com/swagger/athlete.json
- https://developers.strava.com/swagger/club.json
- https://developers.strava.com/swagger/comment.json
- https://developers.strava.com/swagger/fault.json
- https://developers.strava.com/swagger/gear.json
- https://developers.strava.com/swagger/lap.json
- https://developers.strava.com/swagger/latlng.json
- https://developers.strava.com/swagger/map.json
- https://developers.strava.com/swagger/photo.json
- https://developers.strava.com/swagger/route.json
- https://developers.strava.com/swagger/segment.json
- https://developers.strava.com/swagger/segment_effort.json
- https://developers.strava.com/swagger/split.json
- https://developers.strava.com/swagger/sport_type.json
- https://developers.strava.com/swagger/stream.json
- https://developers.strava.com/swagger/upload.json
- https://developers.strava.com/swagger/waypoint.json
- https://developers.strava.com/swagger/zones.json
