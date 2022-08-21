import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

const StructureQuotes = () => {

    return (
        <>
            <Typography variant="h6" align="center">
                Structures
            </Typography>
            <Tooltip                             
            arrow
            title="reversal conversion price"
            >
                <Button>r/c = 0.12</Button>
            </Tooltip>
            <Tooltip                             
            arrow
            title="put & stock price"
            >
                <Button>60 P&S = 3.78</Button>
            </Tooltip>
            <Tooltip                             
            arrow
            title="buy/write price"
            >
                <Button>65 B/W = 4.89</Button>
            </Tooltip>
            <Tooltip                             
            arrow
            title="call vertical price"
            >
                <Button>65/70 CV = 1.13</Button>
            </Tooltip>
            <Tooltip                             
            arrow
            title="straddle price"
            >
                <Button>75 Str = 8.64</Button>
            </Tooltip>
            <Tooltip                             
            arrow
            title="put vertical price"
            >
                <Button>75/80 PV = 2.31</Button>
            </Tooltip>
        </>
    );
}

export default StructureQuotes;