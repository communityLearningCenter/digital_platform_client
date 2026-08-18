import {
    Box,
    Container,
    Button,
    TextField,
    Typography,
    Alert,
    InputLabel,MenuItem, FormControl,
    Select,
    Autocomplete
} from "@mui/material";

export default function VDCRegisteration() {

    return (
            <Container sx={{ mt: 20, width: 700 }}>
                <Typography variant="h4" sx={{ p: 2, mt: 4, color: '#ef6c00', backgroundColor: 'banner', borderRadius: 5, height: 90, width: 175 }}>
                    Village Development Committee
                </Typography>

                <form onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2, p: 3, width: 650 }}>
                        <TextField
                            label="Name"                        
                            //inputRef={nameInput}      
                            value={name}  
                            onChange={(e) => setName(e.target.value)}                   
                            fullWidth
                            color="secondary"    
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                mt: 0.5,  
                            }}
                        />  

                        <TextField
                            label="NRC"                        
                            //inputRef={nrcInput}       
                            value={nrc}       
                            onChange={(e) => setNrc(e.target.value)}                       
                            fullWidth
                            color="secondary"    
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                mt: 0.5,  
                            }}
                        />  

                        {/* Position */}
                        <FormControl fullWidth color="secondary" sx={{mt:1}}>
                            <InputLabel id="LabelPosition">Position</InputLabel>
                            <Select
                                name="position"
                                labelId="LabelPosition"
                                id="formPosition"
                                label="Position"
                                value={position}
                                color="secondary" focused   
                                onChange={handleChange}
                            >
                                <MenuItem value=""></MenuItem>
                                <MenuItem value="Chairman">Chairman</MenuItem>
                                <MenuItem value="Vice Chairman">Vice Chairman</MenuItem>
                                <MenuItem value="Secretary">Secretary </MenuItem>
                                <MenuItem value="Auditor ">Auditor </MenuItem>
                                <MenuItem value="Accountant ">Accountant </MenuItem>
                                <MenuItem value="Treasurer">Treasurer</MenuItem>
                                <MenuItem value="Member">Member</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </form>
            </Container>
    )
}