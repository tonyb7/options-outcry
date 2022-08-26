import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

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

    return (
        <>
            <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ margin: 'auto' }}
            >
                <Tooltip arrow title={"Best Bid - " + bidId}>
                    <Button>{props.bidString}</Button>
                </Tooltip>
                <Tooltip arrow title={"Best Ask - " + askId}>
                    <Button>{props.askString}</Button>
                </Tooltip>
            </Box>
            <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ margin: 'auto' }}
            >
                <Tooltip arrow title="Submit bid"><CheckIcon/></Tooltip>
                <Tooltip arrow title="Enter bid">
                    <TextField size="small" style={{ padding: 5 }}></TextField>
                </Tooltip>
                <Tooltip arrow title="Enter offer">
                <TextField size="small" style={{ padding: 5 }}></TextField>
                </Tooltip>
                <Tooltip arrow title="Cancel offer"><CancelIcon/></Tooltip>
            </Box>
        </>
    );
}

export default OptionQuote;