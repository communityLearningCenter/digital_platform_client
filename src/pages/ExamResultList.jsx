import { useQuery } from "react-query";
import { useState } from "react";
import { useApp } from "../ThemedApp";
import { fetchAllExamResults, fetchAllExamResultsByLC } from "../libs/fetcher";
import {
    Box,
    Container,
    Typography,
    Alert,
    CircularProgress,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    TextField, 
    Dialog, DialogTitle,DialogContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper, 
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function ExamResultList() {
  //const { isLoading, isError, error, data } = useQuery("examResults", fetchAllExamResults);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [subjectRows, setSubjectRows] = useState([]);
  const {auth} = useApp();

  const fetchFn = auth?.role === "System Administrator" ? fetchAllExamResults : fetchAllExamResultsByLC;

  const { isLoading, isError, error, data } = useQuery(
    ["examResults", auth?.role, auth?.learningCenterId], // query key
    () => fetchFn(auth?.learningCenterId),            // pass LC ID for restricted fetch
    { enabled: !!auth }                               // only run if auth is ready
  );

  const handleChangePage = (event, value) => {
    setPage(value - 1); // Pagination component is 1-based
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = Array.isArray(data)
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const subjectKeyMap = {
    "Myanmar": "myanmar",
    "English": "english",
    "Mathematics": "maths",
    "Science": "science",
    "Society": "social",
    "History": "history",
    "Geography": "geography",
    "Child Rights": "childrights",
    "SRHR and Gender": "srhr",
    "PSS": "pss",
    "Kid's Club": "kidsclub",
    Attendance: "attendance",
    };


  const getSubjectsByGrade = (grade) => {
    if (grade == 'KG' || grade == 'G-1' || grade == 'G-2' || grade == 'G-3' || grade == 'G-4' || grade == 'G-5') {
        return ["Myanmar", "English", "Mathematics", "Science", "Society", "Child Rights", "SRHR and Gender", "PSS", "Kid's Club", "Attendance"];
    }
        return ["Myanmar", "English", "Mathematics", "Science", "History", "Geography", "Child Rights", "SRHR and Gender", "PSS", "Kid's Club", "Attendance"];
    };

  const columns = [    
    { field: "lcname", headerName: "Learning Center", width: 160, headerClassName: "super-app-theme--header" },
    { field: "acayr", headerName: "Academic Year", width: 140, headerClassName: "super-app-theme--header" },
    { field: "name", headerName: "Name", width: 140, headerClassName: "super-app-theme--header" },
    { field: "stuID", headerName: "Student ID", width: 130, headerClassName: "super-app-theme--header" },  
    { field: "grade", headerName: "Grade", width: 100, headerClassName: "super-app-theme--header" },
    { 
        field: "session", 
        headerName: "Session", 
        width: 100, 
        headerClassName: "super-app-theme--header",
        renderCell: (params) => (
            <Button
            size="small"
            variant="text"
            color="black"
            onClick={() => {
                setSelectedRow(params.row); // store the clicked row data
                const subjects = getSubjectsByGrade(params.row.grade);
                console.log("grade : ", params.row.grade)
                console.log("subjects : ", subjects);
                const rows = subjects.map((sub) => ({
                    subject: sub,
                    mark: params.row[`${subjectKeyMap[sub]}_mark`] ?? "",      // map marks from data
                    grading: params.row[`${subjectKeyMap[sub]}_grade`] ?? "",  // map grading from data
                }));
                setSubjectRows(rows);
                setOpen(true); // open the popup
            }}
            >
                {params.value}
            </Button>
            ), 
        },
        { field: "total_marks", headerName: "Total", width: 100, headerClassName: "super-app-theme--header" },    
    ];

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 20, width: '950px' }}>
      <Typography
        variant="h4"
        sx={{
          pl: 2,
          pt: 1,
          mb: 2,
          color: "#ef6c00",
          backgroundColor: "banner",
          borderRadius: 5,
          height: 90,
          width: 300,
        }}
      >
        Exam Result List
      </Typography>

      <Box
          sx={{
            mt: -6,
            height: 605,
            width: "100%",     
            "& .super-app-theme--header": {                
              color: "#673ab7",    
              fontSize: "1.1rem",
              backgroundColor: "banner !important"
            },                    
          }}
      >
        <DataGrid
            rows={paginatedRows}
            columns={columns}
            pagination={false}
            disableSelectionOnClick
            hideFooter
            getRowId={(row) => row.id}               
            sx={{ p:2, borderRadius: 2, backgroundColor: "banner"}}
        />
      </Box>

      <Box
          sx={{
              display: "flex",
              justifyContent: "center",
              p: 1,
              backgroundColor: "banner",
              borderTop: "1px solid",
              borderRadius: 1,
              mt: -0.5,
              alignItems: "center",
          }}
      >
        <FormControl size="small">
            <InputLabel id="rows-per-page-label">Rows</InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              label="Rows per page"
              onChange={handleChangeRowsPerPage}>
              {[5, 10, 20, 50].map((option) => (
              <MenuItem key={option} value={option}>
                  {option}
              </MenuItem>
            ))}
            </Select>
        </FormControl>

        <Pagination
            count={Math.ceil(data.length / rowsPerPage)}
            page={page + 1}
            onChange={handleChangePage}
            size="large"
            sx={{
                "& .MuiPaginationItem-root": {
                color: "black",
                },
                "& .Mui-selected": {
                backgroundColor: "#673ab7 !important",
                color: "#fff",
                },
            }}
        />
      </Box>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{color: "#ef6c00"}}>Exam Result Details</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <TableContainer component={Paper} sx={{ mb: "14px", backgroundColor: 'banner', border: "1px solid #b0adac" }}>
                <Table sx={{mb:2}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ color: "#673ab7", fontSize: "0.9rem", textAlign:'center'}}>Subject</TableCell>
                            <TableCell align="center" sx={{ color: "#673ab7", fontSize: "0.9rem", textAlign:'center'}}>Mark</TableCell>
                            <TableCell align="center" sx={{ color: "#673ab7", fontSize: "0.9rem", textAlign:'center'}}>Grading</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjectRows.map((row, index) => (
                            <TableRow key={row.subject} sx={{ height: 10 }}>
                                <TableCell sx={{ color: "#673ab7", fontSize: "0.9rem", py: 0.5}}>{row.subject}</TableCell>
                                <TableCell sx={{ py: 0.5 }}>
                                    <TextField
                                        type="number"
                                        value={row.mark}
                                        onChange={(e) => handleTableChange(index, "mark", e.target.value)}
                                        size="small"                                                                          
                                        sx={{width:"100px"}} 
                                        inputProps={{ style: { textAlign: "center" }, readOnly: true }}
                                    />
                                </TableCell>
                                <TableCell sx={{ py: 0.5 }}>
                                    <TextField
                                        value={row.grading}
                                        onChange={(e) => handleTableChange(index, "grading", e.target.value)}
                                        size="small"                                        
                                        sx={{width:"100px"}}
                                        inputProps={{ style: { textAlign: "center" }, readOnly: true }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </Container>    
  );
}