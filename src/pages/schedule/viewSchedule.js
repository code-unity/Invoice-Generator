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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';import DoDisturbIcon from '@mui/icons-material/DoDisturb';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const ViewSchedule = () => {
    const [schedulesList, setSchedulesList] = useState([])
    const [clientData, setClientData] = useState([]);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alert, setMessage] = React.useState({ message: "", severity: "" });
    const [isLoading, setLoading] = useState(true);

    function handleResponse(newMessage,newSeverity){
        const message = alert;
        message.message = newMessage;
        message.severity = newSeverity;
        setMessage(message);
        setOpenAlert(true);
      }

    const fetchData = async () => {
        try {
            const fetchScheduleData = await axios.get(`${process.env.REACT_APP_API_URL}/schedule`)
            if (fetchScheduleData) {
                setSchedulesList(fetchScheduleData.data.data.results)
            }
          } catch (error) {
            handleResponse('Failed to fetch details. Please try again.','error');
          }
          try {
            const fetchClientData = await axios.get(`${process.env.REACT_APP_API_URL}/client`)
            if (fetchClientData) {
                setClientData(fetchClientData.data.data.results)
                setLoading(false)
            }
          } catch (error) {
            handleResponse('Failed to fetch details. Please try again.','error');
          }
    }
    
    async function disableSchedule (value) {
        value.isDisabled= !value.isDisabled
        try {
            const disableData = await axios.patch(`${process.env.REACT_APP_API_URL}/schedule/${value._id}`, value, { headers: { 'Content-Type': 'application/json' } })
            if (disableData) {
                if(!value.isDisabled){
                    handleResponse('Schedule enabled successfully.','success');
                }
                else{
                    handleResponse('Schedule disabled successfully.','error');
                }
            }
          } catch (error) {
            handleResponse('Error caused while disabling the schedule. Please try again','error');
          }
      }
    
    async function deleteData(value) {
        try {
            const deleteScheduleData = await axios.delete(`${process.env.REACT_APP_API_URL}/schedule/${value}`)
            if (deleteScheduleData) {
                handleResponse('Schedule deleted successfully.','success');
            }
        } 
        catch (error) {
            handleResponse('Failed to delete details. Please try again.','error');
        }
    }
    const handleClose = (event, reason) => {
        setOpenAlert(false);
      };
    
    const convertTime = (str) => {
        var date = new Date(str);
        var hrs= ("0" + (date.getHours() )).slice(-2);
        var mins= ("0" + (date.getMinutes() )).slice(-2);
        return [ hrs,mins ].join(':');
    }
    
    const convertDate = (str) => {
        var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    useEffect(() => {
        fetchData()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    return (
        <div style={{ width: '90vw'}}>
            <Button type="button" variant='contained' color="primary" style={{ marginTop: '3%', marginLeft: '2.6%', marginBottom: '1%' }} onClick={() => history.push('/schedule-invoice')}>
                Add New Schedule
            </Button>
            <TableContainer component={Paper} sx={{ ml: 4 }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' , backgroundColor: 'rgba(0,0,0,0.3)'}}>Schedule Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' , backgroundColor: 'rgba(0,0,0,0.3)'}}>Client Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' , backgroundColor: 'rgba(0,0,0,0.3)'}}>Invoice Number</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' , backgroundColor: 'rgba(0,0,0,0.3)'}}>Date </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' , backgroundColor: 'rgba(0,0,0,0.3)'}}>Time </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' , backgroundColor: 'rgba(0,0,0,0.3)'}}>Frequency </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' , backgroundColor: 'rgba(0,0,0,0.3)'}}>Edit</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' , backgroundColor: 'rgba(0,0,0,0.3)'}}>Delete</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' , backgroundColor: 'rgba(0,0,0,0.3)'}}>Disable/Enable</TableCell>
                        </TableRow>
                    </TableHead>
                    {isLoading && 
                        <div>Loading....</div>
                    }
                    {!isLoading &&
                    <TableBody>
                        {schedulesList.map((temp) => (
                            <TableRow key={temp._id} >
                                {temp.isDisabled &&
                                <>
                                    <TableCell sx={{ fontWeight: 'light' , fontFamily: 'sans-serif'}}>{temp.scheduleName}</TableCell>
                                    <TableCell sx={{ fontWeight: 'light' , fontFamily: 'sans-serif'}}>{clientData.filter(data => data._id === temp.clientId)[0] && clientData.filter(data => data._id === temp.clientId)[0].client_name}{!clientData.filter(data => data._id === temp.clientId)[0] && <>-deleted- </>}</TableCell>
                                    <TableCell sx={{ fontWeight: 'light' , fontFamily: 'sans-serif'}}>{temp.invoiceNumber}</TableCell>
                                    <TableCell sx={{ fontWeight: 'light' , fontFamily: 'sans-serif'}}>{convertDate(temp.date)}</TableCell>
                                    <TableCell sx={{ fontWeight: 'light' , fontFamily: 'sans-serif'}}>{convertTime(temp.time)}</TableCell>
                                    <TableCell sx={{ fontWeight: 'light' , fontFamily: 'sans-serif'}}>{temp.frequency}</TableCell>
                                </>
                                }
                                {!temp.isDisabled &&
                                <>
                                    <TableCell sx={{ fontWeight: 'bold' , fontFamily: 'sans-serif'}}>{temp.scheduleName}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' , fontFamily: 'sans-serif'}}>{clientData.filter(data => data._id === temp.clientId)[0] && clientData.filter(data => data._id === temp.clientId)[0].client_name}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' , fontFamily: 'sans-serif'}}>{temp.invoiceNumber}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' , fontFamily: 'sans-serif'}}>{convertDate(temp.date)}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' , fontFamily: 'sans-serif'}}>{convertTime(temp.time)}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' , fontFamily: 'sans-serif'}}>{temp.frequency}</TableCell>
                                </>
                                }
                                <TableCell sx={{ fontWeight: 'light' }}>
                                    <Tooltip title='Edit' >
                                        <IconButton 
                                            aria-label="delete-client"
                                            size='small'
                                            onClick={() => history.push(`/schedule/${temp._id}`)}
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    <Tooltip title='Delete'>
                                        <IconButton 
                                            aria-label="delete-client"
                                            size='small'
                                            onClick={() => deleteData(temp._id)}
                                        >
                                            <DeleteIcon color="secondary" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'light' }}>
                                    <Tooltip title={temp.isDisabled ? 'Enable ': 'Disable'}>
                                        <IconButton 
                                            aria-label="delete-client"
                                            size='small'
                                            onClick={() => disableSchedule(temp)}
                                        >
                                            {temp.isDisabled && <CheckCircleIcon />}
                                            {!temp.isDisabled && <DoDisturbIcon  />}
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    }
                </Table>
            </TableContainer>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alert.severity}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default ViewSchedule