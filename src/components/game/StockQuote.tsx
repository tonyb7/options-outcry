import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import useFirebaseRef from "../../hooks/useFirebaseRef";

const StockQuote = (props: any) => {

    const [gameData, _] = useFirebaseRef(`gameData/${props.gameId}`, true);
    const gameDataObj = gameData as any;

    return (
        <>
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
                        {gameDataObj?.initialState.stockPrice.toFixed(2)}
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
                        {(gameDataObj?.initialState.stockPrice + gameDataObj?.initialState.spread).toFixed(2)}
                    </Button>
                </Tooltip>
            </Box>
        </>
    );
}

export default StockQuote;