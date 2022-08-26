import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

import { useState } from "react";

interface QuoteEntryProps {
    gameId: string, 
    K: number,
    isCall: boolean,
}

const QuoteEntry = (props: QuoteEntryProps) => {

    const [submitted, setSubmitted] = useState(false);
    const [bid, setBid] = useState("");
    const [ask, setAsk] = useState("");

    const handleSubmitQuote = () => {
        console.log("handle submit quote!");
        if (bid.length === 0 || ask.length === 0) {
            // TODO: notif why quote not submitted
            return;
        }
        setSubmitted(true);

    }

    const handleCancelQuote = () => {
        setSubmitted(false);
    }

    const handleInputEnter = (event: any) => {
        if (event.key === 'Enter') {
            handleSubmitQuote();
        }
    }

    return (
        <Box 
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ margin: 'auto' }}
        >
            {submitted ? (
                    <>
                    <PointOfSaleIcon visibility="hidden"/>
                    <Tooltip arrow title="Your bid">
                        <TextField size="small" style={{ padding: 5 }}></TextField>
                    </Tooltip>
                    <Tooltip arrow title="Your offer">
                        <TextField size="small" style={{ padding: 5 }}></TextField>
                    </Tooltip>
                    <Tooltip arrow title="Cancel quote">
                        <CancelIcon onClick={handleCancelQuote}/>
                    </Tooltip>
                    </>
                ) : (
                    <>
                    <PointOfSaleIcon visibility="hidden"/>
                    <Tooltip arrow title="Enter bid">
                        <TextField 
                            size="small" style={{ padding: 5 }}
                            onKeyDown={handleInputEnter}
                            onChange={(e) => setBid(e.target.value)}
                        >
                        </TextField>
                    </Tooltip>
                    <Tooltip arrow title="Enter offer">
                        <TextField 
                            size="small" style={{ padding: 5 }}
                            onKeyDown={handleInputEnter}
                            onChange={(e) => setAsk(e.target.value)}
                        >
                        </TextField>
                    </Tooltip>
                    <Tooltip arrow title="Submit quote">
                        <CheckCircleIcon onClick={handleSubmitQuote}/>
                    </Tooltip>
                    </>
                )}
        </Box>
    );
}

export default QuoteEntry;