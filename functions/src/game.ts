var bs = require('black-scholes');

interface InitialState {
    lowestStrike: number,
    strikes: Array<number>,
    stockPrice: number,
    spread: number,
    riskFreeRate: number,
    tteDays: number,
    rc: number,
    atmVol: number,
    skew: string
}

function randNum(min: number, max: number) : number {
    return (Math.random() * (max - min)) + min;
}

export function generateInitialState(): InitialState {

    let lowestStrike = (Math.floor(Math.random() * 15) * 5) + 20; // multiple of 5 in [20, 90]
    let strikes = [lowestStrike, lowestStrike + 5, lowestStrike + 10, lowestStrike + 15, lowestStrike + 20];
    let highestStrike = strikes[strikes.length - 1];
    let stockPrice = randNum(lowestStrike + 0.01, highestStrike);
    stockPrice = Math.round(stockPrice * 100) / 100 // round to 2 decimal places
    let spread = (Math.floor(Math.random() * 25) + 1) / 100; // cent value in [0.01, 0.25]
    let riskFreeRate = (Math.floor(Math.random() * 5) + 1) / 100; // [0.01, 0.05]
    let tteDays = Math.floor(Math.random() * 100) + 50; // [50, 149]
    let rc = stockPrice * Math.pow(Math.E, riskFreeRate * (tteDays / 252)) - stockPrice;
    rc = Math.round(rc * 100) / 100;
    let atmVol = (Math.floor(Math.random() * 36) + 5) / 100; // [0.05, 0.40]
    let skewChoices = ['call', 'put', 'both'];
    let skew = skewChoices[Math.floor(Math.random() * skewChoices.length)];

    let initialState: InitialState = {
        lowestStrike: lowestStrike,
        strikes: strikes,
        stockPrice: stockPrice,
        spread: spread,
        riskFreeRate: riskFreeRate,
        tteDays: tteDays,
        rc: rc,
        atmVol: atmVol,
        skew: skew
    }

    return initialState;
}

interface OptionFairs {
    callBids: Array<number>,
    callAsks: Array<number>,
    putBids: Array<number>,
    putAsks: Array<number>
}

function impliedVolAtK(k: number, s: number, atmVol: number, skew: string): number {
    return atmVol; // TODO
}

export function generateOptionFairs(initialState: InitialState): OptionFairs {

    let callBids: Array<number> = [];
    let callAsks: Array<number> = [];
    let putBids: Array<number> = [];
    let putAsks: Array<number> = [];

    let s_bid = initialState.stockPrice;
    let s_ask = s_bid + initialState.spread;
    let s_mid = (s_bid + s_ask) / 2;
    let t = initialState.tteDays / 252;
    let r = initialState.riskFreeRate;

    // blackScholes(s, k, t, v, r, callPut)
    initialState.strikes.forEach(k => {
        let v = impliedVolAtK(k, s_mid, initialState.atmVol, initialState.skew);
        callBids.push(bs.blackScholes(s_bid, k, t, v, r, "call"));
        callAsks.push(bs.blackScholes(s_ask, k, t, v, r, "call"));
        putBids.push(bs.blackScholes(s_ask, k, t, v, r, "put"));
        putAsks.push(bs.blackScholes(s_bid, k, t, v, r, "put"));
    });

    let optionFairs: OptionFairs = {
        callBids: callBids,
        callAsks: callAsks,
        putBids: putBids,
        putAsks: putAsks
    }
    return optionFairs;
}

interface StructuresState {

}

export function generateStructures(
        initialState: InitialState, 
        optionFairs: OptionFairs
    ): StructuresState {

    let structures: StructuresState = {

    }

    return structures;
}

