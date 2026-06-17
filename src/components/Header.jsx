import {useApp} from "../ThemedApp";
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Link,
    Typography,
    Select,
    MenuItem
} from "@mui/material";

import {    
    Menu as MenuIcon,
} from "@mui/icons-material";

export default function Header() {
    const {auth, showDrawer, setShowDrawer} = useApp();    
    const role = auth ? auth.role : "Guest";
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (event) => {
    const lang = event.target.value;

    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
};

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
                <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                    <Link component={RouterLink} to="/" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }}>{t("header.home")}</Link>
                    {/* <Link href="#" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }}>About</Link>
                    <Link href="#" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }}>Contact</Link> */}
                    {/* Show Sign Up if the User is Un-Registered*/}
                    {role === "System Admin" && (
                        <Link component={RouterLink} to="/register" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }}>{t("header.signup")}</Link>
                    )}
                    {/* Conditionally show Login / Logout */}
                    {!auth ? (
                        <Link component={RouterLink} to="/" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }}>{t("header.login")}</Link>
                    ) : (
                        <Link component={RouterLink} to="/" color="#ef6c00" underline="none" sx={{ p: 2, fontSize: 20 }} 
                            onClick={() => {
                                localStorage.removeItem("token");
                                setAuth(null);
                                navigate("/");
                            }}>
                            {t("header.logout")}
                        </Link>
                    )}
                    <Select
                        value={i18n.language}
                        onChange={handleLanguageChange}
                        size="small"
                        sx={{
                            color: "#ef6c00",
                            ml: 2,
                            minWidth: 100,
                            fontSize: 20
                        }}
                        >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="mm">မြန်မာ</MenuItem>
                    </Select>
                </Box>
                
            </Toolbar>
        </AppBar>
    )
}