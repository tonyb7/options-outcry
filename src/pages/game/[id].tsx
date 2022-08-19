import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Box, Container } from '@mui/system'

import Navbar from '../../components/Navbar'
import { Grid, Paper, Typography, Link, Button, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles';

import { styled } from '@mui/material/styles';

import { GameObject } from '../../interfaces'
import useFirebaseRef from '../../hooks/useFirebaseRef'
import NotFoundPage from '../../components/NotFoundPage'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const useStyles = makeStyles({
    paper: {
      width: "100%",
      height: "100%"
    }
});  


const GameRoom:NextPage = () => {

    const classes = useStyles();
    const router = useRouter();
    const { id } = router.query;
    const [game, _] = useFirebaseRef(`games/${id}`, true);
    const gameObj = game as unknown as GameObject;
    console.log("Gameobj:", gameObj);

    if (gameObj && gameObj.status === "waiting") {
        router.push(`/room/${id}`);
    }

    if (!gameObj) {
        return <NotFoundPage/>;
    }

    return (
        <Container>
            <Navbar/>
            <div style={{ marginTop: 75 }}></div>
            <Paper>
                <Grid container style={{ height: "85vh" }} alignItems="stretch" >
                        <Grid item xs={9}>
                            <Grid container direction="column" spacing={1}>
                                <Grid item container xs={10}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" align="center">
                                            Stock
                                        </Typography>
                                        <Box 
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        >
                                            <Tooltip                             
                                            arrow
                                            title="Click to sell"
                                            >
                                                <Button
                                                    size="medium"
                                                    disabled={false}
                                                    onClick={() => {}}
                                                    style={{ color: "#f2687f" }}
                                                >
                                                    62.31
                                                </Button>
                                            </Tooltip>
                                            <Tooltip                             
                                            arrow
                                            title="Click to buy"
                                            >
                                                <Button
                                                    size="medium"
                                                    disabled={false}
                                                    onClick={() => {}}
                                                    style={{ color: "#17bd5f" }}
                                                >
                                                    62.36
                                                </Button>
                                            </Tooltip>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Tooltip                             
                                        arrow
                                        title="reversal conversion price"
                                        >
                                            <Button>r/c = 0.12</Button>
                                        </Tooltip>
                                        <Tooltip                             
                                        arrow
                                        title="put & stock price"
                                        >
                                            <Button>60 P&S = 3.78</Button>
                                        </Tooltip>
                                        <Tooltip                             
                                        arrow
                                        title="buy/write price"
                                        >
                                            <Button>65 B/W = 4.89</Button>
                                        </Tooltip>
                                        <Tooltip                             
                                        arrow
                                        title="call vertical price"
                                        >
                                            <Button>65/70 CV = 1.13</Button>
                                        </Tooltip>
                                        <Tooltip                             
                                        arrow
                                        title="straddle price"
                                        >
                                            <Button>75 Str = 8.64</Button>
                                        </Tooltip>
                                        <Tooltip                             
                                        arrow
                                        title="put vertical price"
                                        >
                                            <Button>75/80 PV = 2.31</Button>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                                <Grid item xs={2}>
                                    
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper className={classes.paper}>
                                
                            </Paper>
                        </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default GameRoom