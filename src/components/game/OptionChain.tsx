import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import OptionQuoteRow from "./OptionQuoteRow";

const OptionChain = () => {
    return (
        <>
            <Typography variant="h6" align="center">
                Option Chain
            </Typography>
            <Grid container paddingTop={2} paddingLeft={12} paddingRight={12}>
                <Grid container style={{ borderBottom: 'solid' }}>
                    <Grid container xs={5}>
                        <Typography align="center" style={{ margin: 'auto' }}>
                            Calls
                        </Typography>
                    </Grid>
                    <Grid container xs={2}>
                        <Typography align="center" style={{ margin: 'auto' }}>
                            K
                        </Typography>
                    </Grid>
                    <Grid container xs={5}>
                        <Typography align="center" style={{ margin: 'auto' }}>
                            Puts
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={60}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={65}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={70}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={75}/>
                </Grid>
                <Grid container style={{ borderBottom: 'solid', padding: 10 }}>
                    <OptionQuoteRow K={80}/>
                </Grid>
            </Grid>
        </>
    );
}

export default OptionChain;