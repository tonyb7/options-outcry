import { AppBar, Toolbar } from '@mui/material'
import { Typography, Link, Tooltip } from '@mui/material'

import { useContext } from 'react'
import { UserContext } from '../context'

const Navbar = () => {
    const user: any = useContext(UserContext);

    return (
        <AppBar elevation={0}>
            <Toolbar variant="dense">
                <Typography variant="h6" style={{ flexGrow: 1, whiteSpace: "nowrap" }}>
                    <Link href="/" underline="none" color="inherit">
                        Options Open Outcry
                    </Link>
                </Typography>
                <Typography variant="h6" style={{ marginLeft: "2em", marginRight: 8, minWidth: 0, color: '#03b6fc' }}>
                    <Tooltip title="Return to homepage to change name">
                        <span>{user?.name}</span>
                    </Tooltip>
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
