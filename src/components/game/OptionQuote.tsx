import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { GetUserNameFromId } from '../User';

import firebase from "../../firebase";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { UserObject } from "../../interfaces";

interface OptionInventory {
    strike0Transactions: Array<number>
    strike1Transactions: Array<number>
    strike2Transactions: Array<number>
    strike3Transactions: Array<number>
    strike4Transactions: Array<number>
}
interface UserInventory {
    callTransactions: OptionInventory,
    putTransactions: OptionInventory,
    stockTransactions: Array<number>
}

interface OptionQuoteProps {
    bidString: string,
    bidUserId: string,
    askString: string,
    askUserId: string,
    gameId: string,
    isCall: boolean,
    K: number,
    K_idx: number
}

const OptionQuote = (props: OptionQuoteProps) => {

    const user = useContext(UserContext) as any as UserObject;
    let databasePath = `gameData/${props.gameId}/inventory/${user.id}`;
    const [inventory, setInventory] = useState<UserInventory | null>(null);
    useEffect(() => {
        const ref = firebase.database().ref(databasePath);
        ref.on("value", (snapshot) => {
            setInventory(snapshot.val());
        });
        return () => ref.off();
    }, [databasePath]);

    let bidId = "None";
    if (props.bidUserId.length > 0) {
        bidId = GetUserNameFromId(props.bidUserId);
    }

    let askId = "None";
    if (props.askUserId.length > 0) {
        askId = GetUserNameFromId(props.askUserId);
    }

    // "inventory": {
    //     "$user": {
    //         "callTransactions": {
    //             "strike0Transactions": {},
    //             "strike1Transactions": {},
    //             "strike2Transactions": {},
    //             "strike3Transactions": {},
    //             "strike4Transactions": {}
    //         },
    //         "putTransactions": {
    //             "strike0Transactions": {},
    //             "strike1Transactions": {},
    //             "strike2Transactions": {},
    //             "strike3Transactions": {},
    //             "strike4Transactions": {}
    //         },
    //         "stockTransactions": {}
    //     }
    // },

    const handleSell = () => {
        console.log("SOLD!");
        if (!inventory) {
            console.log("TODO: Error msg/popup");
            return;
        }
        // user.id sells to props.bidUserId at parseFloat(props.bidString)
        const price = parseFloat(props.bidString);
        const firstIdx = props.isCall ? "callTransactions" : "putTransactions" as keyof UserInventory;
        const secondIdx = "strike" + props.K_idx + "Transactions" as keyof OptionInventory;
        const optionTransactions = inventory[firstIdx] as OptionInventory;

        optionTransactions[secondIdx].push(price);
        
        const cptyDbPath = `gameData/${props.gameId}/inventory/${props.bidUserId}`;
        const ref = firebase.database().ref(cptyDbPath);
        let cptyInventory: UserInventory | null = null;
        ref.on("value", (snapshot) => {
            cptyInventory = snapshot.val();
        });
        if (!cptyInventory) {
            console.log("Cpty Inventory not fetched!");
            return;
        }
        const cptyOptionTransactions = cptyInventory[firstIdx] as OptionInventory;
        cptyOptionTransactions[secondIdx].push(0 - price);

        // TODO: how to make this atomic?
        // const batch = firebase.database().batch();
        // firebase.database().ref(databasePath).set(inventory)
        //     .then(() => console.log("Recorded sell successfully"))
        //     .catch((reason) => {
        //         console.warn(`Failed to sell (${reason})`);
        //     });
        // firebase.database().ref(cptyDbPath).set(cptyInventory)
        //     .then(() => console.log("Recorded cpty sell successfully"))
        //     .catch((reason) => {
        //         console.warn(`Failed to cpty sell (${reason})`);
        //     });




    }

    const handleBuy = () => {
        console.log("TAKE 'EM");
        // user.id buys from props.askUserId for parseFloat(props.bidString)

    }

    return (
        <>
            <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ margin: 'auto' }}
            >
                <Tooltip 
                    arrow 
                    title={
                        <div style={{ textAlign: "center" }}>
                            {"Best Bid - " + bidId}
                            <br/>
                            {"(Click to Sell)"}
                        </div>
                    }
                >
                    <Button
                        onClick={handleSell}
                    >
                        {props.bidString}
                    </Button>
                </Tooltip>
                <Tooltip 
                    arrow 
                    title={
                        <div style={{ textAlign: "center" }}>
                            {"Best Ask - " + askId}
                            <br/>
                            {"(Click to Buy)"}
                        </div>
                    }
                >
                    <Button
                        onClick={handleBuy}
                    >
                        {props.askString}
                    </Button>
                </Tooltip>
            </Box>
        </>
    );
}

export default OptionQuote;