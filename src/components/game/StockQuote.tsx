import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const StockQuote = () => {
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
                        62.31
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
                        62.36
                    </Button>
                </Tooltip>
            </Box>
        </>
    );
}

export default StockQuote;