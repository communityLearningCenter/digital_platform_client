import { useQuery } from "react-query";
import { useState } from "react";
import { fetchAllLCs } from "../libs/fetcher";
import {
  Box,
  Button,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function LearningCenter() {
    const { isLoading, isError, error, data } = useQuery("learningcenter", fetchAllLCs);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);  

    const handleChangePage = (event, value) => {
        setPage(value - 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    const paginatedRows = Array.isArray(data)
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

    const handleExportCSV = () => {
        if (!Array.isArray(data)) return;

        const headers = ["ID", "Learning Center", "Region"];
        const rows = data.map((row) => [row.id, row.lcname, row.region]);

        const csvContent = [headers, ...rows]
        .map((e) =>
            e
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "learning-centers.csv");
    };

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 100,
            horizontalalign: 'center',
            headerClassName: "super-app-theme--header",
        },
        {
            field: "lcname",
            headerName: "Learning Center",
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "region",
            headerName: "Region",
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
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
        <Container maxWidth="md" sx={{ mt: 20 }}>
            <Typography
                variant="h4"
                sx={{
                    p: 2,
                    mb: 2.5,          
                    color: "#ef6c00",
                    backgroundColor: "banner",
                    borderRadius: 3,
                    width: "fit-content",
                }}
            >
            Learning Centers
            </Typography>

            {/* <Button
                variant="outlined"
                onClick={handleExportCSV}
                sx={{ height: "fit-content", alignSelf: "center" }}
                >
                Export CSV
            </Button> */}

            <Box
                sx={{
                mt: -4,
                height: 605,
                width: "100%",
                    "& .super-app-theme--header": {
                        backgroundColor: "banner",
                        color: "#673ab7",                    
                        fontSize: "1.1rem",
                    },
                }}
            >
                <DataGrid
                    rows={paginatedRows}
                    columns={columns}
                    pageSize={rowsPerPage}          
                    pagination = {false}
                    disableSelectionOnClick
                    hideFooter
                    sx={{ p:2, backgroundColor: "banner", borderRadius: 2 }}
                />            
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",          
                    p: 1,
                    backgroundColor: "banner",
                    borderTop: "1px solid #e0e0e0",
                    borderRadius: 2,
                    mt:-0.6,
                    alignItems: "center",
                }}
            >
                <FormControl size="small">
                    <InputLabel id="rows-per-page-label">Rows</InputLabel>
                    <Select
                        labelId="rows-per-page-label"
                        value={rowsPerPage}
                        label="Rows per page"
                        onChange={handleChangeRowsPerPage}                      
                    >
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
