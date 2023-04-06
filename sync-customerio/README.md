# Sync contacts with Customer.io

**Author**: Customer.io (**[https://customer.io](https://customer.io)**)

**Description**: Sync customer data from Firebase Authentication and Firestore collections to Customer.io and send transactional and marketing emails, push notifications, SMS and more.



**Details**: Customer.io allows you to utilize the data about your users to send personalized messages to them over different channels.

This extension allows you to sync your users to your Customer.io account.
Users can be managed by Firebase Authentication and any time users are creted or deleted those changes will be synced with your Customer.io.
Alternatively you can specify a Firestore collection to monitor where user records are stored and those changes can also be synced.

For user profiles created from Firebase Authentication the extension will sync the following data if available:
- id
- email
- phone
- email_verified
- display_name
- photo_url
- disabled
- created_at
- last_sign_in

With using a Firestore collection you have more control on how profiles are identified and the data to be synced.
Example user document
```json
{
	"identifiers": {
		"id": "db01",
	},
	"attributes": {
		"first_name": "John",
		"last_name": "Doe",
		"email": "john.doe@example.com",
		"plan": "basic"
	}
}
```
Alternatively we also support email as an identifier
```json
{
	"identifiers": {
		"email": "jane.doe@example.com",
	},
	"attributes": {
		"first_name": "Jane",
		"last_name": "Doe",
		"plan": "premiun",
		"created_at": 1361205308
	}
}
```

For more info visit docs ?????

**Additional Setup**

This extension also requires you to have a [Customer.io](https://customer.io) account.
The API credentials will be needed during install step for the extension.

**Billing**

Along with charges for your Customer.io account this extension uses other Firebase or Google Cloud services which may have associated charges:

* Cloud Secret Manager
* Cloud Functions
* Cloud Firestore
* Firebase Authentication

### 🧩 Install this extension

**Console**

[![Install this extension in your Firebase project](https://www.gstatic.com/mobilesdk/210513_mobilesdk/install-extension.png "Install this extension in your Firebase project")][install-link]

[install-link]: https://console.firebase.google.com/project/_/extensions/install?ref=customerio/sync-customerio

**Firebase CLI**

```bash
firebase ext:install customerio/sync-customerio --project=[your-project-id]
```

> Learn more about installing extensions in the Firebase Extensions documentation:
> [console](https://firebase.google.com/docs/extensions/install-extensions?platform=console),
> [CLI](https://firebase.google.com/docs/extensions/install-extensions?platform=cli)





**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Customer.io Site ID: This can be found on your [API Credentials page](https://fly.customer.io/settings/api_credentials).

* Customer.io API Key: This can be found on your [API Credentials page](https://fly.customer.io/settings/api_credentials).

* Customer.io Datacenter Region: This can be found on your [account's privacy page](https://fly.customer.io/settings/privacy).

* Firestore collection of user records to sync: test



**Cloud Functions:**

* **createAuthProfile:** Adds profiles to your Customer.io account when they are created using Firebase Authentication. Syncs the following data if available:
  - id
  - email
  - phone
  - email_verified
  - display_name
  - photo_url
  - disabled
  - created_at
  - last_sign_in


* **deleteAuthProfile:** Removes profiles from your Customer.io account when they are deleted using Firebase Authentication.

* **syncFirestoreProfile:** Monitors specified Firestore collection and syncs changes with your Customer.io account.
All changes (create, delete & update) to the records in the collection will sync the data accordingly.
Using collection you have more control on what profile data is synced.
The extension looks for two fields in document structure:

    **name:** `identifiers`
    **description:** The person you want to perform an action on.
    **type:** Object
        - must provide one of either id or email
        - you cannot pass multiple identifiers
    **notes:** Optional field however highly recomended to include otherwise the document id will be used as the identifier.

    **name:** `attributes`
    **description:** Attributes that you want to add or update for this person.
    **type:** Object
    **notes:** Optional field however if missing only the data that would be synced in the document id as the identifier.

    Example document since `identifiers` is missing the document id will implictly used
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

    Example document that overrides the identifier

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

