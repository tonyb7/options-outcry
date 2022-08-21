import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Container } from '@mui/system'

import Navbar from '../../components/Navbar'
import { Grid, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles';

import { styled } from '@mui/material/styles';

import { GameObject } from '../../interfaces'
import useFirebaseRef from '../../hooks/useFirebaseRef'
import NotFoundPage from '../../components/NotFoundPage'

import StockQuote from '../../components/game/StockQuote'
import StructureQuotes from '../../components/game/StructureQuotes'
import OptionChain from '../../components/game/OptionChain'
import GameLog from '../../components/game/GameLog'

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
            <div style={{ marginTop: 65 }}></div>
            <Paper style={{ padding: 20 }}>
                <Grid container style={{ height: "85vh" }} alignItems="stretch" >
                        <Grid item xs={9}>
                            <Grid container direction="column" spacing={1}>
                                <Grid item container xs={10}>
                                    <Grid item xs={12}>
                                        <StockQuote/>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <OptionChain/>
                                    </Grid>
                                    <Grid item container xs={3} direction="column">
                                        <StructureQuotes/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper className={classes.paper}>
                                <GameLog/>
                            </Paper>
                        </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default GameRoom