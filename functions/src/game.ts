

interface InitialState {

}

function randNum(min: number, max: number) : number {
    return (Math.random() * (max - min)) + min;
}

export function generateInitialState(): InitialState {

    let lowestStrike = (Math.floor(Math.random() * 15) * 5) + 20; // multiple of 5 in [20, 90]
    let highestStrike = lowestStrike + 20;
    let stockPrice = randNum(lowestStrike + 0.01, highestStrike);
    stockPrice = Math.round(stockPrice * 100) / 100 // round to 2 decimal places
    let spread = (Math.floor(Math.random() * 25) + 1) / 100; // cent value in [0.01, 0.25]
    let riskFreeRate = (Math.floor(Math.random() * 5) + 1) / 100; // [0.01, 0.05]
    let tteDays = Math.floor(Math.random() * 100) + 1; // [1, 100]
    let rc = stockPrice * Math.pow(Math.E, riskFreeRate * (tteDays / 252)) - stockPrice;
    let lVol = (Math.floor(Math.random() * 36) + 5) / 100; // [0.05, 0.40]
    let skewChoices = ['call', 'put', 'none'];
    let skew = skewChoices[Math.floor(Math.random() * skewChoices.length)];

    let initialState: InitialState = {
        lowestStrike: lowestStrike,
        stockPrice: stockPrice,
        spread: spread,
        riskFreeRate: riskFreeRate,
        tteDays: tteDays,
        rc: rc,
        lVol: lVol,
        skew: skew
    }

    return initialState;
}

interface OptionFairs {

}

export function generateOptionFairs(initialState: InitialState): OptionFairs {

    let optionFairs: OptionFairs = {

    }
    return optionFairs;
}

interface StructuresState {

}

export function generateStructures(optionFairs: OptionFairs): StructuresState {

    let structures: StructuresState = {

    }

    return structures;
}

