import {useApp} from "../ThemedApp";
import { Link as RouterLink } from 'react-router-dom';

import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Link,
    Typography
} from "@mui/material";

import {    
    Menu as MenuIcon,
} from "@mui/icons-material";

export default function Header() {
    const {auth, showDrawer, setShowDrawer} = useApp();    
    const role = auth ? auth.role : "Guest";

    return(
        // <AppBar position="static" sx={{ height: 120 }}>
        //     <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <AppBar position="fixed" sx={{ height: 120, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                
                {/* Left: Menu + Logo */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={() => setShowDrawer(!showDrawer)}
                    sx={{ color: '#ef6c00', height: 30 }}
                >
                    <MenuIcon />
                </IconButton>

                <Box
                    component="img"
                    src="/Logo.png"
                    alt="Logo"
                    sx={{ height: 100, ml: 2, mt: 1 }}
                />
                </Box>

                {/* Right: Nav Links */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Link component={RouterLink} to="/" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }}>Home</Link>
                    {/* <Link href="#" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }}>About</Link>
                    <Link href="#" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }}>Contact</Link> */}
                    {/* Show Sign Up if the User is Un-Registered*/}
                    {role === "Guest" && (
                        <Link component={RouterLink} to="/register" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }}>Sign Up</Link>
                    )}
                    {/* Conditionally show Login / Logout */}
                    {!auth ? (
                        <Link component={RouterLink} to="/" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }}>Login</Link>
                    ) : (
                        <Link component={RouterLink} to="/" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }} 
                        onClick={() => {
                            localStorage.removeItem("token");
                            setAuth(null);
                            navigate("/");
                        }}>
                            Logout</Link>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}