import { useQuery, useMutation, useQueryClient} from "react-query";
import { useState } from "react";
import { useApp } from "../ThemedApp";
import { useNavigate } from "react-router-dom";
import { fetchAllStudents, fetchAllStudentsByLC, deleteStudent } from "../libs/fetcher";
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
import { DataGrid } from "@mui/x-data-grid";

export default function StudentList() {
  //const { isLoading, isError, error, data } = useQuery("students", fetchAllStudents);

  const [page, setPage] = useState(0);
  const {auth} = useApp();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchFn = auth?.role === "System Administrator" ? fetchAllStudents : fetchAllStudentsByLC;

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

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    console.log("id : ", id);
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

  const paginatedRows = Array.isArray(data)
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const columns = [
    //{ field: "id", headerName: "ID", width: 90, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "lcname", headerName: "Learning Center", width: 160, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "acayr", headerName: "Academic Year", width: 140, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "name", headerName: "Name", width: 140, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "stuID", headerName: "Student ID", width: 130, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "grade", headerName: "Grade", width: 100, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "gender", headerName: "Gender", width: 100, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "pwd", headerName: "PWD", width: 100, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "guardianName", headerName: "Guardian Name", width: 150, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "guardianNRC", headerName: "Guardian NRC", width: 150, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "familyMember", headerName: "Family Members", width: 150, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "over18Male", headerName: "Over 18 (Male)", width: 100, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "over18Female", headerName: "Over 18 (Female)", width: 100, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "under18Male", headerName: "Under 18 (Male)", width: 100, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "under18Female", headerName: "Under 18 (Female)", width: 100, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "acaReview", headerName: "Academic Review", width: 150, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "kidsClubStu", headerName: "Kid's Club Student", width: 160, headeralign: 'center', headerClassName: "super-app-theme--header" },
    { field: "dropoutStu", headerName: "Dropout Student", width: 150, headeralign: 'center', headerClassName: "super-app-theme--header" },
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

  const columnGroupingModel = [
    {
      groupId: 'Over18',
      headerName: 'Over 18 Years Old',
      children: [{field: 'over18Male'}, {field:'over18Female'}],     
    },
    {
      groupId: 'Under18',
      headerName: 'Under 18 Years Old',
      children: [{field: 'under18Male'}, {field:'under18Female'}], 
    }
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
    <Container maxWidth="xl" sx={{ mt: 20 }}>
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
          width: 220,
        }}
      >
        Student List
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
            // Wrap long header text
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal !important",
              lineHeight: "1.2 !important",
              textAlign: "center",
            },
            "& .MuiDataGrid-columnHeader": {
              alignItems: "center !important",
              padding: "8px !important",
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
            onRowClick={(params) => navigate(`/registration/${params.row.id}`)}
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
            count={Math.ceil((data?.length || 0) / rowsPerPage)}
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
    </Container>
  );
}