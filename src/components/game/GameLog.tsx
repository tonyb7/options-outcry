import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


import GameTimer from "./GameTimer";
import SimpleInput from "../SimpleInput";

import { useState, useContext, useMemo } from "react";
import useFirebaseQuery from "../../hooks/useFirebaseQuery.js";

import Filter from "bad-words";

import firebase from "../../firebase";
import { UserContext } from "../../context";
import User from "../User";

import { PnlStats, UserPnl, OptionFairValue } from "./CalculatePnl";
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
            return (
                <Paper key={key}>
                    <Typography
                        component={'span'}
                        style={{ fontSize: 12, fontWeight: 'bold', margin: 10, marginTop: 25 }}
                    >
                        ({formatTime(item.time - item.pnlStats.gameStartedAt, false)}) 
                        These are PnL statistics if the inside market on each option was executed against: 
                        <Table>
                        {pnlStats.userPnls.map((userpnl: UserPnl, i: number) => (
                            <TableBody key={"pnls" + i}>
                                <TableRow>
                                    <TableCell style={{ fontSize: 12, fontWeight: 'bold' }}>{userpnl.userName}</TableCell>
                                    <TableCell style={{ fontSize: 12 }}>{userpnl.pnl.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                        </Table>
                    </Typography>
                    <Typography
                        component={'span'}
                        style={{ fontSize: 12, fontWeight: 'bold', margin: 10, marginTop: 25 }}
                    >
                        ({formatTime(item.time - item.pnlStats.gameStartedAt, false)}) 
                        These are PnL statistics if the spread was collected on "correct" markets, 
                        and only the incorrect leg was traded against on "incorrect" markets. Correct is defined as the 
                        option fair value being within the inside market: 
                        <Table>
                        {pnlStats.userPnls.map((userpnl: UserPnl, i: number) => (
                            <TableBody key={"pnls" + i}>
                                <TableRow>
                                    <TableCell style={{ fontSize: 12, fontWeight: 'bold' }}>{userpnl.userName}</TableCell>
                                    <TableCell style={{ fontSize: 12 }}>{userpnl.pnlAdverse.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                        </Table>
                    </Typography>
                    <Typography
                        style={{ fontSize: 12, fontWeight: 'bold', margin: 10 }}
                    >
                        Option fairs used to calculate PnLs:
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontSize: 12 }}>Strike</TableCell>
                                    <TableCell style={{ fontSize: 12 }}>Call Fair</TableCell>
                                    <TableCell style={{ fontSize: 12 }}>Put Fair</TableCell>
                                </TableRow>
                            </TableHead>
                        {pnlStats.fairs.map((fairs: OptionFairValue, i: number) => (
                            <TableBody key={"fairs" + i}>
                                <TableRow>
                                    <TableCell style={{ fontSize: 12, fontWeight: 'bold' }}>{fairs.K}</TableCell>
                                    <TableCell style={{ fontSize: 12 }}>{fairs.callValue.toFixed(2)}</TableCell>
                                    <TableCell style={{ fontSize: 12 }}>{fairs.putValue.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        ))}
                        </Table>
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