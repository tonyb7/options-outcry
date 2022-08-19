import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Container } from '@mui/system'

import Navbar from '../../components/Navbar'
import { Grid, Paper, Typography, Link } from '@mui/material'
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
                                <Grid item xs={10}>
                                    {/* <Paper className={classes.paper}>
                                        <Item>Hello</Item>
                                    </Paper> */}
                                    <Item>
                                        Stock: 69.05 @ 69.25
                                    </Item>
                                </Grid>
                                <Grid item xs={2}>
                                Stock: 69.05 @ 69.25
                                    {/* <Paper>
                                        Yo
                                    </Paper> */}
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