import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import firebase from '../../firebase'
import "firebase/compat/database"

import { Container } from '@mui/system'
import { makeStyles } from '@mui/styles'
import { Typography, Link, Grid, IconButton, Tooltip, Box, Button } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done';
import LinkIcon from '@mui/icons-material/Link';

import Subheading from '../../components/Subheading'
import SimpleInput from '../../components/SimpleInput'
import Navbar from '../../components/Navbar'
import RoomUserList from '../../components/RoomUserList'

import useFirebaseRef from '../../hooks/useFirebaseRef'
import { UserContext } from '../../context'
import { UserObject } from '../../components/User'

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

interface GameObject {
    createdAt: number,
    host: string,
    status: string,
    users: any[]
};

const WaitingRoom:NextPage = () => {

    const router = useRouter()
    const { id } = router.query
    const [game, _] = useFirebaseRef(`games/${id}`, false);
    const gameObj = game as unknown as GameObject;

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
        if (
          !leaving &&
          game &&
          gameObj.status === "waiting" &&
          (!gameObj.users || (userObj && !(userObj.id in gameObj.users)))
        ) {
          const updates = {
            [`games/${id}/users/${userObj.id}`]:
              firebase.database.ServerValue.TIMESTAMP,
            // [`userGames/${user.id}/${id}`]: game.createdAt,
          };
          firebase
            .database()
            .ref()
            .update(updates)
            .then(() => firebase.analytics().logEvent("join_game", { id }))
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
    }

    return (
        <Container>
            <Navbar/>
            {game ? (
                <Container>
                    <Typography variant="h4" align="center" style={{ marginTop: 90 }}>
                        Waiting Room
                    </Typography>
                    <Typography variant="h6" align="center" style={{ marginTop: 0 }}>
                        {id}
                    </Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <Subheading>Players</Subheading>
                            <RoomUserList game={game} gameId={id}/>
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
                </Container>
            ) : (
                <Container>
                    <Typography variant="h4" align="center" style={{ marginTop: 90 }}>
                        Loading...
                    </Typography>
                    <Typography variant="h6" align="center" style={{ marginTop: 20 }}>
                        If the page does not load for more than 5 seconds, please try refreshing the page. 
                        If the page still does not load, this game does not exist.
                        Visit the{" "}
                        <Link href="/">
                            homepage
                        </Link>
                        {" "}to create a game.
                    </Typography>
                </Container>
            )}
        </Container>
    );
}

export default WaitingRoom
