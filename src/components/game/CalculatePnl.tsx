import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context";
import { UserObject, GameObject } from "../../interfaces";
import firebase from "../../firebase";

import { AddPnlMessage } from "./GameLog";

interface UserPnl {
    userName: string,
    pnl: number
}
interface OptionFairValue {
    K: number,
    callValue: number,
    putValue: number
}
export interface PnlStats {
    userPnls: Array<UserPnl>,
    fairs: Array<OptionFairValue>
};

interface CalculatePnlProps {
    gameId: string
}

const CalculatePnl = (props: CalculatePnlProps) => {

    // Determine whether the user is the host or not.
    // Calc pnl button can only be pressed by the host. 
    const user = useContext(UserContext) as any as UserObject;
    const [isHost, setIsHost] = useState(false);
    useEffect(() => {
        const ref = firebase.database().ref(`games/${props.gameId}`);
        ref.once("value", snapshot => {
            const game: GameObject = snapshot.val();
            console.log("GAME.HOST: ", game.host, ", USER?.ID: ", user?.id);
            setIsHost(game.host === user?.id);
        });
        return () => ref.off();
    }, [props.gameId]);


    const [gameData, setGameData] = useState<any>(null);
    const calculatePnl = () => {
        const ref = firebase.database().ref(`gameData/${props.gameId}`);
        let promise: Promise<any> = ref.once("value", snapshot => {
            setGameData(snapshot.val());
        });
        Promise.resolve(promise);

        // turn this:
        // "initialStateOptionFairs": {
        //     "calls": {},
        //     "puts": {}
        // },
        // initialState.strikes
        // "markets": {
        //     "$user": {
        //         "callBids": {},
        //         "callAsks": {},
        //         "callMarketTimes": {},
        //         "putBids": {},
        //         "putAsks": {},
        //         "putMarketTimes": {}
        //     }
        // },

        // into this:
        // These are PnL statistics if the inside market on each option was executed against:
        // User: PnL
        // User: PnL
        // ...
        // User: PnL
        // Fairs Used:
        //      K1 Call: _, K1 Put: _
        //      K2 Call: _, K2 Put: _
        //      ...
        //      K5 Call: _, K5 Put: _
        let pnlStats: PnlStats = {
            userPnls: [
                {
                    userName: "User1",
                    pnl: 0.1
                },
                {
                    userName: "User2",
                    pnl: 0.2
                },
            ],
            fairs: [
                {
                    K: 60,
                    callValue: 0.15,
                    putValue: 4.5
                },
                {
                    K: 65,
                    callValue: 0.01,
                    putValue: 8.5
                },
            ]
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
                    onClick={calculatePnl}
                >
                    Calculate PnL
                </Button>
            </span>
        </Tooltip>

    );
}

export default CalculatePnl;