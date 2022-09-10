import Grid from "@mui/material/Grid";

import OptionQuote from "./OptionQuote";
import QuoteEntry from "./QuoteEntry";
import { Markets } from "./QuoteUtils";
import { GetInsideMarkets, InsideMarkets } from "./QuoteUtils";

interface OptionQuoteRowProps {
    gameId: string,
    K: number,
    K_idx: number,
    market: Markets
}

const OptionQuoteRow = (props: OptionQuoteRowProps) => {

    let insideMarkets: InsideMarkets = GetInsideMarkets(props.market);

    return (
        <>
            <Grid container item xs={5}>
                <OptionQuote 
                    bidString={insideMarkets.callBestBid} 
                    bidUserId={insideMarkets.callBestBidUserId} 
                    askString={insideMarkets.callBestAsk}
                    askUserId={insideMarkets.callBestAskUserId}
                    gameId={props.gameId}
                    K={props.K} 
                    K_idx={props.K_idx}
                    isCall={true} 
            />
                <QuoteEntry 
                    gameId={props.gameId}
                    K={props.K} 
                    K_idx={props.K_idx}
                    isCall={true} 
                />
            </Grid>
            <Grid container item xs={2}>
                <span style={{ margin: 'auto' }}>{props.K}</span>
            </Grid>
            <Grid container item xs={5}>
                <OptionQuote 
                    bidString={insideMarkets.putBestBid}
                    bidUserId={insideMarkets.putBestBidUserId} 
                    askString={insideMarkets.putBestAsk}
                    askUserId={insideMarkets.putBestAskUserId}
                    gameId={props.gameId}
                    K={props.K}
                    K_idx={props.K_idx}
                    isCall={false}
                />
                <QuoteEntry 
                    gameId={props.gameId} 
                    K={props.K} 
                    K_idx={props.K_idx}
                    isCall={false} 
                />
            </Grid>
        </>
    );
}

export default OptionQuoteRow;