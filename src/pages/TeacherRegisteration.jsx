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

import { fetchAllLCs, postTeacher, fetchTeacher, updateTeacher } from "../libs/fetcher";
import { useEffect, useRef, useState } from "react"; 
import { useMutation, useQuery } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";

import { createFilterOptions } from "@mui/material/Autocomplete";

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => `${option.lcname}`
});

export default function TeacherRegisteration() {
    const { setGlobalMsg } = useApp();        
    const { id } = useParams();
    const isEdit = Boolean(id);
    
    //const nameInput = useRef(); 
    //const nrcInput = useRef();
    //const addressInput = useRef();
    //const phnoInput = useRef();

    const [name, setName] = useState("");
    const [nrc, setNrc] = useState("");
    const [address, setAddress] = useState("");
    const [phno, setPhno] = useState("");

    const [position, setPosition] = useState(''); 
    const [status, setStatus] = useState(''); 
    const {data: learningcenters, isLoading, error: fetchError} = useQuery("learningcenters", fetchAllLCs);   
    const [selectedLC, setSelectedLC] = useState(null);    
    const [joinDate, setJoinDate] = useState(null); 

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch teacher if edit mode
    const { data: teacher } = useQuery(
        ["teacher", id],
        () => fetchTeacher(id),
        { enabled: isEdit }
    );

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
            // const name = nameInput.current.value;
            // const nrc = nrcInput.current.value;
            // const address = addressInput.current.value;
            // const phno = phnoInput.current.value;            
    
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
            if (isEdit) {
                update.mutate({ id, data: submittedData });
            } else {
                create.mutate(submittedData);
            }
        };
    
        const handleClear = () =>{
            setName("");
            setNrc("");
            setAddress("");
            setPhno("");
            setPosition('');
            setSelectedLC(null);
            setStatus ('');
            setJoinDate(null);   
            setError(null);        
            navigate("/teachersregisteration"); 
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

        const update = useMutation(({ id, data }) => updateTeacher(id, data), {
            onError: () => setError("Error updating teacher"),
            onSuccess: () => {
                setGlobalMsg("Successfully Updated");
                navigate("/teachers");
            },
        });

        

        useEffect(() => {
            if (teacher && learningcenters) {
                const matchedLC =
                learningcenters.find(lc => lc.lcname === teacher.lcname) || null;
                setSelectedLC(matchedLC);
                setName(teacher.teacherName ?? "");
                setNrc(teacher.teacherNRC ?? "");
                setAddress(teacher.address ?? "");
                setPhno(teacher.phnumber ?? "");
                setPosition(teacher.position ?? "");
                setStatus(teacher.status ?? "");
                setJoinDate(teacher.joinDate ? new Date(teacher.joinDate) : null);
            }
        }, [teacher, learningcenters]);
    
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
                                //inputRef={nameInput}      
                                value={name}  
                                onChange={(e) => setName(e.target.value)}                   
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
                                //inputRef={nrcInput}       
                                value={nrc}       
                                onChange={(e) => setNrc(e.target.value)}                       
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
                                value={selectedLC}
                                onChange={(event, value) => setSelectedLC(value)}
                                isOptionEqualToValue={(option, value) =>
                                    option.id === value.id
                                }
                                color='secondary' focused
                                renderInput={(params) => (
                                    <TextField {...params} label="Learning Center" variant="outlined" fullWidth />
                                )}
                            />

                            <TextField
                                label="Address"                        
                                //inputRef={addressInput}          
                                value={address}       
                                onChange={(e) => setAddress(e.target.value)}                 
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
                                //inputRef={phnoInput}     
                                value={phno}       
                                onChange={(e) => setPhno(e.target.value)}                         
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
                                    format="dd/MM/yyyy"
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