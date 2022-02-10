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

import Rows from '../../components/viewClientRows';

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

const ViewClient = () => {
    const classes = useStyles();
    const [rows, setRows] = useState();
    const [open, setOpen] = React.useState(false);
    const [alert, setMessage] = React.useState({ message: "", severity: "" });
    const [openLoader, setOpenLoader] = React.useState(false);

    const fetchData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/client`)
            .then((res) => {
                setRows(res.data.data.results)
            });
    }

    useEffect(() => {
        fetchData()
<<<<<<< HEAD
    },[])
=======
    },[]);// eslint-disable-line react-hooks/exhaustive-deps
>>>>>>> c98a254696f3df4cfc9bcddce9d278aba9d1a1bd

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };
    

    const deleteData = (id) => {
        setOpenLoader(true)
        axios.delete(`${process.env.REACT_APP_API_URL}/client/${id}`)
            .then((response) => {
                setOpenLoader(false);
                const message = alert;
                message.message = "Client Details Deletion Successfully";
                message.severity = 'success';
                setMessage(message);
                setOpen(true);
                history.push('/view-client')
            })
            .catch((error) => {
                setOpenLoader(false);
                const message = alert;
                message.message = "Deletion Client Details Unsuccessful";
                message.severity = "error"
                setMessage(message);
                setOpen(true);
            })
    }

    return (
        <div style={{ width: '100vw' }}>
            <Button type="button" variant='contained' color="primary" style={{marginTop: '3%', marginLeft: '2.6%', marginBottom:'1%'}} onClick={() => history.push('/client')}>
                Add New Client
            </Button>
            <TableContainer component={Paper} sx={{ ml: 5 }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Client Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date of Contract</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Edit</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows !== undefined && rows.map((row) => (
                            <Rows key={row._id} row={row} deleteData={deleteData} />
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

export default ViewClient