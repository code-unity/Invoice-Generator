import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import history from '../../history';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@mui/material/IconButton';

function deleteData(value) {
    axios.delete(`${process.env.REACT_APP_API_URL}/schedule/${value}`)
        .then((response) => {
            alert('successfully deleted Schedule');
            // TODO:: use the same fix as in scheudle invoice page
            // history.push('/schedule-invoice')
            // history.push('/view-schedule')
        })
        .catch((error) => {
            alert('Failed to delete Schedule');
        })
}
const ViewSchedule = () => {
    const [schedulesList, setSchedulesList] = useState([]);
    const [client, setClient] = useState([]);
    const [isLoading, setLoading] = useState(true)

    const fetchData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/schedule`)
            .then((data) => {
                setSchedulesList(data.data.data.results)
            });
        axios.get(`${process.env.REACT_APP_API_URL}/client`)
            .then((data) => {
                setClient(data.data.data.results)
                setLoading(false) // TODO:: fix the same way scheudle Invoice
            });

    }

    const convertTime = (str) => {
        var date = new Date(str);
        var hrs = ('0' + (date.getHours())).slice(-2);
        var mins = ('0' + (date.getMinutes())).slice(-2);
        return [hrs, mins].join(':');
    }

    const convertDate = (str) => {
        var date = new Date(str),
            mnth = ('0' + (date.getMonth() + 1)).slice(-2),
            day = ('0' + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join('-');
    }

    useEffect(() => {
        fetchData()
    }, [])

    // TODO:: put this inside the Table Container
    if (isLoading) {
        return <div>Loading..</div>
    }

    return (
        <div style={{ width: '100vw' }}>
            <Button type='button' variant='contained' color='primary' style={{ marginTop: '3%', marginLeft: '2.6%', marginBottom: '1%' }} onClick={() => history.push('/schedule-invoice')}>
                Add New Schedule
            </Button>
            <TableContainer component={Paper} sx={{ ml: 5 }}>
                <Table aria-label='collapsible table'>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Client Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Invoice Number</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Time </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Frequency </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Edit</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedulesList.map((scheduleData) => (
                            <TableRow key={scheduleData._id} >
                                <TableCell sx={{ fontWeight: 'light' }}>{client.find(data => data._id === scheduleData.clientId).client_name}</TableCell>
                                <TableCell sx={{ fontWeight: 'light' }}>{scheduleData.invoiceNumber}</TableCell>
                                <TableCell sx={{ fontWeight: 'light' }}>{convertDate(scheduleData.date)}</TableCell>
                                <TableCell sx={{ fontWeight: 'light' }}>{convertTime(scheduleData.time)}</TableCell>
                                <TableCell sx={{ fontWeight: 'light' }}>{scheduleData.frequency}</TableCell>
                                <TableCell sx={{ fontWeight: 'light' }}>
                                    <IconButton
                                        aria-label='delete-client'
                                        size='small'
                                        onClick={() => history.push(`/schedule/${scheduleData._id}`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    <IconButton
                                        aria-label='delete-client'
                                        size='small'
                                        onClick={() => deleteData(scheduleData._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default ViewSchedule