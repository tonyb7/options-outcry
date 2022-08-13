import { Dialog } from '@mui/material';
import { FC } from 'react';

import Button from '@mui/material/Button';
import handleLogin from '../firebase/auth';

interface AccountOptionsProps {
    open: boolean,
    onClose: any,
}

const AccountOptionsDialog: FC<AccountOptionsProps> = ({open, onClose}) => {

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
