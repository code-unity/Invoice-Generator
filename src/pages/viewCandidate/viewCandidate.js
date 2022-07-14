import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@mui/material/Paper';
import history from '../../history';
import Rows from '../../components/viewCandidateRows';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column'
    },
}))

const ViewCandidate = () => {
    const classes = useStyles();
    const [rows, setRows] = useState();
    const [open, setOpen] = React.useState(false);
    const [alert, setMessage] = React.useState({ message: "", severity: "" });
    const [openLoader, setOpenLoader] = React.useState(false);
    const [clientData, setClientdata] = React.useState([]);


    const fetchData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/candidate`)
            .then((res) => {
                setRows(res.data.data)
            })
        axios.get(`${process.env.REACT_APP_API_URL}/client`)
            .then((response) => {
                setClientdata(response.data.data.results);
            });

    }
    
    const getName = (row, clientData) => {
        const name = clientData.filter((item) =>  item._id === row.assigned_to)
        return (name[0].client_name);
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    const deleteData = (id) => {
        setOpenLoader(true)
        axios.delete(`${process.env.REACT_APP_API_URL}/candidate/${id}`)
            .then((response) => {
                setOpenLoader(false);
                const message = alert;
                message.message = "Candidate Details Deletion Successfully";
                message.severity = 'success';
                setMessage(message);
                setOpen(true);
                history.push('/view-candidate')
            })
            .catch((error) => {
                setOpenLoader(false);
                const message = alert;
                message.message = "Deletion Candidate Details Unsuccessful";
                message.severity = "error"
                setMessage(message);
                setOpen(true);
            })
    }

    return (
        <div style={{ marginRight:'90px' }}>
            <Button type="button" variant='contained' color="primary" style={{ marginTop: '3%', marginLeft: '2.6%', marginBottom: '1%' }} onClick={() => history.push('/candidate')}>
                Add New Candidate
            </Button>
            <TableContainer component={Paper} sx={{ ml: 5 }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Info</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Assigned to</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email Id.</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date of Birth</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date of Joining</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Pan Card No</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Edit</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows !== undefined && clientData.length > 0 && rows.map((row) => (
                            <Rows key={row._id} row={row} assignedTo={getName(row, clientData)} deleteData={deleteData} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alert.severity}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Backdrop className={classes.backdrop} open={openLoader} >
                <div>
                    <CircularProgress color="primary" />
                </div>
                <span>Request Processing...</span>
            </Backdrop>
        </div>
    )
}

export default ViewCandidate