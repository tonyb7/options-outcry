import { AppBar, Toolbar } from '@mui/material'
import { Typography, Link } from '@mui/material'

const Navbar = () => {
    return (
        <AppBar elevation={0}>
            <Toolbar variant="dense">
                <Typography variant="h6" style={{ flexGrow: 1, whiteSpace: "nowrap" }}>
                    <Link href="/" underline="none" color="inherit">
                        Options Open Outcry
                    </Link>
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
