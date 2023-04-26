### See it in action

#### Add/Remove Contacts through Firebase Auth
1.  Go to your [Authentication dashboard](https://console.firebase.google.com/project/${param:PROJECT_ID}/authentication/users) in the Firebase console.

2.  Click **Add User** and add a test user.

3.  Log into your Customer.io account and confirm that a new profile was created in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) and added to the list of [People](https://fly.customer.io/env/last/people) in the workspace.

4. Remove the test user.  

5. Return to your Customer.io account and confirm that the profile was deleted in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) and removed from the list of [People](https://fly.customer.io/env/last/people) in the workspace. 

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

2. If it doesn't already exist, create a collection called `${param:USERS_COLLECTION}`.

3. Click **Add document** and create a blank document.  

4. Log into your Customer.io account and confirm that a new profile with the `document_id` from the previous step was created in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) and added to the list of [People](https://fly.customer.io/env/last/people) in the workspace.

5. Return to the document and add an `attributes` field.
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
6. Return to your Customer.io account and confirm that the profile with the `id` from the previous step was updated with the provided `attributes` in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified).

7. Return to the document and add a field to the `attributes` object and remove.
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

8. Return to your Customer.io account and confirm in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) that the `favoriteColor` attribute was added and `favoriteFood` was removed from the test profile.

9. Now delete the test document in the collection `${param:USERS_COLLECTION}`.

10. Return to your Customer.io account and confirm in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) that the test profile has been removed.


#### Sync Contacts with Cloud Firestore (Custom identifier)
1. Go to your [Firestore Database](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore) in the Firebase console.

2. If it doesn't already exist, create a collection called `${param:USERS_COLLECTION}`.

3. Click **Add document** and add an identifier block and attributes to the document.
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

4. Log into your Customer.io account and confirm that a new profile with the `id` and `attributes` from the previous step was created in the [Activity Logs](https://fly.customer.io/env/last/activity_logs/identified) and added to the list of [People](https://fly.customer.io/env/last/people) in the workspace.

#### Cloud Firestore Document Format Overview
The extension looks for two fields in the document structure:

| name | description | type | notes |
|---|----|----|----|
| `identifiers` | The person you want to create or update. | Object, one of either `id` or `email` | Optional field; document id will be used as the identifier if nothing else is specified. |
| `attributes` | Attributes that you want to add or update for this person. | Object | Optional field |


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
