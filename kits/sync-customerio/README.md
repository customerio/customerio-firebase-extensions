# Sync contacts with Customer.io (function kit)

A [Firebase function kit](https://firebase.google.com/docs/extensions/users/migrate) that syncs people to [Customer.io](https://customer.io). It replaces the [sync-customerio Firebase Extension](https://extensions.dev/extensions/customerio/sync-customerio), which stops receiving updates when Firebase Extensions shuts down on March 31, 2027.

The kit deploys three 2nd gen Cloud Functions into your own Firebase project:

| Function | Trigger | What it does |
|---|---|---|
| `createAuthProfile` | Firebase Authentication user created | Creates a profile in Customer.io with the user's auth attributes |
| `deleteAuthProfile` | Firebase Authentication user deleted | Deletes the profile from Customer.io |
| `syncFirestoreProfile` | Document written in `USERS_COLLECTION` | Creates, updates or deletes the profile to match the document |

## Requirements

- Firebase CLI `15.32.0` or later
- Blaze (pay as you go) plan
- A Customer.io workspace and its Track API credentials

## Install

```bash
firebase functions:kits:install --package @customerio/firebase-sync-customerio@latest
firebase deploy --only functions
```

The CLI prompts for any parameter it can't find in the kit instance's `.env` file.

## Parameters

| Name | Type | Description |
|---|---|---|
| `LOCATION` | string | Cloud Functions region. Defaults to `us-central1`. |
| `SITE_ID` | string | Customer.io Site ID, from your [API Credentials page](https://fly.customer.io/settings/api_credentials). |
| `API_KEY` | secret | Customer.io Track API key, stored in Cloud Secret Manager. |
| `REGION` | `us` or `eu` | Customer.io datacenter region, shown on your account's [privacy page](https://fly.customer.io/settings/privacy). It must match your account. |
| `USERS_COLLECTION` | string | Firestore collection to sync. Defaults to `_unconfigured_`, which leaves Firestore sync off. |

## Firestore document format

| Field | Type | Notes |
|---|---|---|
| `identifiers` | Object with one of `id` or `email` | Optional. The document ID is used when it's missing. |
| `attributes` | Object | Optional. Attributes removed from the document are cleared in Customer.io. |

```json
{
  "identifiers": { "email": "john.doe@example.com" },
  "attributes": { "first_name": "John", "plan": "basic" }
}
```

## Things to know

- The Authentication triggers use `onUserCreated` and `onUserDeleted` from `firebase-functions/v2/identity`, which Firebase marks as Preview.
- Firebase doesn't fire `onUserDeleted` for batch deletes made with the Admin SDK's `deleteUsers()`. Delete users one at a time to remove them from Customer.io.
- Firebase delivers events at least once. A repeated event sends the same identify or delete to Customer.io again, which leaves the profile in the same state.
- Each function logs `initialized context` with the Customer.io region on cold start. If syncs fail with authorization errors, check that `REGION` matches your account.
