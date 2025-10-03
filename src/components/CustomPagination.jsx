import {
  Box,
  Pagination,

} from '@mui/material';
const CustomPagination = ({ count, page, onChange }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: -1,
                p: 1,
                backgroundColor: 'banner',
                borderTop: '1px solid #e0e0e0',
                borderRadius: 1,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                <Pagination
                    count={count}
                    page= {page + 1}
                    onChange={onChange} //{(event, value) => setPage(value - 1)}   
                    size="large"
                    sx={{
                        '& .MuiPaginationItem-root': {
                        color: 'black',
                        },
                        '& .Mui-selected': {
                        backgroundColor: '#673ab7 !important',
                        color: '#fff',
                        },
                    }}                           
                />
            </Box>
        </Box>
    );
}


export default CustomPagination;