import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import GitHubIcon from '@mui/icons-material/GitHub';

import { useState, useEffect } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

import { generateName } from '../src/utilities'
import AccountOptionsDialog from './AccountOptionsDialog'
import { UserContext } from './context';

const App:NextPage = () => {

    // Code mirrored after https://github.com/ekzhang/setwithfriends
    const [authUser, setAuthUser] = useState<firebase.User | null>(null);
    const [user, setUser] = useState(null);
    const [showAccountOptions, setShowAccountOptions] = useState(false);

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
            <a href="/room" className={styles.card}>
            <h2>Play &rarr;</h2>
            <p>Create or join an open outcry game.</p>
            </a>

            <a href="/info" className={styles.card}>
            <h2>Info &rarr;</h2>
            <p>Rules, helpful formulas, and other information.</p>
            </a>
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
