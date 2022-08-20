import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Box, Container } from '@mui/system'

import Navbar from '../../components/Navbar'
import { Grid, Paper, Typography, Link, Button, Tooltip, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

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
                                        <Typography variant="h5" align="center">
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
                                    <Grid item xs={9}>
                                        <Typography variant="h6" align="center">
                                            Option Chain
                                        </Typography>
                                        <Grid container paddingTop={2} paddingLeft={12} paddingRight={12}>
                                            <Grid container style={{ borderBottom: 'solid' }}>
                                                <Grid container xs={5}>
                                                    <Typography align="center" style={{ margin: 'auto' }}>
                                                        Calls
                                                    </Typography>
                                                </Grid>
                                                <Grid container xs={2}>
                                                    <Typography align="center" style={{ margin: 'auto' }}>
                                                        K
                                                    </Typography>
                                                </Grid>
                                                <Grid container xs={5}>
                                                    <Typography align="center" style={{ margin: 'auto' }}>
                                                        Puts
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                                                <Grid container xs={5}>
                                                    <Box 
                                                    display="flex"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    style={{ margin: 'auto' }}
                                                    >
                                                        <Tooltip arrow title="Click to sell option">
                                                            <Button>3.89</Button>
                                                        </Tooltip>
                                                        <Tooltip arrow title="Click to buy option">
                                                            <Button>3.90</Button>
                                                        </Tooltip>
                                                    </Box>
                                                    <Box 
                                                    display="flex"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    style={{ margin: 'auto' }}
                                                    >
                                                        <Tooltip arrow title="Submit bid"><CheckIcon/></Tooltip>
                                                        <Tooltip arrow title="Enter bid">
                                                            <TextField size="small" style={{ padding: 5 }}></TextField>
                                                        </Tooltip>
                                                        <Tooltip arrow title="Enter offer">
                                                        <TextField size="small" style={{ padding: 5 }}></TextField>
                                                        </Tooltip>
                                                        <Tooltip arrow title="Cancel offer"><CancelIcon/></Tooltip>
                                                    </Box>
                                                </Grid>
                                                <Grid container xs={2}>
                                                    <span style={{ margin: 'auto' }}>60</span>
                                                </Grid>
                                                <Grid container xs={5}>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={3} direction="column">
                                        <Typography variant="h6" align="center">
                                            Structures
                                        </Typography>
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
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper className={classes.paper}>
                                <Typography variant="h5" align="center">
                                    Log
                                </Typography>
                                <Typography align="center">
                                    Time Left: 5:00
                                </Typography>
                            </Paper>
                        </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default GameRoom