# Sync contacts with Customer.io

**Author**: Customer.io (**[https://customer.io](https://customer.io)**)

**Description**: Sync customers to Customer.io for sending transactional and marketing emails, push, and in-app messages.



**Details**: Install this extension to sync customers to Customer.io. This extension:

- Adds new customers when they sign up through Firebase Authentication.
- Listens to a specified Cloud Firestore collection for updates to customer attributes.

The synced data can then be used to trigger transactional messages and automated marketing campaigns in Customer.io.

**Additional Setup**

Before installing this extension, set up Firebase Authentication to manage your users.  Optionally, set up a Cloud Firestore database to store additional customer data.  

You’ll need a Customer.io account set up before installing this extension.  [Get started for free](https://customer.io) on the Customer.io website.

Install the Customer.io iOS, Android, React Native, Expo, or Flutter [SDKs](https://customer.io/docs/sdk/) to send rich push notifications and in-app messages to customers in your mobile app.

**Billing**

This extension uses the following Firebase services which may have associated charges:

- Cloud Firestore
- Cloud Functions
- Firebase Authentication

This extension also uses the following third-party services:

- [Customer.io](http://Customer.io/pricing) (pricing information)

You are responsible for any costs associated with your use of these services.




**Configuration Parameters:**

* Cloud Functions location: Where do you want to deploy the functions created for this extension? For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Customer.io Site ID: This can be found on your [API Credentials page](https://fly.customer.io/settings/api_credentials).

* Customer.io API Key: This can be found on your [API Credentials page](https://fly.customer.io/settings/api_credentials).

* Customer.io Datacenter Region: This can be found on your [account's privacy page](https://fly.customer.io/settings/privacy).

* Firestore collection of user records to sync: A collection path to monitor for changes



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
The extension looks for two fields in the document structure:

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

