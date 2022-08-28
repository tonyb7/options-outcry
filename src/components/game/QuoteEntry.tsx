import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


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
    const [warningOpen, setWarningOpen] = useState(false);

    const handleSubmitQuote = () => {
        console.log("handle submit quote! bid: ", bid, " ask: ", ask);
        if (bid.length === 0 || ask.length === 0) {
            setWarningOpen(true);
            return;
        }

        let bidFloat = parseFloat(bid);
        let askFloat = parseFloat(ask);
        if (bidFloat.toString() != bid || askFloat.toString() != ask) {
            setWarningOpen(true);
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

    const handleBidChange = (event: any) => {
        setBid(event.target.value);
    }

    const handleAskChange = (event: any) => {
        setAsk(event.target.value);
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
                            value={bid}
                        >
                        </TextField>
                    </Tooltip>
                    <Tooltip arrow title="Enter offer">
                        <TextField 
                            size="small" style={{ padding: 5 }}
                            onKeyDown={handleInputEnter}
                            onChange={handleAskChange}
                            value={ask}
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