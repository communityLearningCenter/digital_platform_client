import {
    Box,
    Container,
    Button,
    TextField,
    Typography,
    Alert,
    InputLabel,MenuItem, FormControl, 
    Select,
} from "@mui/material";

import { useRef, useState } from "react"; 
import { useMutation } from "react-query";
import { postStudent } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";

export default function KidsClubReport() {
    const handleSubmit = () => {                
        const name = nameInput.current.value;
        const stuID = stuIDInput.current.value;
        const gurdianName = gurdianNameInput.current.value;
        const gurdianNRC = gurdianNRCInput.current.value;
        const familyMember = parseInt(familyNoInput.current.value,10);
        const over18 = parseInt(over18Input.current.value,10);
        const under18 = parseInt(under18Input.current.value,10);

        if (!name || !stuID ) {
            setError("Student Name, Student ID required");
            return false;
        }
        create.mutate({ lcname, acayr, name, stuID, grade, gender, pwd, gurdianName, gurdianNRC, familyMember, over18, under18, acaReview, kidsClubStu, dropoutStu });
    };
}