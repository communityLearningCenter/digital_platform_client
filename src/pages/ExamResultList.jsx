import { useQuery, useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import { useApp } from "../ThemedApp";
import { fetchAllExamResults, fetchAllExamResultsByLC, deleteExamResult } from "../libs/fetcher";
import FloatingMenuMaterialUI from "../components/FloatingMenuMaterialUI";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as XLSX from "xlsx";
//import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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
    IconButton,
    TextField, 
    Dialog, DialogTitle,DialogContent, DialogActions,
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
  const [deldialogopen, setDelDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [subjectRows, setSubjectRows] = useState([]);
  const {auth} = useApp();
  const queryClient = useQueryClient();

  const fetchFn = auth?.role === "System Admin" ? fetchAllExamResults : fetchAllExamResultsByLC;

  const { isLoading, isError, error, data } = useQuery(
    ["examResults", auth?.role, auth?.learningCenterId], // query key
    () => fetchFn(auth?.learningCenterId),            // pass LC ID for restricted fetch
    { enabled: !!auth }                               // only run if auth is ready
  );

  const mutation = useMutation((id) => deleteExamResult(id), {
      onSuccess: () => {
        queryClient.invalidateQueries("examResults"); // refresh list
        setDelDialogOpen(false);
      },
    });
  
    const handleDeleteClick = (id) => {
      setSelectedId(id);      
      setDelDialogOpen(true);
    };
  
    const confirmDelete = () => {
      if (selectedId) {
        mutation.mutate(selectedId);
      }
    };

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
    "Attendance": "attendance",
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
      { field: "actions", headerName: "Actions", width: 120, headeralign: 'center', headerClassName: "super-app-theme--header",
          renderCell: (params) => (
          <IconButton 
            color="error" onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(params.row.id)}
            }
          >
            <DeleteIcon />
          </IconButton>
        ),        
      },
  ];

  const exportToExcel = (rows) => {
    if (!rows || rows.length === 0) {
      alert("No data to export!");
      return;
    }
  
    // --- Step 1: Define the header layout ---
    const headerRow1 = [
      "Learning Center",
      "Academic Year", 
      "Name",
      "Student ID",
      "Grade", 
      "Session",
      "Myanmar",
      "",
      "English",
      "",
      "Mathematics",
      "",
      "Science",
      "",
      "Society",
      "",
      "History",
      "",
      "Geography",
      "",
      "Child Rights",
      "",
      "SRHR and Gender",
      "",
      "PSS",
      "",
      "Kid's Club",
      "",
      "Attendance",
      "", 
      "Total"
    ];
  
    const headerRow2 = [
      "", "", "", "", "", "", 
      "Mark", "Grade", "Mark", "Grade", "Mark", "Grade", "Mark", "Grade", "Mark", "Grade", "Mark", "Grade", 
      "Mark", "Grade", "Mark", "Grade", "Mark", "Grade", "Mark", "Grade", "Mark", "Grade", "Mark", "Grade",
      ""
    ];
  
    // --- Step 2: Create data rows ---
    const dataRows = rows.map((r) => [
      r.lcname,
      r.acayr,
      r.student.name,
      r.student.stuID,
      r.student.grade,
      r.session,
      r.myanmar_mark,
      r.myanmar_grade,
      r.english_mark,
      r.english_grade,
      r.maths_mark,
      r.maths_grade,
      r.science_mark,
      r.science_grade,
      r.social_mark,
      r.social_grade,
      r.geography_mark,
      r.geography_grade,
      r.history_mark,
      r.history_grade,
      r.childrights_mark,
      r.childrights_grade,
      r.srhr_mark,
      r.srhr_grade,
      r.pss_mark,
      r.pss_grade,
      r.kidsclub_mark,
      r.kidsclub_grade,
      r.attendance_mark,
      r.attendance_grade,
      r.total_marks  
    ]);
  
    // Combine all rows
    const allData = [headerRow1, headerRow2, ...dataRows];
  
    // --- Step 3: Create worksheet from data ---
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
  
    // --- Step 4: Define merged cells ---
    worksheet["!merges"] = [
      // Merge normal headers over row 1–2
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Learning Center
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Academic Year
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Name
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // Student ID
      { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, // Grade
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }, // Session
      { s: { r: 0, c: 30 }, e: { r: 1, c: 30 } }, // Total
      
  
      // Merge grouped headers
      { s: { r: 0, c: 6 }, e: { r: 0, c: 7 } }, // Myanmar
      { s: { r: 0, c: 8 }, e: { r: 0, c: 9 } }, // English
      { s: { r: 0, c: 10 }, e: { r: 0, c: 11 } }, // Maths
      { s: { r: 0, c: 12 }, e: { r: 0, c: 13 } }, // Science
      { s: { r: 0, c: 14 }, e: { r: 0, c: 15 } }, // Social
      { s: { r: 0, c: 16 }, e: { r: 0, c: 17 } }, // Geography
      { s: { r: 0, c: 18 }, e: { r: 0, c: 19 } }, // History
      { s: { r: 0, c: 20 }, e: { r: 0, c: 21 } }, // Childrights
      { s: { r: 0, c: 22 }, e: { r: 0, c: 23 } }, // SRHR
      { s: { r: 0, c: 24 }, e: { r: 0, c: 25 } }, // PSS
      { s: { r: 0, c: 26 }, e: { r: 0, c: 27 } }, // Kids Club
      { s: { r: 0, c: 28 }, e: { r: 0, c: 29 } }, // Attendance
    ];
  
    // --- Step 5: Optional column widths ---
    worksheet["!cols"] = [
      { wch: 20 }, // Learning Center
      { wch: 15 }, // Academic Year
      { wch: 20 }, // Name
      { wch: 15 }, // Student ID
      { wch: 10 }, // Grade
      { wch: 10 }, // Session
    ];
  
    // --- Step 6: Build workbook and export ---
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exam Results");
  
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `Exam_Result_List_${new Date().toISOString()}.xlsx`);
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

        {/* Confirm dialog */}
        <Dialog open={deldialogopen} onClose={() => setDelDialogOpen(false)}>
          <DialogTitle>Are you sure you want to delete this exam result?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDelDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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

      <FloatingMenuMaterialUI
        tooltip="Student Actions"
        position={{ bottom: 32, right: 32 }}
        actions={[
            {
                id: "add",
                icon: <AddIcon sx={{ color: "#000" }} />,
                label: "Add Student",
                onClick: () => navigate("/registration/new"),
            },
            {
                id: "export",
                icon: <PictureAsPdfIcon sx={{ color: "#000" }} />,
                label: "Export to Excel",
                onClick: () => exportToExcel(data),
            }
        ]}
    />
    </Container>    
  );
}