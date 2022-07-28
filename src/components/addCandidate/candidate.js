/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import MuiAlert from '@material-ui/lab/Alert';
import { useParams } from "react-router-dom";
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from "@material-ui/core/Tooltip";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import history from '../../history';

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
  item: {
    width: '500px',
    padding: '5px'
  },
  quantity: {
    width: '50px',
    padding: '5px'
  },
  rate: {
    width: '100px',
    padding: '5px'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column'
  },
  formControl: {
    marginBottom: theme.spacing(1),
    minWidth: 250,
    maxWidth: 300,
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



export default function FormPropsTextFields() {
  let { id } = useParams();
  const classes = useStyles();
  const inputAdornment= '₹'
  const [clientData, setClientdata] = React.useState([]);
  const [candidateData, setState] = React.useState(
    { 
      name: "", email: "", assigned_to: "", payment_terms: "", date_of_birth: String(new Date()), date_of_Joining: String(new Date()),
    Basic: 0,
    type:'',
    Designation:'',
    pan_no:'',
    D_allow: 0,
    HR_allow: 0,
    Bonus: 0,
    conveyance:0,
    others:0,
    total_earnings:0,
    prof_tax:0,
    p_f_employer:0,
    p_f_employee:0,
    td_S:0,
    other_tax:0, 
    });

  const [open, setOpen] = React.useState(false);
  const [alert, setMessage] = React.useState({ message: "", severity: "" });
  const [openLoader, setOpenLoader] = React.useState(false);
  const [tds,setTds] = React.useState(0)
  const [isloading, setIsloading]=React.useState(true);
  const fetchClientData = async() => {
    await axios.get(`${process.env.REACT_APP_API_URL}/client`)
      .then((res) => {
        setClientdata(res.data.data.results);
        setIsloading(false)
      });
  }

  useEffect(() => {
    const fetchData = async() => {
      await axios.get(`${process.env.REACT_APP_API_URL}/candidate/${id}`)
        .then((response) => {
          var assign='';
          console.log(response.data.data)

        setState(response.data.data)
        setTds(response.data.data.td_S)    
        if(!clientData.filter(data => data._id === response.data.data.assigned_to)[0])
        {candidateData.assigned_to=null}
    
      })
        .catch((error) => {
          history.push('/candidate')
        })
    }


    fetchClientData()
    if (id) {
      fetchData()
    }
  }, [])// eslint-disable-line react-hooks/exhaustive-deps


  const birthDateChange = (date) => {
    setState({ ...candidateData, date_of_birth: String(date) })
    
  };
  const joiningDateChange = (date) => {
    setState({ ...candidateData, date_of_Joining: String(date) })

  };

  const handleChange = e => {
    setState({
      ...candidateData,
      [e.target.name]: e.target.value,
    });

  }
function handleChangesforBasic(event){

  if (candidateData.total_earnings !== 0)
  {candidateData.total_earnings= parseFloat(candidateData.total_earnings) - (parseFloat(candidateData.Basic)+parseFloat(candidateData.D_allow)+parseFloat(candidateData.HR_allow));}


  if (event.target.value === ""){
    candidateData.Basic=0;}
    else{
  candidateData.Basic=parseInt(event.target.value);}

  candidateData.D_allow=candidateData.Basic*30/100
  candidateData.HR_allow=candidateData.Basic*45/100
  candidateData.p_f_employee=Math.round((candidateData.Basic+candidateData.D_allow)*12/100)
  candidateData.total_earnings+=(candidateData.Basic+candidateData.D_allow+candidateData.HR_allow)
  candidateData.td_S=(candidateData.total_earnings*.1).toFixed(1)
  setTds(candidateData.td_S)
}

function handleChangeforbonus(event){
  candidateData.total_earnings-=candidateData.Bonus;

  if (event.target.value === ""){
  candidateData.Bonus=0;}
  else{
  candidateData.Bonus=parseInt(event.target.value);}

  candidateData.total_earnings+=candidateData.Bonus;
  candidateData.td_S=(candidateData.total_earnings*.1).toFixed(1)
  setTds(candidateData.td_S)
}

function handleChangeforTDS(event){

  if (event.target.value === ""){
  candidateData.td_S=0;}
  else{
  candidateData.td_S=parseInt(event.target.value);}

  setTds(candidateData.td_S)
}

function handleChangeforDA(event){
  candidateData.total_earnings-=candidateData.D_allow;

  if (event.target.value === ""){
  candidateData.D_allow=0;}
  else{
  candidateData.D_allow=parseInt(event.target.value);}

  candidateData.total_earnings+=candidateData.D_allow;
  candidateData.td_S=(candidateData.total_earnings*.1).toFixed(1)
  setTds(candidateData.td_S)
  candidateData.p_f_employee=(candidateData.Basic+candidateData.D_allow)*12/100


}

function handleChangeforHRA(event){
  candidateData.total_earnings-=candidateData.HR_allow;

  if (event.target.value === ""){
  candidateData.HR_allow=0;}
  else{
  candidateData.HR_allow=parseInt(event.target.value);}

  candidateData.total_earnings+=candidateData.HR_allow;
  candidateData.td_S=(candidateData.total_earnings*.1).toFixed(1)
  setTds(candidateData.td_S)


}
function handleChangeforconveyance(event){
  candidateData.total_earnings-=candidateData.conveyance;

  if (event.target.value === ""){
  candidateData.conveyance=0;}
  else{
  candidateData.conveyance=parseInt(event.target.value);}

  candidateData.total_earnings+=candidateData.conveyance;
  candidateData.td_S=(candidateData.total_earnings*.1).toFixed(1)
  setTds(candidateData.td_S)
}
function handleChangeforothers(event){
  candidateData.total_earnings-=candidateData.others;

  if (event.target.value === ""){
  candidateData.others=0;}
  else{
  candidateData.others=parseInt(event.target.value);}

  candidateData.total_earnings+=candidateData.others;
  candidateData.td_S=(candidateData.total_earnings*.1).toFixed(1)
  setTds(candidateData.td_S)

}

function changeFieldValue() {
  const fieldValues = {
    name: "", email: "", assigned_to: "", payment_terms: "", date_of_birth: String(new Date()), date_of_Joining: String(new Date()),
    Basic: 0,
    Designation:'',
    type:'',
    pan_no:'',
    D_allow: 0,
    HR_allow: 0,
    Bonus: 0,
    conveyance:0,
    others:0,
    total_earnings:0,
    prof_tax:0,
    p_f_employer:0,
    p_f_employee:0,
    td_S:0,
    other_tax:0, 
  }

  setTds("");
  setState(fieldValues);
}
  function printdata() {
    setOpenLoader(true);
    axios.post(`${process.env.REACT_APP_API_URL}/candidate`, candidateData, { headers: { 'Content-Type': 'application/json' } })
      .then(function (response) {
        setOpenLoader(false);
        const message = alert;
        message.message = "candidate added successfully";
        message.severity = "success"
        setMessage(message);
        setOpen(true);
        changeFieldValue();

      })
      .catch(error => {
        setOpenLoader(false);
        const message = alert;
        message.message = error?.response?.data?.status?.message;
        message.severity = "error";
        setMessage(message);
        setOpen(true);
      })

  }

  const updateData = () => {
    setOpenLoader(true);
    axios.put(`${process.env.REACT_APP_API_URL}/candidate/${id}`, candidateData, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        setOpenLoader(false);
        const message = alert;
        message.message = "Candidate Details Updated Successfully";
        message.severity = 'success';
        setMessage(message);
        setOpen(true);
        history.push('/view-candidate')
      })
      .catch((error) => {
        setOpenLoader(false);
        const message = alert;
        message.message = error?.response?.data?.status?.message;
        message.severity = "error"
        setMessage(message);
        setOpen(true);
      })
  }

  const deleteData = () => {
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
        message.message = error?.response?.data?.status?.message;
        message.severity = "error"
        setMessage(message);
        setOpen(true);
      })
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <h1 style={{ marginLeft: '300px', marginTop: '50px', marginRight:"0" }}>
        {id ? 'Edit Candidate Details' : 'Add Candidate'}
      </h1>
      {isloading && <div> Loading... </div> }
      {!isloading && <>
        <div className="form">
        <div className='top' style={{ display:"flex" }}>
          <div style={{  float: "left", marginLeft:'15px',marginTop: '30px', marginBottom: '0px' }} >
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-name-label">Assigned To</InputLabel>
            <Select
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              defaultValue={null}
              value={candidateData.assigned_to}
              onChange={handleChange}
              name="assigned_to"
              input={<Input />}
              MenuProps={MenuProps}
            >{clientData.map((name) => (
              <MenuItem key={name._id} value={name._id}>{name.client_name}</MenuItem>
            ))}</Select>
          </FormControl>
            
          </div>
          <div style={{ float: "left",marginLeft: "50px", marginTop: '30px', marginBottom: '0px',width:"150px"}}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-name-label">Type Of Employee</InputLabel>
            <Select
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              defaultValue={""}
              value={candidateData.type}
              onChange={handleChange}
              name="type"
              input={<Input />}
              MenuProps={MenuProps}
            >
              <MenuItem value="" >
                <em style={{ fontFamily:"sans-serif", fontStyle:"unset" }}>None</em>
              </MenuItem>
              <MenuItem value="Full-Time" >
                <em style={{ fontFamily:"sans-serif", fontStyle:"unset" }}>Full-Time</em>
              </MenuItem>
              <MenuItem value="Internship" >
                <em style={{ fontFamily:"sans-serif", fontStyle:"unset" }}>Internship</em>
              </MenuItem>
            </Select>
          </FormControl> 
          </div>
          <div style={{  float: "left",marginLeft: "150px", marginTop: '14px', marginBottom: '0px',width:"150px" }} >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  openTo="year"
                  variant="inline"
                  format="yyyy-MM-dd"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date of Joining"
                  views={['year', 'month', 'date']}
                  value={candidateData.date_of_Joining}
                  onChange={joiningDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div style={{  float: "left",marginLeft: "50px", marginTop: '14px', marginBottom: '0px',width:"150px"  }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                openTo="year"
                views={['year', 'month', 'date']}
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id="date-picker-inline"
                label="Date of Birth"
                value={candidateData.date_of_birth}
                onChange={birthDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>

        <form noValidate autoComplete="off" style={{ padding: "10px"}}>
        <div className="leftDivision">

          <div style={{  float: "left",marginLeft: "0px", marginTop: '30px', marginBottom: '30px' }}>
          <TextField
              id="outlined-required"
              required
              label="Name of the candidate"
              name="name"
              value={candidateData.name}
              variant="outlined"
              onChange={handleChange}
            />
          </div>

            
          <div style={{  float: "left",marginLeft: "15px", marginTop: '30px', marginBottom: '30px' }} >
              <TextField
              required
              label="Designation"
              name="Designation"
              value={candidateData.Designation}
              placeholder="Designation"
              variant="outlined"
              onChange={handleChange}
            />
            </div>
          <div style={{  float: "left",marginLeft: "15px", marginTop: '32px', marginBottom: '30px', }}>
          <TextField
              required
              id="outlined-required"
              label="Email"
              variant="outlined"
              name="email"
              value={candidateData.email}
              onChange={handleChange}
            />
            </div>
            <div style={{  float: "left",marginLeft: "15px", marginTop: '30px', marginBottom: '30px' }} >
              <TextField
              required
              label="Pan Card No."
              name="pan_no"
              value={candidateData.pan_no}
              placeholder="Pan Card No."
              variant="outlined"
              onChange={handleChange}
            />
            </div>
            </div>

          <div className="leftDivision">
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Add Basic Salary" placement='top' arrow>
              <TextField
                required
                name='Basic'
                label="Basic Salary"
                value={candidateData.Basic}
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
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Dearness Allowance (30% of Basic Salary)" placement='top' arrow>
              <TextField
                required
                label="DA"
                value={candidateData.D_allow}
                onChange={handleChangeforDA}
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
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="House Rent Allowance (45% of Basic Salary)" placement='top' arrow>
              <TextField
                required
                label="HRA"
                value={candidateData.HR_allow}
                onChange={handleChangeforHRA}

                placeholder="Hr-allowance"
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
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Add Conveyance" placement='top' arrow>
            <TextField
                required
                label="Conveyance"
                value={candidateData.conveyance}
                placeholder="conveyance"
                onChange={handleChangeforconveyance}
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
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px'  }}>
            <Tooltip title="Add Bonus" placement='top' arrow>
              <TextField
                required
                label="Bonus"
                onChange={handleChangeforbonus}
                value={candidateData.Bonus}
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
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Add Other Earnings" placement='top' arrow>
            <TextField
                label="Others"
                onChange={handleChangeforothers}
                value={candidateData.others}
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
          </div>

          <div className="leftDivision">
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Add Professional Tax" placement='top' arrow>
              <TextField
                required
                name='prof_tax'
                label="Professional Tax"
                onChange={handleChange}
                value={candidateData.prof_tax}
                placeholder="Professional tax"
                type='number'
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
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Add Employer PF" placement='top' arrow>
              <TextField
                required
                name='p_f_employer'
                label="Employer PF"
                onChange={handleChange}
                type='number'
                value={candidateData.p_f_employer}
                placeholder="Employer PF"
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
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px'  }}>
            <Tooltip title="Employee PF (12% of Total Earnings)" placement='top' arrow>
              <TextField
                required
                label="Employee PF"
                name='p_f_employee'
                value={candidateData.p_f_employee}
                onChange={handleChange}
                type='number'
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
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="TDS (10% of Total Earnings)" placement='top' arrow>
            <TextField
                required
                label="Advance TAX/TDS"
                value={tds}
                onChange={handleChangeforTDS}
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
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <Tooltip title="Add Any Other Taxes" placement='top' arrow>
            <TextField
                name='other_tax'
                label="Other Tax"
                onChange={handleChange}
                type='number'
                value={candidateData.other_tax}
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
            <div style={{  float: "left",marginRight: "15px", marginTop: '30px', marginBottom: '30px' }} >
              <TextField
                id="outlined-textarea"
                label="Payment Terms"
                multiline
                variant="outlined"
                inputProps={{ className: classes.payment }}
                name="payment_terms"
                value={candidateData.payment_terms}
                onChange={handleChange}
              />
              </div>
          </div>
        </form>
        

      </div>

      <div style={{ marginLeft: "300px", marginTop: "10px", marginBottom:"30px" }}>
        {!id &&
          <Tooltip title="Click To Add Candidate" arrow>
          <Button type="reset" variant="contained" color="primary" onClick={()=>{console.log(candidateData);printdata()}}>
            Add Candidate
          </Button>
          </Tooltip>
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
      </>}
      
    </div>
  );
}
