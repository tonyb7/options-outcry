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

import { generateInitialState, generateInitialStateOptionFairs, 
    generateStructures, generateOptionFairs } from './game';

const MAX_GAME_ID_LENGTH = 64;
// const MAX_UNFINISHED_GAMES_PER_HOUR = 4;

/* eslint-disable */
export const createGame = functions.https.onCall(async (data: any, context: any) => {
    const gameId = data.gameId;
    console.log("Creating game ", gameId);

    if (
        !(typeof gameId === "string") ||
        gameId.length === 0 ||
        gameId.length > MAX_GAME_ID_LENGTH
    ) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The function must be called with " +
                "argument `gameId` to be created at `/games/:gameId`."
        );
    }
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called while authenticated."
        );
    }
    
    const userId = context.auth.uid;
    const gameRef = admin.database().ref(`games/${gameId}`);

    // Create the game in the database
    const { committed, snapshot } = await gameRef.transaction((currentData) => {
        if (currentData === null) {
            return {
                host: userId,
                createdAt: admin.database.ServerValue.TIMESTAMP,
                status: "waiting",
            };
        } 
        else {
            return;
        }
    });
    if (!committed) {
        throw new functions.https.HttpsError(
            "already-exists",
            "The requested `gameId` already exists."
        );
    }

    let initialState = generateInitialState();
    let initialStateOptionFairs = generateInitialStateOptionFairs(initialState);
    let structures = generateStructures(initialState, initialStateOptionFairs);
    let optionFairs = generateOptionFairs(initialState, structures);

    // After this point, the game has successfully been created.
    // We update the database asynchronously in:
    //   1. /gameData/:gameId
    const updates: Array<Promise<any>> = [];
    updates.push(
        admin.database().ref(`gameData/${gameId}`).set({
            initialState: initialState,
            initialStateOptionFairs: initialStateOptionFairs,
            structures: structures,
            optionFairs: optionFairs,
            markets: {"hello": "asdf"},
        })
    );

    await Promise.all(updates);

    AddServerMessage(gameId, "Welcome to Options Open Outcry!");
    AddServerMessage(gameId, "Make markets and have the host click \"Calculate PnL\" when you are ready!");

    return snapshot.val();
});

export function AddServerMessage(gameId: string, message: string): void {
    const databasePath = `chats/${gameId}`;
    admin.database().ref(databasePath).push({
        user: process.env.SERVER_USER_ID,
        message: message,
        time: admin.database.ServerValue.TIMESTAMP,
    });
}
