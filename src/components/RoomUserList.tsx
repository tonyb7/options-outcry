
import { List, ListItem } from "@mui/material"
import { useContext } from "react";

import { UserContext } from "../context";
import User from "./User";

const RoomUserList = ({ game, gameId }: { game: any, gameId: any }) => {
    const user = useContext(UserContext);
    
    // Current list of players, sorted by when they joined
    const users = Object.keys(game.users || {}).sort(
        (a, b) => game.users[a] - game.users[b]
    );
    // console.log("users: ", users);
    // console.log("game: ", game);

    function renderListItem(playerId: string) {
        return (
            <ListItem key={playerId}>
                <User id={playerId} />
            </ListItem>
        )
    }

    return (
        <List>
            {users.map(renderListItem)}
        </List>
    );
}

export default RoomUserList