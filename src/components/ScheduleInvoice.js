import React from "react";
import './ScheduleInvoice.css';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
//import DeleteIcon from '@material-ui/icons/Delete';
//import IconButton from '@material-ui/core/IconButton';
//import CircularProgress from '@material-ui/core/CircularProgress';
//import Backdrop from '@material-ui/core/Backdrop';
import axios from 'axios';
import './invoiceForm.css'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
//import Snackbar from '@material-ui/core/Snackbar';
//import InputAdornment from '@mui/material/InputAdornment';
//import TextareaAutosize from '@mui/material/TextareaAutosize';
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
  

  
  
  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  
export default function ScheduleInvoice () {
    const classes = useStyles();
    const [personName, setPersonName] = React.useState('');
  const [clientData, setClientData] = React.useState([]);
  const theme = useTheme();
  const [open,setOpen]=React.useState(false)
  const [invoiceNumber, setInvoiceNumber] = React.useState('0');
  const [selectedDate, setSelectedDate] = React.useState(new Date().toDateString());
  const [selectedTime, setSelectedTime] = React.useState('10:00');
  const [invoiceHistory, setInvoiceHistory] = React.useState([]);
  const [frequency, setFrequency] = React.useState('');
  const frequencyList = [{item : 'Daily'},{item : 'Weekly'},{item : 'Monthly'},{item : 'Anually'}]
  const [time, setTime] = React.useState();
  const timeList = [{item : '9.00 AM'},{item : '10.00 AM'},{item : '11.00 AM'},{item : '12.00 PM'}]
  {frequencyList.map((temp) =>{
    console.log(temp.item);
  })}
  const handleTime = (e) => {
    setTime(e.target.value);
    ScheduleData.time=e.target.value;
  }
  const handleDateChange = (date) => {
    setSelectedDate(date);
    ScheduleData.date=date;
  };
  const handleFrequency = (e) => {
    setFrequency(e.target.value);
    ScheduleData.frequency=e.target.value;
  }
  const fetchData = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/client`)
      .then((res) => {
        setOpen(false)
        setClientData(res.data.data.results);
        //{res.data.data.results.map((name) => {console.log(name)})}
      });
      axios.get(`${process.env.REACT_APP_API_URL}/invoice`)
      .then((res) => {
        setOpen(false);
        setInvoiceHistory(res.data.data.results);
      });
  };
  const [ScheduleData, setScheduleData] = React.useState({
    client: '',
    invoiceNumber:'0',
    date: String(new Date().toDateString()),
    frequency : '',
    time : '9.00 AM',
  });
  {clientData.map((temp) => {
    console.log('thisis sample test',temp)
  })}
  {invoiceHistory.map((temp) => {
    console.log('thisis sample invoice',temp.invoice_number)
  })}
  function handleChange(event) {
    if (event.target.value !== "") {
      ScheduleData.client = event.target.value;
    }
    console.log(ScheduleData);
  };
  function handleInvoiceChange(e) {
    setInvoiceNumber(e.target.value);
    ScheduleData.invoiceNumber=e.target.value;
  }
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
                            {clientData.map((king) => (
                            <MenuItem key={king._id} value={king._id} style={getStyles(king.client_name, personName, theme)}>
                                {king.client_name}
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
                            {invoiceHistory.map((king) => (
                            <MenuItem key={king.invoice_number} value={king.invoice_number} >
                                {king.invoice_number}
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
                    <div className="leftDivision" style={{width:'100%',display:'flex'}}>
                    <FormControl className={classes.formControl} style={{float:'left',marginLeft:'40px',marginTop:'45px',}}>
                        <InputLabel id="demo-mutiple-name-label">Select Time</InputLabel>
                        <Select
                            labelId="demo-mutiple-name-label"
                            id="demo-mutiple-name"
                            defaultValue={""}
                            onChange={(e) => {handleTime(e)}}
                            input={<Input />}
                            MenuProps={MenuProps}
                        >
                            <MenuItem value="">
                            <em>None</em>
                            </MenuItem>
                            {timeList.map((temp) => (
                                <MenuItem key = {temp.item} value={temp.item} >
                                    {temp.item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    </div>
                    
                    
                </div>
            </div>
            <div style={{marginLeft:'300px',marginTop:'10px'}}>
                    <Button type="submit" variant="contained" color="primary" onClick={ console.log(ScheduleData)}>
            Submit Schedule
          </Button>
                    </div>
        </>
    )
}