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

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react"; 
import { useMutation, useQuery } from "react-query";
import { fetchLCsbyUser, postStudent, fetchStudent, fetchStudentbyStuID, updateStudent } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";
import { useTranslation } from "react-i18next";

import { createFilterOptions } from "@mui/material/Autocomplete";
const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => `${option.lcname}`
});

export default function Register() {
    const { setGlobalMsg, auth } = useApp();  
    const { id } = useParams();
    const isEdit = Boolean(id);
   
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

    const { t } = useTranslation();
    
    // Dropdowns
    const [selectedLC, setSelectedLC] = useState(null);
    const [acayr, setAcaYr] = useState("");

    // Text fields
    const [name, setName] = useState("");
    const [stuID, setStuID] = useState("");
    const [grade, setGrade] = useState("");
    const [gender, setGender] = useState("");
    const [pwd, setPWD] = useState("");
    const [pwd_type, setPWDType] = useState("");
    const [guardianName, setGuardianName] = useState("");
    const [guardianNRC, setGuardianNRC] = useState("");
    const [guardianType, setGuardianType] = useState("");

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
            case 'pwd_type':
                setPWDType(value);
                break;
            case 'guardianType':
                setGuardianType(value);
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
        if (!name || !stuID || !grade || !stuStatus || !acaReview || !kidsClubStu || !dropoutStu) {
            setError("Student Name, Student ID and Grade are required");
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
            pwd_type,
            guardianName,                                                                           
            guardianNRC,
            guardianType,
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
        setPWDType("");
        setGuardianName("");
        setGuardianNRC("");
        setGuardianType("");
        setFamilyMember(0);
        setOver18Male(0);
        setOver18Female(0);
        setUnder18Male(0);
        setUnder18Female(0);
        setStuStatus("");
        setAcaReview("");
        setKidsClubStu("");
        setDropoutStu("");
        navigate("/registration/new");
    };

    const create = useMutation(async data => postStudent(data), {        
        onError: async (error) => {
            setError(error.message);
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

    const findStudentByStuID = useMutation(fetchStudentbyStuID, {
        onSuccess: (data) => {
            setName(data.name || "");
            setGrade(data.grade || "");
            setGender(data.gender || "");
            setPWD(data.pwd || "");
            setPWDType(data.pwd_type || "");
            setGuardianName(data.guardianName || "");
            setGuardianNRC(data.guardianNRC || "");       
            setGuardianType(data.guardianType || "");
            setFamilyMember(data.familyMember || "");
            setUnder18Male(data.under18Male || 0);   
            setUnder18Female(data.under18Female || 0);
            setOver18Male(data.over18Male || 0);   
            setOver18Female(data.over18Female || 0);
            setStuStatus(data.stuStatus || "");
        },
        onError: () => {
            // Optional: return message if not found
            setGlobalMsg("Student not found. New registration.");
        }
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
            setPWDType(student.pwd_type || "");
            setGuardianName(student.guardianName || "");
            setGuardianNRC(student.guardianNRC || "");
            setGuardianType(student.guardianType || "");
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
            <Typography variant="h4" sx={{ p:2, mt: 4, color: '#ef6c00', backgroundColor: 'banner', borderRadius: 5, height: 90, width: 420  }}>
                {t("stuReg.stuRegistration")}
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
                            {/* Learning Center */}
                            <Autocomplete
                                options={learningcenters || []}
                                value={selectedLC}   // add this line
                                getOptionLabel={(option) => option.lcname}
                                filterOptions={filterOptions}
                                onChange={(event, value) => setSelectedLC(value)}
                                renderInput={(params) => (
                                    <TextField {...params} label={t("stuReg.lcname")} variant="outlined" fullWidth />
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
                                <InputLabel id="LabelAcaYr">{t("stuReg.academicyr")}</InputLabel>
                                <Select 
                                    name="acayr"
                                    labelId="LabelAcaYr" 
                                    id="formAcaYr"
                                    label="Academic Year"
                                    value={acayr}                                    
                                    onChange={handleChange}
                                    color="secondary" focused    
                                    required
                                    error={!acayr}
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"2024 - 2025"}>2024 - 2025</MenuItem>
                                    <MenuItem value={"2025 - 2026"}>2025 - 2026</MenuItem> 
                                    <MenuItem value={"2026 - 2027"}>2026 - 2027</MenuItem>                               
                                </Select>
                                {!acayr && (
                                <Typography variant="caption" color="error">
                                    {t("stuReg.academicyrRequiredText")}
                                </Typography>                              
                            )}
                            </FormControl>
                        </Box>    

                        <TextField
                            label={t("stuReg.stuID")}
                            value={stuID}
                            onChange={(e) => setStuID(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key === "Enter" && stuID) {
                                    e.preventDefault();
                                    findStudentByStuID.mutate(stuID);
                                }
                            }}
                            onBlur={() => {
                                if (stuID) {
                                    findStudentByStuID.mutate(stuID);
                                }
                            }}
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
                            label={t("stuReg.stuName")}
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

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5,                        
                        }}>
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelGrade">{t("stuReg.grade")}</InputLabel>
                                <Select 
                                    name="grade"
                                    labelId="LabelGrade" 
                                    id="formGrade"
                                    value={grade}
                                    label="Grade"
                                    onChange={handleChange}
                                    color="secondary" focused    
                                    required   
                                    error={!grade}
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Preschool"}>Preschool</MenuItem>
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
                                    <MenuItem value={"G-11"}>G-11</MenuItem> 
                                    <MenuItem value={"G-12"}>G-12</MenuItem>                                
                                </Select>
                                {!grade && (
                                <Typography variant="caption" color="error">
                                    {t("stuReg.gradeRequiredText")}
                                </Typography>
                            )}
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
                                    >{t("stuReg.gender")}</InputLabel>
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
                                <InputLabel id="LabelPWD">{t("stuReg.pwd")}</InputLabel>
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

                        {pwd === "Yes" && (
                            <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                mt: 0.5,  
                            }}>
                                <FormControl fullWidth color="secondary">
                                    <InputLabel id="LabelPWDType">{t("stuReg.pwdtypes")}</InputLabel>
                                    <Select 
                                        name="pwd_type"
                                        labelId="LabelPWDType" 
                                        id="formPWDType"
                                        value={pwd_type}
                                        label="PWD Types"
                                        onChange={handleChange}
                                        color="secondary" focused       
                                        fullWidth>
                                        <MenuItem value={"visual"}>Visual Impairment</MenuItem>
                                        <MenuItem value={"hearing"}>Hearing Impairment</MenuItem>
                                        <MenuItem value={"physical"}>Physical Disability</MenuItem>    
                                        <MenuItem value={"intellectual"}>Intellectual Disability</MenuItem>  
                                    </Select>
                                </FormControl>
                            </Box>
                        )}

                        <TextField
                            label={t("stuReg.guardianName")}
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
                            label={t("stuReg.guardianNRC")}
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

                        <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 0.5,  
                        }}>
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelPWD">{t("stuReg.guardianType")}</InputLabel>
                                <Select 
                                    name="guardianType"
                                    labelId="LabelGuardianType" 
                                    id="formGuardianType"
                                    value={guardianType}
                                    label="Guardian Type"
                                    onChange={handleChange}
                                    color="secondary" focused       
                                    fullWidth>
                                    <MenuItem value={"relative"}>{t("stuReg.relative")}</MenuItem>
                                    <MenuItem value={"parents"}>{t("stuReg.parent")}</MenuItem>                                    
                                </Select>
                            </FormControl>
                        </Box>

                        <TextField
                            label={t("stuReg.familymemeberCount")}
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
                                {t("stuReg.under18Count")}
                            </legend>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label={t("stuReg.under18MaleCount")}
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
                                    label={t("stuReg.under18FemaleCount")}
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
                                {t("stuReg.over18Count")}
                            </legend>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label={t("stuReg.over18MaleCount")}
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
                                    label={t("stuReg.over18FemaleCount")}
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
                                <InputLabel id="LabelStuStatus">{t("stuReg.studentStatus")}</InputLabel>
                                <Select 
                                    name="stuStatus"
                                    labelId="LabelStuStatus" 
                                    id="formStuStatus"
                                    value={stuStatus}
                                    label="Student Status"
                                    onChange={handleChange}
                                    required
                                    error={!stuStatus}
                                    color="secondary"       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Old"}>{t("stuReg.oldStu")}</MenuItem>
                                    <MenuItem value={"New"}>{t("stuReg.newStu")}</MenuItem>                                                             
                                </Select>
                                {!stuStatus && (
                                <Typography variant="caption" color="error">
                                    {t("stuReg.studentStatusRequiredText")}
                                </Typography>    
                            )} 
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
                                <InputLabel id="LabelAcaReview">{t("stuReg.academicReview")}</InputLabel>
                                <Select 
                                    name="acaReview"
                                    labelId="LabelAcaReview" 
                                    id="formAcaReview"
                                    value={acaReview}
                                    label="Academic Review"
                                    onChange={handleChange}
                                    required
                                    error={!acaReview}
                                    color="secondary"       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"PS"}>{t("stuReg.ps")}</MenuItem>
                                    <MenuItem value={"PS Passed"}>{t("stuReg.psPass")}</MenuItem>
                                    <MenuItem value={"PS Failed"}>{t("stuReg.psFail")}</MenuItem>
                                    <MenuItem value={"KG Passed"}>{t("stuReg.kgPass")}</MenuItem>
                                    <MenuItem value={"KG Failed"}>{t("stuReg.kgFail")}</MenuItem>       
                                    <MenuItem value={"G1 Passed"}>{t("stuReg.g1Pass")}</MenuItem>
                                    <MenuItem value={"G1 Failed"}>{t("stuReg.g1Fail")}</MenuItem>  
                                    <MenuItem value={"G2 Passed"}>{t("stuReg.g2Pass")}</MenuItem>
                                    <MenuItem value={"G2 Failed"}>{t("stuReg.g2Fail")}</MenuItem>        
                                    <MenuItem value={"G3 Passed"}>{t("stuReg.g3Pass")}</MenuItem>
                                    <MenuItem value={"G3 Failed"}>{t("stuReg.g3Fail")}</MenuItem>    
                                    <MenuItem value={"G4 Passed"}>{t("stuReg.g4Pass")}</MenuItem>
                                    <MenuItem value={"G4 Failed"}>{t("stuReg.g4Fail")}</MenuItem>      
                                    <MenuItem value={"G5 Passed"}>{t("stuReg.g5Pass")}</MenuItem>
                                    <MenuItem value={"G5 Failed"}>{t("stuReg.g5Fail")}</MenuItem>          
                                    <MenuItem value={"G6 Passed"}>{t("stuReg.g6Pass")}</MenuItem>
                                    <MenuItem value={"G6 Failed"}>{t("stuReg.g6Fail")}</MenuItem>  
                                    <MenuItem value={"G7 Passed"}>{t("stuReg.g7Pass")}</MenuItem>
                                    <MenuItem value={"G7 Failed"}>{t("stuReg.g7Fail")}</MenuItem>    
                                    <MenuItem value={"G8 Passed"}>{t("stuReg.g8Pass")}</MenuItem>
                                    <MenuItem value={"G8 Failed"}>{t("stuReg.g8Fail")}</MenuItem>      
                                    <MenuItem value={"G9 Passed"}>{t("stuReg.g9Pass")}</MenuItem>
                                    <MenuItem value={"G9 Failed"}>{t("stuReg.g9Fail")}</MenuItem> 
                                    <MenuItem value={"G10 Passed"}>{t("stuReg.g10Pass")}</MenuItem>
                                    <MenuItem value={"G10 Failed"}>{t("stuReg.g10Fail")}</MenuItem>    
                                    <MenuItem value={"G11 Passed"}>{t("stuReg.g11Pass")}</MenuItem>
                                    <MenuItem value={"G11 Failed"}>{t("stuReg.g11Fail")}</MenuItem>    
                                    <MenuItem value={"G12 Passed"}>{t("stuReg.g12Pass")}</MenuItem>
                                    <MenuItem value={"G12 Failed"}>{t("stuReg.g12Fail")}</MenuItem>                        
                                </Select> 
                                {!acaReview && (
                                <Typography variant="caption" color="error">
                                    {t("stuReg.academicReviewRequiredText")}
                                </Typography>    
                            )} 
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
                                <InputLabel id="LabelKidClubStu">{t("stuReg.kidsclubStudent")}</InputLabel>
                                <Select 
                                    name="kidsClubStu"
                                    labelId="LabelKidsClubStu" 
                                    id="formKidsClubStu"
                                    value={kidsClubStu}
                                    label={t("stuReg.kidsclubStudent")}
                                    onChange={handleChange}
                                    required
                                    error={!kidsClubStu}
                                    color="secondary"       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Yes"}>{t("stuReg.yes")}</MenuItem>
                                    <MenuItem value={"No"}>{t("stuReg.no")}</MenuItem>                                                             
                                </Select>
                                {!kidsClubStu && (
                                <Typography variant="caption" color="error">
                                    {t("stuReg.kidsclubStuRequiredText")}
                                </Typography>    
                            )} 
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
                                <InputLabel id="LabelKidClubStu">{t("stuReg.dropoutStudent")}</InputLabel>
                                <Select 
                                    name="dropoutStu"
                                    labelId="LabelDropoutStu" 
                                    id="formDropoutStu"
                                    value={dropoutStu}
                                    label={t("stuReg.dropoutStudent")}
                                    onChange={handleChange}
                                    required
                                    error={!dropoutStu}
                                    color="secondary"       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Yes"}>{t("stuReg.yes")}</MenuItem>
                                    <MenuItem value={"No"}>{t("stuReg.no")}</MenuItem>                                                             
                                </Select>
                                {!dropoutStu && (
                                <Typography variant="caption" color="error">
                                    {t("stuReg.dropoutStuRequiredText")}
                                </Typography>    
                            )} 
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
                                {t("stuReg.submit")}                               
                            </Button>
                            <Button
                                type="reset"
                                variant="contained"
                                onClick={handleClear}>
                                {t("stuReg.clear")}                                     
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Container>        
    );
}