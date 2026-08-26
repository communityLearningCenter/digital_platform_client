import { useQuery, useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import { useApp } from "../ThemedApp";
import { useNavigate } from "react-router-dom";
import { fetchAllStudents, fetchAllStudentsByLC, deleteStudent } from "../libs/fetcher";
import FloatingMenuMaterialUI from "../components/FloatingMenuMaterialUI";
import AddIcon from "@mui/icons-material/Add";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as XLSX from "xlsx";
//import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import i18n from "i18next";
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

export default function StudentList() {
  //const { isLoading, isError, error, data } = useQuery("students", fetchAllStudents);

  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const { auth } = useApp();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [academicYear, setAcademicYear] = useState("All");
  const [acayr, setAcaYr] = useState("");

  const fetchFn = auth?.role === "System Admin" ? fetchAllStudents : fetchAllStudentsByLC;

  const [filters, setFilters] = useState([
    { id: 1, field: "status", value: "all" },
  ]);

  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { isLoading, isError, error, data } = useQuery(
    ["students", auth?.role, auth?.learningCenterId], // query key
    () => fetchFn(auth?.learningCenterId),            // pass LC ID for restricted fetch
    { enabled: !!auth }                               // only run if auth is ready
  );

  const mutation = useMutation((id) => deleteStudent(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("students"); // refresh list
      setOpen(false);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'acayr':
        setAcaYr(value);
        break;
      default:
        break;
    }
  }

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpen(true);
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

  // const paginatedRows = Array.isArray(data)
  //   ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  //   : [];

  const filteredRows = Array.isArray(data)
    ? data.filter((row) => {
      // Academic Year filter
      if (acayr && row.acayr !== acayr) {
        return false;
      }

      return filterModel.items.every((filter) => {
        if (!filter.value) return true;

        return String(row[filter.field] ?? "")
          .toLowerCase()
          .includes(String(filter.value).toLowerCase());
      });
    })
    : [];

  const sortedRows = [...filteredRows].sort((a, b) => {
    // Group by Learning Center
    const lcCompare = String(a.lcname).localeCompare(String(b.lcname));
    if (lcCompare !== 0) {
      return lcCompare;
    }
    // Then sort by Student ID
    return String(a.stuID).localeCompare(String(b.stuID), undefined, {
      numeric: true,
    });
  });


  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleFilterChange = () => {
    setPage(0);
  };

  const columns = [
    //{ field: "id", headerName: "ID", width: 90, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "lcname", headerName: t("stuReg.lcname"), width: 160, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "acayr", headerName: t("stuReg.academicyr"), width: 160, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "name", headerName: t("stuReg.stuName"), width: 140, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "stuID", headerName: t("stuReg.stuID"), width: 130, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "grade", headerName: t("stuReg.grade"), width: 100, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "gender", headerName: t("stuReg.gender"), width: 100, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "pwd", headerName: t("stuReg.pwd"), width: 120, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "pwd_type", headerName: t("stuReg.pwdtypes"), width: 130, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "guardianName", headerName: t("stuReg.guardianName"), width: 170, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "guardianNRC", headerName: t("stuReg.guardianNRC"), width: 190, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "guardianType", headerName: t("stuReg.guardianType"), width: 190, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "familyMember", headerName: t("stuReg.familymemeberCount"), width: 150, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "over18Male", headerName: t("stuList.over18Male"), width: 140, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "over18Female", headerName: t("stuList.over18Female"), width: 120, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "under18Male", headerName: t("stuList.under18Male"), width: 140, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "under18Female", headerName: t("stuList.under18Female"), width: 120, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "stuStatus", headerName: t("stuReg.studentStatus"), width: 150, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "acaReview", headerName: t("stuReg.academicReview"), width: 150, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "kidsClubStu", headerName: t("stuReg.kidsclubStudent"), width: 180, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "dropoutStu", headerName: t("stuReg.dropoutStudent"), width: 200, headeralign: 'center', headerClassName: "super-app-theme--header" },
    {
      field: "actions", headerName: "Actions", width: 120, headeralign: 'center', headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <IconButton
          color="error" onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(params.row.id)
          }
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
      "Gender",
      "PWD",
      "PWD Type",
      "Guardian Name",
      "Guardian NRC",
      "Guardian Type",
      "Family Members",
      "Over 18 Years Old",
      "",
      "Under 18 Years Old",
      "",
      "Student Status",
      "Academic Review",
      "Kid's Club Student",
      "Dropout Student",
    ];

    const headerRow2 = [
      "", "", "", "", "", "", "", "", "", "", "", "",
      "Male", "Female",
      "Male", "Female",
      "", "", "", ""
    ];

    // --- Step 2: Create data rows ---
    const dataRows = rows.map((r) => [
      r.lcname,
      r.acayr,
      r.name,
      r.stuID,
      r.grade,
      r.gender,
      r.pwd,
      r.pwd_type,
      r.guardianName,
      r.guardianNRC,
      r.guardianType,
      r.familyMember,
      r.over18Male,
      r.over18Female,
      r.under18Male,
      r.under18Female,
      r.stuStatus,
      r.acaReview,
      r.kidsClubStu,
      r.dropoutStu,
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
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }, // Gender
      { s: { r: 0, c: 6 }, e: { r: 1, c: 6 } }, // PWD
      { s: { r: 0, c: 7 }, e: { r: 1, c: 7 } }, // PWD Type
      { s: { r: 0, c: 8 }, e: { r: 1, c: 8 } }, // Guardian Name
      { s: { r: 0, c: 9 }, e: { r: 1, c: 9 } }, // Guardian NRC
      { s: { r: 0, c: 10 }, e: { r: 1, c: 10 } }, // Guardian Type
      { s: { r: 0, c: 11 }, e: { r: 1, c: 11 } }, // Family Members
      { s: { r: 0, c: 16 }, e: { r: 1, c: 16 } }, // Student Status
      { s: { r: 0, c: 17 }, e: { r: 1, c: 17 } }, // Academic Review
      { s: { r: 0, c: 18 }, e: { r: 1, c: 18 } }, // Kid's Club Student
      { s: { r: 0, c: 19 }, e: { r: 1, c: 19 } }, // Dropout Student

      // Merge grouped headers
      { s: { r: 0, c: 12 }, e: { r: 0, c: 13 } }, // Over 18 Years Old
      { s: { r: 0, c: 14 }, e: { r: 0, c: 15 } }, // Under 18 Years Old
    ];

    // --- Step 5: Optional column widths ---
    worksheet["!cols"] = [
      { wch: 20 }, // Learning Center
      { wch: 15 }, // Academic Year
      { wch: 20 }, // Name
      { wch: 15 }, // Student ID
      { wch: 10 }, // Grade
      { wch: 10 }, // Gender
      { wch: 10 }, // PWD
      { wch: 20 }, // PWD Type
      { wch: 20 }, // Guardian Name
      { wch: 20 }, // Guardian NRC
      { wch: 20 }, // Guardian Type
      { wch: 15 }, // Family Members
      { wch: 12 }, // Over 18 Years Old (Male)
      { wch: 12 }, // Over 18 Years Old (Female)
      { wch: 12 }, // Under 18 Years Old (Male)
      { wch: 12 }, // Under 18 Years Old (Female)
      { wch: 15 }, // Student Status
      { wch: 20 }, // Academic Review
      { wch: 20 }, // Kid's Club Student
      { wch: 20 }, // Dropout Student
    ];

    // --- Step 6: Build workbook and export ---
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `Student_List_${new Date().toISOString()}.xlsx`);
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
    <Container maxWidth="xl" sx={{ mt: 20 }}>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}>
        <Typography
          variant="h4"
          sx={{
            px: 1,
            mt:-2,
            color: "#ef6c00",
            backgroundColor: "banner",
            borderRadius: 5,
            minHeight: 80,
            width: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            lineHeight: 1,
            whiteSpace: "nowrap",
            fontSize: i18n.language === "my" ? "1.8rem" : "2.125rem",
          }}
        >
          {t("stuList.tabTitle")}
        </Typography>

        <FormControl fullWidth color="secondary">
          <InputLabel id="LabelAcaYr" sx={{ ml: 125, mb: 4 }}>{t("stuReg.academicyr")}</InputLabel>
          <Select
            name="acayr"
            labelId="LabelAcaYr"
            id="formAcaYr"
            label="Academic Year"
            value={acayr}
            onChange={handleChange}
            color="secondary" 
            required
            error={!acayr}
            sx={{ ml: 126, mb: 4, width: 209, borderRadius: 2, backgroundColor: "banner" }}>
            <MenuItem value={""}>All</MenuItem>
            <MenuItem value={"2024 - 2025"}>2024 - 2025</MenuItem>
            <MenuItem value={"2025 - 2026"}>2025 - 2026</MenuItem>
            <MenuItem value={"2026 - 2027"}>2026 - 2027</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          mt: -5,
          height: 605,
          width: "100%",

          "& .super-app-theme--header": {
            color: "#673ab7",
            fontSize: "1rem",
            backgroundColor: "banner !important",
          },

          "& .MuiDataGrid-columnHeaders": {
            minHeight: "80px !important",
            maxHeight: "80px !important",
            height: "80px !important",
          },

          "& .MuiDataGrid-columnHeader": {
            minHeight: "80px !important",
            maxHeight: "80px !important",
            height: "80px !important",
            alignItems: "center !important",
            padding: "18px !important",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal !important",
            lineHeight: "1.3 !important",
            textAlign: "center",
            width: "100%",
            overflow: "visible !important",
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
          sx={{ p: 2, borderRadius: 2, backgroundColor: "banner" }}
          onRowClick={(params) => navigate(`/registration/${params.row.id}`)}
          //onFilterModelChange={handleFilterChange}
          onFilterModelChange={(model) => {
            setFilterModel(model);
            setPage(0);
          }
          }
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
            onChange={handleChangeRowsPerPage}                >
            {[5, 10, 20, 50].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Confirm dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Are you sure you want to delete this student?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Pagination
          //count={Math.ceil((data?.length || 0) / rowsPerPage)}
          count={Math.ceil(filteredRows.length / rowsPerPage)}
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

      <FloatingMenuMaterialUI
        tooltip="Student Actions"
        position={{ bottom: 32, right: 32 }}
        actions={[
          {
            id: "add",
            icon: <AddIcon sx={{ color: "#000" }} />,
            label: "Add Student",
            onClick: () => navigate("/registration"),
          },
          {
            id: "export",
            icon: <DownloadIcon sx={{ color: "#000" }} />,
            label: "Export to Excel",
            onClick: () => exportToExcel(sortedRows),
          }
        ]}
      />
    </Container>
  );
}