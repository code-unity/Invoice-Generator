import React from "react";
import './ScheduleInvoice.css';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import '.././invoiceForm.css'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import TimePicker from 'react-time-picker-input';
import "react-time-picker-input/dist/components/TimeInput.css"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
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
  
export default function ScheduleInvoice () {
    const classes = useStyles();
    const [clientId, setClientId] = React.useState([]);
    const [invoiceNumber, setInvoiceNumber] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(Date.now());
    const [invoiceHistory, setInvoiceHistory] = React.useState([]);
    const [frequency, setFrequency] = React.useState('');
    const frequencyList = [{item : 'Daily'},{item : 'Weekly'},{item : 'Monthly'},{item : 'Anually'}];
    const [selectedTime, setSelectedTime] = React.useState('');
    const [scheduleData, setScheduledData] = React.useState({
        client: '',
        invoiceNumber:'0',
        date: String(new Date().toDateString()),
        frequency : '',
        time : '',
    });
    const convert = (str) => {
        var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    const handleTime = (e) => {
        setSelectedTime(e);
        scheduleData.time=e;
    };
    
    const handleDateChange = (date) => {
        const dateInReqFormat=convert(date);
        setSelectedDate(dateInReqFormat);
        scheduleData.date=dateInReqFormat;
    };
    
    const handleFrequency = (e) => {
        setFrequency(e.target.value);
        scheduleData.frequency=e.target.value;
    };
 
    function handleChange(event) {
        if (event.target.value !== "") {
            scheduleData.client = event.target.value;
        }
    };
    function handleInvoiceChange(e) {
        setInvoiceNumber(e.target.value);
        scheduleData.invoiceNumber=e.target.value;
    }

    const fetchData = () => {
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/client`)
            .then((res) => {
            setClientId(res.data.data.results);});
        }
        catch(err) {
            // To be filled
        }
        try{
            axios.get(`${process.env.REACT_APP_API_URL}/invoice`)
            .then((res) => {
            setInvoiceHistory(res.data.data.results);});
        }
        catch(err){
            // To be filled 
        }
    };
    React.useEffect(() => {
        fetchData();
    }, []);
    return(
        <>
            <div className="Main-box">
                <h1 className="Main-box-h1">Schedule Invoice</h1>
                <div className="form form-for-schedule">
                    <FormControl className={classes.formControl} style={{marginLeft:'40px'}}>
                        <InputLabel id="demo-mutiple-name-label">Select Client</InputLabel>
                        <Select
                            labelId="demo-mutiple-name-label"
                            id="demo-mutiple-name"
                            defaultValue={""}
                            onChange={e => handleChange(e)}
                            input={<Input />}
                            MenuProps={MenuProps}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {clientId.map((client) => (
                                <MenuItem key={client._id} value={client._id} >
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
                            variant="inline"
                            format="yyyy-MM-dd"
                            margin="normal"
                            label="Starting Date"
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
                        Pick Time
                        <TimePicker
                            value={selectedTime}
                            onChange={(e)=>handleTime(e)} 
                        />
                    </div>
                    <div style={{float:'left' ,marginTop:'150px'}}>
                    <Button type="submit" className='button-schedule-page' variant="contained" color="primary">
                        Create Invoice
                    </Button>
                </div>
                <div style={{float:'right', marginTop:'150px'}}>
                    <Button type="submit" className='button-schedule-page' variant="contained" color="primary" onClick={ console.log(scheduleData)}>
                        Submit Schedule
                    </Button>
                </div>
                </div>
            </div>
        </>
    )
}