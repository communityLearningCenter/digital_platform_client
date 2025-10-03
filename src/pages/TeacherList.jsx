import { useQuery } from "react-query";
import { useState } from "react";
import { fetchAllTeachers } from "../libs/fetcher";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function TeacherList() {
    const { isLoading, isError, error, data } = useQuery("teachers", fetchAllTeachers);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    console.log("Paginated Rows : ", paginatedRows);
    const columns = [
        { field: "teacherName", headerName: "Teacher Name", width: 160, horizontalalign: 'center', headerClassName: "super-app-theme--header" },
        { field: "teacherNRC", headerName: "Teacher NRC", width: 160, horizontalalign: 'center', headerClassName: "super-app-theme--header" },
        { field: "position", headerName: "Position", width: 160, horizontalalign: 'center', headerClassName: "super-app-theme--header" },
        { field: "status", headerName: "Status", width: 160, horizontalalign: 'center', headerClassName: "super-app-theme--header" },
        { field: "lcname", headerName: "Learning Center", width: 160, horizontalalign: 'center', headerClassName: "super-app-theme--header" },
        { field: "address", headerName: "Address", width: 140, horizontalalign: 'center', headerClassName: "super-app-theme--header" },
        { field: "phnumber", headerName: "Phone", width: 140, horizontalalign: 'center', headerClassName: "super-app-theme--header" },
        { field: "joinDate", headerName: "Join Date ", width: 130, horizontalalign: 'center', headerClassName: "super-app-theme--header"}        
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
                Teachers List
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
        </Container>
    );
}