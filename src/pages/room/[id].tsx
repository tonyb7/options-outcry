import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Container } from '@mui/system'
import { Typography, Link } from '@mui/material'

import Navbar from '../../components/Navbar'

import firebase from '../../firebase'
import "firebase/compat/database"

import { useState } from 'react'

import useFirebaseRef from '../../hooks/useFirebaseRef'

const WaitingRoom:NextPage = () => {

    const router = useRouter()
    const { id } = router.query
    const [game, gameLoading] = useFirebaseRef(`games/${id}`, true);

    return (
        <Container>
            <Navbar/>
            {game ? (
                <Container>
                    <Typography variant="h4" align="center" style={{ marginTop: 90 }}>
                        Waiting Room
                    </Typography>
                    <Typography variant="h6" align="center" style={{ marginTop: 0 }}>
                        {id}
                    </Typography>
                </Container>
            ) : (
                <Container>
                    <Typography variant="h4" align="center" style={{ marginTop: 90 }}>
                        Loading...
                    </Typography>
                    <Typography variant="h6" align="center" style={{ marginTop: 20 }}>
                        If the page does not load for more than 5 seconds, this game does not exist.
                        Visit the{" "}
                        <Link href="/">
                            homepage
                        </Link>
                        {" "}to create a game.
                    </Typography>
                </Container>
            )}
        </Container>
    );
}

export default WaitingRoom
