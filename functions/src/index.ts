// import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/* eslint-disable */
export const createGame = functions.https.onCall(async (data: any, context: any) => {
    const gameId = data.gameId;
    console.log("Creating game ", gameId);
    console.log("Ypoooooooo2222")
});
