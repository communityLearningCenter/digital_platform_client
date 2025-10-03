import {
    Box,
    Container,
    Button,
    TextField,
    Typography,
    Alert,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Autocomplete,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

import { useState, useEffect } from "react"; 
import { useMutation, useQuery } from "react-query";
import { fetchLCsbyUser, fetchAllStudents, fetchAllStudentsByLC, postExamResults } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";

import { createFilterOptions } from "@mui/material/Autocomplete";

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => `${option.name} ${option.grade}`
});

const getSubjectsByGrade = (grade) => {
    if (grade == 'KG' || grade == 'G-1' || grade == 'G-2' || grade == 'G-3' || grade == 'G-4' || grade == 'G-5') {
        return ["Myanmar", "English", "Mathematics", "Science", "Society", "Child Rights", "SRHR and Gender", "PSS", "Kid's Club", "Attendance"];
    }
        return ["Myanmar", "English", "Mathematics", "Science", "History", "Geography", "Child Rights", "SRHR and Gender", "PSS", "Kid's Club", "Attendance"];
};

export default function ExamResults() {
    const { auth, setGlobalMsg } = useApp();    
    //const [lcname, setLC] = useState('');
    const [acayr, setAcaYr] = useState('');
    const [session, setSession] = useState('');
    //const [error, setError] = useState(null);
    const navigate = useNavigate();

    //const {data: students, isLoading, error: fetchError} = useQuery("students", fetchAllStudents);
    const fetchFn = auth?.role === "System Administrator" ? fetchAllStudents : fetchAllStudentsByLC;
    
    const { isLoading, isError, error, data: students } = useQuery(
        ["students", auth?.role, auth?.learningCenterId], // query key
        () => fetchFn(auth?.learningCenterId),            // pass LC ID for restricted fetch
        { enabled: !!auth }                               // only run if auth is ready
    );

    const { data: learningcenters} = useQuery(
        ["learningcenters", auth?.id],         // query key
        () => fetchLCsbyUser(auth?.id),        // query function
        { enabled: !!auth?.id }                // only run if id exists
    );

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [subjectRows, setSubjectRows] = useState([]);
    const [selectedLC, setSelectedLC] = useState(null);

    useEffect(() => {
        if (selectedStudent) {            
            console.log("Selected Grade : ", selectedStudent.grade);
            const subjects = getSubjectsByGrade(selectedStudent.grade);
            console.log("subjects : ", subjects)
            setSubjectRows(subjects.map(sub => ({
                subject: sub,
                mark: "",
                grading: ""
            })));
        } else {
            setSubjectRows([]);
        }
    }, [selectedStudent]);

    // Separate table row updates from form field updates
    const handleTableChange = (index, field, value) => {
        setSubjectRows(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'acayr':
                setAcaYr(value);
                break;
            case 'session':
                setSession(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = () => {                
        if (!selectedStudent) {
            setError("Please select a student");
            return;
        }       

        const submittedData = {            
            lcname: selectedLC ? String(selectedLC.lcname) : "", //lcname,
            acayr,
            session,
            student: selectedStudent,
            results: subjectRows
        };        
        create.mutate(submittedData);
    };

    const handleClear = () => {
        setSelectedLC(null);//setLC('');
        setAcaYr('');
        setSession('');
        setSelectedStudent(null);
        setSubjectRows([]);
        setError(null);
    };

    const create = useMutation(async data => postExamResults(data), {
        onError: async () => {
            setError("Error Occurred");
        },
        onSuccess: async () => {
            setGlobalMsg("Exam results are successfully registered");
            navigate("/examresultlist");
        },
    });

    return (
        <Container sx={{ mt: 20, width: 700 }}>
            <Typography variant="h4" sx={{ p: 2, mt: 4, color: '#ef6c00', backgroundColor: 'banner', borderRadius: 5, height: 90, width: 230 }}>
                Exam Result
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

                        {/* <FormControl fullWidth color="secondary">
                            <InputLabel id="LabelLC">Learning Center</InputLabel>
                            <Select
                                name="lcname"
                                labelId="LabelLC"
                                label="Learning Center"
                                id="formLC"
                                value={lcname}
                                onChange={handleFormChange}
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Golden Gate">Golden Gate</MenuItem>
                                <MenuItem value="Bright Hope">Bright Hope</MenuItem>
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

                        {/* Academic Year */}
                        <FormControl fullWidth color="secondary">
                            <InputLabel id="LabelAcaYr">Academic Year</InputLabel>
                            <Select
                                name="acayr"
                                labelId="LabelAcaYr"
                                id="formAcaYr"
                                label="Academic Year"
                                value={acayr}
                                color="secondary" focused   
                                onChange={handleFormChange}
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="2024 - 2025">2024 - 2025</MenuItem>
                                <MenuItem value="2025 - 2026">2025 - 2026</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Student Search */}
                        <Autocomplete
                            options={students || []}
                            label = "Student"
                            getOptionLabel={(option) => option.name}
                            filterOptions={filterOptions}
                            onChange={(event, value) => setSelectedStudent(value)}
                            color='secondary' focused
                            renderInput={(params) => (
                                <TextField {...params} label="Student Name" variant="outlined" fullWidth />
                            )}
                        />

                        {/* Session */}
                        <FormControl fullWidth color="secondary">
                            <InputLabel id="LabelSession">Session</InputLabel>
                            <Select
                                name="session"
                                labelId="LabelSession"
                                id="formSession"
                                label="Session"
                                color='secondary' focused
                                value={session}
                                onChange={handleFormChange}
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="First Time">First Time</MenuItem>
                                <MenuItem value="Second Time">Second Time</MenuItem>
                                <MenuItem value="Third Time">Third Time</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Subjects Table */}
                        {subjectRows.length > 0 && (
                            <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: 'banner', border: "1px solid #b0adac" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ color: "#673ab7", fontSize: "1rem", textAlign:'center'}}>Subject</TableCell>
                                            <TableCell align="center" sx={{ color: "#673ab7", fontSize: "1rem", textAlign:'center'}}>Mark</TableCell>
                                            <TableCell align="center" sx={{ color: "#673ab7", fontSize: "1rem", textAlign:'center'}}>Grading</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {subjectRows.map((row, index) => (
                                            <TableRow key={row.subject}>
                                                <TableCell align="center" sx={{ color: "#673ab7", fontSize: "1rem", textAlign:'center'}}>{row.subject}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        value={row.mark}
                                                        onChange={(e) => handleTableChange(index, "mark", e.target.value)}
                                                        fullWidth
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        value={row.grading}
                                                        onChange={(e) => handleTableChange(index, "grading", e.target.value)}
                                                        fullWidth
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {/* Buttons */}
                        <Box sx={{ display: "flex", gap: 1, mt: 2, ml: 25 }}>
                            <Button type="submit" variant="contained" sx={{ backgroundColor: '#ef6c00', color: 'banner' }}>
                                Submit
                            </Button>
                            <Button type="reset" variant="contained" onClick={handleClear}>
                                Clear
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}
