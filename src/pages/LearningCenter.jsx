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
    const [filters, setFilters] = useState([
        { id: 1, field: "status", value: "all" },
    ]);

    const handleChangePage = (event, value) => {
        setPage(value - 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    const getAvailableColumns = (currentFilters) => {
        const usedFields = currentFilters.map((f) => f.field);
        return filterableColumns.filter((col) => !usedFields.includes(col.field));
    };

    const filteredData = Array.isArray(data) ? data.filter((row) =>
      filters.every((filter) => {
        if (filter.value === "all") return true;
        return row[filter.field] === filter.value;
      })
    ) : [];

    const paginatedRows = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    /*const paginatedRows = Array.isArray(data)
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];*/

    const getUniqueValues = (field) => {
        if (!Array.isArray(data)) return [];
            return [...new Set(data.map((row) => row[field]).filter(Boolean))];
    };

    const handleExportCSV = () => {
        if (!Array.isArray(data)) return;

        const headers = ["ID", "Learning Center", "Region", "Status"];
        const rows = data.map((row) => [row.id, row.lcname, row.region, row.status]);

        const csvContent = [headers, ...rows]
        .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`)
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
        {
            field: "status",
            headerName: "Status",
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

    const filterableColumns = [
        { field: "status", label: "Status" },
        { field: "region", label: "Region" },
    ];

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

            <Box sx={{ mb: 2, backgroundColor: "banner", mt: -4, pb: 2,       // padding bottom
                        borderRadius: 2, borderBottom: "1px solid #e0e0e0",
                    }}>
                {filters.map((filter, index) => {
                    const availableColumns = getAvailableColumns(filters);

                    // Only show Add Filter if there are columns left AND this is the last filter
                    const showAdd =
                    availableColumns.length > 0 && index === filters.length - 1;

                    // Remove button only if more than 1 filter row
                    const showRemove = filters.length > 1;

                    return (
                        <Box
                            key={filter.id}
                            sx={{ display: "flex", gap: 2, mb: 1, pt: 2, ml: 3 }}
                        >
                            {/* Column Select */}
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel>Column</InputLabel>
                                <Select
                                    label="Column"
                                    value={filter.field}
                                    onChange={(e) => {
                                        setFilters((prev) =>
                                            prev.map((f) =>
                                            f.id === filter.id
                                                ? { ...f, field: e.target.value, value: "all" }
                                                : f
                                            )
                                            );
                                        setPage(0);
                                    }}
                            >
                                {[
                                filter.field,
                                ...availableColumns.map((c) => c.field),
                                ].map((field) => {
                                const col = filterableColumns.find((c) => c.field === field);
                                return (
                                    <MenuItem key={field} value={field}>
                                        {col.label}
                                    </MenuItem>
                                );
                                })}
                            </Select>
                            </FormControl>

                            {/* Value Select */}
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Value</InputLabel>
                            <Select
                                label="Value"
                                value={filter.value}
                                onChange={(e) => {
                                setFilters((prev) =>
                                    prev.map((f) =>
                                    f.id === filter.id ? { ...f, value: e.target.value } : f
                                    )
                                );
                                setPage(0);
                                }}
                            >
                                <MenuItem value="all">All</MenuItem>
                                {getUniqueValues(filter.field).map((val) => (
                                <MenuItem key={val} value={val}>
                                    {val}
                                </MenuItem>
                                ))}
                            </Select>
                            </FormControl>

                            {/* Remove Button */}
                            {showRemove && (
                            <Button
                                color="error"
                                onClick={() =>
                                    setFilters((prev) =>
                                        prev.filter((f) => f.id !== filter.id)
                                    )
                                }
                            >
                                Remove
                            </Button>
                            )}

                            {/* Add Filter Button */}
                            {showAdd && (
                            <Button
                                color="error"
                                onClick={() => {
                                    const nextColumns = getAvailableColumns(filters);
                                    if (nextColumns.length === 0) return;

                                    setFilters((prev) => [
                                        ...prev,
                                        { id: Date.now(), field: nextColumns[0].field, value: "all" },
                                    ]);
                                }}
                            >
                                + Add Filter
                            </Button>
                            )}
                        </Box>
                        );
                    })}
                    </Box>

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
                    //count={Math.ceil(data.length / rowsPerPage)}
                    count={Math.ceil(filteredData.length / rowsPerPage)}
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
