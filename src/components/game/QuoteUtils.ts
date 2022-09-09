
interface UserMarkets { 
    [userId: string]: { bid: number, ask: number, bidTime: number, askTime: number } 
}
export interface Markets {
    strike: number,
    userCallMarkets: UserMarkets,
    userPutMarkets: UserMarkets
}

export function GetFormattedMarkets(gameDataMarkets: any, strikes: Array<number>): Array<Markets> {

    let markets: Array<Markets> = [];

    strikes.forEach((strike: number, i: number) => {
        let userCallMarkets : UserMarkets = {};
        let userPutMarkets : UserMarkets = {};

        for (let userId in gameDataMarkets) {
            let userMarkets = gameDataMarkets[userId];
            userCallMarkets[userId] = { 
                bid: userMarkets.callBids[i], 
                ask: userMarkets.callAsks[i], 
                bidTime: userMarkets.callBidTimes[i],
                askTime: userMarkets.callAskTimes[i]
            };
            userPutMarkets[userId] = { 
                bid: userMarkets.putBids[i], 
                ask: userMarkets.putAsks[i], 
                bidTime: userMarkets.callBidTimes[i],
                askTime: userMarkets.callAskTimes[i]
            };
        }
    
        markets.push({
            strike: strike,
            userCallMarkets: userCallMarkets,
            userPutMarkets: userPutMarkets
        });
    });
    
    return markets;
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

export interface InsideMarkets {
    callBestBid: string,
    callBestAsk: string,
    putBestBid: string,
    putBestAsk: string,
    callBestBidUserId: string,
    callBestAskUserId: string,
    putBestBidUserId: string,
    putBestAskUserId: string,
}

export function GetInsideMarkets(market: Markets) : InsideMarkets
{
    const NO_MARKET = parseInt(process.env.NO_MARKET || '');

    let callBids: Array<number> = [];
    let callAsks: Array<number> = [];
    let callBidTimes: Array<number> = [];
    let callAskTimes: Array<number> = [];
    let callUsers: Array<string> = [];

    for (let userId in market.userCallMarkets) {
        let thisMarket = market.userCallMarkets[userId];

         // As of now markets need to be two-sided
        let valid: boolean = thisMarket.bid != NO_MARKET && thisMarket.ask != NO_MARKET;
        if (valid) {
            callBids.push(thisMarket.bid);
            callAsks.push(thisMarket.ask);
            callBidTimes.push(thisMarket.bidTime);
            callAskTimes.push(thisMarket.askTime);
            callUsers.push(userId);
        }
    }

    let putBids: Array<number> = [];
    let putAsks: Array<number> = [];
    let putBidTimes: Array<number> = [];
    let putAskTimes: Array<number> = [];
    let putUsers: Array<string> = [];
    for (let userId in market.userPutMarkets) {
        let thisMarket = market.userPutMarkets[userId];

         // As of now markets need to be two-sided
        let valid: boolean = thisMarket.bid != NO_MARKET && thisMarket.ask != NO_MARKET;
        if (valid) {
            putBids.push(thisMarket.bid);
            putAsks.push(thisMarket.ask);
            putBidTimes.push(thisMarket.bidTime);
            putAskTimes.push(thisMarket.askTime);
            putUsers.push(userId);
        }
    }

    let callBestBid: string;
    let callBestBidUserId = "";
    if (callBids.length === 0) {
        callBestBid = "---";
    } else {
        const callBestBidIdx = findByPriceTime(callBids, callBidTimes, (a, b) => a < b);
        callBestBid = callBids[callBestBidIdx].toFixed(2);
        callBestBidUserId = callUsers[callBestBidIdx];
    }

    let callBestAsk: string;
    let callBestAskUserId = "";
    if (callAsks.length === 0) {
        callBestAsk = "---";
    } else {
        const callBestAskIdx = findByPriceTime(callAsks, callAskTimes, (a, b) => a > b);
        callBestAsk = callAsks[callBestAskIdx].toFixed(2);
        callBestAskUserId = callUsers[callBestAskIdx];
    }

    let putBestBid: string;
    let putBestBidUserId = "";
    if (putBids.length === 0) {
        putBestBid = "---";
    } else {
        const putBestBidIdx = findByPriceTime(putBids, putBidTimes, (a, b) => a < b);
        putBestBid = putBids[putBestBidIdx].toFixed(2);
        putBestBidUserId = putUsers[putBestBidIdx];
    }

    let putBestAsk: string;
    let putBestAskUserId = "";
    if (putAsks.length === 0) {
        putBestAsk = "---";
    } else {
        const putBestAskIdx = findByPriceTime(putAsks, putAskTimes, (a, b) => a > b);
        putBestAsk = putAsks[putBestAskIdx].toFixed(2);
        putBestAskUserId = putUsers[putBestAskIdx];
    }

    let insideMarkets: InsideMarkets = {
        callBestBid: callBestBid,
        callBestAsk: callBestAsk,
        putBestBid: putBestBid,
        putBestAsk: putBestAsk,
        callBestBidUserId: callBestBidUserId,
        callBestAskUserId: callBestAskUserId,
        putBestBidUserId: putBestBidUserId,
        putBestAskUserId: putBestAskUserId,
    }

    return insideMarkets;
}
