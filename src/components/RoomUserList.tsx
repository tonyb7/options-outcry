
import { useContext } from "react";

import { Grid, List, ListItem, Tooltip } from "@mui/material";
import StarsIcon from '@mui/icons-material/Stars';
import PersonIcon from '@mui/icons-material/Person';

import { UserContext } from "../context";
import User from "./User";

const RoomUserList = ({ game, gameId }: { game: any, gameId: any }) => {
    const user = useContext(UserContext);
    
    // Current list of players, sorted by when they joined
    const users = Object.keys(game.users || {}).sort(
        (a, b) => game.users[a] - game.users[b]
    );

    function renderListItem(playerId: string) {
        return (
            <ListItem key={playerId}>
                <Grid container>
                    <Grid item xs={1}>
                        <Tooltip title={playerId === game.host ? "Host" : "Player"}>
                            {playerId === game.host ? <StarsIcon /> : <PersonIcon />}
                        </Tooltip>
                    </Grid>
                    <Grid item xs={11}>
                        <User id={playerId} />
                    </Grid>
                </Grid>
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