import {  
    Alert,   
    Box,
    TextField, 
    Container, 
    Typography,
    FormControl,
    Pagination,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
    LinearProgress,
    Fab,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { fetchUser } from "../libs/fetcher";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { useRef } from "react";
import { useApp } from "../ThemedApp";

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from "@mui/icons-material/Delete";

const api = import.meta.env.VITE_API_URL;

export default function TeachingMaterials() {
    const { id } = useParams();
    const { isLoading, isError, error, data } = useQuery(`users/${id}`, async () => fetchUser(id));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const { auth } = useApp();
    console.log("role: ", auth);
    
    const {
        data: fileData = [],
        isLoading: fileLoading,
        refetch,
    } = useQuery("files", async () => {
            const res = await fetch(`${api}/files`);
            return res.json();
        }
    );

    const formatDate = (value) => {
        if (!value) return "";
        const date = new Date(value);
        return format(new Date(value), "dd/MM/yyyy");       
    };

    const handleChangePage = (event, value) => {
        setPage(value - 1); // Pagination component is 1-based
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedRows = Array.isArray(fileData)
        ? fileData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : [];

    const handleDocumentUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
            if (!selectedFiles.length) return;

        selectedFiles.forEach((file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("username", data.name);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `${api}/upload-file?username=${data.name}`);
            xhr.responseType = "json";

            setUploading(true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percent);
                }
            };

            xhr.onload = () => {
                setUploading(false);
                setUploadProgress(0);

                if (xhr.status === 200) {                    
                    refetch();                   
                }
            };

            xhr.onerror = () => {
                setUploading(false);
                console.error("Upload failed");
            };

            xhr.send(formData);
        });
    };

    const baseColumns = [
        {
            field: "name",
            headerName: "File Name",
            headerClassName: "super-app-theme--header",
            flex: 1,
        },
        {
            field: "relatedTopic",
            headerName: "Topic",
            headerClassName: "super-app-theme--header",
            width: 150,
        },     
        {
            field: "uploadedDate",
            headerName: "Uploaded At",
            headerClassName: "super-app-theme--header",
            width: 180,
            renderCell: (params) => formatDate(params.row.uploadedDate)
        },
        {
            field: "download",
            headerName: "Download",
            headerClassName: "super-app-theme--header",
            width: 130,
            renderCell: (params) => (
            <IconButton
                onClick={() => handleDownload(params.row)}
                color="success"
            >
                <FileDownloadIcon />
            </IconButton>
            ),
        },        
    ];

    const deleteColumn = {
        field: "delete",
        headerName: "Delete",
        width: 120,
        renderCell: (params) => (
            <IconButton
            color="error"
            onClick={() => handleDelete(params.row)}
            >
            <DeleteIcon />
            </IconButton>
        ),
    };

    const columns = auth?.role === "System Admin"
        ? [...baseColumns, deleteColumn]
        : baseColumns;

    const handleDownload = async (file) => {
        try {
            const response = await fetch(file.url);

            if (!response.ok) {
            throw new Error("Failed to download file");
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = file.name || "download";
            
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleDelete = async (file) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${file.name}"?`
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(`${api}/files/${file.id}`, {
            method: "DELETE",
            });

            if (!res.ok) throw new Error("Delete failed");

            // refresh table
            refetch();

        } catch (err) {
            console.error(err);
        }
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
            <Box sx={{ textAlign: "center" }}>
                Loading..
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
                    height: 80,
                    width: 330,
                }}
            >
                Teaching Materials
            </Typography>

            <Box
                sx={{
                    mt: -5,
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
                sx={{ p:2, borderRadius: 2, backgroundColor: "banner"}}
                loading={fileLoading}                        
                />                

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
                        count={Math.ceil(fileData.length / rowsPerPage)}
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
                
                    {/* <Button variant="contained" component="label">
                        Upload Documents
                        <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleDocumentUpload}
                        />
                    </Button> */}
            </Box> 

            <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleDocumentUpload}
            /> 

            {auth?.role === "System Admin" && (
                <Fab
                    color="primary"
                    sx={{ position: "fixed", bottom: 32, right: 32 }}
                    onClick={() => fileInputRef.current.click()}
                    >
                    <UploadFileIcon />
                </Fab>
            )}

        </Container>
)}