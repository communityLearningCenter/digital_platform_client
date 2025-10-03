import {
    Box,
    Container,
    Button,
    TextField,
    Typography,
    Alert,
    InputLabel,MenuItem, FormControl, FormLabel,
    Select,
    Autocomplete,
    CircularProgress
} from "@mui/material";

import { useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react"; 
import { useMutation, useQuery } from "react-query";
import { fetchLCsbyUser, postStudent, fetchStudent, updateStudent } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";

import { createFilterOptions } from "@mui/material/Autocomplete";
const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => `${option.lcname}`
});

export default function Register() {
    const { setGlobalMsg, auth } = useApp();  
    const { id } = useParams();
    const isEdit = Boolean(id);
    //const [lcname, setLC] = useState('');

    //console.log("auth.id : ", auth.id)
   
    const { data: learningcenters} = useQuery(
        ["learningcenters", auth?.id],         // query key
        () => fetchLCsbyUser(auth?.id),        // query function
        { enabled: !!auth?.id }                // only run if id exists
        );
    
    // Fetch student if edit mode
    const { data: student, isLoading } = useQuery(
        ["student", id],
        () => fetchStudent(id),
        { enabled: isEdit }
    );
    
    // Dropdowns
    const [selectedLC, setSelectedLC] = useState(null);
    const [acayr, setAcaYr] = useState("");

    // Text fields
    const [name, setName] = useState("");
    const [stuID, setStuID] = useState("");
    const [grade, setGrade] = useState("");
    const [gender, setGender] = useState("");
    const [pwd, setPWD] = useState("");
    const [guardianName, setGuardianName] = useState("");
    const [guardianNRC, setGuardianNRC] = useState("");

    // Numbers
    const [familyMember, setFamilyMember] = useState(0);
    const [over18Male, setOver18Male] = useState(0);
    const [over18Female, setOver18Female] = useState(0);
    const [under18Male, setUnder18Male] = useState(0);
    const [under18Female, setUnder18Female] = useState(0);

    // Other dropdowns
    const [stuStatus, setStuStatus] = useState("");
    const [acaReview, setAcaReview] = useState("");
    const [kidsClubStu, setKidsClubStu] = useState("");
    const [dropoutStu, setDropoutStu] = useState("");

    // Errors
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    //if (isLoading) return <CircularProgress />;
    //if (error) return <Alert severity="error">{error}</Alert>;

    const handleChange = (event) => {
        const { name, value } = event.target;

        switch (name) {            
            case 'acayr':
                setAcaYr(value);
                break;
            case 'grade':
                setGrade(value);
                break;
            case 'gender':
                setGender(value);
                break;
            case 'pwd':
                setPWD(value);
                break;
            case 'stuStatus':
                setStuStatus(value);
                break;
            case 'acaReview':
                setAcaReview(value);
                break;
            case 'kidsClubStu':
                setKidsClubStu(value);
                break;
            case 'dropoutStu':
                setDropoutStu(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = () => {
        if (!name || !stuID) {
            setError("Student Name, Student ID required");
            return;
        }

        const payload = {
            lcname: selectedLC?.lcname || "",
            acayr,
            name,
            stuID,
            grade,
            gender,
            pwd,
            guardianName,
            guardianNRC,
            familyMember: parseInt(familyMember, 10) || 0,
            over18Male: parseInt(over18Male, 10) || 0,
            over18Female: parseInt(over18Female, 10) || 0,
            under18Male: parseInt(under18Male, 10) || 0,
            under18Female: parseInt(under18Female, 10) || 0,
            stuStatus,
            acaReview,
            kidsClubStu,
            dropoutStu,
        };

        if (isEdit) {
            update.mutate({ id, data: payload });
        } else {
            create.mutate(payload);
        }
        };

    const handleClear = () => {
        setSelectedLC(null);
        setAcaYr("");
        setName("");
        setStuID("");
        setGrade("");
        setGender("");
        setPWD("");
        setGuardianName("");
        setGuardianNRC("");
        setFamilyMember(0);
        setOver18Male(0);
        setOver18Female(0);
        setUnder18Male(0);
        setUnder18Female(0);
        setStuStatus("");
        setAcaReview("");
        setKidsClubStu("");
        setDropoutStu("");
    };

    const create = useMutation(async data => postStudent(data), {
        onError: async () => {
            setError("Error Occurs");
        },
        onSuccess: async user => {
            setGlobalMsg("Successfully Registered");
            navigate("/students");
        },
    });

    const update = useMutation(({ id, data }) => updateStudent(id, data), {
        onError: () => setError("Error updating student"),
        onSuccess: () => {
            setGlobalMsg("Successfully Updated");
            navigate("/students");
        },
    });

    useEffect(() => {
        if (student) {
            const matchedLC = learningcenters?.find(lc => lc.lcname === student.lcname) || null;
            setSelectedLC(matchedLC);
            setAcaYr(student.acayr || "");
            setName(student.name || "");
            setStuID(student.stuID || "");
            setGrade(student.grade || "");
            setGender(student.gender || "");
            setPWD(student.pwd || "");
            setGuardianName(student.guardianName || "");
            setGuardianNRC(student.guardianNRC || "");
            setFamilyMember(student.familyMember || 0);
            setOver18Male(student.over18Male || 0);
            setOver18Female(student.over18Female || 0);
            setUnder18Male(student.under18Male || 0);
            setUnder18Female(student.under18Female || 0);
            setStuStatus(student.stuStatus || "");
            setAcaReview(student.acaReview || "");
            setKidsClubStu(student.kidsClubStu || "");
            setDropoutStu(student.dropoutStu || "");
        }
    }, [student, learningcenters]);

    return (
        <Container sx={{ mt: 20, width:700}}>
            <Typography variant="h4" sx={{ p:2, mt: 4, color: '#ef6c00', backgroundColor: 'banner', borderRadius: 5, height: 90, width: 365  }}>
                Student Registration
            </Typography>
            <Box sx={{mt:-6,backgroundColor:'banner', borderRadius: 5,}}>            
                {error && (
                    <Alert
                        severity="warning"
                        sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}>                  

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 2, 
                            p:3, 
                            width: 650,                            
                        }}>                   
                        
                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5                            
                        }}>
                            
                            {/* <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelLC">Learning Center</InputLabel>
                                <Select 
                                    name="lcname"
                                    labelId="LabelLC" 
                                    id="formLC"
                                    value={lcname}
                                    label="Learning Center"
                                    onChange={handleChange}                             
                                    fullWidth
                                    >
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Golden Gate"}>Golden Gate</MenuItem>
                                    <MenuItem value={"Bright Hope"}>Bright Hope</MenuItem>
                                    <MenuItem value={"Banner of Wisdom"}>Banner of Wisdom</MenuItem>
                                    <MenuItem value={"Shining Star"}>Shining Star</MenuItem>
                                    <MenuItem value={"Peace Kawchan"}>Peace Kaw Chan</MenuItem>
                                    <MenuItem value={"Peace Della"}>Peace Della</MenuItem>
                                    <MenuItem value={"Cannan"}>Cannan</MenuItem>
                                    <MenuItem value={"Apyin Yay Kyaw"}>Apyin Yay Kyaw</MenuItem>
                                    <MenuItem value={"Northern Star"}>Northern Star</MenuItem>
                                    <MenuItem value={"Injendone"}>Injendone</MenuItem>
                                    <MenuItem value={"Kyarrapatee"}>Kyarrapatee</MenuItem>
                                    <MenuItem value={"Maw Phaung"}>Maw Phaung</MenuItem>
                                    <MenuItem value={"Shwe Set"}>Shwe Set</MenuItem>
                                </Select>
                            </FormControl> */}
                            {/* Learning Center */}
                            <Autocomplete
                                options={learningcenters || []}
                                value={selectedLC}   // add this line
                                getOptionLabel={(option) => option.lcname}
                                filterOptions={filterOptions}
                                onChange={(event, value) => setSelectedLC(value)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Learning Center" variant="outlined" fullWidth />
                                )}
                            />
                            
                        </Box> 

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5,  
                        }}>
                            
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelAcaYr">Academic Year</InputLabel>
                                <Select 
                                    name="acayr"
                                    labelId="LabelAcaYr" 
                                    id="formAcaYr"
                                    label="Academic Year"
                                    value={acayr}                                    
                                    onChange={handleChange}
                                    color="secondary" focused       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"2024 - 2025"}>2024 - 2025</MenuItem>
                                    <MenuItem value={"2025 - 2026"}>2025 - 2026</MenuItem>                                
                                </Select>
                            </FormControl>
                        </Box>                    

                        <TextField
                            label="Student Name"
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
                            label="Student ID"
                            value={stuID}
                            onChange={(e) => setStuID(e.target.value)}
                            fullWidth
                            color="secondary"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                mt: 0.5,
                            }}
                        />   

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5,                        
                        }}>
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelGrade">Grade</InputLabel>
                                <Select 
                                    name="grade"
                                    labelId="LabelGrade" 
                                    id="formGrade"
                                    value={grade}
                                    label="Grade"
                                    onChange={handleChange}
                                    color="secondary" focused       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"KG"}>KG</MenuItem>
                                    <MenuItem value={"G-1"}>G-1</MenuItem>
                                    <MenuItem value={"G-2"}>G-2</MenuItem>
                                    <MenuItem value={"G-3"}>G-3</MenuItem>
                                    <MenuItem value={"G-4"}>G-4</MenuItem>
                                    <MenuItem value={"G-5"}>G-5</MenuItem>
                                    <MenuItem value={"G-6"}>G-6</MenuItem>
                                    <MenuItem value={"G-7"}>G-7</MenuItem>
                                    <MenuItem value={"G-8"}>G-8</MenuItem>
                                    <MenuItem value={"G-9"}>G-9</MenuItem>
                                    <MenuItem value={"G-10"}>G-10</MenuItem>                                
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5,  
                        }}>
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelGender"
                                    >Gender</InputLabel>
                                <Select 
                                    name="gender"
                                    labelId="LabelGender" 
                                    id="formGender"
                                    value={gender}
                                    label="Gender"                                    
                                    onChange={handleChange}                                          
                                    >
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Male"}>Male</MenuItem>
                                    <MenuItem value={"Female"}>Female</MenuItem>                                                             
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5,  
                        }}>
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelPWD">PWD</InputLabel>
                                <Select 
                                    name="pwd"
                                    labelId="LabelPWD" 
                                    id="formPWD"
                                    value={pwd}
                                    label="PWD"
                                    onChange={handleChange}
                                    color="secondary" focused       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Yes"}>Yes</MenuItem>
                                    <MenuItem value={"No"}>No</MenuItem>                                                             
                                </Select>
                            </FormControl>
                        </Box>

                        <TextField
                            label="Guardian Name"
                            value={guardianName}
                            onChange={(e) => setGuardianName(e.target.value)}
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
                            label="Guardian NRC"
                            value={guardianNRC}
                            onChange={(e) => setGuardianNRC(e.target.value)}
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
                            label="No. of Family Member"
                            type="number"
                            value={familyMember}
                            onChange={(e) => setFamilyMember(Number(e.target.value) || 0)}
                            fullWidth
                            color="secondary"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                mt: 0.5,
                            }}
                        />

                        <Box
                            component="fieldset"
                            sx={{
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                p: 2,
                                mt: 0.5
                            }}
                            >
                            <legend style={{ fontSize: '1rem', padding: '0 8px', color:'#636363'}}>
                                No. of Under 18 Years Old
                            </legend>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Male"
                                    type="number"
                                    value={under18Male}
                                    onChange={(e) => setUnder18Male(Number(e.target.value) || 0)}
                                    variant="outlined"
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
                                    label="Female"
                                    type="number"
                                    value={under18Female}
                                    onChange={(e) => setUnder18Female(Number(e.target.value) || 0)}
                                    variant="outlined"
                                    fullWidth
                                    color="secondary"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        mt: 0.5,
                                    }}
                                />
                            </Box>
                        </Box>   

                        <Box
                            component="fieldset"
                            sx={{
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                p: 2,
                                mt: 0.5
                            }}
                            >
                            <legend style={{ fontSize: '1rem', padding: '0 8px', color:'#636363'}}>
                                No. of Over 18 Years Old
                            </legend>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Male"
                                    type="number"
                                    value={over18Male}
                                    onChange={(e) => setOver18Male(Number(e.target.value) || 0)}
                                    variant="outlined"
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
                                    label="Female"
                                    type="number"
                                    value={over18Female}
                                    onChange={(e) => setOver18Female(Number(e.target.value) || 0)}
                                    variant="outlined"
                                    fullWidth
                                    color="secondary"
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        mt: 0.5,
                                    }}
                                />

                            </Box>
                        </Box>     

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5,  
                        }}>
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelStuStatus">Student Status</InputLabel>
                                <Select 
                                    name="stuStatus"
                                    labelId="LabelStuStatus" 
                                    id="formStuStatus"
                                    value={stuStatus}
                                    label="Student Status"
                                    onChange={handleChange}
                                    color="secondary"       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Old"}>Old</MenuItem>
                                    <MenuItem value={"New"}>New</MenuItem>                                                             
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5,  
                        }}>
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelAcaReview">Academic Review</InputLabel>
                                <Select 
                                    name="acaReview"
                                    labelId="LabelAcaReview" 
                                    id="formAcaReview"
                                    value={acaReview}
                                    label="Academic Review"
                                    onChange={handleChange}
                                    color="secondary"       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"KG Passed"}>KG Passed</MenuItem>
                                    <MenuItem value={"KG Failed"}>KG Failed</MenuItem>       
                                    <MenuItem value={"G1 Passed"}>G1 Passed</MenuItem>
                                    <MenuItem value={"G1 Failed"}>G1 Failed</MenuItem>  
                                    <MenuItem value={"G2 Passed"}>G2 Passed</MenuItem>
                                    <MenuItem value={"G2 Failed"}>G2 Failed</MenuItem>        
                                    <MenuItem value={"G3 Passed"}>G3 Passed</MenuItem>
                                    <MenuItem value={"G3 Failed"}>G3 Failed</MenuItem>    
                                    <MenuItem value={"G4 Passed"}>G4 Passed</MenuItem>
                                    <MenuItem value={"G4 Failed"}>G4 Failed</MenuItem>      
                                    <MenuItem value={"G5 Passed"}>G5 Passed</MenuItem>
                                    <MenuItem value={"G5 Failed"}>G5 Failed</MenuItem>          
                                    <MenuItem value={"G6 Passed"}>G6 Passed</MenuItem>
                                    <MenuItem value={"G6 Failed"}>G6 Failed</MenuItem>  
                                    <MenuItem value={"G7 Passed"}>G7 Passed</MenuItem>
                                    <MenuItem value={"G7 Failed"}>G7 Failed</MenuItem>    
                                    <MenuItem value={"G8 Passed"}>G8 Passed</MenuItem>
                                    <MenuItem value={"G8 Failed"}>G8 Failed</MenuItem>      
                                    <MenuItem value={"G9 Passed"}>G9 Passed</MenuItem>
                                    <MenuItem value={"G9 Failed"}>G9 Failed</MenuItem> 
                                    <MenuItem value={"G10 Passed"}>G10 Passed</MenuItem>
                                    <MenuItem value={"G10 Failed"}>G10 Failed</MenuItem>                        
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5, 
                        }}>
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelKidClubStu">Kid's Club Student</InputLabel>
                                <Select 
                                    name="kidsClubStu"
                                    labelId="LabelKidsClubStu" 
                                    id="formKidsClubStu"
                                    value={kidsClubStu}
                                    label="Kid's Club Student"
                                    onChange={handleChange}
                                    color="secondary"       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Yes"}>Yes</MenuItem>
                                    <MenuItem value={"No"}>No</MenuItem>                                                             
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5, 
                        }}>
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelKidClubStu">Dropout Student</InputLabel>
                                <Select 
                                    name="dropoutStu"
                                    labelId="LabelDropoutStu" 
                                    id="formDropoutStu"
                                    value={dropoutStu}
                                    label="Drop Out Student"
                                    onChange={handleChange}
                                    color="secondary"       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Yes"}>Yes</MenuItem>
                                    <MenuItem value={"No"}>No</MenuItem>                                                             
                                </Select>
                            </FormControl>
                        </Box>

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