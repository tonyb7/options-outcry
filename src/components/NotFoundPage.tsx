import type { NextPage } from 'next'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import Navbar from './Navbar';

const NotFoundPage:NextPage = () => {
    return (
        <Container>
            <Navbar/>
            <Container>
                <Typography variant="h4" align="center" style={{ marginTop: 90 }}>
                    Loading...
                </Typography>
                <Typography variant="h6" align="center" style={{ marginTop: 20 }}>
                    If the page does not load for more than 5 seconds, please try refreshing the page. 
                    If the page still does not load, this game does not exist.
                    Visit the{" "}
                    <Link href="/">
                        homepage
                    </Link>
                    {" "}to create a game.
                </Typography>
            </Container>
        </Container>
    )
}

export default NotFoundPage;