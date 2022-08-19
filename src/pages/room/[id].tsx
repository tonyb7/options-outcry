import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import firebase from '../../firebase'
import "firebase/compat/database"

import { Container } from '@mui/system'
import { makeStyles } from '@mui/styles'
import { Typography, Link, Grid, IconButton, Tooltip } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done';
import LinkIcon from '@mui/icons-material/Link';

import Subheading from '../../components/Subheading'
import SimpleInput from '../../components/SimpleInput'
import Navbar from '../../components/Navbar'
import RoomUserList from '../../components/RoomUserList'

import useFirebaseRef from '../../hooks/useFirebaseRef'

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
    const [game, gameLoading] = useFirebaseRef(`games/${id}`);

    const classes = useStyles();

    const [copiedLink, setCopiedLink] = useState(false);
    const link = process.env.NEXT_PUBLIC_HOST + "room/" + id;
    function handleCopy() {
        navigator.clipboard.writeText(link).then(() => setCopiedLink(true));
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
                            <RoomUserList/>
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
                </Container>
            ) : (
                <Container>
                    <Typography variant="h4" align="center" style={{ marginTop: 90 }}>
                        Loading...
                    </Typography>
                    <Typography variant="h6" align="center" style={{ marginTop: 20 }}>
                        If the page does not load for more than 5 seconds, this game does not exist.
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
