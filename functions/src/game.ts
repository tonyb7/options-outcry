import {assert} from "console";

const bs = require("black-scholes");

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
    stockPrice += 0.005 // stockPrice is price at middle of spread
    let spread = ((Math.floor(Math.random() * 5) * 5) + 5) / 100; // multiple of 0.05 in [0.05, 0.25]
    let riskFreeRate = (Math.floor(Math.random() * 3) + 1) / 100; // [0.01, 0.03]
    let tteDays = Math.floor(Math.random() * 100) + 200; // [200, 299]
    let rc = stockPrice * Math.pow(Math.E, riskFreeRate * (tteDays / 252)) - stockPrice;
    rc = Math.round(rc * 100) / 100;
    let atmVol = (Math.floor(Math.random() * 50) + 40) / 100; // [0.40, 0.89]
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
    calls: Array<number>,
    puts: Array<number>,
}

function impliedVolAtK(k: number, s: number, atmVol: number, skew: string): number {
    return atmVol; // TODO
}

export function generateInitialStateOptionFairs(initialState: InitialState): OptionFairs {

    let calls: Array<number> = [];
    let puts: Array<number> = [];

    let s_mid = initialState.stockPrice;
    let t = initialState.tteDays / 252;
    let r = initialState.riskFreeRate;

    // blackScholes(s, k, t, v, r, callPut)
    initialState.strikes.forEach(k => {
        let v = impliedVolAtK(k, s_mid, initialState.atmVol, initialState.skew);
        calls.push(bs.blackScholes(s_mid, k, t, v, r, "call"));
        puts.push(bs.blackScholes(s_mid, k, t, v, r, "put"));
    });

    let optionFairs: OptionFairs = {
        calls: calls,
        puts: puts
    }
    return optionFairs;
}

interface StructuresState {
    putAndStock: {
        strike: number,
        price: number,
        price_alt: number,
    },
    buyWrite: {
        strike: number,
        price: number,
        price_alt: number,
    },
    straddle: {
        strike: number,
        price: number,
        price_alt: number,
    },
    callVertical: {
        lowerStrike: number,
        verticalWidth: number,
        price: number,
        price_alt: number,
    },
    putVertical: {
        lowerStrike: number,
        verticalWidth: number,
        price: number,
        price_alt: number,
    }
}

function shuffleArray(array: Array<number>) : Array<number> {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export function generateStructures(
        initialState: InitialState, 
        optionFairs: OptionFairs
    ): StructuresState {

    assert(initialState.strikes.length >= 5);
    let highestStrike = initialState.strikes[initialState.strikes.length - 1];
    let strikeOrder = shuffleArray(initialState.strikes.slice(0));

    let structures: StructuresState = {
        putAndStock: {
            strike: strikeOrder[0],
            price: 0,
            price_alt: 0,
        },
        buyWrite: {
            strike: strikeOrder[1],
            price: 0,
            price_alt: 0,
        },
        straddle: {
            strike: strikeOrder[2],
            price: 0,
            price_alt: 0,
        },
        callVertical: {
            lowerStrike: strikeOrder[3],
            verticalWidth: 5,
            price: 0,
            price_alt: 0,
        },
        putVertical: {
            lowerStrike: strikeOrder[4],
            verticalWidth: 5,
            price: 0,
            price_alt: 0,
        }
    }

    if (structures.callVertical.lowerStrike === highestStrike) {
        structures.callVertical.lowerStrike -= 5;
    }
    if (structures.putVertical.lowerStrike === highestStrike) {
        structures.putVertical.lowerStrike -= 5;
    }

    let s_mid = initialState.stockPrice + (initialState.spread / 2);

    // putAndStock = call - r/c = put + parity
    let k = structures.putAndStock.strike;
    let k_idx = initialState.strikes.indexOf(k);
    structures.putAndStock.price = optionFairs.calls[k_idx] - initialState.rc;
    structures.putAndStock.price_alt = optionFairs.puts[k_idx] + (s_mid - k);

    // buyWrite = put + r/c = call - parity
    k = structures.buyWrite.strike;
    k_idx = initialState.strikes.indexOf(k);
    structures.buyWrite.price = optionFairs.puts[k_idx] + initialState.rc;
    structures.buyWrite.price_alt = optionFairs.calls[k_idx] - (s_mid - k);

    // straddle = put + call
    k = structures.straddle.strike;
    k_idx = initialState.strikes.indexOf(k);
    structures.straddle.price = optionFairs.calls[k_idx] + optionFairs.puts[k_idx];
    structures.straddle.price_alt = 2 * optionFairs.calls[k_idx] - (s_mid - k) - initialState.rc;

    // callVertical = lower leg call - higher leg call 
    k = structures.callVertical.lowerStrike;
    k_idx = initialState.strikes.indexOf(k);
    let k2 = k + structures.callVertical.verticalWidth;
    let k2_idx = initialState.strikes.indexOf(k2);
    structures.callVertical.price = optionFairs.calls[k_idx] - optionFairs.calls[k2_idx];
    structures.callVertical.price_alt = structures.callVertical.verticalWidth - (optionFairs.puts[k2_idx] - optionFairs.puts[k_idx]);

    // putVertical = higher leg put - lower leg put
    k = structures.putVertical.lowerStrike;
    k_idx = initialState.strikes.indexOf(k);
    k2 = k + structures.putVertical.verticalWidth;
    k2_idx = initialState.strikes.indexOf(k2);
    structures.putVertical.price = optionFairs.puts[k2_idx] - optionFairs.puts[k_idx];
    structures.putVertical.price_alt = structures.putVertical.verticalWidth - (optionFairs.calls[k_idx] - optionFairs.calls[k2_idx]);

    // Round prices to two decimal places
    structures.putAndStock.price = Math.round(structures.putAndStock.price * 100) / 100;
    structures.putAndStock.price_alt = Math.round(structures.putAndStock.price_alt * 100) / 100;
    structures.buyWrite.price = Math.round(structures.buyWrite.price * 100) / 100;
    structures.buyWrite.price_alt = Math.round(structures.buyWrite.price_alt * 100) / 100;
    structures.straddle.price = Math.round(structures.straddle.price * 100) / 100;
    structures.straddle.price_alt = Math.round(structures.straddle.price_alt * 100) / 100;
    structures.callVertical.price = Math.round(structures.callVertical.price * 100) / 100;
    structures.callVertical.price_alt = Math.round(structures.callVertical.price_alt * 100) / 100;
    structures.putVertical.price = Math.round(structures.putVertical.price * 100) / 100;
    structures.putVertical.price_alt = Math.round(structures.putVertical.price_alt * 100) / 100;

    return structures;
}


export function generateOptionFairs(
    initialState: InitialState, 
    strcutures: StructuresState
): OptionFairs {
    
    let calls: Array<number> = [];
    let puts: Array<number> = [];

    // TODO: compute option fairs from structures

    let optionFairs: OptionFairs = {
        calls: calls,
        puts: puts
    }
    return optionFairs;
}
