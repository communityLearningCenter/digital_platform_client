import {
    Box,
    Container,
    Button,
    TextField,
    Typography,
    Alert,
    InputLabel,MenuItem, FormControl,
    Select,
    Autocomplete
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { fetchAllLCs, postTeacher } from "../libs/fetcher";
import { useRef, useState } from "react"; 
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";

import { createFilterOptions } from "@mui/material/Autocomplete";

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => `${option.lcname}`
});

export default function TeacherRegisteration() {
    const { setGlobalMsg } = useApp();        
    
    const nameInput = useRef(); 
    const nrcInput = useRef();
    const [position, setPosition] = useState(''); 
    const [status, setStatus] = useState(''); 
    const {data: learningcenters, isLoading, error: fetchError} = useQuery("learningcenters", fetchAllLCs);    
    const [selectedLC, setSelectedLC] = useState(null);
    const addressInput = useRef();
    const phnoInput = useRef();
    const [joinDate, setJoinDate] = useState(); 

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
    
            switch (name) {
                case 'position':
                    setPosition(value);
                    break;
                case 'status':
                    setStatus(value);
                    break;
                case 'joinDate':
                    setJoinDate(value);
                    break;                
                default:
                    break;
            }
        };
    
        const handleSubmit = () => {                
            const name = nameInput.current.value;
            const nrc = nrcInput.current.value;
            const address = addressInput.current.value;
            const phno = phnoInput.current.value;            
    
            if (!name) {
                setError("Teacher Name required");
                return false;
            }
            const submittedData = {
                name,
                nrc,
                position,
                status,
                address,
                phno,
                joinDate,
                learningcenter: selectedLC,                
            };  
            create.mutate(submittedData);
        };
    
        const handleClear = () =>{
            setPosition('');
            setSelectedLC(null);
            setStatus ('');
            setJoinDate(null);   
            setError(null);         
        }
    
        const create = useMutation(async data => postTeacher(data), {
            onError: async () => {
                setError("Error Occurs");
            },
            onSuccess: async user => {
                setGlobalMsg("Teachers Successfully Registered");
                navigate("/teachers");
            },
        });
    
        return (
            <Container sx={{ mt: 20, width: 700 }}>
                <Typography variant="h4" sx={{ p: 2, mt: 4, color: '#ef6c00', backgroundColor: 'banner', borderRadius: 5, height: 90, width: 175 }}>
                    Teachers
                </Typography>
                <Box sx={{ mt: -6, backgroundColor: 'banner', borderRadius: 5 }}>
                    {error && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2, p: 3, width: 650 }}>
                            <TextField
                                label="Name"                        
                                inputRef={nameInput}                            
                                fullWidth
                                color="secondary"    
                                sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                mt: 0.5,  
                            }}
                            />  

                            <TextField
                                label="NRC"                        
                                inputRef={nrcInput}                            
                                fullWidth
                                color="secondary"    
                                sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                mt: 0.5,  
                            }}
                            />  

                            {/* Position */}
                            <FormControl fullWidth color="secondary" sx={{mt:1}}>
                                <InputLabel id="LabelPosition">Position</InputLabel>
                                <Select
                                    name="position"
                                    labelId="LabelPosition"
                                    id="formPosition"
                                    label="Position"
                                    value={position}
                                    color="secondary" focused   
                                    onChange={handleChange}
                                >
                                    <MenuItem value=""></MenuItem>
                                    <MenuItem value="Volunteer Teacher">Volunteer Teacher</MenuItem>
                                    <MenuItem value="Kid's Club Teacher">Kid's Club Teacher</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Status */}
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelStatus">Status</InputLabel>
                                <Select
                                    name="status"
                                    labelId="LabelStatus"
                                    id="formStatus"
                                    label="Status"
                                    value={status}
                                    color="secondary" focused   
                                    onChange={handleChange}
                                >
                                    <MenuItem value=""></MenuItem>
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Learning Center */}
                            <Autocomplete
                                options={learningcenters || []}
                                label = "Learning Centers"
                                getOptionLabel={(option) => option.lcname}
                                filterOptions={filterOptions}
                                onChange={(event, value) => setSelectedLC(value)}
                                color='secondary' focused
                                renderInput={(params) => (
                                    <TextField {...params} label="Learning Center" variant="outlined" fullWidth />
                                )}
                            />

                            <TextField
                                label="Address"                        
                                inputRef={addressInput}                            
                                fullWidth
                                color="secondary"    
                                sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                mt: 0.5,  
                            }}
                            />  

                            <TextField
                                label="Phone Number"                        
                                inputRef={phnoInput}                            
                                fullWidth
                                color="secondary"    
                                sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                mt: 0.5,  
                            }}
                            />  

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                {/* <DatePicker
                                    label="Join Date"
                                    value={joinDate}
                                    onChange={(newValue) => setJoinDate(newValue)}
                                    renderInput={(params) => <TextField {...params} />}
                                /> */}
                                <DatePicker
                                    label="Join Date"
                                    value={joinDate}
                                    onChange={(newValue) => setJoinDate(newValue)}
                                    slotProps={{
                                        field: {
                                            fullWidth: true,
                                            color: "secondary"
                                        }
                                    }}
                                />
                            </LocalizationProvider>

                            <Box
                                sx={{
                                    display: "flex",                           
                                    gap: 1,
                                    mt: 2,
                                    ml: 25
                                }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{backgroundColor:'#ef6c00', color:'banner'}}>
                                    Submit                                
                                </Button>
                                <Button
                                    type="reset"
                                    variant="contained"
                                    onClick={handleClear}>
                                    Clear                                
                                </Button>
                            </Box>        
                        </Box>
                    </form>
                </Box>
            </Container>
        );
}