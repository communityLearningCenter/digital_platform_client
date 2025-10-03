import { 
    Alert, 
    Avatar, 
    Box, 
    Container, 
    Typography, 
    IconButton 
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { fetchUser } from "../libs/fetcher";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
    const { id } = useParams();
    const { isLoading, isError, error, data } = useQuery(`users/${id}`, async () => fetchUser(id));

    const [preview, setPreview] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to backend       
        const formData = new FormData();
        formData.append("image", file);
        formData.append("username", data.name); // send username along       
        console.log("data.avatarUrl : ", data.avatarUrl)

        await fetch(`http://localhost:8000/upload-profile?username=${data.name}`, {
            method: "POST",
            body: formData,
            });
    };

    if (isError) {
        return (
            <Box>
                <Alert severity="warning">{error.message}</Alert>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ textAlign: "center" }}>
                Loading..
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 20 }}>
            <Typography 
                variant="h4" 
                sx={{ pl: 2.5, pt: 1, color: '#ef6c00', backgroundColor: 'banner', borderRadius: 5, height: 70, width: 140 }}
            >
                Profile
            </Typography>

            <Box sx={{ bgcolor: "banner", height: 100, borderRadius: 3, mt: -3 }} />

            <Box
                sx={{
                    mb: 4,
                    marginTop: "-50px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    height: 800,
                    borderRadius: 5,
                    bgcolor: "banner",
                }}
            >

                <Box sx={{ position: "relative", display: "inline-block" }}>                    
                    <Avatar
                        src={preview || data.avatarUrl}
                        sx={{
                            mt: -60,
                            width: 140,
                            height: 140,
                            bgcolor: "#ef6c00",
                        }}
                    />

                    {/* Hidden file input */}
                    <input
                        accept="image/*"
                        type="file"
                        id="upload-avatar"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    {/* Overlay */}
                    <label htmlFor="upload-avatar">
                        <Box
                            sx={{
                                mt:-60,
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "140px",     // match Avatar size
                                height: "140px",    // match Avatar size
                                borderRadius: "50%", // ensure circle
                                bgcolor: "rgba(0,0,0,0.5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.3s",
                                cursor: "pointer",
                                "&:hover": {
                                    opacity: 1,
                                },
                            }}
                        >
                            <CameraAlt sx={{ color: "white", fontSize: 32 }} />
                        </Box>
                    </label>
                </Box>

                <Box sx={{ mt: -40, color: "#ef6c00", textAlign: "center" }}>
                    <Typography>{data.name}</Typography>
                    <Typography sx={{ fontSize: "0.8em", color: "text.fade" }}>
                        {data.role}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
