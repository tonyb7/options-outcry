import type { NextPage } from 'next'

import { Container } from '@mui/system'
import { Typography, Link, Paper } from '@mui/material'
import Navbar from '../src/Navbar'


const WaitingRoom:NextPage = () => {
    return (
        <Container>
            <Navbar/>
            <Typography variant="h4" align="center" style={{ marginTop: 90 }}>
                Waiting Room
            </Typography>

        </Container>
    );
}

export default WaitingRoom
