import Grid from "@mui/material/Grid";

import OptionQuote from "./OptionQuote";
import { Markets } from "./OptionChain";

interface OptionQuoteRowProps {
    K: number,
    market: Markets
}

// Returns index based on price-time priority, and comp functor. 
// Functors used are just for min and max.
function findByPriceTime(
        prices: Array<number>, 
        times: Array<number>, 
        comp: (a: number, b: number) => boolean
): number {
    let valid: boolean = prices.length > 0 && prices.length === times.length;
    console.assert(valid);
    if (!valid) {
        return -1;
    }

    let bestPriceIdx = 0;
    for (let i = 1; i < prices.length; ++i) {
        if (comp(prices[i], prices[bestPriceIdx])) {
            bestPriceIdx = i;
        } else if (prices[i] === prices[bestPriceIdx]) {
            if (times[i] < times[bestPriceIdx]) {
                bestPriceIdx = i;
            } else if (times[i] === times[bestPriceIdx]) {
                if (Math.floor(Math.random() * 2) === 0) {
                    bestPriceIdx = i;
                }
            }
        }
    }
    return bestPriceIdx;
}

const OptionQuoteRow = (props: OptionQuoteRowProps) => {

    const NO_MARKET = parseInt(process.env.NO_MARKET || '');

    let callBids: Array<number> = [];
    let callAsks: Array<number> = [];
    let callTimes: Array<number> = [];
    let callUsers: Array<string> = [];
    for (let userId in props.market?.userCallMarkets) {
        let market = props.market.userCallMarkets[userId];

         // As of now markets need to be two-sided
        let valid: boolean = market.bid != NO_MARKET && market.ask != NO_MARKET;
        if (valid) {
            callBids.push(market.bid);
            callAsks.push(market.ask);
            callTimes.push(market.time);
            callUsers.push(userId);
        }
    }

    let putBids: Array<number> = [];
    let putAsks: Array<number> = [];
    let putTimes: Array<number> = [];
    let putUsers: Array<string> = [];
    for (let userId in props.market?.userPutMarkets) {
        let market = props.market.userPutMarkets[userId];

         // As of now markets need to be two-sided
        let valid: boolean = market.bid != NO_MARKET && market.ask != NO_MARKET;
        if (valid) {
            putBids.push(market.bid);
            putAsks.push(market.ask);
            putTimes.push(market.time);
            putUsers.push(userId);
        }
    }

    let callBestBid: string;
    let callBestBidUserId = "";
    if (callBids.length === 0) {
        callBestBid = "---";
    } else {
        const callBestBidIdx = findByPriceTime(callBids, callTimes, (a, b) => a < b);
        callBestBid = callBids[callBestBidIdx].toFixed(2);
        callBestBidUserId = callUsers[callBestBidIdx];
    }

    let callBestAsk: string;
    let callBestAskUserId = "";
    if (callAsks.length === 0) {
        callBestAsk = "---";
    } else {
        const callBestAskIdx = findByPriceTime(callAsks, callTimes, (a, b) => a > b);
        callBestAsk = callAsks[callBestAskIdx].toFixed(2);
        callBestAskUserId = callUsers[callBestAskIdx];
    }

    let putBestBid: string;
    let putBestBidUserId = "";
    if (putBids.length === 0) {
        putBestBid = "---";
    } else {
        const putBestBidIdx = findByPriceTime(putBids, putTimes, (a, b) => a < b);
        putBestBid = putBids[putBestBidIdx].toFixed(2);
        putBestBidUserId = putUsers[putBestBidIdx];
    }

    let putBestAsk: string;
    let putBestAskUserId = "";
    if (putAsks.length === 0) {
        putBestAsk = "---";
    } else {
        const putBestAskIdx = findByPriceTime(putAsks, putTimes, (a, b) => a > b);
        putBestAsk = putAsks[putBestAskIdx].toFixed(2);
        putBestAskUserId = putUsers[putBestAskIdx];
    }

    return (
        <>
            <Grid container item xs={5}>
                <OptionQuote 
                    bidString={callBestBid} 
                    bidUserId={callBestBidUserId} 
                    askString={callBestAsk}
                    askUserId={callBestAskUserId}
                />
            </Grid>
            <Grid container item xs={2}>
                <span style={{ margin: 'auto' }}>{props.K}</span>
            </Grid>
            <Grid container item xs={5}>
                <OptionQuote 
                    bidString={putBestBid}
                    bidUserId={putBestBidUserId} 
                    askString={putBestAsk}
                    askUserId={putBestAskUserId}
                />
            </Grid>
        </>
    );
}

export default OptionQuoteRow;