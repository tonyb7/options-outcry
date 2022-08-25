import Grid from "@mui/material/Grid";

import OptionQuote from "./OptionQuote";
import { Markets } from "./OptionChain";

interface OptionQuoteRowProps {
    K: number,
    market: Markets
}

const OptionQuoteRow = (props: OptionQuoteRowProps) => {

    const NO_MARKET = parseInt(process.env.NO_MARKET || '');

    let callBids: Array<number> = [];
    let callAsks: Array<number> = [];
    for (let userId in props.market?.userCallMarkets) {
        let bid = props.market.userCallMarkets[userId].bid;
        let ask = props.market.userCallMarkets[userId].ask;
        if (bid != NO_MARKET) {
            callBids.push(bid);
        }
        if (ask != NO_MARKET) {
            callAsks.push(ask);
        }
    }

    let putBids: Array<number> = [];
    let putAsks: Array<number> = [];
    for (let userId in props.market?.userPutMarkets) {
        let bid = props.market.userPutMarkets[userId].bid;
        let ask = props.market.userPutMarkets[userId].ask;
        if (bid != NO_MARKET) {
            putBids.push(bid);
        }
        if (ask != NO_MARKET) {
            putAsks.push(ask);
        }
    }

    let callBestBid: string;
    if (callBids.length === 0) {
        callBestBid = "---";
    } else {
        callBestBid = Math.max(...callBids).toFixed(2);
    }

    let callBestAsk: string;
    if (callAsks.length === 0) {
        callBestAsk = "---";
    } else {
        callBestAsk = Math.min(...callAsks).toFixed(2);
    }

    let putBestBid: string;
    if (putBids.length === 0) {
        putBestBid = "---";
    } else {
        putBestBid = Math.max(...putBids).toFixed(2);
    }

    let putBestAsk: string;
    if (putAsks.length === 0) {
        putBestAsk = "---";
    } else {
        putBestAsk = Math.min(...putAsks).toFixed(2);
    }

    return (
        <>
            <Grid container item xs={5}>
                <OptionQuote bidString={callBestBid} askString={callBestAsk}/>
            </Grid>
            <Grid container item xs={2}>
                <span style={{ margin: 'auto' }}>{props.K}</span>
            </Grid>
            <Grid container item xs={5}>
                <OptionQuote bidString={putBestBid} askString={putBestAsk}/>
            </Grid>
        </>
    );
}

export default OptionQuoteRow;