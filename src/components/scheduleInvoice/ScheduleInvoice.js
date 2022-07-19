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
    marginTop: '10px',
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
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alert, setMessage] = React.useState({ message: "", severity: "" });
  const [isLoading, setIsLoading] = React.useState(true);
  const frequencyList = [{ item: 'Daily' }, { item: 'Weekly' }, { item: 'Monthly' }, { item: 'Anually' }];
  const INTIAL_STATE = {
    isDisabled: false,
    clientId: '',
    invoiceNumber: '',
    date: null,
    frequency: '',
    time: null,
  };
  const [scheduleData, setScheduleData] = React.useState(INTIAL_STATE);
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
      handleResponse('Failed to fetch details. Please try again.','error');
    }
    try {
      const invoiceData = await axios.get(`${process.env.REACT_APP_API_URL}/invoice`);
      if (invoiceData) {
        setInvoiceHistory(invoiceData.data.data.results);
        setIsLoading(false)
      }
    } catch (error) {
      handleResponse('Failed to fetch details. Please try again.','error');
    }
    if(id){
      try {
        const scheduledData = await axios.get(`${process.env.REACT_APP_API_URL}/schedule/${id}`);
        if (scheduledData) {
          setScheduleData(scheduledData.data.data);
        }
      } catch (error) {
        handleResponse('Failed to fetch details. Please try again.','error');
      }
    }
  }

  function handleResponse(newMessage,newSeverity){
    const message = alert;
    message.message = newMessage;
    message.severity = newSeverity;
    setMessage(message);
    setOpenAlert(true);
  }

  const handleTimeChange = (selectedTime) => {
      const temp={...scheduleData};
      temp.time = selectedTime;
      setScheduleData(temp);
  };

  const handleDateChange = (selectedDate) => {
    const temp = { ...scheduleData };
    temp.date = selectedDate;
    setScheduleData(temp);
  };

  const handleFrequencyChange = (event) => {
      const temp ={...scheduleData};
      temp.frequency = event.target.value;
      setScheduleData(temp);
  };

  async function handleClientChange(event) {
    if (event.target.value !== '') {
      const clientIdNew=event.target.value;
      const temp ={...scheduleData};
      temp.clientId = clientIdNew;
      setScheduleData(temp);
    }
  };

  function handleInvoiceChange(event) {
    const temp = { ...scheduleData };
    temp.invoiceNumber = event.target.value;
    setScheduleData(temp);
  }

  function resetFields() {
    setScheduleData(INTIAL_STATE)
  }

  const uploadDetails = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/schedule`, scheduleData, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        handleResponse('Schedule details uploaded successfully','success');
        resetFields();
      })
      .catch((error) => {
        handleResponse('Failed to upload details. Please try again.','error');
      })
  }

  function goToGenerateInvoice() {
    history.push('/home');
  }

  function updateData() {
    axios.patch(`${process.env.REACT_APP_API_URL}/schedule/${id}`, scheduleData, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        handleResponse('Schedule details updated successfully','success');
      })
      .catch((error) => {
        handleResponse('Failed to update details. Please try again.','error');
      })
  }

  function deleteData() {
    axios.delete(`${process.env.REACT_APP_API_URL}/schedule/${id}`)
      .then((response) => {
        handleResponse('Schedule details deleted successfully','success');
      })
      .catch((error) => {
        handleResponse('Failed to delete details. Please try again.','error');
      })
  }

  function buttonsBar() {
    return (
      <div>
        {!id &&
          <>
            <div style={{ display:'inline-block', marginTop: '10px' ,marginLeft: '300px',marginRight : '30px'}}>
              <Button variant='contained' color='primary' className='button-schedule-page' onClick={() => { goToGenerateInvoice(); }}>
                Create Invoice
              </Button>
            </div>
            <div style={{display:'inline-block',marginTop: '10px' ,marginLeft:'0px'}}>
              <Button type='submit' className='button-schedule-page' variant='contained' color='primary' onClick={() => { uploadDetails(); }}>
                Submit Schedule
              </Button>
            </div>
          </>
        }
        {id &&
          <>
            <div style={{ display:'inline-block',marginTop: '10px' ,marginLeft:'300px',marginRight:'30px'}}>
              <Button variant='contained' color='primary' className='button-schedule-page' onClick={updateData}>
                Save
              </Button>
            </div>
            <div style={{  display:'inline-block',marginTop: '10px' ,marginLeft: '0px'}}>
              <Button type='submit' className='button-schedule-page' variant='contained' color='primary' onClick={deleteData}>
                Delete
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
      {isLoading && <div>loading...</div>}
      {!isLoading && 
      <div className='form-for-schedule box'>
        <div style={{display:'flex' , justifyContent:'space-between'}}> 
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
          <FormControl className={classes.formControl} style={{ marginLeft: '40px' ,marginRight:'40px'}}>
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
                <MenuItem key={item._id} value={item._id} >
                  {item.invoice_number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <br></br>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <div style={{ marginLeft: '40px' }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} style={{marginTop:'0px'}}>
              <KeyboardDatePicker
                disableToolbar
                format='yyyy-MM-dd'
                openTo='year'
                variant='inline'
                margin='normal'
                label='Starting Date'
                value={scheduleData.date}
                onChange={handleDateChange}
                style={{marginTop:'0px'}}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <FormControl className={classes.formControl} style={{ marginLeft: '40px' , marginRight:'40px',marginTop:'0px'}}>
              <InputLabel id='demo-multiple-name-label' style={{marginTop:'0px'}}>Set Frequency</InputLabel>
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
          </div>
        </div>
        <br></br>
        <div style={{display:'flex' , justifyContent:'space-between'}}> 
          <div style={{ marginLeft: '40px',marginRight:'40px' }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} style={{marginTop:'0px'}}>
                <KeyboardTimePicker
                  format='hh:mm a'
                  mask='__:__ _M'
                  label='Select Time'
                  value={scheduleData.time}
                  onChange={(e) => handleTimeChange(e)}
                  style={{marginTop:'0px'}}
                />
              </MuiPickersUtilsProvider>
          </div>
        </div>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
          <Alert onClose={() => setOpenAlert(false)} severity={alert.severity}>
            {alert.message}
          </Alert>
        </Snackbar>
      </div>}
      {buttonsBar()}
    </div>
  )
}