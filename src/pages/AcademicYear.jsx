import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { fetchAllAcaYrs, updateAcaYr } from "../libs/fetcher";
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  MenuItem,
  Select, Button,
  Dialog, DialogTitle,DialogContent, DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function AcademicYear() {
    const { isLoading, isError, error, data } = useQuery("academicYear", fetchAllAcaYrs);
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);  
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [open, setOpen] = useState(false);
    const [acayr, setAcaYr] = useState("");
    const [status, setStatus] = useState("");    
    const queryClient = useQueryClient();    

    const handleChange = (event) => {
        const { name, value } = event.target;

        switch (name) {            
            case 'acayr':
                setAcaYr(value);
                break;
            case 'status':
                setStatus(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = () => {
        if (!selectedRow) return;

        const payload = {
            status: status,   // ✅ ONLY status
        };

        update.mutate({
            id: selectedRow.id,
            data: payload,
        });
    };
    
    const handleChangePage = (event, value) => {
        setPage(value - 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };

    const handleClosePopUp = () => {
        setOpen(false);
        setSelectedRow(null);
        setAcaYr("");
        setStatus("");
    };         
    
    const paginatedRows = Array.isArray(data)
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 100,
            horizontalalign: 'center',
            headerClassName: "super-app-theme--header",
        },
        {
            field: "acaYr",
            headerName: "Academic Year",
            flex: 1,
            headerClassName: "super-app-theme--header",
            renderCell: (params) => (
            <Button
                size="small"
                variant="text"
                color="black"
                onClick={() => {
                    setSelectedRow(params.row); // store the clicked row data     
                    setAcaYr(params.row.acaYr);
                    setStatus(params.row.status);                 
                    setOpen(true); // open the popup
                }}
                >
                {params.value}
            </Button>
            ), 
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            headerClassName: "super-app-theme--header",
        },
    ];

    const update = useMutation(
        ({ id, data }) => updateAcaYr(id, data),
        {
            onSuccess: () => {
                handleClosePopUp();
                queryClient.invalidateQueries("academicYear"); // refresh grid
            },
            onError: () => {
                console.error("Error updating status");
            },
        }
    );

    useEffect(() => {
            if (selectedRow) {
                setAcaYr(selectedRow.acaYr);
                setStatus(selectedRow.status);
            }
        }, [selectedRow]);

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
            Academic Years
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
            {/* Popup Dialog */}
            <Dialog open={open} onClose={handleClosePopUp}>
                <DialogTitle sx={{color: "#ef6c00"}}>Academic Year</DialogTitle>
                <DialogContent>
                    {selectedRow && (
                    <Container sx={{ mt: 2, width:300}}>
                        <Box >
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelAcaYr">Academic Year</InputLabel>
                                <Select 
                                    name="acayr"
                                    labelId="LabelAcaYr" 
                                    id="formAcaYr"
                                    label="Academic Year"
                                    value={acayr}                                    
                                    onChange={handleChange}
                                    color="secondary" focused  
                                    disabled       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"2024 - 2025"}>2024 - 2025</MenuItem>
                                    <MenuItem value={"2025 - 2026"}>2025 - 2026</MenuItem>                                
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ mt: 3}}>
                            <FormControl fullWidth color="secondary">
                                <InputLabel id="LabelAcaYr">Status</InputLabel>
                                <Select 
                                    name="status"
                                    labelId="LabelStatus" 
                                    id="formStatus"
                                    label="Status"
                                    value={status}                                    
                                    onChange={handleChange}
                                    color="secondary" focused       
                                    fullWidth>
                                    <MenuItem value={""}></MenuItem>
                                    <MenuItem value={"Active"}>Active</MenuItem>
                                    <MenuItem value={"Inactive"}>Inactive</MenuItem>                                
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ mt: 3}}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{backgroundColor:'#ef6c00', color:'banner'}}
                                onClick={handleSubmit}>                                
                                Submit                                
                            </Button>
                        </Box>
                    </Container>
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );    
}