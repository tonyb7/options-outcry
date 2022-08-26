import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import useFirebaseRef from "../../hooks/useFirebaseRef";

interface StockQuoteProps {
    gameId: string
}

const StockQuote = (props: StockQuoteProps) => {

    const [gameData, _] = useFirebaseRef(`gameData/${props.gameId}`, true);
    const gameDataObj = gameData as any;

    let bid = gameDataObj?.initialState.stockPrice - (gameDataObj?.initialState.spread / 2);
    let ask = gameDataObj?.initialState.stockPrice + (gameDataObj?.initialState.spread / 2);

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
                // title="Click to sell"
                title="Best Bid"
                >
                    <Button
                        size="medium"
                        disabled={false}
                        onClick={() => {}}
                        style={{ color: "#f2687f" }}
                    >
                        {bid.toFixed(2)}
                    </Button>
                </Tooltip>
                <Tooltip                             
                arrow
                // title="Click to buy"
                title="Best Offer"
                >
                    <Button
                        size="medium"
                        disabled={false}
                        onClick={() => {}}
                        style={{ color: "#17bd5f" }}
                    >
                        {ask.toFixed(2)}
                    </Button>
                </Tooltip>
            </Box>
        </>
    );
}

export default StockQuote;