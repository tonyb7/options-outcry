import { Dialog } from '@mui/material';
import { FC } from 'react';

import Button from '@mui/material/Button';
import firebase, { authProvider } from '../src/firebase';

interface AccountOptionsProps {
    open: boolean,
    onClose: any,
}

const AccountOptionsDialog: FC<AccountOptionsProps> = ({open, onClose}) => {

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

    return (
        <Dialog open={open} onClose={onClose}>
            <Button
                onClick={handleLogin}
                >
                Sign in with Google
            </Button>
        </Dialog>
    )
}

export default AccountOptionsDialog
