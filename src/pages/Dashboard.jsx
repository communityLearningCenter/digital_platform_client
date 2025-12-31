import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    useTheme,
    Container
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useQuery } from "react-query";
import { fetchStuCountbyAcaYr, fetchStuCountbyGrade, fetchKCStuCountbyLC, fetchStuCountbyGender, fetchTotalCount, 
    fetchGradingCountforLPforFirstSession, fetchGradingCountforLPforSecondSession,
    fetchGradingCountforUPforFirstSession, fetchGradingCountforUPforSecondSession,} from "../libs/fetcher";
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
import {RechartsDevtools} from '@recharts/devtools';

// Dummy data (replace with API later)

const studentData = [
    { year: "2021", students: 800 },
    { year: "2022", students: 900 },
    { year: "2023", students: 1000 },
    { year: "2024", students: 1150 },
    { year: "2025", students: 1240 },
    { year: "2026", students: 800 }    
];

const examDataforLowerPrimary = [
    { name: "A", value: 100 },
    { name: "E", value: 820 },
    { name: "S", value: 120 }
];

const examDataforUpperPrimary = [
    { name: "A", value: 100 },
    { name: "B", value: 820 },
    { name: "C", value: 120 },
    { name: "D", value: 120 }
];

const barChartData = [
    { lcname: "LC1", students: 120 },
    { lcname: "LC2", students: 180 },
    { lcname: "LC3", students: 90 },
    { lcname: "LC4", students: 250 },
    { lcname: "LC5", students: 300 },
];

const data = [
    { name: 'Group 1', value: 400 },
    { name: 'Group 2', value: 300 },
    { name: 'Group 3', value: 300 },
    { name: 'Group 4', value: 200 },
    { name: 'Group 5', value: 400 },
    { name: 'Group 6', value: 300 },
    { name: 'Group 7', value: 300 },
    { name: 'Group 8', value: 200 },
    { name: 'Group 9', value: 400 },
    { name: 'Group 10', value: 300 },
    { name: 'Group 11', value: 300 },
    { name: 'Group 12', value: 200 },
    { name: 'Group 13', value: 200 },
];

const GenderColors = ["#6fa8dc", "#e8bad5"]
//const LPCOLORS = ["#b0ce44ff", "#89c7FF", "#EC9BE1"];
//const UPCOLORS = ["#A4CFE4", "#B0D1BC", "#A181C6", "#AF9293"]
const LPCOLORS = ["#AED581", "#81D4FA", "#F8BBD0"];
const UPCOLORS = ["#8b9a3e", "#ae928d", "#C86464", "#AAB4C8"];
const GradeColors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#abd9ce"]
const KCStuColors =["#f08621", "#e36888", "#b4b534", "#6698cc", "#bfdff3", "#ff9b28", "#ccd537", "#f055a5", "#fabe37", "#7a88fe", "#ff4040", "#ecade7ff", "#7fe0dcff"]
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
    const { data: stuCountbyGender } = useQuery(["stuCountbyGender"], fetchStuCountbyGender);
    const { data: stuCountbyGrade } = useQuery(["stuCountbyGrade"], fetchStuCountbyGrade);
    const { data: kcStuCountbyLC } = useQuery(["kcStuCountbyLC"], fetchKCStuCountbyLC);
    const { data: totalCount = {}, isLoading } = useQuery(["totalCount"], fetchTotalCount);
    const { data: resultCountofFirstSessionLP= {} } = useQuery(["resultCountofFirstSessionLP"], fetchGradingCountforLPforFirstSession);
    const { data: resultCountofSecondSessionLP= {} } = useQuery(["resultCountofSecondSessionLP"], fetchGradingCountforLPforSecondSession);
    const { data: resultCountofFirstSessionUP= {} } = useQuery(["resultCountofFirstSessionUP"], fetchGradingCountforUPforFirstSession);
    const { data: resultCountofSecondSessionUP= {} } = useQuery(["resultCountofSecondSessionUP"], fetchGradingCountforUPforSecondSession);
    //const { data: totalStuCount } = useQuery(["totalStuCount"], fetchTotalStuCount);

    const genderPieData = stuCountbyGender ? [
      { name: "Male", count: stuCountbyGender.male },
      { name: "Female", count: stuCountbyGender.female }
    ] : [];

    const stuCountbyLCsPieData = stuCountbyGender ? [
      { name: "Male", count: stuCountbyGender.male },
      { name: "Female", count: stuCountbyGender.female }
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

    return (
        <Container sx={{ mt: 20 }}>
            <Box sx={{ p: 3, minHeight: "100vh" }}>
                {/*<Typography variant="h5" fontWeight={600} mb={3}>
                    Dashboard
                </Typography>*/}

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
                                            data={examDataforLowerPrimary}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="value"
                                            nameKey="name"     
                                            label={renderCustomizedLabel("black")}    
                                            labelLine={false}   
                                        >
                                            {examDataforLowerPrimary.map((entry, index) => (
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
                                            data={examDataforUpperPrimary}
                                            innerRadius={50}
                                            outerRadius={90}
                                            dataKey="value"
                                            nameKey="name"     
                                            label={renderCustomizedLabel("white")}    
                                            labelLine={false}   
                                        >
                                            {examDataforUpperPrimary.map((entry, index) => (
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
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={6}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 350, width: '1090px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                Students Count by Grade for All Learning Centers
                                </Typography>

                                <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={stuCountbyGrade ?? []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="grade" />
                                    <YAxis />
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
                </Grid>   

                <Grid container spacing={2} mb={3}>                         
                    <Grid item xs={12} md={6}>
                        <Card elevation={2} sx={{ borderRadius: 2, height: 400, width: '1090px' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                                Kids' Club Students Count in All Learning Centers
                                </Typography>

                                <ResponsiveContainer width="100%" height={340}>
                                <BarChart data={kcStuCountbyLC ?? []}>
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
                                            fontSize={12}
                                            fontWeight={600}/>
                                        {(kcStuCountbyLC ?? []).map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={KCStuColors [index]}                                                
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>                        
                
            </Box>
        </Container>
    );
}