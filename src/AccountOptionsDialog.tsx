import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { FC, useContext, useState } from 'react';

import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';

import { UserContext } from './context';
import firebase, { authProvider } from './firebase';

import Filter from "bad-words";

interface AccountOptionsProps {
    open: boolean,
    onClose: () => void,
}

const AccountOptionsDialog: FC<AccountOptionsProps> = ({open, onClose}) => {

    const user: any = useContext(UserContext);
    const [nameValue, setNameValue] = useState("");
    const maxNameLength = 25;
    const filter = new Filter();

    function handleLogin(): void {
        firebase
            .auth()
            .signInWithPopup(authProvider)
            .catch((error) => {
            switch (error.code) {
                case "auth/cancelled-popup-request":
                case "auth/popup-closed-by-user":
                    break;
                default:
                    alert(error.toString()); // Should not be reached
            }
            });
    }

    function handleLogout(): void {
        firebase.auth().signOut();
    }

    function handleKeyDown(event: React.KeyboardEvent): void {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSubmit();
        }
    }

    function handleSubmit(): void {
        if (filter.isProfane(nameValue)) {
            alert("Detected that input is profane. Please choose a more appropriate input.");
        } else {
            handleChangeName(nameValue)
            setNameValue("");
        }
    }

    function handleChangeName(name: string): void {
        name = (name || "").trim();
        if (name) {
            firebase.database().ref(`users/${user.id}/name`).set(name);
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Account Options</DialogTitle>
            { user?.authUser.isAnonymous ? (
                <DialogContent>
                    <DialogContentText gutterBottom>
                        You are currently anonymous. Sign in to save your settings.
                    </DialogContentText>
                    <DialogContentText gutterBottom component="div">
                        <Button
                            onClick={handleLogin}
                            variant="outlined"
                            fullWidth
                        >
                            <GoogleIcon/> &nbsp;Sign in with Google
                        </Button>
                    </DialogContentText>
                </DialogContent>
            ) : (
                <DialogContent>
                    <DialogContentText gutterBottom>
                        You are currently signed in using {user?.authUser.email}.
                    </DialogContentText>
                    <DialogContentText gutterBottom component="div">
                        <Button
                            onClick={handleLogout}
                            variant="outlined"
                            fullWidth
                        >
                            Log out
                        </Button>
                    </DialogContentText>
                </DialogContent>
            )}
            <DialogContent>
                <DialogContentText gutterBottom>
                    Your display name is&nbsp;
                    <span style={{ color: '#03b6fc' }}>{user?.name}</span>
                    . You can change it here:
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    fullWidth
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    variant="outlined"
                    onKeyDown={handleKeyDown}
                    inputProps={{ maxNameLength }}
                />
            </DialogContent>
        </Dialog>
    )
}

export default AccountOptionsDialog
