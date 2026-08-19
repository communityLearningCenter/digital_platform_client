import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    useTheme,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    TextField,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useQueryClient, useQuery } from "react-query";
import { useEffect, useState } from "react"; 
import { createFilterOptions } from "@mui/material/Autocomplete";
import { fetchStuCountbyAcaYr, fetchStuCountbyGrade, fetchAllStuCountbyLC, fetchKCStuCountbyLC, fetchStuCountbyGender, fetchStudentbyEnrollStatus, fetchPWDStuCountbyGender, fetchTotalCount, fetchAllAcaYrs,
    fetchGradingCountforLPforFirstSession, fetchGradingCountforLPforSecondSession, fetchGradingCountforLPforThirdSession,
    fetchGradingCountforUPforFirstSession, fetchGradingCountforUPforSecondSession, fetchGradingCountforUPforThirdSession} from "../libs/fetcher";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Bar,
    BarChart,
    CartesianGrid ,
    Legend,
    LabelList
} from "recharts";

const GenderColors = ["#6ab2ec", "#f56e9d"]
const EnrolledStatusColors = ["#92d1d1", "#f7f097"]
const LPCOLORS = ["#AED581", "#81D4FA", "#F8BBD0"];
const UPCOLORS = ["#8b9a3e", "#ae928d", "#C86464", "#AAB4C8"];
const GradeColors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#abd9ce"]
const KCStuColors =["#f08621", "#e36888", "#b4b534", "#6698cc", "#bfdff3", "#ff9b28", "#ccd537", "#f055a5", "#fabe37", "#7a88fe", "#ff4040", "#ecade7ff", "#7fe0dcff"]
const AllStuColors =["#b8f079", "#bdaceb", "#f3ced6", "#6698cc", "#a6dde4", "#daa281", "#558a2a", "#df74ab", "#4658a8", "#86aa94", "#973838", "rgb(201, 166, 114)", "rgb(224, 127, 211)"]
const PWDStudentColors = ["#6698cc","#e36888"]
const StatCard = ({ title, value, icon }) => (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ mr: 2, color: "#ff7a18" }}>{icon}</Box>
            <Box>
                <Typography variant="subtitle2" color="text.secondary">
                    {title}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                    {value}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

