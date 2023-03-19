# auth-customerio

Authenticates and syncs your users between Firebase Authentication and Customer.io

## Local development
https://firebase.google.com/docs/extensions/alpha/test#emulator

From an empty folder on your machine:

- `firebase init customerio-firebase-extensions`. Start the Authentication, Functions, and Extensions emulators.
- `firebase ext:install /path/to/this/auth-customerio/folder`. Configure against a prod workspace.
- `firebase emulators:start`. Go to the Authentication UI in the emulator and make users. You should see them appear in your CIO workspace.