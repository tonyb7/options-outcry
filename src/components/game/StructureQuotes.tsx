import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import useFirebaseRef from "../../hooks/useFirebaseRef";

const StructureQuotes = (props: any) => {

    const [gameData, _] = useFirebaseRef(`gameData/${props.gameId}`, true);
    const gameDataObj = gameData as any;

    let structureList = [
        {   
            strike: gameDataObj?.structures.putAndStock.strike, 
            label: gameDataObj?.structures.putAndStock.strike + " P&S = " + gameDataObj?.structures.putAndStock.price.toFixed(2),
            tooltip: "put & stock price"
        },
        {   
            strike: gameDataObj?.structures.buyWrite.strike, 
            label: gameDataObj?.structures.buyWrite.strike + " B/W = " + gameDataObj?.structures.buyWrite.price.toFixed(2),
            tooltip: "buy/write price"
        },
        {   
            strike: gameDataObj?.structures.straddle.strike, 
            label: gameDataObj?.structures.straddle.strike + " STR = " + gameDataObj?.structures.straddle.price.toFixed(2),
            tooltip: "straddle price"
        },
        {   
            strike: gameDataObj?.structures.callVertical.lowerStrike, 
            label:  gameDataObj?.structures.callVertical.lowerStrike + "/" + 
                    (gameDataObj?.structures.callVertical.lowerStrike + gameDataObj?.structures.callVertical.verticalWidth) + 
                    " CV = " + gameDataObj?.structures.callVertical.price.toFixed(2),
            tooltip: "call vertical price"
        },
        {   
            strike: gameDataObj?.structures.putVertical.lowerStrike, 
            label:  gameDataObj?.structures.putVertical.lowerStrike + "/" + 
                    (gameDataObj?.structures.putVertical.lowerStrike + gameDataObj?.structures.putVertical.verticalWidth) + 
                    " PV = " + gameDataObj?.structures.putVertical.price.toFixed(2),
            tooltip: "put vertical price"
        },
    ];

    structureList.sort((a, b) => (a.strike > b.strike) ? 1 : -1);

    return (
        <>
            <Typography variant="h6" align="center">
                Structures
            </Typography>
            <Tooltip                             
            arrow
            title="reversal conversion price"
            >
                <Button>r/c = {gameDataObj?.initialState.rc}</Button>
            </Tooltip>
            {structureList.map(structure => (
                 <Tooltip                             
                 arrow
                 title={structure.tooltip}
                 key={structure.tooltip}
                 >
                     <Button>{structure.label}</Button>
                 </Tooltip>
            ))}
        </>
    );
}

export default StructureQuotes;