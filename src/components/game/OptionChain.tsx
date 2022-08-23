import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import OptionQuoteRow from "./OptionQuoteRow";

import useFirebaseRef from "../../hooks/useFirebaseRef";

const OptionChain = (props: any) => {

    const [gameData, _] = useFirebaseRef(`gameData/${props.gameId}`, true);
    const gameDataObj = gameData as any;

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
                    <OptionQuoteRow K={gameDataObj?.initialState.strikes[0]}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={gameDataObj?.initialState.strikes[1]}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={gameDataObj?.initialState.strikes[2]}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={gameDataObj?.initialState.strikes[3]}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={gameDataObj?.initialState.strikes[4]}/>
                </Grid>
            </Grid>
        </>
    );
}

export default OptionChain;