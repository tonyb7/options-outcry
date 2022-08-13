
## Technology Stack
- [Next.js](https://nextjs.org/) using TypeScript
- [firebase](https://firebase.google.com/)
- [Material UI](https://mui.com/)

## Firebase Setup

Create a firebase project and do the following:

1. Go to authentication, and enable the `Anonymous` and `Google` sign-in methods. 
2. Create a `Realtime Database` and set the following security rules:
```
TODO (ask me for them for now)
```
3. Create a `Web App`. Create a file named `.env.local` (template below) in the root of the project and paste in the appropriate values that are given to you.
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```
