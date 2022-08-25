
## Technology Stack
- [Next.js](https://nextjs.org/) using TypeScript
- [firebase](https://firebase.google.com/)
- [Material UI](https://mui.com/)

## Environment Variable Setup
Hard link `.env` and `functions/.env` since apparently GitHub cannot store hard links:
```
rm functions/.env
ln .env functions/.env
``` 

## Firebase Setup

Create a firebase project and do the following:

1. Go to authentication, and enable the `Anonymous` and `Google` sign-in methods. 
2. Create a `Realtime Database` and paste in the following security rules from [`database.rules.json`](database.rules.json).
3. Create a `Web App`. Create a file named `.env.local` (template below) in the root of the project and paste in the appropriate values that are given to you. The `NEXT_PUBLIC_HOST` variable must end in `/`... it is used in `src/pages/room/[id].tsx` as a scrappy way of getting the page's URL.
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

## Firebase Functions Emulator
Setting up an local emulator for local testing.

1. After changes are made in cloud functions (e.g., `functions/src/index.ts`):
```bash
cd functions
npm run build
```
This step is required or else the changes don't get reflected in the emulator. Seems like a bug in the firebase emulator.

2. Start the emulator with `firebase emulators:start --only functions`

3. In development, the emulator should be picked up by firebase, see `src/firebase.ts`

