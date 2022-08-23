import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import GameTimer from "./GameTimer";
import SimpleInput from "../SimpleInput";

import { useState } from "react";
import useFirebaseRef from "../../hooks/useFirebaseRef";

const GameLog = (props: any) => {

    const [input, setInput] = useState("");

    const [chat, _] = useFirebaseRef(`chats/${props.gameId}`, true);
    const chatObj = chat as any;

    // const databasePath = gameId ? `chats/${gameId}` : "lobbyChat";
    // const messagesQuery = useMemo(
    //   () =>
    //     firebase
    //       .database()
    //       .ref(databasePath)
    //       .orderByChild("time")
    //       .limitToLast(messageLimit),
    //   [databasePath, messageLimit]
    // );
    // const messages = useFirebaseQuery(messagesQuery);

    function handleSubmit(event: any) {
    //     event.preventDefault();
    //     if (input) {
    //       if (filter.isProfane(input)) {
    //         alert(
    //           "We detected that your message contains profane language. If you think this was a mistake, please let us know!"
    //         );
    //       } else {
    //         firebase.database().ref(databasePath).push({
    //           user: user.id,
    //           message: input,
    //           time: firebase.database.ServerValue.TIMESTAMP,
    //         });
    //         setInput("");
    //       }
    //     }
    }

    return (
        <>
            <Typography variant="h5" align="center">
                Log
            </Typography>
            <GameTimer/>
            <Paper style={{ maxHeight: '70vh', overflow: 'auto', margin: 5 }}>
                <List>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
                    <ListItem>Hello</ListItem>
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

export default GameLog;