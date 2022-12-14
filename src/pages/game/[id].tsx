import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Container } from '@mui/system'

import Navbar from '../../components/Navbar'
import { Grid, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles';

import { GameObject } from '../../interfaces'
import useFirebaseRef from '../../hooks/useFirebaseRef'
import NotFoundPage from '../../components/NotFoundPage'

import StockQuote from '../../components/game/StockQuote'
import StructureQuotes from '../../components/game/StructureQuotes'
import SecurityInfo from '../../components/game/SecurityInfo'
import OptionChain from '../../components/game/OptionChain'
import GameLog from '../../components/game/GameLog'
import CalculatePnl from '../../components/game/CalculatePnl'

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
    const gameId: string = id as string;

    const [game, gameLoading] = useFirebaseRef(`games/${id}`, true);
    const gameObj = game as unknown as GameObject;

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
                                        <StockQuote gameId={gameId}/>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <OptionChain gameId={gameId}/>
                                    </Grid>
                                    <Grid item container xs={4} direction="column">
                                        <StructureQuotes gameId={gameId}/>
                                        <SecurityInfo gameId={gameId}/>
                                        <CalculatePnl gameId={gameId}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper className={classes.paper}>
                                <GameLog gameId={id}/>
                            </Paper>
                        </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default GameRoom