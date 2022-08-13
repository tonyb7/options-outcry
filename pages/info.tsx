import type { NextPage } from 'next'

import { Container } from '@mui/system'
import { Typography, Link, Paper } from '@mui/material'
import { AppBar, Toolbar } from '@mui/material'

const Info:NextPage = () => {
    return (
        <Container>
            <AppBar elevation={0}>
                <Toolbar variant="dense">
                    <Typography variant="h6" style={{ flexGrow: 1, whiteSpace: "nowrap" }}>
                        <Link href="/" underline="none" color="inherit">
                            Options Open Outcry
                        </Link>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Typography variant="h4" align="center" style={{ marginTop: 90 }}>
                Info
            </Typography>
            <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
                <Typography variant="body1" gutterBottom>
                    Options Open Outcry is a mock options trading game. The code for this application 
                    is made open source on Github at{" "}  
                    <Link href="https://github.com/tonyb7/options-outcry">tonyb7/options-outcry</Link>.
                </Typography>
            </Paper>
            <Paper style={{ padding: "1rem", maxWidth: 720, margin: "12px auto" }}>
                <Typography variant="body1" gutterBottom>
                    For success in this game, you need to learn the options parity formulas. You can find some of those formulas{" "}
                    <Link href="https://github.com/tonyb7/options-lib/blob/master/parity/README.md">here</Link>.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    For mental math practice, a good tool is{" "}
                    <Link href="https://arithmetic.zetamac.com/">Zetamac</Link>.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    For practice with options parity formulas, a good tool is{" "}
                    <Link href="https://parity-zetamac.herokuapp.com/">Parity Zetamac</Link>.
                </Typography>
            </Paper>
            <Typography
                variant="body1"
                align="center"
                style={{ marginTop: 12, paddingBottom: 12 }}
            >
                <Link href="/">Return to home</Link>
            </Typography>
        </Container>
    )
}

export default Info 
