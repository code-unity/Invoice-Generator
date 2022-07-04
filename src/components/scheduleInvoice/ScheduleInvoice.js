import React from "react";
import './ScheduleInvoice.css';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import '.././invoiceForm.css'
import 'date-fns';
import { useParams } from "react-router-dom";
import DateFnsUtils from '@date-io/date-fns';
import "react-time-picker-input/dist/components/TimeInput.css";
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
    multiline: {
      width: '400px',
    },
    payment: {
      width: '195px',
    },
  
    formControl: {
      margin: theme.spacing(1),
      minWidth: 150,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    invoiceNumber: {
        float:'right',
      marginTop:'10px',
      marginLeft:'10px',
      marginRight: '10px',
      width: '150px',
      height : '50px',
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    item: {
      width: '490px',
      padding: '5px'
    },
    quantity: {
      width: '45px',
      padding: '5px'
    },
    rate: {
      width: '45px',
      padding: '5px'
    },
    math: {
      width: '150px',
      padding: '10px'
    },
    discount: {
      width: '100px',
      padding: '10px'
    },
    type: {
      width: '50px',
      marginLeft: '5px'
    },
    menu: {
      width: '100px',
      padding: '10px'
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column'
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
  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
export default function ScheduleInvoice () {
    let { id } = useParams();
    const classes = useStyles();
    const [clientId, setClientId] = React.useState([]);
    const [invoiceNumber, setInvoiceNumber] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState();
    const [invoiceHistory, setInvoiceHistory] = React.useState([]);
    const [frequency, setFrequency] = React.useState('');
    const history= useHistory();
    const theme = useTheme();
    const [isLoading, setLoading] = React.useState(true);
    const frequencyList = [{item : 'Daily'},{item : 'Weekly'},{item : 'Monthly'},{item : 'Anually'}];
    const [selectedTime, setSelectedTime] = React.useState();
    const [clientName, setClientName]= React.useState("");
    const [scheduleData, setScheduledData] = React.useState({
        client: "",
        invoiceNumber:'',
        date: '',
        frequency : '',
        time : '',
    });
    
    const handleTime = (e) => {
        setSelectedTime(e);
        scheduleData.time=e;
    };
    
    const handleDateChange = (date) => {
        setSelectedDate(date);
        scheduleData.date=date;
    };
    
    const handleFrequency = (e) => {
        setFrequency(e.target.value);
        scheduleData.frequency=e.target.value;
    };

    function handleChange(event) {
        if (event.target.value !== "") {
            scheduleData.client = event.target.value;
            setClientName(event.target.value)
        }
    };
    
    function handleInvoiceChange(e) {
        setInvoiceNumber(e.target.value);
        scheduleData.invoiceNumber=e.target.value;
    }
    
    function uploadDetails(){
        axios.post(`${process.env.REACT_APP_API_URL}/schedule`, scheduleData, { headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
          alert('Schedule created successfully')
          history.push('')
          history.push('/schedule-invoice')

        })
        .catch(error => {
          alert('Failed to create Schedule. Please try again')
        })
    }

    function validateData () {
        if(scheduleData.client_name!=='' && scheduleData.frequency!=='' && scheduleData.invoiceNumber!=='' && scheduleData.date!=='' && scheduleData.time!==''){
            uploadDetails();
        }
        else{
            window.alert("Enter all the Mandatory fields");
        }
    }

    function GoToInvoice(){
        history.push('/home');
    }

    React.useEffect(() => {
      axios.get(`${process.env.REACT_APP_API_URL}/client`)
        .then((res) => {
        setClientId(res.data.data.results);
      })
      .catch((error) => {
        history.push('/schedule-invoice')
      })
      axios.get(`${process.env.REACT_APP_API_URL}/invoice`)
          .then((res) => {
          setInvoiceHistory(res.data.data.results);
          setLoading(false)
      })
      .catch((error) => {
        history.push('/schedule-invoice')
      })
   
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
  
    
    React.useEffect(() => {
        if(id){
          axios.get(`${process.env.REACT_APP_API_URL}/schedule/${id}`)
          .then((response) => {
            scheduleData.client=response.data.data.client
            scheduleData.date=response.data.data.date
            scheduleData.time=response.data.data.time
            scheduleData.frequency=response.data.data.frequency
            scheduleData.invoiceNumber=response.data.data.invoiceNumber
            setClientName(response.data.data.client)
            setFrequency(response.data.data.frequency)
            setInvoiceNumber(response.data.data.invoiceNumber)
            setSelectedDate(response.data.data.date)
            setSelectedTime(response.data.data.time)
          })
          .catch((error) => {
            history.push('/schedule-invoice')
          })
        }
       }, []);// eslint-disable-line react-hooks/exhaustive-deps
       
    function updateData () {
        axios.patch(`${process.env.REACT_APP_API_URL}/schedule/${id}`, scheduleData, { headers: { 'Content-Type': 'application/json' } })
          .then((response) => {
            alert('successfully updated Schedule');
            history.push('/view-schedule');
          })
          .catch((error) => {
           alert('Failed to update Schedule');
          })
      }

      function deleteData () {
        axios.delete(`${process.env.REACT_APP_API_URL}/schedule/${id}`)
          .then((response) => {
            alert('successfully deleted Schedule');
            history.push('/view-schedule')
          })
          .catch((error) => {
            alert('Failed to delete Schedule');
          })
      }

      if(isLoading ){
        return(<div>loading...</div>)
      }

    return(
        <>
            <div className="Main-box">
                <h1 className="Main-box-h1">{id ? ' Edit Schedule ' : 'Add New Schedule'}</h1>
                <div className="form form-for-schedule">
                    <FormControl className={classes.formControl} style={{marginLeft:'40px'}}>
                        <InputLabel id="demo-mutiple-name-label">Select Client</InputLabel>
                            <Select
                                labelId="demo-mutiple-name-label"
                                id="demo-mutiple-name"
                                defaultValue={''}
                                value={clientName}
                                onChange={e => handleChange(e)}
                                input={<Input />}
                                MenuProps={MenuProps}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {clientId.map((client) => (
                                    <MenuItem key={client._id} value={client._id} style={getStyles(client.client_name, clientName, theme)}>
                                        {client.client_name}
                                    </MenuItem>
                                ))}
                            </Select>
                    </FormControl>
                    <FormControl className={classes.formControl} style={{float:'right',marginLeft:'50px',marginRight:'40px'}}>
                        <InputLabel id="demo-mutiple-name-label">Invoice Number</InputLabel>
                            <Select
                                labelId="demo-mutiple-name-label"
                                id="demo-mutiple-name"
                                defaultValue={""}
                                value={invoiceNumber}
                                onChange={(e) => {handleInvoiceChange(e)}}
                                input={<Input />}
                                MenuProps={MenuProps}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {invoiceHistory.map((item) => (
                                    <MenuItem key={item.invoice_number} value={item.invoice_number} >
                                        {item.invoice_number}
                                    </MenuItem>
                                ))}
                            </Select>
                    </FormControl>
                    <br></br>
                    <div style={{ float: "left", marginTop: '30px', marginRight: "15px", marginBottom: '10px', marginLeft: "40px" }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                format="yyyy-MM-dd"
                                openTo="year"
                                variant='inline'
                                margin="normal"
                                label="Starting Date"
                                minDate={Date.now()}
                                value={selectedDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <FormControl className={classes.formControl} style={{float:'right',marginLeft:'50px',marginTop:'45px',marginRight:'40px'}}>
                        <InputLabel id="demo-mutiple-name-label">Set Frequency</InputLabel>
                          <Select
                              labelId="demo-mutiple-name-label"
                              id="demo-mutiple-name"
                              defaultValue={""}
                              value={frequency}
                              onChange={(e) => {handleFrequency(e)}}
                              input={<Input />}
                              MenuProps={MenuProps}
                          >
                              <MenuItem value="">
                                  <em>None</em>
                              </MenuItem>
                              {frequencyList.map((temp) => (
                                  <MenuItem key = {temp.item} value={temp.item} >
                                      {temp.item}
                                  </MenuItem>
                              ))}
                          </Select>
                    </FormControl>
                    <div className='time-picker-div'>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                            format="hh:mm a"
                            mask="__:__ _M"
                            label='Select Time'
                            value={selectedTime}
                            onChange={(e)=>handleTime(e)}
                        />
                    </MuiPickersUtilsProvider>
                    </div>
                    <div>
                        {!id &&
                            <>
                                <div style={{float:'left' ,marginTop:'150px'}}>
                                    <Button variant="contained" color="primary" className='button-schedule-page' onClick={ () => {GoToInvoice();}}>
                                        Create Invoice
                                    </Button>
                                </div>
                                <div style={{float:'right', marginTop:'150px'}}>
                                    <Button type="submit" className='button-schedule-page' variant="contained" color="primary"onClick={ () => {validateData();}}>
                                        Submit Schedule
                                    </Button>
                                </div>
                            </> 
                        }
                        { id &&
                            <>
                                <div style={{float:'left', marginTop:'150px'}}>
                                    <Button type="submit" className='button-schedule-page' variant="contained" color="primary"onClick={deleteData}>
                                        Delete
                                    </Button>
                                </div>
                                <div style={{float:'right' ,marginTop:'150px'}}>
                                    <Button variant="contained" color="primary" className='button-schedule-page' onClick={ updateData}>
                                        Save
                                    </Button>
                                </div>
                            </> 
                        }
                    </div>
                </div>
            </div>
        </>
    )
}