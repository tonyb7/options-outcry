import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

import GitHubIcon from '@mui/icons-material/GitHub';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useState, useEffect } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

import { generateName } from '../src/utilities'
import AccountOptionsDialog from './AccountOptionsDialog'
import { UserContext } from './context';

import generate from "project-name-generator";
import { useRouter } from 'next/router'
import { createGame } from './firebase';

const App:NextPage = () => {

    // Code mirrored after https://github.com/ekzhang/setwithfriends
    const [authUser, setAuthUser] = useState<firebase.User | null>(null);
    const [user, setUser] = useState(null);
    const [showAccountOptions, setShowAccountOptions] = useState(false);

    const [waiting, setWaiting] = useState(false);  
    const router = useRouter()

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const lightTheme = createTheme({
        palette: {
          mode: 'light',
        },
    });
    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
    });
    useEffect(() => {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        if (darkThemeMq.matches) {
            console.log("Setting theme to dark");
            setIsDarkTheme(true);
          } else {
            console.log("Setting theme to light");
            setIsDarkTheme(false);
          }
          
    }, []);

    useEffect(() => {
        return firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                console.log("User is signed in");
                setAuthUser(user);
            } 
            else {
                // User is signed out
                console.log("User is signed out");
                setAuthUser(null);
                firebase
                    .auth()
                    .signInAnonymously()
                    .catch((error) => {
                        alert("Unable to connect to the server. Please try again later.");
                    });
            }
        });
    }, []);

    useEffect(() => {
        if (!authUser) {
            setUser(null);
            return;
        }
        const userRef = firebase.database().ref(`/users/${authUser.uid}`);
        function update(snapshot: firebase.database.DataSnapshot) {
            if (snapshot.child("name").exists()) {
                setUser({
                    ...snapshot.val(),
                    id: authUser?.uid,
                    authUser,
                    setAuthUser,
                });
            }
            else {
                userRef.update({
                    name: generateName(),
                });
                // After this, `update` should be called again and
                // the if branch above will be taken
            }
        }
        userRef.on("value", update);
        return () => {
            userRef.off("value", update);
        }
    }, [authUser]);

    async function newRoom(): Promise<void> {
        if (waiting) { // prevent user from mass-creating games
            return;
        }
        setWaiting(true);
        let attempts = 0;
        while (attempts < 5) {
            attempts++;
            const gameId = generate({ words: 3 }).dashed;
            try {
                await createGame({ gameId });
            } catch (error: any) {
                if (error.code === "functions/already-exists") {
                    // We generated an already-used game ID
                    continue;
                } else {
                    // Unspecified error occurred
                    setWaiting(false);
                    alert(error.toString());
                    return;
                }
            }
            // Successful game creation
            firebase.analytics().logEvent("create_game", { gameId });
            router.push(`/room/${gameId}`)
            return;
        }
        // Unsuccessful game creation
        setWaiting(false);
        alert("Error: Could not find an available game ID.");
    }

    return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <CssBaseline/>
        <div className={styles.container}>
            <Head>
            <title>Options Outcry</title>
            <meta name="description" content="Options Open Outcry Simulator" />
            <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
            <h1 className={styles.title}>
                Options Open Outcry
            </h1>

            <UserContext.Provider value={user}>
                <p className={styles.description}>
                    You are logged in as&nbsp; 
                    <span onClick={() => setShowAccountOptions(true)} className={styles.link}>
                        { user ? user['name'] : "..." }
                    </span>
                    <AccountOptionsDialog
                        open={showAccountOptions}
                        onClose={() => setShowAccountOptions(false)}
                    />
                </p>
            </UserContext.Provider>

            <div className={styles.grid}>
                <span onClick={() => newRoom()} className={styles.card}>
                <h2>Play &rarr;</h2>
                <p>Create or join an open outcry game.</p>
                </span>

                <span onClick={() => router.push(`/info`)} className={styles.card}>
                    <h2>Info &rarr;</h2>
                    <p>Rules, helpful formulas, and other information.</p>
                </span>
            </div>
            </main>

            <footer className={styles.footer}>
            <a
                href="https://github.com/tonyb7/options-outcry"
                target="_blank"
                rel="noopener noreferrer"
            >
                <span className={styles.logo}>
                    <GitHubIcon/>
                </span>
            </a>
            </footer>
        </div>
    </ThemeProvider>
    )
}

export default App 
