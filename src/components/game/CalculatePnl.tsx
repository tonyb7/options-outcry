import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context";
import { UserObject, GameObject } from "../../interfaces";
import firebase from "../../firebase";

import { AddServerMessage, AddPnlMessage } from "./GameLog";
import { Markets, GetFormattedMarkets, InsideMarkets, GetInsideMarkets } from "./QuoteUtils";
import { GetUserNameFromIdNoHook } from "../User";

export interface UserPnl {
    userName: string,
    pnl: number,
    pnlAdverse: number,
}
export interface OptionFairValue {
    K: number,
    callValue: number,
    putValue: number
}
export interface PnlStats {
    userPnls: Array<UserPnl>,
    fairs: Array<OptionFairValue>,
    gameStartedAt: number
};

interface CalculatePnlProps {
    gameId: string
}

const CalculatePnl = (props: CalculatePnlProps) => {

    // Determine whether the user is the host or not.
    // Calc pnl button can only be pressed by the host. 
    const user = useContext(UserContext) as any as UserObject;
    const [isHost, setIsHost] = useState(false);
    const [startedAt, setStartedAt] = useState(0);
    useEffect(() => {
        const ref = firebase.database().ref(`games/${props.gameId}`);
        ref.once("value", snapshot => {
            const game: GameObject = snapshot.val();
            console.log("game.host=", game.host, ", user?.id=", user?.id);
            setIsHost(game.host === user?.id);
            setStartedAt(game.startedAt);
        });
        return () => ref.off();
    // }, [props.gameId]);
    });


    const [gameData, setGameData] = useState<any>(null);
    const calculatePnl = async () => {
        const ref = firebase.database().ref(`gameData/${props.gameId}`);
        const getGameData: Promise<any> = ref.once("value", snapshot => {
            setGameData(snapshot.val());
        });
        await Promise.resolve(getGameData);

        console.log("Game Data: ", gameData);
        if (!gameData) {
            AddServerMessage(props.gameId, "Try clicking Calculate PnL one more time");
            return;
        }
        let strikes: Array<number> = gameData.initialState.strikes;

        let fairs: Array<OptionFairValue> = [];
        strikes.forEach((strike: number, i: number) => {
            let fair: OptionFairValue = {
                K: strike,
                callValue: gameData.initialStateOptionFairs.calls[i],
                putValue: gameData.initialStateOptionFairs.puts[i],
            };
            fairs.push(fair);
        });

        let userPnls: Array<UserPnl> = [];
        let userIdToIdxMap: { [id: string]: number } = {};
        let i = 0;
        for (let userId in gameData.markets) {
            userIdToIdxMap[userId] = i;
            let userName = await Promise.resolve(GetUserNameFromIdNoHook(userId));
            userPnls.push({
                userName: userName,
                pnl: 0,
                pnlAdverse: 0,
            });
            i += 1;
        }
        let markets: Array<Markets> = GetFormattedMarkets(gameData.markets, strikes)
        strikes.forEach((strike: number, i: number) => {
            let insideMarket: InsideMarkets = GetInsideMarkets(markets[i]);

            let validCallBid = parseFloat(insideMarket.callBestBid).toFixed(2) === insideMarket.callBestBid;
            let validCallAsk = parseFloat(insideMarket.callBestAsk).toFixed(2) === insideMarket.callBestAsk;
            let validPutBid = parseFloat(insideMarket.putBestBid).toFixed(2) === insideMarket.putBestBid;
            let validPutAsk = parseFloat(insideMarket.putBestAsk).toFixed(2) === insideMarket.putBestAsk;
            
            console.log("(calculate pnl) Strike: ", strike);

            if (validCallBid && validCallAsk) {
                let bid = parseFloat(insideMarket.callBestBid);
                let ask = parseFloat(insideMarket.callBestAsk);
                let spread = ask - bid;

                let pnlDiffBid = fairs[i].callValue - bid;
                userPnls[userIdToIdxMap[insideMarket.callBestBidUserId]].pnl += pnlDiffBid;
                if (pnlDiffBid <= spread) {
                    userPnls[userIdToIdxMap[insideMarket.callBestBidUserId]].pnlAdverse += pnlDiffBid;
                }

                let pnlDiffAsk = ask - fairs[i].callValue;
                userPnls[userIdToIdxMap[insideMarket.callBestAskUserId]].pnl += pnlDiffAsk;
                if (pnlDiffAsk <= spread) {
                    userPnls[userIdToIdxMap[insideMarket.callBestAskUserId]].pnlAdverse += pnlDiffAsk;
                }

                console.log("(calculate pnl) Call Bid: ", bid, ", Ask: ", ask, " new bid user pnl: ", 
                    userPnls[userIdToIdxMap[insideMarket.callBestBidUserId]].pnl, 
                    ", new bid user adverse pnl: ", userPnls[userIdToIdxMap[insideMarket.callBestBidUserId]].pnlAdverse);
            }

            if (validPutBid && validPutAsk) {
                let bid = parseFloat(insideMarket.putBestBid);
                let ask = parseFloat(insideMarket.putBestAsk);
                let spread = ask - bid;

                let pnlDiffBid = fairs[i].putValue - bid;
                userPnls[userIdToIdxMap[insideMarket.putBestBidUserId]].pnl += pnlDiffBid;
                if (pnlDiffBid <= spread) {
                    userPnls[userIdToIdxMap[insideMarket.putBestBidUserId]].pnlAdverse += pnlDiffBid;
                }

                let pnlDiffAsk = ask - fairs[i].putValue;
                userPnls[userIdToIdxMap[insideMarket.putBestAskUserId]].pnl += pnlDiffAsk;
                if (pnlDiffAsk <= spread) {
                    userPnls[userIdToIdxMap[insideMarket.putBestAskUserId]].pnlAdverse += pnlDiffAsk;
                }

                console.log("(calculate pnl) Put Bid: ", bid, ", Ask: ", ask, " new bid user pnl: ", 
                userPnls[userIdToIdxMap[insideMarket.putBestBidUserId]].pnl, 
                ", new bid user adverse pnl: ", userPnls[userIdToIdxMap[insideMarket.putBestBidUserId]].pnlAdverse);
            }
        });

        let pnlStats: PnlStats = {
            userPnls: userPnls,
            fairs: fairs,
            gameStartedAt: startedAt
        }

        AddPnlMessage(props.gameId, pnlStats);
    }

    return (
        <Tooltip
        arrow
        style={{ width: '80%', margin: 'auto', textAlign: 'center' }}
        title={ "Compute PnL of each player supposing that " + 
                "the inside market of each option was executed. " + 
                "PnL is calculated against approximate option fair values " + 
                "based on the price of underlying and price of structures. " + 
                "Can only be clicked by the host." }
        >
            <span>
                <Button 
                    disabled={!isHost}
                    variant='contained'
                    style={{ marginLeft: '15%', marginRight: '15%' }}
                    onClick={() => { calculatePnl(); }}
                >
                    Calculate PnL
                </Button>
            </span>
        </Tooltip>

    );
}

export default CalculatePnl;