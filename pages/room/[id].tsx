import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Container } from '@mui/system'
import { Typography } from '@mui/material'
import Navbar from '../../src/Navbar'

import firebase from '../../src/firebase'
import "firebase/compat/database"

const WaitingRoom:NextPage = () => {

    const router = useRouter()
    const { id } = router.query
    console.log("game id: ", id)
    const gameRef = firebase.database().ref(`games/${id}`).once("value", snapshot => {
        if (snapshot.exists()){
            console.log("exists!");
            console.log(snapshot.val());
        } 
        else {
            console.log("does not exist!");
            console.log(snapshot.val());
        }
    });
    console.log("gameRef: ", gameRef);

    return (
        <Container>
            <Navbar/>
            <Typography variant="h4" align="center" style={{ marginTop: 90 }}>
                Waiting Room
            </Typography>
            <Typography variant="h6" align="center" style={{ marginTop: 90 }}>
                {id}
            </Typography>

        </Container>
    );
}

export default WaitingRoom
