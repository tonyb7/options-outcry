import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import firebase from '../../firebase'
import "firebase/compat/database"

import { Container } from '@mui/system'
import { makeStyles } from '@mui/styles'
import { Typography, Link, Grid, IconButton, 
    Tooltip, Box, Button, Paper } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done';
import LinkIcon from '@mui/icons-material/Link';

import Subheading from '../../components/Subheading'
import SimpleInput from '../../components/SimpleInput'
import Navbar from '../../components/Navbar'
import RoomUserList from '../../components/RoomUserList'

import useFirebaseRef from '../../hooks/useFirebaseRef'
import { UserContext } from '../../context'
import { UserObject, GameObject } from '../../interfaces'
import NotFoundPage from '../../components/NotFoundPage'

const useStyles = makeStyles((theme: any) => ({
    subpanel: {
      background: theme.palette.background.panel,
      padding: theme.spacing(1),
      borderRadius: 4,
    },
    shareLink: {
      display: "flex",
      alignItems: "center",
      "& > input": {
        flexGrow: 1,
        color: theme.palette.secondary.main,
      },
    },
    chatPanel: {
      display: "flex",
      flexDirection: "column",
      height: 400,
      padding: 8,
    },
    modeSelection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
    },
}));

const WaitingRoom:NextPage = () => {

    const router = useRouter()
    const { id } = router.query
    const [game, _] = useFirebaseRef(`games/${id}`, false);
    const gameObj = game as unknown as GameObject;
    // console.log("Game: ", game);

    const classes = useStyles();

    const [copiedLink, setCopiedLink] = useState(false);
    const link = process.env.NEXT_PUBLIC_HOST + "room/" + id;
    function handleCopy() {
        navigator.clipboard.writeText(link).then(() => setCopiedLink(true));
    }

    const user = useContext(UserContext);
    const userObj = user as unknown as UserObject
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        // console.log("Use effect running");
        if (
          !leaving &&
          game &&
          gameObj.status === "waiting" &&
          (!gameObj.users || (userObj && !(userObj.id in gameObj.users)))
        ) {
            // console.log("UseEffect updating db");
            const updates = {
                [`games/${id}/users/${userObj.id}`]:
                firebase.database.ServerValue.TIMESTAMP,
                // [`userGames/${user.id}/${id}`]: game.createdAt,
            };
            firebase
                .database()
                .ref()
                .update(updates)
                .then(() => {
                    firebase.analytics().logEvent("join_game", { id });
                })
                .catch((reason) => {
                    console.warn(`Failed to join game (${reason})`);
                });
        }
    }, [user, game, id, leaving]);

    if (gameObj && gameObj.status !== "waiting" && !leaving) {
        router.push(`/game/${id}`);
    }

    function leaveGame() {
        setLeaving(true);
        const updates = {
            [`games/${id}/users/${userObj.id}`]: null,
        };
        firebase
            .database()
            .ref()
            .update(updates)
            .then(() => router.push("/"))
            .catch((reason) => {
                console.warn(`Failed to leave game (${reason})`);
                setLeaving(false);
            });
    }

    function startGame() {
        firebase.database().ref(`games/${id}`).update({
            status: "ingame",
            startedAt: firebase.database.ServerValue.TIMESTAMP,
        });
        
        let initMarkets: { [userId: string]: any } = {};
        const users = Object.keys(gameObj.users || {}).sort(
            (a: any, b: any) => gameObj.users[a] - gameObj.users[b]
        );
        users.map(userId => {
            initMarkets[userId] = 
            {
                callBids: [-1, -1, -1, -1, -1],
                callAsks: [-1, -1, -1, -1, -1],
                putBids: [-1, -1, -1, -1, -1],
                putAsks: [-1, -1, -1, -1, -1],
            }
        });
        firebase.database().ref(`/gameData/${id}/markets`)
            .set(initMarkets)
            .then(() => { })
            .catch((reason) => {
                console.warn(`Failed to initialize markets in gameData. (${reason})`);
            });
    }

    if (!gameObj) {
        console.log("NO GAME OBJ")
        return <NotFoundPage/>;
    }

    return (
        <Container>
            <Navbar/>
            <Container>
                <Typography variant="h4" align="center" style={{ marginTop: 90 }}>
                    Waiting Room
                </Typography>
                <Typography variant="h6" align="center" style={{ marginTop: 0, paddingBottom: 20 }}>
                    {id}
                </Typography>
                <Paper style={{ padding: 16 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <div className={classes.subpanel}>
                                <Subheading>Players</Subheading>
                                <RoomUserList game={game} gameId={id}/>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={classes.subpanel}>
                                <Subheading>Inviting Friends</Subheading>
                                <Typography variant="body1">
                                To invite someone to play, share this URL:
                                <span className={classes.shareLink}>
                                    <SimpleInput
                                    readOnly
                                    value={link}
                                    onFocus={(event) => event.target.select()}
                                    />
                                    <Tooltip
                                    placement="top"
                                    title={copiedLink ? "Link copied" : "Copy link"}
                                    >
                                    <IconButton onClick={handleCopy}>
                                        {copiedLink ? <DoneIcon /> : <LinkIcon />}
                                    </IconButton>
                                    </Tooltip>
                                </span>
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                    <Box marginTop={2}>
                        {userObj && gameObj && userObj.id === gameObj.host ? (
                        <Tooltip
                            arrow
                            title="Make sure everyone is in the waiting room! Additional players won't be able to join after the game has started."
                        >
                            <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={startGame}
                            >
                            Start game
                            </Button>
                        </Tooltip>
                        ) : (
                        <Tooltip
                            arrow
                            title="Currently waiting for the host to start the game. You can leave by pressing this button."
                        >
                            <Button
                            size="large"
                            variant="outlined"
                            fullWidth
                            disabled={leaving}
                            onClick={leaveGame}
                            >
                            Leave game
                            </Button>
                        </Tooltip>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Container>
    );
}

export default WaitingRoom
