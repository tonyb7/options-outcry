import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import OptionQuoteRow from "./OptionQuoteRow";

import useFirebaseRef from "../../hooks/useFirebaseRef";

interface UserMarkets { 
    [userId: string]: { bid: number, ask: number } 
}
export interface Markets {
    strike: number,
    userCallMarkets: UserMarkets,
    userPutMarkets: UserMarkets
}

const OptionChain = (props: any) => {

    const [gameData, _] = useFirebaseRef(`gameData/${props.gameId}`, true);
    const gameDataObj = gameData as any;

    let marketsObj = gameDataObj?.markets;
    let markets: Array<Markets> = [];
    gameDataObj?.initialState.strikes.forEach((strike: number, i: number) => {
        let userCallMarkets : UserMarkets = {};
        let userPutMarkets : UserMarkets = {};

        for (let userId in marketsObj) {
            let userMarkets = marketsObj[userId];
            userCallMarkets[userId] = { bid: userMarkets.callBids[i], ask: userMarkets.callAsks[i] };
            userPutMarkets[userId] = { bid: userMarkets.putBids[i], ask: userMarkets.putAsks[i] };
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
                    <OptionQuoteRow K={gameDataObj?.initialState.strikes[0]} market={markets[0]}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={gameDataObj?.initialState.strikes[1]} market={markets[1]}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={gameDataObj?.initialState.strikes[2]} market={markets[2]}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={gameDataObj?.initialState.strikes[3]} market={markets[3]}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={gameDataObj?.initialState.strikes[4]} market={markets[4]}/>
                </Grid>
            </Grid>
        </>
    );
}

export default OptionChain;