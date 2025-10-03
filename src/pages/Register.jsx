import {
    Box,
    Container,
    Button,
    TextField,
    Typography,
    Alert,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Autocomplete
} from "@mui/material";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { postUser, fetchAllLCs } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";

export default function Register() {
    const { setGlobalMsg } = useApp();
    const nameInput = useRef();
    const passwordInput = useRef();
    const [role, setRole] = useState("");
    const [selectedLC, setSelectedLC] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch Learning Centers
    const { data: learningCenters } = useQuery("learningCenters", fetchAllLCs);

    const handleSubmit = () => {
        const name = nameInput.current.value;
        const password = passwordInput.current.value;

        if (!name || !role || !password) {
            setError("Name, Role, and Password are required");
            return;
        }

        if (role === "Volunteer Teacher" && !selectedLC) {
            setError("Learning Center is required for Volunteer Teacher");
            return;
        }

        const payload = {
            name,
            role,
            password,
            learningCenterId: role === "Volunteer Teacher" ? selectedLC?.id : null,
        };

        create.mutate(payload);
    };

    const create = useMutation(async data => postUser(data), {
        onError: () => setError("Cannot create account"),
        onSuccess: () => {
            setGlobalMsg("User Account Created");
            navigate("/login");
        },
    });

    return (
        <Container maxWidth="sm" sx={{ mt: 20 }}>
            <Typography variant="h4" sx={{ pl:2.5, pt:1.5, color:'#ef6c00', backgroundColor: 'banner', borderRadius: 5, height: 80, width: 170 }}>
                Register
            </Typography>
            <Box sx={{ borderRadius: 5, height: 300 , width:530, bgcolor: "banner", mt: -9 }}>
                {error && <Alert severity="warning" sx={{ mt: 2 }}>{error}</Alert>}

                <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5, pl:3 }}>

                        <TextField
                            inputRef={nameInput}
                            placeholder="Name"
                            color="secondary"
                            sx={{width: 470, pt:3}}
                        />

                        {/* Role Dropdown */}
                        <FormControl fullWidth color="secondary">
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                label="Role"
                                sx={{width:470}}
                            >
                                <MenuItem value="System Admin">System Admin</MenuItem>
                                <MenuItem value="Volunteer Teacher">Volunteer Teacher</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Show Learning Center only if role = Volunteer Teacher */}
                        {role === "Volunteer Teacher" && (
                            <Autocomplete
                                options={learningCenters || []}
                                getOptionLabel={(option) => option.lcname}
                                onChange={(e, value) => setSelectedLC(value)}
                                renderInput={(params) => <TextField {...params} label="Learning Center" variant="outlined" />}
                            />
                        )}

                        <TextField
                            inputRef={passwordInput}
                            type="password"
                            placeholder="Password"
                            color="secondary"
                            sx={{width:470 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 1, ml: 17, maxWidth: 200, backgroundColor:'#ef6c00', color:'banner' }}
                        >
                            Register
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}