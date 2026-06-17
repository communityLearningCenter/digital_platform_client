import {
    Alert,
    Box,
    Container,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";
import { postLogin } from "../libs/fetcher"
import { useMutation } from "react-query";
import { useTranslation } from "react-i18next";

export default function Login() {
    
    const usernameInput = useRef();
    const passwordInput = useRef();
    const [error, setError] = useState(null);
    const { t } = useTranslation();
    
    const handleSubmit = () => {
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        if (!username || !password) {
            setError("username and password required");
            return false;
         }
        login.mutate({ username, password });
    };
    const login = useMutation(
        async ({ username, password }) => postLogin(username, password),
        {
            onError: async () => {
                setError("Incorrect username or password");
            },
            onSuccess: async result => {
                setAuth(result.user);
                localStorage.setItem("token", result.token);
                if(result.user.role === "System Admin")
                    navigate("/dashboard");
                else
                    navigate("/home");
            },
        }
    );
    const navigate = useNavigate();    
    const {setAuth } = useApp();
    
    return (    
       <Container sx={{ width:350, height: 300, mt: 25, border: 1, borderRadius: 5, backgroundColor:'banner'}}>
            <Typography variant="h4" sx={{ mt:-6, ml:-3, pt:1, pl:2, color:'#ef6c00', borderRadius: 5, height: 80, width: 250,backgroundColor:'banner' }}>
                {t("header.login")}
            </Typography>
            <Box sx={{pt:-4}}>                
                {error && (
                    <Alert
                        severity="warning"
                        sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        setAuth(true);
                        handleSubmit();
                        //navigate("/");
                    }}>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 2,
                        }}>

                        <TextField
                            inputRef={usernameInput}
                            placeholder={t("login.username")}
                            fullWidth
                            color="secondary"        
                            sx={{ mb: 1 }}
                        />

                        <TextField
                            inputRef={passwordInput}
                            type="password"
                            placeholder={t("login.password")}
                            fullWidth
                            color="secondary"        
                            sx={{ mt:1, mb: 5 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{mt:-2.5, ml:9, maxWidth: 150, backgroundColor:'#ef6c00', color:'banner' }}>
                            {t("login.login1")}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>         
    );
}