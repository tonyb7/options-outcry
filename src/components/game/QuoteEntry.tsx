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

import { useState, useContext, useEffect } from "react";

// Helpful tutorial on working with realtime database + react: 
//  https://www.youtube.com/watch?v=P-XNZdKQUR0

type FiveNumbers = [number, number, number, number, number];
interface Quote {
    callBids: FiveNumbers,
    callAsks: FiveNumbers,
    callBidTimes: FiveNumbers,
    callAskTimes: FiveNumbers,
    putBids: FiveNumbers,
    putAsks: FiveNumbers,
    putBidTimes: FiveNumbers,
    putAskTimes: FiveNumbers
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
            return [false, false, process.env.NO_MARKET, process.env.NO_MARKET] as const;
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
        let bidSubmitted = (bid !== process.env.NO_MARKET);
        let askSubmitted = (ask !== process.env.NO_MARKET);
        return [bidSubmitted, askSubmitted, bid, ask] as const;
    }

    const [bidSubmitted, askSubmitted, bid, ask] = parseQuote(quotes, props.isCall, props.K_idx);
    const [bidInput, setBidInput] = useState("");
    const [askInput, setAskInput] = useState("");
    const [warningOpen, setWarningOpen] = useState(false);

    function isNumeric(str: string) {
        return !isNaN(+str);
    }

    const handleSubmitQuote = (quoteInput: string, isBid: boolean) => {
        if (quoteInput.length == 0 || !isNumeric(quoteInput)) {
            setWarningOpen(true);
            return;
        }

        if (!quotes) {
            return;
        }

        let quoteFloat = parseFloat(quoteInput);
        quoteFloat = Math.round(quoteFloat * 100) / 100;

        if (props.isCall) {
            if (isBid) {
                quotes.callBids[props.K_idx] = quoteFloat;
                quotes.callBidTimes[props.K_idx] = Date.now();
            } else {
                quotes.callAsks[props.K_idx] = quoteFloat;
                quotes.callAskTimes[props.K_idx] = Date.now();
            }
        } else {
            if (isBid) {
                quotes.putBids[props.K_idx] = quoteFloat;
                quotes.putBidTimes[props.K_idx] = Date.now();
            } else {
                quotes.putAsks[props.K_idx] = quoteFloat;
                quotes.putAskTimes[props.K_idx] = Date.now();
            }
        }
        firebase.database().ref(databasePath).set(quotes)
            .then(() => console.log("Submitted quote successfully"))
            .catch((reason) => {
                console.warn(`Failed to submit quote (${reason})`);
            });
    }

    const handleCancelQuote = (isBid: boolean) => {
        if (!quotes) {
            return;
        }

        if (props.isCall) {
            if (isBid) {
                quotes.callBids[props.K_idx] = parseFloat(process.env.NO_MARKET || "-1");
                quotes.callBidTimes[props.K_idx] = Date.now();
            } else {
                quotes.callAsks[props.K_idx] = parseFloat(process.env.NO_MARKET || "-1");
                quotes.callAskTimes[props.K_idx] = Date.now();
            }
        } else {
            if (isBid) {
                quotes.putBids[props.K_idx] = parseFloat(process.env.NO_MARKET || "-1");
                quotes.putBidTimes[props.K_idx] = Date.now();
            } else {
                quotes.putAsks[props.K_idx] = parseFloat(process.env.NO_MARKET || "-1");
                quotes.putAskTimes[props.K_idx] = Date.now();
            }
        }

        firebase.database().ref(databasePath).set(quotes)
            .then(() => console.log("Canceled quote successfully"))
            .catch((reason) => {
                console.warn(`Failed to cancel quote (${reason})`);
            });
    }

    const handleInputEnter = (event: any, isBid: boolean) => {
        if (event.key === 'Enter') {
            if (isBid) {
                handleSubmitQuote(bidInput, true);
            }
            else {
                handleSubmitQuote(askInput, false);
            }
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
            {bidSubmitted ? (
                <>
                    <Tooltip arrow title="Cancel bid">
                        <CancelIcon onClick={() => handleCancelQuote(true)}/>
                    </Tooltip>
                    <Tooltip arrow title="Your bid">
                        <TextField 
                            disabled 
                            size="small" 
                            style={{ padding: 5 }}
                            value={bid}
                        >
                        </TextField>
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
                            Invalid quote! Quote must be numerical.
                        </Alert>
                    </Snackbar>
                    <Tooltip arrow title="Submit bid">
                        <CheckCircleIcon onClick={() => handleSubmitQuote(bidInput, true)}/>
                    </Tooltip>
                    <Tooltip arrow title="Enter bid">
                        <TextField 
                            size="small" style={{ padding: 5 }}
                            onKeyDown={e => handleInputEnter(e, true)}
                            onChange={handleBidChange}
                            value={bidInput}
                        >
                        </TextField>
                    </Tooltip>
                </>
            )}
            {askSubmitted ? (
                <>
                    <Tooltip arrow title="Your offer">
                        <TextField 
                            disabled 
                            size="small" 
                            style={{ padding: 5 }}
                            value={ask}
                        >
                        </TextField>
                    </Tooltip>
                    <Tooltip arrow title="Cancel offer">
                        <CancelIcon onClick={() => handleCancelQuote(false)}/>
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
                            Invalid quote! Quote must be numerical.
                        </Alert>
                    </Snackbar>
                    <Tooltip arrow title="Enter offer">
                        <TextField 
                            size="small" style={{ padding: 5 }}
                            onKeyDown={e => handleInputEnter(e, false)}
                            onChange={handleAskChange}
                            value={askInput}
                        >
                        </TextField>
                    </Tooltip>
                    <Tooltip arrow title="Submit offer">
                        <CheckCircleIcon onClick={() => handleSubmitQuote(askInput, false)}/>
                    </Tooltip>
                </>
            )}
        </Box>
    );
}

export default QuoteEntry;