import Grid from "@mui/material/Grid";

import OptionQuote from "./OptionQuote";

interface OptionQuoteRowProps {
    K: number
}

const OptionQuoteRow = (props: OptionQuoteRowProps) => {

    return (
        <>
            <Grid container xs={5}>
                <OptionQuote bidString="---" askString="---"/>
            </Grid>
            <Grid container xs={2}>
                <span style={{ margin: 'auto' }}>{props.K}</span>
            </Grid>
            <Grid container xs={5}>
                <OptionQuote bidString="---" askString="---"/>
            </Grid>
        </>
    );
}

export default OptionQuoteRow;