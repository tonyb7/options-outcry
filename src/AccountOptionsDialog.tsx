import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { FC, useContext } from 'react';

import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';

import { UserContext } from './context';
import firebase, { authProvider } from './firebase';

interface AccountOptionsProps {
    open: boolean,
    onClose: () => void,
}

const AccountOptionsDialog: FC<AccountOptionsProps> = ({open, onClose}) => {

    const user: any = useContext(UserContext);

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
        </Dialog>
    )
}

export default AccountOptionsDialog
