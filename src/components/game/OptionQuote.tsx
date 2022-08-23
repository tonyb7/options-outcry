import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

interface OptionQuoteProps {
    bidString: string,
    askString: string
}

const OptionQuote = (props: OptionQuoteProps) => {

    return (
        <>
            <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ margin: 'auto' }}
            >
                <Tooltip arrow title="Click to sell option">
                    <Button>{props.bidString}</Button>
                </Tooltip>
                <Tooltip arrow title="Click to buy option">
                    <Button>{props.bidString}</Button>
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