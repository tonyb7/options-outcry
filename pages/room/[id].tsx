import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Container } from '@mui/system'
import { Typography } from '@mui/material'
import Navbar from '../../src/Navbar'


const WaitingRoom:NextPage = () => {

    const router = useRouter()
    const { id } = router.query
    // TODO: look up id in database, if not exist, 404 not found

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
