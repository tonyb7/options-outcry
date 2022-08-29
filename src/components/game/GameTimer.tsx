import Typography from "@mui/material/Typography";

import moment from "moment";
import { useEffect, useState } from "react";

import firebase from "../../firebase";
import { GameObject } from "../../interfaces";
import useMoment from "../../hooks/useMoment";

export function formatTime(t: number, hideSubsecond: boolean): string {
    t = Math.max(t, 0);
    const hours = Math.floor(t / (3600 * 1000));
    const rest = t % (3600 * 1000);
    const format = hideSubsecond ? "mm:ss" : "mm:ss.SS";
    return (hours ? `${hours}:` : "") + moment.utc(rest).format(format);
}

interface GameTimerProps {
    gameId: string
}

const GameTimer = (props: GameTimerProps) => {

    return (
        <>
            <Typography align="center" paddingTop={1} paddingBottom={2}>
                Time Elapsed: {GetTimeElapsed(props.gameId)}
            </Typography>
        </>
    );

}

// Used by external components who want the timestamp (such as CalculatePnl)
export function GetTimeElapsed(gameId: string): string {
    const [startedAt, setStartedAt] = useState(0);
    const [endedAt, setEndedAt] = useState(0);
    const [gameStatus, setGameStatus] = useState("");

    const ref = firebase.database().ref(`games/${gameId}`);
    let promise: Promise<any> = ref.once("value", snapshot => {
        const game: GameObject = snapshot.val();
        setStartedAt(game.startedAt);
        setEndedAt(game.endedAt);
        setGameStatus(game.status);
    });
    Promise.resolve(promise);

    const time = useMoment(500);
    const gameTime = gameStatus === "done" ? endedAt : time;
    return formatTime(gameTime.valueOf() - startedAt, gameStatus !== "done");
}   

export default GameTimer;