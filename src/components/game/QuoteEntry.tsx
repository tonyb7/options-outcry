import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import firebase from "../../firebase";
import { UserContext } from "../../context";
import { UserObject } from "../../interfaces";

import { useState, useContext, useMemo, useEffect } from "react";

// Helpful tutorial on working with realtime database + react: 
//  https://www.youtube.com/watch?v=P-XNZdKQUR0

type FiveNumbers = [number, number, number, number, number];
interface Quote {
    callBids: FiveNumbers,
    callAsks: FiveNumbers,
    callMarketTimes: FiveNumbers,
    putBids: FiveNumbers,
    putAsks: FiveNumbers,
    putMarketTimes: FiveNumbers
}

interface QuoteEntryProps {
    gameId: string, 
    K: number,
    K_idx: number,
    isCall: boolean,
}

const QuoteEntry = (props: QuoteEntryProps) => {

    const user = useContext(UserContext) as any as UserObject;
    let databasePath = `gameData/${props.gameId}/markets/${user?.id}`;

    const [quotes, setQuotes] = useState<Quote | null>(null);

    useEffect(() => {
        const ref = firebase.database().ref(databasePath);
        ref.on("value", (snapshot) => {
            setQuotes(snapshot.val());
        });
        return () => ref.off();
    }, [databasePath]);

    const parseQuote = (quotes: Quote | null, isCall: boolean, K_idx: number) => {
        if (!quotes) {
            return [false, process.env.NO_MARKET, process.env.NO_MARKET] as const;
        }
        let bid: string = process.env.NO_MARKET || "";
        let ask: string = process.env.NO_MARKET || "";
        if (isCall) {
            bid = quotes.callBids[K_idx].toString();
            ask = quotes.callAsks[K_idx].toString();
        } else {
            bid = quotes.putBids[K_idx].toString();
            ask = quotes.putAsks[K_idx].toString();
        }
        let submitted = !(bid === process.env.NO_MARKET || ask === process.env.NO_MARKET);
        return [submitted, bid, ask] as const;
    }

    const [submitted, bid, ask] = parseQuote(quotes, props.isCall, props.K_idx);
    const [bidInput, setBidInput] = useState("");
    const [askInput, setAskInput] = useState("");
    const [warningOpen, setWarningOpen] = useState(false);

    function isNumeric(str: string) {
        return !isNaN(+str);
    }
      
    const handleSubmitQuote = () => {
        console.log("SUBMIT QUOTE CALLED");
        if (bidInput.length === 0 || askInput.length === 0) {
            console.log("SET WARNING OPEN 2");
            setWarningOpen(true);
            return;
        }

        if (!isNumeric(bidInput) || !isNumeric(askInput)) {
            console.log("SET WARNING OPEN 1");
            setWarningOpen(true);
            return;
        }
        
        if (!quotes) {
            return;
        }
        
        let bidFloat = parseFloat(bidInput);
        let askFloat = parseFloat(askInput);
        bidFloat = Math.round(bidFloat * 100) / 100;
        askFloat = Math.round(askFloat * 100) / 100;

        if (props.isCall) {
            quotes.callBids[props.K_idx] = bidFloat;
            quotes.callAsks[props.K_idx] = askFloat;
        } else {
            quotes.putBids[props.K_idx] = bidFloat;
            quotes.putAsks[props.K_idx] = askFloat;
        }
        firebase.database().ref(databasePath).set(quotes)
            .then(() => console.log("Submitted quote successfully"))
            .catch((reason) => {
                console.warn(`Failed to submit market (${reason})`);
            });
    }

    const handleCancelQuote = () => {
        if (!quotes) {
            return;
        }

        if (props.isCall) {
            quotes.callBids[props.K_idx] = parseFloat(process.env.NO_MARKET || "-1");
            quotes.callAsks[props.K_idx] = parseFloat(process.env.NO_MARKET || "-1");
        } else {
            quotes.putBids[props.K_idx] = parseFloat(process.env.NO_MARKET || "-1");
            quotes.putAsks[props.K_idx] = parseFloat(process.env.NO_MARKET || "-1");
        }
        firebase.database().ref(databasePath).set(quotes)
            .then(() => console.log("Canceled quote successfully"))
            .catch((reason) => {
                console.warn(`Failed to cancel market (${reason})`);
            });
    }

    const handleInputEnter = (event: any) => {
        if (event.key === 'Enter') {
            handleSubmitQuote();
        }
    }

    const handleBidChange = (event: any) => {
        setBidInput(event.target.value);
    }

    const handleAskChange = (event: any) => {
        setAskInput(event.target.value);
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
                        <TextField 
                            disabled 
                            size="small" 
                            style={{ padding: 5 }}
                            value={bid}
                        >
                        </TextField>
                    </Tooltip>
                    <Tooltip arrow title="Your offer">
                        <TextField 
                            disabled 
                            size="small" 
                            style={{ padding: 5 }}
                            value={ask}
                        >
                        </TextField>
                    </Tooltip>
                    <Tooltip arrow title="Cancel quote">
                        <CancelIcon onClick={handleCancelQuote}/>
                    </Tooltip>
                    </>
                ) : (
                    <>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        autoHideDuration={2500}
                        open={warningOpen}
                        onClose={()=> setWarningOpen(false)}
                        key={'market-enter-error'}
                    >
                        <Alert severity="warning">
                            Quotes must include both bid and ask! Quotes must be numerical.
                        </Alert>
                    </Snackbar>
                    <PointOfSaleIcon visibility="hidden"/>
                    <Tooltip arrow title="Enter bid">
                        <TextField 
                            size="small" style={{ padding: 5 }}
                            onKeyDown={handleInputEnter}
                            onChange={handleBidChange}
                            value={bidInput}
                        >
                        </TextField>
                    </Tooltip>
                    <Tooltip arrow title="Enter offer">
                        <TextField 
                            size="small" style={{ padding: 5 }}
                            onKeyDown={handleInputEnter}
                            onChange={handleAskChange}
                            value={askInput}
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