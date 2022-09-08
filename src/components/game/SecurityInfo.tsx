import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import useFirebaseRef from "../../hooks/useFirebaseRef";

interface SecurityInfoProps {
    gameId: string
}

const SecurityInfo = (props: SecurityInfoProps) => {

    const [gameData, _] = useFirebaseRef(`gameData/${props.gameId}`, true);
    const gameDataObj = gameData as any;

    let atmVol = gameDataObj?.initialState.atmVol;
    let dte = gameDataObj?.initialState.tteDays;

    return (
        <>
            <Typography variant="h6" align="center" style={{ marginTop: 15 }}>
                Security Info
            </Typography>
            <Tooltip                             
            arrow
            title="ATM Implied Volatility"
            >
                <Button>{"ATM Vol: " + Math.round(atmVol * 100) + "%"}</Button>
            </Tooltip>
            <Tooltip                             
            arrow
            title="Days to Expiration"
            >
                <Button>{"TTE: " + dte + " days"}</Button>
            </Tooltip>
        </>
    );
}

export default SecurityInfo;