import type { NextPage } from 'next'
import Head from 'next/head'
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
            You are logged in as {user ? user['name'] : "Yoo"}
            <Button
            onClick={handleLogin}
            >
            Sign in with Google
            </Button>
        </p>

        <div className={styles.grid}>
            <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
            </a>

            <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
            </a>

            <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
            >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
            </a>

            <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            >
            <h2>Deploy &rarr;</h2>
            <p>
                Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
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
