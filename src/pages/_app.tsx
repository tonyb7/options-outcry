import '../styles/globals.css'
import type { AppProps } from 'next/app'

import '../firebase' // initialize firebase

import { useState, useEffect } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { UserContext } from '../context';
import { generateName } from '../utilities'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

function MyApp({ Component, pageProps }: AppProps) {

    // Light or dark theme
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const lightTheme = createTheme({
        palette: {
            mode: 'light',
        },
    });
    const darkTheme = createTheme({
        palette: {
            mode: 'light',
            // mode: 'dark', // I don't like the dark theme 
            // TODO: Can make it a user-adjustable option
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

    // User authentication
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
        <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
            <CssBaseline/>
            <UserContext.Provider value={user}>
                <Component {...pageProps} />
            </UserContext.Provider>
        </ThemeProvider>
    );
}

export default MyApp
