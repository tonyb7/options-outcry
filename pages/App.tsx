import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Button from '@mui/material/Button';
import handleLogin from '../firebase/auth';

import { useState, useEffect } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

import { generateName } from '../src/utilities'

const App:NextPage = () => {

    // Code mirrored after https://github.com/ekzhang/setwithfriends
    const [authUser, setAuthUser] = useState<firebase.User | null>(null);
    const [user, setUser] = useState(null);

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

        <p className={styles.description}>
            You are logged in as {user ? user['name'] : "..."}
            {/* <Button
            onClick={handleLogin}
            >
            Sign in with Google
            </Button> */}
        </p>

        <div className={styles.grid}>
            <a href="/room" className={styles.card}>
            <h2>Play &rarr;</h2>
            <p>Create an options open outcry game.</p>
            </a>

            <a href="/info" className={styles.card}>
            <h2>Info &rarr;</h2>
            <p>Learn how to play and helpful formulas.</p>
            </a>
        </div>
        </main>

        <footer className={styles.footer}>
        <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
        >
            Powered by{' '}
            <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
        </a>
        </footer>
    </div>
    )
}

export default App 