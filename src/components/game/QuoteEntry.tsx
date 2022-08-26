import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

interface QuoteEntryProps {
    gameId: string, 
    K: number,
    isCall: boolean,
}

const QuoteEntry = (props: QuoteEntryProps) => {

    const handleSubmitQuote = () => {

    }

    return (
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
    );
}

export default QuoteEntry;