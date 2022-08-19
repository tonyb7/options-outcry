import type { NextPage } from 'next'

import { Container } from '@mui/system'

import Navbar from '../../components/Navbar'
import { Grid } from '@mui/material'

const GameRoom:NextPage = () => {

    return (
        <Container>
            <Navbar/>
            <Grid></Grid>
        </Container>
    )
}

export default GameRoom