import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context";
import { UserObject, GameObject } from "../../interfaces";
import firebase from "../../firebase";

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
            setIsHost(game.host === user?.id);
        });
        return () => ref.off();
    }, [props.gameId]);


    const [gameData, setGameData] = useState<any>(null);
    const calculatePnl = () => {
        const ref = firebase.database().ref(`gameData/${props.gameId}`);
        ref.once("value", snapshot => {
            setGameData(snapshot.val());
        });
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