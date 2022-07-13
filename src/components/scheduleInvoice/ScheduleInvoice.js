import React from 'react';
import './ScheduleInvoice.css';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '.././invoiceForm.css'
import 'date-fns';
import { useParams } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import 'react-time-picker-input/dist/components/TimeInput.css';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    maxWidth: 300,
  },
  invoiceNumber: {
    float: 'right',
    marginTop: '10px',
    marginLeft: '10px',
    marginRight: '10px',
    width: '150px',
    height: '50px',
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ScheduleInvoice() {
  const { id } = useParams();
  const classes = useStyles();
  const [clientData, setClientData] = React.useState([]); 
  const [invoiceHistory, setInvoiceHistory] = React.useState([]); 
  const history = useHistory();
  const [schedulesList, setSchedulesList] = React.useState([])
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alert, setMessage] = React.useState({ message: "", severity: "" });
  const [isLoading, setIsLoading] = React.useState(true);
  const frequencyList = [{ item: 'Daily' }, { item: 'Weekly' }, { item: 'Monthly' }, { item: 'Anually' }];
  const [scheduleData, setScheduleData] = React.useState({
    isDisabled: false,
    scheduleName: '',
    clientId: '',
    invoiceNumber: '',
    date: null,
    frequency: '',
    time: null,
  });
  React.useEffect(() => {
    fetchRequiredData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRequiredData = async () => {
    try {
      const clientData = await axios.get(`${process.env.REACT_APP_API_URL}/client`);
      if (clientData) {
        setClientData(clientData.data.data.results);
      }
    } catch (error) {
      const message = alert;
      message.message = "Failed to fetch details. Please try again";
      message.severity = "error";
      setMessage(message);
      setOpenAlert(true);
    }
    try {
      const invoiceData = await axios.get(`${process.env.REACT_APP_API_URL}/invoice`);
      if (invoiceData) {
        setInvoiceHistory(invoiceData.data.data.results);
      }
    } catch (error) {
      const message = alert;
      message.message = "Failed to fetch details. Please try again";
      message.severity = "error";
      setMessage(message);
      setOpenAlert(true);
    }

    try {
      const schedulesData = await axios.get(`${process.env.REACT_APP_API_URL}/schedule`);
      if (schedulesData) {
        setSchedulesList(schedulesData.data.data.results);
      }
    } catch (error) {
      const message = alert;
      message.message = "Failed to fetch details. Please try again";
      message.severity = "error";
      setMessage(message);
      setOpenAlert(true);
      setIsLoading(false)
    }
    if(id){
      try {
        const scheduledData = await axios.get(`${process.env.REACT_APP_API_URL}/schedule/${id}`);
        if (scheduledData) {
          setScheduleData(scheduledData.data.data);
        }
      } catch (error) {
        const message = alert;
        message.message = "Failed to fetch details. Please try again";
        message.severity = "error";
        setMessage(message);
        setOpenAlert(true);
      }
    }
  }

  const handleTimeChange = (e) => {
      const temp={...scheduleData};
      temp.time = e;
      setScheduleData(temp);
  };

  const handleDateChange = (date) => {
    const temp = { ...scheduleData };
    temp.date = date;
    setScheduleData(temp);
  };

  const handleFrequencyChange = (event) => {
      const temp ={...scheduleData};
      temp.frequency = event.target.value;
      setScheduleData(temp);
  };

  function handleClientChange(event) {
    if (event.target.value !== '') {
      const clientIdNew=event.target.value;
      const temp ={...scheduleData};
      temp.clientId = clientIdNew;
      const count = schedulesList.reduce((accumulator, data) => {
        if (data.clientId === clientIdNew) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);
      temp.scheduleName = `${clientData.find(data => data._id === clientIdNew).client_name}-CU-${(count + 1)}`;
      setScheduleData(temp);
    }
  };

  function handleInvoiceChange(e) {
    const temp = { ...scheduleData };
    temp.invoiceNumber = e.target.value;
    setScheduleData(temp);
  }

  function resetFields(){
    const temp={...scheduleData};
    temp.isDisabled=false
    temp.scheduleName=''
    temp.clientId=''
    temp.date=null
    temp.time=null
    temp.invoiceNumber=''
    temp.frequency=''
    setScheduleData(temp)
  }

  

  const uploadDetails = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/schedule`, scheduleData, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        const message = alert;
        message.message = "Schedule details uploaded successfully";
        message.severity = "success";
        setMessage(message);
        setOpenAlert(true);
        resetFields();
      })
      .catch((error) => {
        const message = alert;
        message.message = "Failed to upload Schedule details. Please try again";
        message.severity = "error";
        setMessage(message);
        setOpenAlert(true);
      })
  }

  function goToGenerateInvoice() {
    history.push('/home');
  }
  

  function updateData() {
    axios.patch(`${process.env.REACT_APP_API_URL}/schedule/${id}`, scheduleData, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        const message = alert;
        message.message = "Schedule details updated successfully";
        message.severity = "success";
        setMessage(message);
        setOpenAlert(true);
      })
      .catch((error) => {
        const message = alert;
        message.message = "Failed to update schedule details. Please try again. ";
        message.severity = "error"
        setMessage(message);
        setOpenAlert(true);
      })
  }

  function deleteData() {
    axios.delete(`${process.env.REACT_APP_API_URL}/schedule/${id}`)
      .then((response) => {
        const message = alert;
        message.message = "Schedule details deleted successfully";
        message.severity = "success";
        setMessage(message);
        setOpenAlert(true);
      })
      .catch((error) => {
        const message = alert;
        message.message = "Failed to delete schedule details. Please try again. ";
        message.severity = "error"
        setMessage(message);
        setOpenAlert(true);
      })
  }

  function buttonsBar() {
    return (
      <div>
        {!id &&
          <>
            <div style={{ float: 'left', marginTop: '150px' }}>
              <Button variant='contained' color='primary' className='button-schedule-page' onClick={() => { goToGenerateInvoice(); }}>
                Create Invoice
              </Button>
            </div>
            <div style={{ float: 'right', marginTop: '150px' }}>
              <Button type='submit' className='button-schedule-page' variant='contained' color='primary' onClick={() => { uploadDetails(); }}>
                Submit Schedule
              </Button>
            </div>
          </>
        }
        {id &&
          <>
            <div style={{ float: 'left', marginTop: '150px' }}>
              <Button type='submit' className='button-schedule-page' variant='contained' color='primary' onClick={deleteData}>
                Delete
              </Button>
            </div>
            <div style={{ float: 'right', marginTop: '150px' }}>
              <Button variant='contained' color='primary' className='button-schedule-page' onClick={updateData}>
                Save
              </Button>
            </div>
          </>
        }
      </div>
    )
  }

  return (
    <div className='Main-box'>
      <h1 className='Main-box-h1'>{id ? 'Edit Schedule ' : 'Add New Schedule'}</h1>
      {!isLoading && <div>loading...</div>}
      {isLoading && <div className='form form-for-schedule'>
        <FormControl className={classes.formControl} style={{ marginLeft: '40px' }}>
          <InputLabel id='demo-multiple-name-label'>Select Client</InputLabel>
          <Select
            labelId='demo-multiple-name-label'
            id='demo-multiple-name'
            defaultValue=''
            value={scheduleData.clientId}
            onChange={handleClientChange}
            input={<Input />}
            MenuProps={MenuProps}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {clientData.map((client) => (
              <MenuItem key={client._id} value={client._id} >
                {client.client_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl} style={{ float: 'right', marginLeft: '50px', marginRight: '40px' }}>
          <InputLabel id='demo-multiple-name-label'>Invoice Number</InputLabel>
          <Select
            labelId='demo-multiple-name-label'
            id='demo-multiple-name'
            defaultValue={''}
            value={scheduleData.invoiceNumber}
            onChange={(e) => { handleInvoiceChange(e) }}
            input={<Input />}
            MenuProps={MenuProps}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {invoiceHistory.map((item) => (
              <MenuItem key={item._id} value={item.invoice_number} >
                {item.invoice_number}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br></br>
        <div style={{ float: 'left', marginTop: '30px', marginRight: '15px', marginBottom: '10px', marginLeft: '40px' }}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              format='yyyy-MM-dd'
              openTo='year'
              variant='inline'
              margin='normal'
              label='Starting Date'
              minDate={Date.now()}
              value={scheduleData.date}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <FormControl className={classes.formControl} style={{ float: 'right', marginLeft: '50px', marginTop: '45px', marginRight: '40px' }}>
          <InputLabel id='demo-multiple-name-label'>Set Frequency</InputLabel>
          <Select
            labelId='demo-multiple-name-label'
            id='demo-multiple-name'
            defaultValue={''}
            value={scheduleData.frequency}
            onChange={(e) => { handleFrequencyChange(e) }}
            input={<Input />}
            MenuProps={MenuProps}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {frequencyList.map((temp) => (
              <MenuItem key={temp.item} value={temp.item} >
                {temp.item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className='time-picker-div'>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardTimePicker
              format='hh:mm a'
              mask='__:__ _M'
              label='Select Time'
              value={scheduleData.time}
              onChange={(e) => handleTimeChange(e)}
            />
          </MuiPickersUtilsProvider>
        </div>
        {buttonsBar()}
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
          <Alert onClose={() => setOpenAlert(false)} severity={alert.severity}>
            {alert.message}
          </Alert>
        </Snackbar>
      </div>}
    </div>
  )
}