const StatCard1 = ({ title, value, subtitle, icon }) => (
  <Card elevation={2} sx={{ borderRadius: 2 }}>
    <CardContent sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ mr: 2, color: "#ff7a18" }}>{icon}</Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          {value}
        </Typography>
        {subtitle && (
          <Box>
            {subtitle.map((item, idx) => (
              <Typography key={idx} variant="body2" color="text.secondary">
                <Box component="span" fontWeight={600}>{item.label}:</Box> {item.value}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => `${option.acaYr}`
});

const renderCustomizedLabel = (labelColor = "black") => {
    return ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        value
        }) => {
            if (!value || value === 0 || !percent || percent === 0) 
                return null;

            if (cx == null || cy == null || innerRadius == null || outerRadius == null) 
                return null;
            
            //const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const radiusOffset = innerRadius + (outerRadius - innerRadius) * 0.3;// inside the slice//(outerRadius + 30; // distance outside the slice)
            const ncx = Number(cx);
            const ncy = Number(cy);
            const RADIAN = Math.PI / 180;

            const x = ncx + radiusOffset * Math.cos(-(midAngle ?? 0) * RADIAN);
            const y = ncy + radiusOffset * Math.sin(-(midAngle ?? 0) * RADIAN);

            return (
                <text
                    x={x}
                    y={y}
                    fill={labelColor}
                    textAnchor={x > ncx ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={13}
                >
                    {`${((percent ?? 1) * 100).toFixed(0)}%`}  {/*  {`${name}: ${((percent ?? 1) * 100).toFixed(0)}%`} */}
                </text>
            );
        };
    };

export default function Dashboard() {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const [selectedAcaYr, setSelectedAcaYr] = useState(null);
    const acayr = selectedAcaYr?.acaYr || "";
    const { data: stuCountbyGender } = useQuery(["stuCountbyGender", acayr], fetchStuCountbyGender, { enabled: !!acayr });
    const { data: stuCountbyEnrollStatus } = useQuery(["stuCountbyEnrollStatus", acayr], fetchStudentbyEnrollStatus, { enabled: !!acayr });
    const { data: pwdStudentData} = useQuery(["pwdStudentData", acayr], fetchPWDStuCountbyGender, {enabled: !!acayr});
    const { data: stuCountbyGrade } = useQuery(["stuCountbyGrade", acayr], fetchStuCountbyGrade, { enabled: !!acayr });
    const { data: kcStuCountbyLC } = useQuery(["kcStuCountbyLC", acayr], fetchKCStuCountbyLC, { enabled: !!acayr });
    const { data: stuCountbyLC } = useQuery(["stuCountbyLC", acayr], fetchAllStuCountbyLC, {enabled: !!acayr}); 
    const { data: totalCount = {} } = useQuery(["totalCount", acayr], fetchTotalCount, { enabled: !!acayr });
    const { data: resultCountofFirstSessionLP= {} } = useQuery(["resultCountofFirstSessionLP", acayr], fetchGradingCountforLPforFirstSession, { enabled: !!acayr });
    const { data: resultCountofSecondSessionLP= {} } = useQuery(["resultCountofSecondSessionLP", acayr], fetchGradingCountforLPforSecondSession, { enabled: !!acayr });
    const { data: resultCountofThirdSessionLP= {} } = useQuery(["resultCountofThirdSessionLP", acayr], fetchGradingCountforLPforThirdSession, { enabled: !!acayr });
    const { data: resultCountofFirstSessionUP= {} } = useQuery(["resultCountofFirstSessionUP", acayr], fetchGradingCountforUPforFirstSession, { enabled: !!acayr });
    const { data: resultCountofSecondSessionUP= {} } = useQuery(["resultCountofSecondSessionUP", acayr], fetchGradingCountforUPforSecondSession, { enabled: !!acayr });
    const { data: resultCountofThirdSessionUP= {} } = useQuery(["resultCountofThirdSessionUP", acayr], fetchGradingCountforUPforThirdSession, { enabled: !!acayr });
    //const { data: totalStuCount } = useQuery(["totalStuCount"], fetchTotalStuCount);

    const { data: acayrs} = useQuery(
        ["academicyear"],                 // query key
        () => fetchAllAcaYrs()            // query function
    );

    const enrollStatusData = stuCountbyEnrollStatus ? [
      { name: "Old", count: stuCountbyEnrollStatus.old_count },
      { name: "New", count: stuCountbyEnrollStatus.new_count }
    ] : [];

    const genderCountData = stuCountbyGender ? [
      { name: "Male", count: stuCountbyGender.male },
      { name: "Female", count: stuCountbyGender.female }
    ] : [];

    const stuPWDCountData = pwdStudentData ? [
        { name: "BWD", count: pwdStudentData.pwd_boy_count },
        { name: "GWD", count: pwdStudentData.pwd_girl_count }
    ] : [];

    const FirstSessionLPPieData = resultCountofFirstSessionLP ? [
      { name: "A", count: resultCountofFirstSessionLP.countA },
      { name: "E", count: resultCountofFirstSessionLP.countE },
      { name: "S", count: resultCountofFirstSessionLP.countS }
    ] : [];

    const SecondSessionLPPieData = resultCountofSecondSessionLP ? [
      { name: "A", count: resultCountofSecondSessionLP.countA },
      { name: "E", count: resultCountofSecondSessionLP.countE },
      { name: "S", count: resultCountofSecondSessionLP.countS }
    ] : [];

    const ThirdSessionLPPieData = resultCountofThirdSessionLP ? [
      { name: "A", count: resultCountofThirdSessionLP.countA },
      { name: "E", count: resultCountofThirdSessionLP.countE },
      { name: "S", count: resultCountofThirdSessionLP.countS }
    ] : [];

    const FirstSessionUPPieData = resultCountofFirstSessionUP ? [
      { name: "A", count: resultCountofFirstSessionUP.countA },
      { name: "B", count: resultCountofFirstSessionUP.countB },
      { name: "C", count: resultCountofFirstSessionUP.countC },
      { name: "D", count: resultCountofFirstSessionUP.countD }
    ] : [];

    const SecondSessionUPPieData = resultCountofSecondSessionUP ? [
      { name: "A", count: resultCountofSecondSessionUP.countA },
      { name: "B", count: resultCountofSecondSessionUP.countB },
      { name: "C", count: resultCountofSecondSessionUP.countC },
      { name: "D", count: resultCountofSecondSessionUP.countD }
    ] : [];

    const ThirdSessionUPPieData = resultCountofThirdSessionUP ? [
      { name: "A", count: resultCountofThirdSessionUP.countA },
      { name: "B", count: resultCountofThirdSessionUP.countB },
      { name: "C", count: resultCountofThirdSessionUP.countC },
      { name: "D", count: resultCountofThirdSessionUP.countD }
    ] : [];

    useEffect(() => {
        queryClient.invalidateQueries();
    }, [selectedAcaYr]);

    return (
        <Container sx={{ mt: 20 }}>
            <Box sx={{ p: 3, minHeight: "100vh" }}>
                {/*<Typography variant="h5" fontWeight={600} mb={3}>
                    Dashboard
                </Typography>*/}

                <Box sx={{ width:215, height: 75, mb: 2, backgroundColor: "banner", pb: 2,       // padding bottom
                        borderRadius: 2, borderBottom: "1px solid #e0e0e0",
                    }}>

                    <Autocomplete                        
                        options={acayrs || []}
                        value={selectedAcaYr}   // add this line
                        getOptionLabel={(option) => option?.acaYr || ""}
                        isOptionEqualToValue={(option, value) =>
                            option.acaYr === value.acaYr
                        }
                        filterOptions={filterOptions}
                        onChange={(event, value) => {setSelectedAcaYr(value);}}   
                        renderInput={(params) => (
                            <TextField {...params} label="Academic Year" variant="outlined" sx={{width:200, m:1}} />
                        )}
                    />
                </Box>

                {/* ===== Stats Row ===== */}
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard1
                            title="Count of Students"
                            value={totalCount.totalStuCount}
                            subtitle={[
                                { label: "Male", value: stuCountbyGender?.male ?? 0 },
                                { label: "Female", value: stuCountbyGender?.female ?? 0 }
                            ]}
                            icon={<PeopleIcon fontSize="large" />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard1
                            title="Count of Teachers"
                            value={totalCount.totalTeacherCount}                        
                            icon={<SchoolIcon fontSize="large" />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard1
                            title="Count of Learning Centers"
                            value={totalCount.totalLCCount}
                            icon={<ApartmentIcon fontSize="large" />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard1
                            title="Count of VDCs"
                            value="60"
                            icon={<AssessmentIcon fontSize="large" />}
                        />
                    </Grid>
                </Grid>

                {/* ===== Charts Row ===== */}                
                    {/*<Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 320, width: '365px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    Student Growth
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <LineChart data={studentData}>
                                        <XAxis dataKey="year" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="students"
                                            stroke="#ff7a18"
                                            strokeWidth={3}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>*/}
                {/*<Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    Students Count by Gender in All Learning Center
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Tooltip />
                                        <Pie
                                            data={genderPieData}
                                            innerRadius={60}
                                            outerRadius={90}
                                            dataKey="count"
                                        >
                                            {genderPieData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={GenderColors[index]}
                                            />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                     <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    Students Count by Learning Centers
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            labelLine={true}
                                            label={renderCustomizedLabel}
                                            fill="#8884d8"
                                            dataKey="value"
                                            innerRadius={10}
                                            outerRadius={90}                                                                                  
                                        >
                                            {data.map((entry, index) => (
                                            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsDevtools />
                                        </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid> 
                </Grid>*/}

                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    Student Count by Gender in All Learning Center
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Pie
                                            data={genderCountData}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="count"    
                                            nameKey="name"     
                                            label={renderCustomizedLabel("black")}    
                                            labelLine={false}                            
                                        >
                                            {genderCountData.map((entry, index) => (
                                                <Cell key={index} fill={GenderColors[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    Student Count by Enrollment Status in All Learning Center
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Pie
                                            data={enrollStatusData}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="count"    
                                            nameKey="name"     
                                            label={renderCustomizedLabel("black")}    
                                            labelLine={false}                            
                                        >
                                            {enrollStatusData.map((entry, index) => (
                                                <Cell key={index} fill={EnrolledStatusColors[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    PWD Student Count by Gender in All Learning Center
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Pie
                                            data={stuPWDCountData}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="count"    
                                            nameKey="name"     
                                            label={renderCustomizedLabel("black")}    
                                            labelLine={false}                            
                                        >
                                            {stuPWDCountData.map((entry, index) => (
                                                <Cell key={index} fill={PWDStudentColors[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    First Session Exam Results for Lower Primary Students
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Pie
                                            data={FirstSessionLPPieData}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="count"    
                                            nameKey="name"     
                                            label={renderCustomizedLabel("black")}    
                                            labelLine={false}                            
                                        >
                                            {FirstSessionLPPieData.map((entry, index) => (
                                                <Cell key={index} fill={LPCOLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    Second Session Exam Results for Lower Primary Students
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Pie
                                            data={SecondSessionLPPieData}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="count"
                                            nameKey="name"     
                                            label={renderCustomizedLabel("black")}    
                                            labelLine={false}    
                                        >
                                            {SecondSessionLPPieData.map((entry, index) => (
                                                <Cell key={index} fill={LPCOLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    Third Session Exam Results for Lower Primary Students
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Pie
                                            data={ThirdSessionLPPieData}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="count"
                                            nameKey="name"     
                                            label={renderCustomizedLabel("black")}    
                                            labelLine={false}   
                                        >
                                            {ThirdSessionLPPieData.map((entry, index) => (
                                                <Cell key={index} fill={LPCOLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={2} mb={3}>                            
                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    First Session Exam Results for Other Grades Students
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Pie
                                            data={FirstSessionUPPieData}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="count"
                                            nameKey="name"     
                                            label={renderCustomizedLabel("white")}    
                                            labelLine={false}   
                                        >
                                            {FirstSessionUPPieData.map((entry, index) => (
                                                <Cell key={index} fill={UPCOLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                   Second Session Exam Results for Other Grades Students
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Pie
                                            data={SecondSessionUPPieData}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="count"
                                            nameKey="name"     
                                            label={renderCustomizedLabel("white")}    
                                            labelLine={false}   
                                        >
                                            {SecondSessionUPPieData.map((entry, index) => (
                                                <Cell key={index} fill={UPCOLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '353px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    Third Session Exam Results for Other Grades Students
                                </Typography>
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" />
                                        <Pie
                                            data={ThirdSessionUPPieData}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="count"
                                            nameKey="name"     
                                            label={renderCustomizedLabel("white")}    
                                            labelLine={false}   
                                        >
                                            {ThirdSessionUPPieData.map((entry, index) => (
                                                <Cell key={index} fill={UPCOLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                
                {/* ===== Bar Charts Row ===== */}
                {/* <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={6}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 400, width: '1090px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                Students Count by Grade for All Learning Centers
                                </Typography>

                                <ResponsiveContainer width="100%" height={300}>
                                <BarChart 
                                    data={stuCountbyGrade ?? []}
                                    margin={{ top: 30, right: 20, left: 20, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="grade" />
                                    <YAxis domain={[0, 'dataMax + 20']}/>
                                    <Tooltip />
                                    <Bar dataKey="count" barSize={35} >
                                        <LabelList 
                                            dataKey="count" 
                                            position="top"
                                            fill="black"
                                            fontSize={12}
                                            fontWeight={600}/>
                                        {(stuCountbyGrade ?? []).map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={GradeColors [index]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>    */}   

                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={6}>
                        <Card
                            elevation={2}
                            sx={{
                                borderRadius: 2,
                                height: 450,
                                width: "1090px"
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    mb={2}
                                >
                                    Kids' Club Students Count in All Learning Centers
                                </Typography>

                                <ResponsiveContainer width="100%" height={450}>
                                    <BarChart
                                        data={kcStuCountbyLC ?? []}
                                        margin={{
                                        top: 30,
                                        right: 30,
                                        left: 20,
                                        bottom: 70
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                        dataKey="lcname"
                                        interval={0}
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        />

                                        <YAxis />
                                        <Tooltip />
                                        

                                        {/* Male - bottom part */}
                                        <Bar
                                        dataKey="male"
                                        name="Male"
                                        stackId="students"                                        
                                        barSize={45}
                                        >
                                        <LabelList
                                            dataKey="male"
                                            position="center"
                                            fill="white"
                                            fontSize={12}
                                            fontWeight={600}
                                            formatter={(value) => `M: ${value}`}
                                        />
                                        {(kcStuCountbyLC ?? []).map((entry, index) => (
                                            <Cell
                                            key={`male-${index}`}
                                            fill={KCStuColors[index % KCStuColors.length]}
                                            fillOpacity={0.55}
                                            />
                                        ))}
                                        </Bar>

                                        {/* Female - top part */}
                                        <Bar
                                        dataKey="female"
                                        name="Female"
                                        stackId="students"                                        
                                        barSize={45}
                                        >
                                        <LabelList
                                            dataKey="female"
                                            position="center"
                                            fill="white"
                                            fontSize={12}
                                            fontWeight={600}
                                            formatter={(value) => `F: ${value}`}
                                        />

                                        <LabelList
                                            dataKey="count"
                                            position="top"
                                            fill="black"
                                            fontSize={15}
                                            fontWeight={700}
                                        />

                                        {(kcStuCountbyLC ?? []).map((entry, index) => (
                                            <Cell
                                            key={`female-${index}`}
                                            fill={KCStuColors[index % KCStuColors.length]}                                            
                                            />
                                        ))}
                                        </Bar>
                                    </BarChart>
                                    </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>     

                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={6}>
                        <Card
                            elevation={2}
                            sx={{
                                borderRadius: 2,
                                height: 450,
                                width: "1090px"
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    mb={2}
                                >
                                    Students Count in All Learning Centers
                                </Typography>

                                <ResponsiveContainer width="100%" height={450}>
                                    <BarChart
                                        data={stuCountbyLC ?? []}
                                        margin={{
                                        top: 30,
                                        right: 30,
                                        left: 20,
                                        bottom: 70
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                        dataKey="lcname"
                                        interval={0}
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                        />

                                        <YAxis />
                                        <Tooltip />
                                        

                                        {/* Male - bottom part */}
                                        <Bar
                                        dataKey="male"
                                        name="Male"
                                        stackId="students1"                                        
                                        barSize={45}
                                        >
                                        <LabelList
                                            dataKey="male"
                                            position="center"
                                            fill="white"
                                            fontSize={12}
                                            fontWeight={600}
                                            formatter={(value) => `M: ${value}`}
                                        />
                                        {(stuCountbyLC ?? []).map((entry, index) => (
                                            <Cell
                                            key={`male-${index}`}
                                            fill={AllStuColors[index % AllStuColors.length]}
                                            fillOpacity={0.55}
                                            />
                                        ))}
                                        </Bar>

                                        {/* Female - top part */}
                                        <Bar
                                        dataKey="female"
                                        name="Female"
                                        stackId="students1"                                        
                                        barSize={45}
                                        >
                                        <LabelList
                                            dataKey="female"
                                            position="center"
                                            fill="white"
                                            fontSize={12}
                                            fontWeight={600}
                                            formatter={(value) => `F: ${value}`}
                                        />

                                        <LabelList
                                            dataKey="count"
                                            position="top"
                                            fill="black"
                                            fontSize={15}
                                            fontWeight={700}
                                        />

                                        {(stuCountbyLC ?? []).map((entry, index) => (
                                            <Cell
                                            key={`female-${index}`}
                                            fill={AllStuColors[index % AllStuColors.length]}                                            
                                            />
                                        ))}
                                        </Bar>
                                    </BarChart>
                                    </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>  

                {/* <Grid container spacing={2} mb={3}>                         
                    <Grid item xs={12} md={6}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 450, width: '1090px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                    Students Count in All Learning Centers
                                </Typography>

                                <ResponsiveContainer width="100%" height={340}>
                                <BarChart data={stuCountbyLC ?? []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="lcname"
                                        interval={0}           // show all labels
                                        tick={{ fontSize: 12 }}
                                        angle={-45}            // rotate labels 45 degrees
                                        textAnchor="end"       // anchor for rotated text 
                                        height={100}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" barSize={35} >
                                        <LabelList 
                                            dataKey="count" 
                                            position="top"
                                            fill="black"
                                            fontSize={15}
                                            fontWeight={600}/>
                                        {(stuCountbyLC ?? []).map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={AllStuColors [index]}                                                
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>                  */}
                
            </Box>
        </Container>
    );
}