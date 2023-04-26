### See it in action

#### Add/Remove Contacts through Firebase Auth
1.  Go to your [Authentication dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/authentication/users) in the Firebase console.

1.  Click **Add User** and add a test user.

1.  Log into your Customer.io account and confirm that a new profile was created in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) and added to the list of [People](https://fly.customer.io/env/last/people) in the workspace.

1. Remove the test user.  

1. Return to your Customer.io account and confirm that the profile was deleted in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) and removed from the list of [People](https://fly.customer.io/env/last/people) in the workspace.

The following data attributes will sync if available:
- id
- email
- phone
- email_verified
- display_name
- photo_url
- disabled
- created_at
- last_sign_in


#### Sync Contacts with Cloud Firestore

1. Go to your [Firestore Database](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore) in the Firebase console.

1. If it doesn't already exist, create a collection called `${param:USERS_COLLECTION}`.

1. Click **Add document** and create a blank document.  

1. Log into your Customer.io account and confirm that a new profile with the `document_id` from the previous step was created in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) and added to the list of [People](https://fly.customer.io/env/last/people) in the workspace.

1. Return to the document and add an `attributes` field.
```
	{
		"attributes":
		{
			"firstName":"First",
			"lastName":"Last",
			"email":"email@domain.com",
			"favoriteFood":"bagels"	
		}
	}
```
1. Return to your Customer.io account and confirm that the profile with the `id` from the previous step was updated with the provided `attributes` in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified).

1. Return to the document and add a field to the `attributes` object and remove.
```
	{
		"attributes":
		{
			"firstName":"First",
			"lastName":"Last",
			"email":"email@domain.com",
			"favoriteColor":"#2f326a"
		}
	}
```

1. Return to your Customer.io account and confirm in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) that the `favoriteColor` attribute was added and `favoriteFood` was removed from the test profile.

1. Now delete the test document in the collection `${param:USERS_COLLECTION}`.

1. Return to your Customer.io account and confirm in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) that the test profile has been removed.


#### Sync Contacts with Cloud Firestore (Custom identifier)
1. Go to your [Firestore Database](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore) in the Firebase console.

1. If it doesn't already exist, create a collection called `${param:USERS_COLLECTION}`.

1. Click **Add document** and add an identifier block and attributes to the document.
```
	{
		"identifiers":{
			"id":"db01"
		},
		"attributes":{
			"firstName":"First",
			"lastName":"Last",
			"email":"email@domain.com",
			"favoriteColor":"#2f326a"
		}
	}
```

1. Log into your Customer.io account and confirm that a new profile with the `id` and `attributes` from the previous step was created in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) and added to the list of [People](https://fly.customer.io/env/last/people) in the workspace.

#### Cloud Firestore Document Format Overview
**name:** `identifiers`
**description:** The person you want to create or update.
**type:** Object
	- must provide one of either id or email
	- you cannot pass multiple identifiers
**notes:** Optional field; document id will be used as the identifier if nothing else is specified.
**name:** `attributes`
**description:** Attributes that you want to add or update for this person.
**type:** Object
**notes:** Optional field
Example document if `identifiers` isn't included.
```json
# /users/db01
{
"attributes": {
	"first_name": "John",
	"last_name": "Doe",
	"email": "john.doe@example.com",
	"plan": "basic"
}
}
```
Example document if 'identifiers' is included.
```json
# /users/db01
{
"identifiers": {
	"email": "john.doe@example.com",
},
"attributes": {
	"first_name": "John",
	"last_name": "Doe",
	"email": "john.doe@example.com",
	"plan": "basic"
}
}
```