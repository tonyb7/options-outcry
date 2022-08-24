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

    return (
        <>
            <Typography variant="h5" align="center">
                Log
            </Typography>
            <GameTimer/>
            <Paper style={{ minHeight: '70vh', maxHeight: '70vh', overflow: 'auto', margin: 5 }}>
                <List>
                    {Object.entries(messages)
                        .sort(([, a]: [any, any], [, b]: [any, any]) => a.time - b.time) 
                        .map(([key, item]: [any, any]) => 
                            item.user !== process.env.NEXT_PUBLIC_SERVER_USER_ID ? 
                            (
                                <ListItem key={key} style={{ fontSize: 12 }}>
                                    <b><User id={item.user}/></b>: {item.message}
                                </ListItem>
                            ) : (
                                <Paper>
                                    <ListItem key={key} style={{ fontSize: 12 }}>
                                        {item.message}
                                    </ListItem>
                                </Paper>
                            )
                    )}
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
        user: process.env.NEXT_PUBLIC_SERVER_USER_ID,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP,
    });
}

export default GameLog;