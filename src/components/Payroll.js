import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import axios from 'axios';
import './payslipform.css'
import { useParams } from "react-router-dom";
import history from '../history';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import "react-datepicker/dist/react-datepicker.css";
import Tooltip from "@material-ui/core/Tooltip";

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
  assignedto: {
    marginRight: '10px',
    float: 'right',
    width: '150px',
    padding: '10px'
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


export default function FormPropsTextFields() {
  const classes = useStyles();
  const theme = useTheme();
  let { id } = useParams();
  const inputAdornment= '₹'
  const [personName, setPersonName] = React.useState('');
  const [candidateData, setCandidatedata] = React.useState([]);
  const [alert, setMessage] = React.useState({ message: "", severity: "" });
  const [openAlert, setOpenAlert] = React.useState(false);
  const [clientData, setClientdata] = React.useState([]);
  const [netsalary , setNetsalary]=React.useState(0);
  const [netearnings , setNetearnings]=React.useState(0);
  const [netdeductions , setNetdeductions]=React.useState(0);
  const [totaltax , setTotaltax]=React.useState(0);
  const [openDownloader, setOpenDownloader] = React.useState(false);
  const [openuploader, setOpenuploader] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openLoader, setOpenLoader] = React.useState(false);
  const [date, setDate] = React.useState(Date.now());
  const year = (new Date().getFullYear());
  const month =(new Date().toLocaleString('default',{month:'long'}));
  const [payslipData, setState] = React.useState({
    isActive:'true',
    candidate:'',
    candidate_id:'',
    type:'',
    date: month + ' '+year,
    Designation: '',
    assigned:'',
    Basic: 0,
    D_allow: 0,
    HR_allow: 0,
    Bonus: 0,
    conveyance:0,
    others:0,
    total_earnings:0,
    prof_tax:0,
    p_f_employer:0,
    p_f_employee:0,
    total_tax:0,
    td_S:0,
    other_tax:0, 
    net_deductions:0,
    net_salary:0,
    remarks:'',
  });

  function handleChange(event) {
    if (event.target.value !== "") {
      let data = candidateData.filter(eachObj => eachObj._id === event.target.value);
      const tempDefault = payslipData;
      const temp2=clientData.filter(eachObj => eachObj._id === data[0].assigned_to )
      tempDefault.Designation=data[0].Designation;
      tempDefault.Basic = data[0].Basic;
      tempDefault.D_allow = data[0].D_allow;
      tempDefault.HR_allow = data[0].HR_allow;
      tempDefault.Bonus = data[0].Bonus;
      tempDefault.others = data[0].others;
      tempDefault.candidate=data[0].name;
      tempDefault.candidate_id=data[0]._id;
      tempDefault.type=data[0].type;
      tempDefault.conveyance=data[0].conveyance;
      tempDefault.prof_tax=data[0].prof_tax;
      tempDefault.p_f_employee=data[0].p_f_employee;
      tempDefault.p_f_employer=data[0].p_f_employer;
      tempDefault.td_S=data[0].td_S;
      tempDefault.other_tax=data[0].other_tax;
      tempDefault.total_earnings=data[0].total_earnings;
      tempDefault.assigned=temp2[0].client_name;
      tempDefault.total_tax=parseFloat(tempDefault.prof_tax)+parseFloat(tempDefault.p_f_employee);
      tempDefault.net_deductions=parseFloat(tempDefault.total_tax)+parseFloat(tempDefault.td_S)+parseFloat(tempDefault.other_tax);
      tempDefault.net_salary=tempDefault.total_earnings-tempDefault.net_deductions;
      setNetsalary(tempDefault.net_salary);
      setPersonName(tempDefault.candidate_id);
      setNetearnings(payslipData.total_earnings);
      setNetdeductions(payslipData.net_deductions);
      setTotaltax(tempDefault.total_tax);
    }

  };
  const fetchData = () => {
    setOpen(true);
      axios.get(`${process.env.REACT_APP_API_URL}/candidate`)
      .then((res) => {
        setOpen(false);
        setCandidatedata(res.data.data);
        
      });
      axios.get(`${process.env.REACT_APP_API_URL}/client`)
      .then((res) => {
        setClientdata(res.data.data.results);
        setOpen(false);
        
      }); 
  };
  const fetchpayslipData = async() => {
    await axios.get(`${process.env.REACT_APP_API_URL}/payslip/${id}`)
      .then((response) => {
        console.log(response.data.data);
        setNetdeductions(response.data.data.net_deductions);
        setNetearnings(response.data.data.total_earnings);
        setNetsalary(response.data.data.net_salary);
        setTotaltax( response.data.data.total_tax);
        setPersonName(response.data.data.candidate_id);
        (setState(response.data.data));
      })
      
      .catch((error) => {
        console.log("failed")
        history.push('/payslip')
      })
  }

  React.useEffect(() => {      
      fetchData();
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if(id){
      fetchpayslipData()}
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };




  ///functions for Calculations
  function handleChangesforBasic(event) {

    if (payslipData.net_salary !== 0)
      {payslipData.net_salary= parseFloat(payslipData.net_salary) - (parseFloat(payslipData.Basic)+parseFloat(payslipData.D_allow)+parseFloat(payslipData.HR_allow)-parseFloat(payslipData.net_deductions));}
    if (payslipData.total_earnings !== 0)
      {payslipData.total_earnings= parseFloat(payslipData.total_earnings) - (parseFloat(payslipData.Basic)+parseFloat(payslipData.D_allow)+parseFloat(payslipData.HR_allow));}
    if (payslipData.total_tax !== 0)
      {payslipData.total_tax = parseFloat( payslipData.total_tax) -  (payslipData.p_f_employee);}
    if (payslipData.net_deductions !== 0)
      {payslipData.net_deductions = parseFloat( payslipData.net_deductions) -  parseFloat(payslipData.p_f_employee) -parseInt(payslipData.td_S);} 
  
    if (event.target.value === ""){payslipData.Basic=0;}
    else{payslipData.Basic=parseInt(event.target.value);}

    payslipData.D_allow=payslipData.Basic*30/100
    payslipData.HR_allow=payslipData.Basic*45/100
    payslipData.total_earnings+=(payslipData.Basic+payslipData.D_allow+payslipData.HR_allow)
    payslipData.p_f_employee=Math.ceil((payslipData.Basic+payslipData.D_allow)*12/100);
    payslipData.total_tax +=  payslipData.p_f_employee
    payslipData.td_S=Math.ceil(payslipData.total_earnings*0.1)
    payslipData.net_deductions +=  parseInt(payslipData.p_f_employee + payslipData.td_S)
    payslipData.net_salary+=(payslipData.Basic+payslipData.D_allow+payslipData.HR_allow-payslipData.net_deductions)
    setNetsalary(payslipData.net_salary);
    setNetearnings(payslipData.total_earnings);
    setTotaltax( payslipData.total_tax);
    setNetdeductions(payslipData.net_deductions);

  }

  function handleChangesforD_allow(event) {
    
    if (payslipData.net_salary !== 0)
    { payslipData.net_salary-=((payslipData.D_allow)-(payslipData.net_deductions));}
    if (payslipData.total_earnings !== 0)
    { payslipData.total_earnings-=payslipData.D_allow;}
    if (payslipData.total_tax !== 0)
    { payslipData.total_tax = parseFloat( payslipData.total_tax) -  parseFloat(payslipData.p_f_employee);}
    if (payslipData.net_deductions !== 0)
    { payslipData.net_deductions = ( payslipData.net_deductions) -  (payslipData.p_f_employee+payslipData.td_S);}
  

    if (event.target.value === ""){
    payslipData.D_allow=0;}
    else{
    payslipData.D_allow=parseInt(event.target.value);}

    payslipData.total_earnings+=payslipData.D_allow;
    payslipData.p_f_employee=Math.ceil((payslipData.Basic+payslipData.D_allow)*12/100)
    payslipData.total_tax +=  payslipData.p_f_employee
    payslipData.td_S=Math.ceil(payslipData.total_earnings*0.1);
    payslipData.net_deductions = parseInt(payslipData.net_deductions) + (payslipData.p_f_employee + payslipData.td_S);
    payslipData.net_salary+=(payslipData.D_allow - payslipData.net_deductions);

    setNetsalary(payslipData.net_salary);
    setNetearnings(payslipData.total_earnings);
    setTotaltax( payslipData.total_tax);
    setNetdeductions(payslipData.net_deductions)
  }

  function handleChangesforHR_allow(event) {
    
    if (payslipData.net_salary !== 0){
    payslipData.net_salary-=((payslipData.HR_allow)-(payslipData.net_deductions));}
    if (payslipData.total_earnings !== 0)
    { payslipData.total_earnings-=payslipData.HR_allow;}
    if (payslipData.net_deductions !== 0){
    payslipData.net_deductions = parseFloat( payslipData.net_deductions) - parseFloat(payslipData.td_S);
    }

    if (event.target.value === ""){
    payslipData.HR_allow=0;}
    else{
    payslipData.HR_allow=parseInt(event.target.value);}

    payslipData.total_earnings+=payslipData.HR_allow;
    payslipData.td_S=Math.ceil(payslipData.total_earnings*0.1)
    payslipData.net_deductions = parseInt(payslipData.net_deductions) +parseFloat(payslipData.td_S);
    payslipData.net_salary+=(payslipData.HR_allow-payslipData.net_deductions);


    setNetsalary(payslipData.net_salary);
    setNetearnings(payslipData.total_earnings);
    setNetdeductions(payslipData.net_deductions)

  }

  function handleChangesforconveyance(event) {
    if (payslipData.net_salary !== 0){
    payslipData.net_salary-=((payslipData.conveyance)-(payslipData.net_deductions));}
    if (payslipData.total_earnings !== 0)
    {payslipData.total_earnings-=payslipData.conveyance;}
    if (payslipData.net_deductions !== 0){
    payslipData.net_deductions = parseFloat( payslipData.net_deductions) - parseFloat(payslipData.td_S);}

    if (event.target.value === ""){
    payslipData.conveyance=0;}
    else{
    payslipData.conveyance=parseInt(event.target.value);}

    payslipData.total_earnings+=payslipData.conveyance;
    payslipData.td_S=Math.ceil(payslipData.total_earnings*0.1);
    payslipData.net_deductions = parseInt(payslipData.net_deductions) +parseFloat(payslipData.td_S);
    payslipData.net_salary+=(payslipData.conveyance-payslipData.net_deductions);

    setNetsalary(payslipData.net_salary);
    setNetearnings(payslipData.total_earnings);
    setNetdeductions(payslipData.net_deductions)

  }

  function handleChangesforBonus(event) {
    if (payslipData.net_salary !== 0)
    {payslipData.net_salary-=((payslipData.Bonus)-(payslipData.net_deductions));}
    if (payslipData.total_earnings !== 0)
    {payslipData.total_earnings-=payslipData.Bonus;}
    if (payslipData.net_deductions !== 0){
    payslipData.net_deductions = parseFloat( payslipData.net_deductions) - parseFloat(payslipData.td_S);}

    if(event.target.value=== ""){
      payslipData.Bonus=0}
    else{
      payslipData.Bonus=parseInt(event.target.value);}
    
    
    payslipData.total_earnings+=payslipData.Bonus;
    payslipData.td_S=Math.ceil(payslipData.total_earnings*0.1).toFixed(1)
    payslipData.net_deductions = parseInt(payslipData.net_deductions) +parseFloat(payslipData.td_S);
    payslipData.net_salary+=(payslipData.Bonus-payslipData.net_deductions);

    setNetsalary(payslipData.net_salary);
    setNetearnings(payslipData.total_earnings);
    setNetdeductions(payslipData.net_deductions)

  }
  
  function handleChangesforOthers(event) {
    if (payslipData.net_salary !== 0){
    payslipData.net_salary-=((payslipData.others)-(payslipData.net_deductions));}
    if (payslipData.total_earnings !== 0)
    { payslipData.total_earnings-=payslipData.others;}
    if (payslipData.net_deductions !== 0){
    payslipData.net_deductions = parseFloat( payslipData.net_deductions) - parseFloat(payslipData.td_S);}

    if(event.target.value=== ""){
      payslipData.others=0}
    else{
      payslipData.others=parseInt(event.target.value);}
      
    payslipData.total_earnings+=payslipData.others;
    payslipData.td_S=Math.ceil(payslipData.total_earnings*0.1).toFixed(1);
    payslipData.net_deductions = parseInt(payslipData.net_deductions) +parseFloat(payslipData.td_S);
    payslipData.net_salary+=(payslipData.others-payslipData.net_deductions);

    setNetsalary(payslipData.net_salary);
    setNetearnings(payslipData.total_earnings);
    setNetdeductions(payslipData.net_deductions)

  }

  function handleChangesforprof_tax(event) {
    if (payslipData.net_salary !== 0){
      payslipData.net_salary=parseInt(payslipData.net_salary)+parseInt(payslipData.prof_tax);}
    if (payslipData.net_deductions !== 0){
    payslipData.net_deductions-=payslipData.prof_tax;}
    if (payslipData.total_tax !== 0){
    payslipData.total_tax-=payslipData.prof_tax;}
    

    if (event.target.value === ""){
    payslipData.prof_tax=0;}
    else{
    payslipData.prof_tax=parseInt(event.target.value);}

    payslipData.net_salary-=(payslipData.prof_tax);
    payslipData.net_deductions+=(payslipData.prof_tax);
    payslipData.total_tax+=(payslipData.prof_tax);

    setNetsalary(payslipData.net_salary);
    setNetdeductions(payslipData.net_deductions);
    setTotaltax(payslipData.total_tax)
  }

  function handleChangesforp_femployee(event) {
    payslipData.net_salary=parseInt(payslipData.net_salary)+parseInt(payslipData.p_f_employee);
    payslipData.net_deductions-=payslipData.p_f_employee;
    payslipData.total_tax-=payslipData.p_f_employee;

    if (event.target.value === ""){
    payslipData.p_f_employee=0;}
    else{
    payslipData.p_f_employee=parseInt(event.target.value);}

    payslipData.net_salary-=payslipData.p_f_employee;
    payslipData.net_deductions+=payslipData.p_f_employee;
    payslipData.total_tax+=payslipData.p_f_employee;

    setNetsalary(payslipData.net_salary);
    setNetdeductions(payslipData.net_deductions);
    setTotaltax(payslipData.total_tax)
  }

  function handleChangesforTDS(event) {
    payslipData.net_salary=parseInt(payslipData.net_salary)+parseInt(payslipData.td_S);
    payslipData.net_deductions-=parseInt(payslipData.td_S);

    if (event.target.value === ""){
    payslipData.td_S=0;}
    else{
    payslipData.td_S=parseInt(event.target.value);}

    payslipData.net_salary-=parseInt(payslipData.td_S);
    payslipData.net_deductions+=parseInt(payslipData.td_S);

    setNetsalary(payslipData.net_salary);
    setNetdeductions(payslipData.net_deductions);
  }


  function handleChangesforOthertaxes(event) {
    payslipData.net_salary=parseInt(payslipData.net_salary)+parseInt(payslipData.other_tax);
    payslipData.net_deductions-=payslipData.other_tax;

    if(event.target.value=== ""){
      payslipData.other_tax=0}
    else{
      payslipData.other_tax=parseInt(event.target.value);}

    payslipData.net_salary-=payslipData.other_tax;
    payslipData.net_deductions+=payslipData.other_tax;

    setNetsalary(parseInt(payslipData.net_salary));
    setNetdeductions(payslipData.net_deductions);
  }
  
  const convert = (str) => {
    var date = new Date(str),
    mnth = date.toLocaleString('en-us', { month: 'long' });
    
    return [mnth, date.getFullYear()].join(" ");
}
  const handleDateChange = (date) => {
    const dateInReqFormat=convert(date);
    setDate(dateInReqFormat);
    payslipData.date=dateInReqFormat;
};

  function handleDatachange(event){
    setState({
      ...payslipData,
      [event.target.name]: event.target.value
    })
}

let b64;
function uploadandprintData(){  
  setOpenDownloader(!open);
  axios.post(`${process.env.REACT_APP_API_URL}/payslip`,payslipData, { headers: { 'Content-Type': 'application/json' } })
  .then((response) => {
    console.log(response)
    setOpenDownloader(false);
    setOpen(false);
    const message = alert;
    message.message = "Payslip generated successfully";
    message.severity = "success";
    setMessage(message);
    setOpenAlert(true);
    changeFieldValue();
    b64 = response.data.pdf;
    var link = document.createElement('a');
    link.innerHTML = 'Download PDF file';
    link.download = 'file.pdf';
    link.href = 'data:application/octet-stream;base64,' + b64;
    document.body.appendChild(link);
    link.click();
    link.remove();
  })

  
  .catch(error => {setOpenLoader(false);
    const message = alert;
    message.message = "Uploading & Printing Payslip Details Unsuccessful";
    message.severity = "error"
    setMessage(message);
    setOpen(false);})
  
}

function uploadData(){  
  setOpenuploader(!open);
  axios.post(`${process.env.REACT_APP_API_URL}/payslip`,payslipData, { headers: { 'Content-Type': 'application/json' } })
  .then((response) => {
    console.log(response)
    setOpenuploader(false);
    setOpen(false);
    const message = alert;
    changeFieldValue();
    message.message = "Payslip saved successfully";
    message.severity = "success";
    setMessage(message);
    setOpenAlert(true);
  })

  
  .catch(error => {setOpenLoader(false);
    const message = alert;
    message.message = "Uploading Payslip Details Unsuccessful";
    message.severity = "error"
    setMessage(message);
    setOpen(false);})
  
}

function changeFieldValue() {
  const fieldValues = {
    isActive:'true',
    candidate:'',
    candidate_id:'',
    type:'',
    date:year + '-' + (month+1),
    Designation: '',
    assigned:'',
    Basic: 0,
    D_allow: 0,
    HR_allow: 0,
    Bonus: 0,
    conveyance:0,
    others:0,
    total_earnings:0,
    prof_tax:0,
    p_f_employer:0,
    p_f_employee:0,
    total_tax:0,
    td_S:0,
    other_tax:0, 
    net_deductions:0,
    net_salary:0,
    remarks:'',
  }

  setState(fieldValues);
  setNetearnings(0);
  setNetdeductions(0);
  setNetsalary(0);
  setTotaltax(0);
  setPersonName('');
  setDate(month + ' '+year,);
}
const deleteData = () => {
  setOpenLoader(true)
  axios.delete(`${process.env.REACT_APP_API_URL}/payslip/${id}`)
    .then((response) => {
      setOpenLoader(false);
      const message = alert;
      message.message = "Paysilp Details Deletion Successfully";
      message.severity = 'success';
      setMessage(message);
      setOpen(false);
      history.push('/paysliphistory')
    })
    .catch((error) => {
      setOpenLoader(false);
      const message = alert;
      message.message = "Deletion Payslip Details Unsuccessful";
      message.severity = "error"
      setMessage(message);
      setOpen(false);
    })
}

function updateData () {
  setOpenLoader(true);
  console.log(payslipData)
  axios.put(`${process.env.REACT_APP_API_URL}/payslip/${id}`, payslipData, { headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
      setOpenLoader(false);
      const message = alert;
      message.message = "Payslip Updated Successfully";
      message.severity = 'success';
      setMessage(message);
      setOpen(false);
      history.push('/view-payslip');
    })
    .catch((error) => {
      setOpenLoader(false);
      const message = alert;
      message.message = " Failed to Update Payslip";
      message.severity = "error"
      setMessage(message);
      setOpen(false);    
    })
}


  return (
    <div >
      <h1 style={{ marginLeft: '300px', marginTop: '50px' }}>
        {id? 'Edit Payslip ' : 'Generate Payslip'}
      </h1>
      <div className="form">

        <div className='top' style={{ display:"flex" }}>
          <div className='candidate'style={{ marginLeft:"20px"}}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-mutiple-name-label">Select Candidate</InputLabel>
          <Select
            labelId="demo-mutiple-name-label"
            id="demo-mutiple-name"
            defaultValue={""}
            value={personName}
            onChange={e => handleChange(e)}
            input={<Input />}
            MenuProps={MenuProps}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {candidateData.map((name) => (
              <MenuItem key={name._id} value={name._id} style={getStyles(name.name, personName, theme)}>
                {name.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> 
        </div>
  
        
        <div className={classes.assignedto} style={{width:'150px', textalign:'center',flexGrow:"1",marginLeft:"50px"}}>
          <TextField
            required
            label="Assigned to"
            variant="outlined"
            value={payslipData.assigned}

            inputProps={{
              readOnly: true,

            }}
          />
        </div>
        <div style={{ float: "right", width:"150px",textalign:'center'}}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  views={["year", "month"]}
                  format="MMMM/yyyy"
                  margin="normal"
                  label="Month/Year"
                  value={date}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
          </div>
        </div>

        <form noValidate autoComplete="off" style={{ padding: "10px" }}>
          <div className="leftDivision">
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }} >
                          
              <TextField
              required
              label="Designation"
              value={payslipData.Designation}
              placeholder="Designation"
              variant="outlined"
              inputProps={{
                readOnly: true,
              }}
            />
            </div>
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Add Basic Salary" placement='top' arrow>
            <TextField
              required
              name='Basic'
              label="Basic Salary"
              value={payslipData.Basic}
              onChange={handleChangesforBasic}
              placeholder="Basic Salary"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
              }}
              variant="outlined"
            />
            </Tooltip>
            </div>
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Dearness Allowance (30% of Basic Salary)" placement='top' arrow>
            <TextField
              required
              label="DA"
              value={payslipData.D_allow}
              onChange={handleChangesforD_allow}
              placeholder="DA"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,

              }}
              variant="outlined"
            />
            </Tooltip>
            </div>

            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="House Rent Allowance (45% of Basic Salary)" placement='top' arrow>
            <TextField
              required
              label="HRA"
              value={payslipData.HR_allow}
              placeholder="Hr-allowance"
              onChange={handleChangesforHR_allow}
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,

              }}
              variant="outlined"
            />
            </Tooltip>

          </div>
          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <Tooltip title="Add Conveyance" placement='top' arrow>
          <TextField
              required
              label="Conveyance"
              value={payslipData.conveyance}
              placeholder="conveyance"
              onChange={handleChangesforconveyance}
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
              }}
              variant="outlined"
            />
            </Tooltip>
          </div>

          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px'  }}>
          <Tooltip title="Add Bonus" placement='top' arrow>
            <TextField
              label="Bonus"
              onChange={handleChangesforBonus}
              value={payslipData.Bonus}
              placeholder="Bonus"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math
              }}
              variant="outlined"
            />
            </Tooltip>
            </div>

          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <Tooltip title="Add Other Earnings" placement='top' arrow>
          <TextField
              label="Others"
              onChange={handleChangesforOthers}
              value={payslipData.others}
              placeholder="Others"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math
              }}
              variant="outlined"
            />
            </Tooltip>
          </div>
          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <Tooltip title="Net Earnings" placement='top' arrow>
          <TextField
              required
              label="Net Earnings"
              value={netearnings}
              placeholder="Net Earnings"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,

              }}
              variant="outlined"
            />
            </Tooltip>

          </div>
          </div>
          
          <div className="leftDivision">

            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Add Professional Tax" placement='top' arrow>
            <TextField
              required
              label="Professional tax"
              value={payslipData.prof_tax}
              onChange={handleChangesforprof_tax}
              placeholder="Professional tax"

              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,

                
              }}
              variant="outlined"
            />
            </Tooltip>
            </div>
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Employee PF (12% of Net Earnings)" placement='top' arrow>
            <TextField
              required
              label="Employee PF"
              value={payslipData.p_f_employee}
              onChange={handleChangesforp_femployee}
              placeholder="Employee PF"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,

              }}
              variant="outlined"
            />
            </Tooltip>
            </div>
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px'  }}>
            <TextField
              required
              label="Employer PF"
              name='p_f_employer'
              value={payslipData.p_f_employer}
              onChange={e=>{handleDatachange(e)}}
              placeholder="Employer PF"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,

              }}
              variant="outlined"
            />
            </div>
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Add Employer PF" placement='top' arrow>
            <TextField
              required
              label="Total Tax"
              value={totaltax}
              placeholder="Total Tax"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,


              }}
              variant="outlined"
            />
            </Tooltip>
          </div>
          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <Tooltip title="TDS (10% of Net Earnings)" placement='top' arrow>
          <TextField
              required
              label="Advance TAX/TDS"
              value={payslipData.td_S}
              onChange={handleChangesforTDS}
              placeholder="TDS"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,

              }}
              variant="outlined"
            />
            </Tooltip>
          </div>

          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <Tooltip title="Add Any Other Taxes" placement='top' arrow>
          <TextField  
              label="Others"
              onChange={handleChangesforOthertaxes}
              value={payslipData.other_tax}
              placeholder="other tax"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math
              }}
              variant="outlined"
            />
            </Tooltip>
            </div>        
          </div>

          <div className="leftDivision">
          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <Tooltip title="Net Deductions" placement='top' arrow>
            <TextField
              required
              label="Net Deductions"
              value={netdeductions}
              placeholder="Net Deductions"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,


              }}
              variant="outlined"
            />
            </Tooltip>
          </div>
          </div>
 
        </form>
        <div className='remarks'>
        <div style={{ marginRight: '15px' }} >
              <TextareaAutosize
                name="remarks"
                minRows={3}
                value={payslipData.remarks}
                onChange={e=>{handleDatachange(e)}}
                placeholder="Remarks"
                style={{ width: 425, fontSize: 19, padding: '5px', borderRadius: '5px', background: '#fafafa' }}
              />
            </div>
            </div>

        <div className='rightDivision'> 
          <div style={{ float: 'right', marginBottom: '10px', marginRight: "15px" }}>
          <Tooltip title="Net Earnings" placement='top' arrow>
            <TextField
              required
              label="Net Earnings"
              value={netearnings}
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
                readOnly: true,

              }}
              inputProps={{
                className: classes.math
              }}
              variant="outlined"
            />
            </Tooltip>
          </div>
          <div style={{ float: 'right', marginBottom: '10px', marginRight: "15px" }}>
          <Tooltip title="Net Deductions" placement='top' arrow>
            <TextField
            required
              label="Net Deductions"
              value={netdeductions}
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
                
              }}
              inputProps={{
                readOnly: true,
                className: classes.math
              }}
              variant="outlined"
            />
            </Tooltip>
          </div>
          <div style={{ float: 'right', marginBottom: '10px', marginRight: "15px" }}>
          <Tooltip title="Net Salary" placement='top' arrow>
          <TextField
              required
              label="Net Salary"
              value={netsalary}
              placeholder="Net Salary"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,

              }}
              variant="outlined"
            />
            </Tooltip>
          </div>
        </div>

        <div style={{ clear: 'both' }}>
        </div>

      </div>
      <div style={{ marginLeft: "300px", marginTop: "20px", marginBottom:"30px"}}>
        {!id &&
        <div>
          <Button type="reset" variant="contained" color="primary" onClick={()=>{console.log(payslipData);uploadandprintData();}}>
          Save and Download

          </Button>
          <div className='savebtn' style={{marginTop:"20px"}}>
          <Button type="reset" variant="contained" color="primary" onClick={()=>{console.log(payslipData);uploadData();}}>
          Save
          </Button>
          </div>
          </div>
          
          }
        {id &&
          <div>
            <Button type="button" variant='contained' color="primary" onClick={updateData}>
              Save
            </Button>
            <Button type="button" variant='contained' color="primary" style={{ marginLeft: '10px' }} onClick={deleteData}>
              Delete
            </Button>
          </div>
        }

        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alert.severity}>
            {alert.message}
          </Alert>
        </Snackbar>
        <Backdrop className={classes.backdrop} open={open} >
          <div>
            <CircularProgress color="primary" />
          </div>
        </Backdrop>
        <Backdrop className={classes.backdrop} open={openDownloader} >
          <div>
            <CircularProgress color="primary" />
          </div>
          <span>Saving & Downloading Payslip...</span>
        </Backdrop>
        <Backdrop className={classes.backdrop} open={openuploader} >
          <div>
            <CircularProgress color="primary" />
          </div>
          <span>Saving Payslip...</span>
        </Backdrop>
        <Backdrop className={classes.backdrop} open={openLoader} >
          <div>
            <CircularProgress color="primary" />
          </div>
          <span>Request Processing...</span>
        </Backdrop>
      </div>
    </div>
  );
}
