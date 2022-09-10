import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { GetUserNameFromId } from '../User';

interface OptionQuoteProps {
    bidString: string,
    bidUserId: string,
    askString: string,
    askUserId: string
}

const OptionQuote = (props: OptionQuoteProps) => {

    let bidId = "None";
    if (props.bidUserId.length > 0) {
        bidId = GetUserNameFromId(props.bidUserId);
    }

    let askId = "None";
    if (props.askUserId.length > 0) {
        askId = GetUserNameFromId(props.askUserId);
    }

    const handleSell = () => {
        console.log("SOLD!");
    }

    const handleBuy = () => {
        console.log("TAKE 'EM");
    }

    return (
        <>
            <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ margin: 'auto' }}
            >
                <Tooltip 
                    arrow 
                    title={
                        <div style={{ textAlign: "center" }}>
                            {"Best Bid - " + bidId}
                            <br/>
                            {"(Click to Sell)"}
                        </div>
                    }
                >
                    <Button
                        onClick={handleSell}
                    >
                        {props.bidString}
                    </Button>
                </Tooltip>
                <Tooltip 
                    arrow 
                    title={
                        <div style={{ textAlign: "center" }}>
                            {"Best Ask - " + askId}
                            <br/>
                            {"(Click to Buy)"}
                        </div>
                    }
                >
                    <Button
                        onClick={handleBuy}
                    >
                        {props.askString}
                    </Button>
                </Tooltip>
            </Box>
        </>
    );
}

export default OptionQuote;