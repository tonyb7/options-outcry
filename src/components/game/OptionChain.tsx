import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import OptionQuoteRow from "./OptionQuoteRow";

import { useEffect, useState } from "react";
import firebase from "../../firebase";
import NotFoundPage from "../NotFoundPage";

interface UserMarkets { 
    [userId: string]: { bid: number, ask: number, time: number } 
}
export interface Markets {
    strike: number,
    userCallMarkets: UserMarkets,
    userPutMarkets: UserMarkets
}

interface OptionChainProps {
    gameId: string
}

const OptionChain = (props: OptionChainProps) => {

    const [gameData, setGameData] = useState<any>(null);

    let databasePath = `gameData/${props.gameId}`;
    useEffect(() => {
        const ref = firebase.database().ref(databasePath);
        ref.on("value", (snapshot) => {
            setGameData(snapshot.val());
        });
        return () => ref.off();
    }, [databasePath]);

    if (!gameData) {
        return <NotFoundPage/>;
    }

    let marketsObj = gameData.markets;
    let markets: Array<Markets> = [];
    gameData.initialState.strikes.forEach((strike: number, i: number) => {
        let userCallMarkets : UserMarkets = {};
        let userPutMarkets : UserMarkets = {};

        for (let userId in marketsObj) {
            let userMarkets = marketsObj[userId];
            userCallMarkets[userId] = { 
                bid: userMarkets.callBids[i], 
                ask: userMarkets.callAsks[i], 
                time: userMarkets.callMarketTimes[i] 
            };
            userPutMarkets[userId] = { 
                bid: userMarkets.putBids[i], 
                ask: userMarkets.putAsks[i], 
                time: userMarkets.callMarketTimes[i] 
            };
        }
    
        markets.push({
            strike: strike,
            userCallMarkets: userCallMarkets,
            userPutMarkets: userPutMarkets
        });
    });

    return (
        <>
            <Typography variant="h6" align="center">
                Option Chain
            </Typography>
            <Grid container paddingTop={2} paddingLeft={2} paddingRight={2}>
                <Grid container style={{ borderBottom: 'solid' }}>
                    <Grid container item xs={5}>
                        <Typography align="center" style={{ margin: 'auto' }}>
                            Calls
                        </Typography>
                    </Grid>
                    <Grid container item xs={2}>
                        <Typography align="center" style={{ margin: 'auto' }}>
                            K
                        </Typography>
                    </Grid>
                    <Grid container item xs={5}>
                        <Typography align="center" style={{ margin: 'auto' }}>
                            Puts
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow 
                        gameId={props.gameId} 
                        K={gameData.initialState.strikes[0]} 
                        K_idx={0}
                        market={markets[0]}
                    />
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow 
                        gameId={props.gameId} 
                        K={gameData.initialState.strikes[1]} 
                        K_idx={1}
                        market={markets[1]}
                    />
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow 
                        gameId={props.gameId} 
                        K={gameData.initialState.strikes[2]} 
                        K_idx={2}
                        market={markets[2]}
                    />
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow 
                        gameId={props.gameId} 
                        K={gameData.initialState.strikes[3]} 
                        K_idx={3}
                        market={markets[3]}
                    />
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow 
                        gameId={props.gameId} 
                        K={gameData.initialState.strikes[4]} 
                        K_idx={4}
                        market={markets[4]}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default OptionChain;