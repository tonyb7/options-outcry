import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import GameTimer from "./GameTimer";
import SimpleInput from "../SimpleInput";

import { useState, useContext, useMemo } from "react";
import useFirebaseQuery from "../../hooks/useFirebaseQuery.js";

import Filter from "bad-words";

import firebase from "../../firebase";
import { UserContext } from "../../context";
import User from "../User";

import { PnlStats, UserPnl } from "./CalculatePnl";
import { formatTime } from "./GameTimer";

const GameLog = (props: any) => {

    const user: any = useContext(UserContext);
    const [input, setInput] = useState("");
    const filter = new Filter();

    const databasePath = `chats/${props.gameId}`;
    const messagesQuery = useMemo(
      () =>
        firebase
          .database()
          .ref(databasePath)
          .orderByChild("time"),
      [databasePath]
    );
    const messages = useFirebaseQuery(messagesQuery);

    function handleSubmit(event: any) {
        event.preventDefault();
        if (input) {
            if (filter.isProfane(input)) {
                alert(
                    "We detected that your message contains profane language."
                );
            } else {
                firebase.database().ref(databasePath).push({
                    user: user.id,
                    message: input,
                    time: firebase.database.ServerValue.TIMESTAMP,
                });
                setInput("");
            }
        }
    }

    const returnServerMessage = (item: any, key: any, gameId: string) => {
        if (item.type === "pnl" && item.hasOwnProperty('pnlStats') && item.pnlStats) {

            const pnlStats = item.pnlStats;
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

            // interface UserPnl {
            //     userName: string,
            //     pnl: number
            // }
            // interface OptionFairValue {
            //     K: number,
            //     callValue: number,
            //     putValue: number
            // }
            // export interface PnlStats {
            //     userPnls: Array<UserPnl>,
            //     fairs: Array<OptionFairValue>
            // };
            console.log("PnlStats: ", pnlStats);
            pnlStats.userPnls.map((userpnl: UserPnl, i: number) => console.log("user pnl: ", userpnl, " i=", i))
            return (
                <Paper key={key}>
                    <Typography
                        style={{ fontSize: 12, fontWeight: 'bold', margin: 10 }}
                    >
                        ({formatTime(item.time - item.pnlStats.gameStartedAt, false)}) These are PnL statistics if the inside market on each option was executed against: 
                        {pnlStats.userPnls.map((userpnl: UserPnl, i: number) => (
                            <Typography 
                                key={i}
                                style={{ fontSize: 12, marginTop: 10 }}
                            >
                                <b>{userpnl.userName}: </b>{userpnl.pnl.toFixed(2)}
                            </Typography>
                        ))}
                    </Typography>
                </Paper>
            );
        }
        // console.assert(item.type === "text");
        return (
            <Paper key={key}>
                <ListItem key={key} style={{ fontSize: 12 }}>
                    {item.message}
                </ListItem>
            </Paper>
        );
    }

    return (
        <>
            <Typography variant="h5" align="center">
                Log
            </Typography>
            <GameTimer gameId={props.gameId}/>
            <Paper style={{ minHeight: '70vh', maxHeight: '70vh', overflow: 'auto', margin: 5 }}>
                <List>
                    {
                    Object.entries(messages)
                        .sort(([, a]: [any, any], [, b]: [any, any]) => a.time - b.time) 
                        .map(([key, item]: [any, any]) => 
                            item.user !== process.env.SERVER_USER_ID ? 
                            (
                                <ListItem key={key} style={{ fontSize: 12 }}>
                                    <b><User id={item.user}/></b>: {item.message}
                                </ListItem>
                            ) : (
                                returnServerMessage(item, key, props.gameId)
                            )
                        )
                    }
                </List>
            </Paper>
            <form onSubmit={handleSubmit} style={{ margin: 5 }}>
                <SimpleInput
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    maxLength={250}
                />
            </form>
        </>
    );
}

export function AddServerMessage(gameId: string, message: string): void {
    const databasePath = `chats/${gameId}`;
    firebase.database().ref(databasePath).push({
        user: process.env.SERVER_USER_ID,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP,
        type: "text",
    });
}

export function AddPnlMessage(gameId: string, pnlStats: PnlStats): void {
    const databasePath = `chats/${gameId}`;
    firebase.database().ref(databasePath).push({
        user: process.env.SERVER_USER_ID,
        message: "PNL STATS (SHOULD NOT SEE THIS)",
        time: firebase.database.ServerValue.TIMESTAMP,
        pnlStats: pnlStats,
        type: "pnl",
    });
}

export default GameLog;