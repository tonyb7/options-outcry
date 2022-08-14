import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import GitHubIcon from '@mui/icons-material/GitHub';

import { useState, useContext } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

import AccountOptionsDialog from './AccountOptionsDialog'
import { UserContext } from './context';

import generate from "project-name-generator";
import { useRouter } from 'next/router'
import { createGame } from './firebase';

const App:NextPage = () => {

    const user: any = useContext(UserContext);
    const [showAccountOptions, setShowAccountOptions] = useState(false);
    const [waiting, setWaiting] = useState(false);  
    const router = useRouter()

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

            <p className={styles.description}>
                You are logged in as&nbsp; 
                <span onClick={() => setShowAccountOptions(true)} className={styles.link}>
                    { user ? user.name : "..." }
                </span>
                <AccountOptionsDialog
                    open={showAccountOptions}
                    onClose={() => setShowAccountOptions(false)}
                />
            </p>

            <div className={styles.grid}>
                <span onClick={() => newRoom()} className={styles.card}>
                <h2>Play &rarr;</h2>
                <p>Create an open outcry game.</p>
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
    )
}

export default App 
