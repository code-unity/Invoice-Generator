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
import 'date-fns';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import TextareaAutosize from '@mui/material/TextareaAutosize'

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { id } from 'date-fns/locale';

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
  const [inputAdornment, setInputAdornment] = React.useState('₹')
  const [personName, setPersonName] = React.useState([]);
  const [candidateData, setCandidatedata] = React.useState([]);
  const [alert, setMessage] = React.useState({ message: "", severity: "" });
  const [openAlert, setOpenAlert] = React.useState(false);
  const [clientData, setClientdata] = React.useState([]);
  const [netsalary , setNetsalary]=React.useState(0);
  const [netearnings , setNetearnings]=React.useState(0);
  const [netdeductions , setNetdeductions]=React.useState(0);
  const [openDownloader, setOpenDownloader] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const [payslipData, setpaySlipData] = React.useState({
    candidate:'',
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
    remarks:0,
  });

 

  function handleChange(event) {
    if (event.target.value !== "") {
      let data = candidateData.filter(eachObj => eachObj._id === event.target.value);
      const tempDefault = payslipData;
      const temp2=clientData.filter(eachObj => eachObj._id ===data[0].assigned_to )
      console.log(temp2,'this is temp2');
      tempDefault.Designation="Software Developer I";
      tempDefault.Basic = 20000;
      tempDefault.D_allow = 6000;
      tempDefault.HR_allow = 9000;
      tempDefault.candidate=data[0].name
      tempDefault.assigned=temp2[0].client_name;
      tempDefault.conveyance=7000;
      tempDefault.prof_tax=200;
      tempDefault.p_f_employee=1800;
      tempDefault.p_f_employer=3120;
      tempDefault.td_S=4400;
      tempDefault.remarks=data[0].payment_terms;
      tempDefault.total_earnings=tempDefault.Basic+tempDefault.D_allow+tempDefault.HR_allow+tempDefault.conveyance+tempDefault.Bonus+tempDefault.others;
      tempDefault.total_tax=tempDefault.prof_tax+tempDefault.p_f_employer;
      tempDefault.net_deductions=tempDefault.total_tax+tempDefault.td_S+tempDefault.other_tax;
      tempDefault.net_salary=tempDefault.total_earnings-tempDefault.net_deductions;
      setNetsalary(tempDefault.net_salary);
      setPersonName(event.target.value);
      setNetearnings(payslipData.total_earnings);
      setNetdeductions(payslipData.net_deductions);
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
      });
      

      
  };

  React.useEffect(() => {
    fetchData();
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

 

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  ///functions for Calculations
  
  function handleChangesforBonus(event) {
    if (event.target.value !== ""){
    payslipData.net_salary-=payslipData.Bonus;
    payslipData.total_earnings-=payslipData.Bonus;

    payslipData.Bonus=parseInt(event.target.value);
    console.log(payslipData.Bonus)

    payslipData.net_salary+=payslipData.Bonus;
    payslipData.total_earnings+=payslipData.Bonus;

    setNetsalary(payslipData.net_salary);
    setNetearnings(payslipData.total_earnings);
  }}

  function handleChangesforOthers(event) {
    if (event.target.value !== ""){
    payslipData.net_salary-=payslipData.others;
    payslipData.total_earnings-=payslipData.others;
    
    payslipData.others=parseInt(event.target.value);

    payslipData.net_salary+=payslipData.others;
    payslipData.total_earnings+=payslipData.others;

    setNetsalary(payslipData.net_salary);
    setNetearnings(payslipData.total_earnings);
  }}

  function handleChangesforOthertaxes(event) {
    if (event.target.value !== ""){
    payslipData.net_salary+=payslipData.other_tax;
    payslipData.net_deductions-=payslipData.other_tax;
    
    payslipData.other_tax=parseInt(event.target.value);

    payslipData.net_salary-=payslipData.other_tax;
    payslipData.net_deductions+=payslipData.other_tax;

    setNetsalary(payslipData.net_salary);
    setNetdeductions(payslipData.net_deductions);
  }}
  const handleDataChange = e => {
    setpaySlipData({
      ...payslipData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div >
      <h1 style={{ marginLeft: '300px', marginTop: '50px' }}>
        Generate Payslip
      </h1>
      <div className="form">


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
        
        <div className={classes.invoiceNumber} style={{width:'150px', textalign:'center'}}>
          <TextField
            required
            label="Assigned to"
            variant="outlined"
            value={payslipData.assigned}
            onChange={handleDataChange}
            inputProps={{
              readOnly: true,

            }}
          />
        </div>

        <form noValidate autoComplete="off" style={{ padding: "10px" }}>
          <div className="leftDivision">
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }} >
                          
              <TextField
              required
              label="Designation"
              value={payslipData.Designation}
              onChange={handleDataChange}
              placeholder="Designation"
              variant="outlined"
              inputProps={{
                readOnly: true,

              }}
            />
            </div>
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <TextField
              required
              label="Basic Salary"
              value={payslipData.Basic}
              onChange={handleDataChange}
              placeholder="Basic Salary"

              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,

              }}
              variant="outlined"
            />
            </div>
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <TextField
              required
              label="DA"
              value={payslipData.D_allow}
              onChange={handleDataChange}
              placeholder="DA"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,

              }}
              variant="outlined"
            />
            </div>

            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <TextField
              required
              label="HR_allow"
              value={payslipData.HR_allow}
              onChange={handleDataChange}
              placeholder="Hr-allowance"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,

              }}
              variant="outlined"
            />

          </div>
          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <TextField
              required
              label="Conveyance"
              value={payslipData.conveyance}
              onChange={handleDataChange}
              placeholder="conveyance"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,


              }}
              variant="outlined"
            />

          </div>

          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px'  }}>
            <TextField
              
              label="Bonus"
              onChange={handleChangesforBonus}
              placeholder="Bonus"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math
              }}
              variant="outlined"
            />
            </div>

          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <TextField
              
              label="Others"
              onChange={handleChangesforOthers}
              placeholder="Others"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math
              }}
              variant="outlined"
            />

          </div>
          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <TextField
              required
              label="Total Earnings"
              value={netearnings}
              onChange={handleDataChange}
              placeholder="Total Earnings"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                readOnly: true,
                className: classes.math
              }}
              variant="outlined"
            />

          </div>
          </div>
          
          <div className="leftDivision">

            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <TextField
              required
              label="Professional tax"
              value={payslipData.prof_tax}
              onChange={handleDataChange}
              placeholder="Professional tax"

              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,

                
              }}
              variant="outlined"
            />
            </div>
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <TextField
              required
              label="Employer PF"
              value={payslipData.p_f_employer}
              onChange={handleDataChange}
              placeholder="Employer PF"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,

              }}
              variant="outlined"
            />
            </div>
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px'  }}>
            <TextField
              required
              label="Employee PF"
              value={payslipData.p_f_employee}
              onChange={handleDataChange}
              placeholder="Employee PF"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,

              }}
              variant="outlined"
            />
            </div>
            <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <TextField
              required
              label="Total Tax"
              value={payslipData.total_tax}
              onChange={handleDataChange}
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
          </div>
          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <TextField
              required
              label="Advance TAX/TDS"
              value={payslipData.td_S}
              onChange={handleDataChange}
              placeholder="TDS"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math,
                readOnly: true,

              }}
              variant="outlined"
            />
          </div>

          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
          <TextField
              
              label="Others"
              onChange={handleChangesforOthertaxes}
              placeholder="other tax"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math
              }}
              variant="outlined"
            />
            </div>        
          </div>

          <div className="leftDivision">
          <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
            <TextField
              required
              label="Net Deductions"
              value={netdeductions}
              onChange={handleDataChange}
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

          </div>
          </div>
 
        </form>
        <div className='remarks'>
        <div style={{ marginRight: '15px' }} >
              <TextareaAutosize
                name="Remarks"
                minRows={3}
                onChange={handleDataChange}
                placeholder="Remarks"
                style={{ width: 425, fontSize: 19, padding: '5px', borderRadius: '5px', background: '#fafafa' }}
              />
            </div>
            </div>

        <div className='rightDivision'> 
          <div style={{ float: 'right', marginBottom: '10px', marginRight: "15px" }}>
            <TextField
              required
              label="Total Earnings"
              value={netearnings}
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                readOnly: true,
                className: classes.math
              }}
              variant="outlined"
            />
          </div>
          <div style={{ float: 'right', marginBottom: '10px', marginRight: "15px" }}>
            <TextField
              label="Net Deductions"
              value={netdeductions}
              onChange={handleDataChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                className: classes.math
              }}
              variant="outlined"
            />
          </div>
          <div style={{ float: 'right', marginBottom: '10px', marginRight: "15px" }}>
          <TextField
              required
              label="Net Salary"
              value={netsalary}
              onChange={handleDataChange}
              placeholder="Net Salary"
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              inputProps={{
                readOnly: true,
                className: classes.math
              }}
              variant="outlined"
            />
          </div>
        </div>

        <div style={{ clear: 'both' }}>
        </div>

      </div>
      <div style={{ marginLeft: "300px", marginBottom: "30px", marginTop: "10px" }}>
        <Button variant="contained" color="primary" onClick={() => {console.log(payslipData); setOpen(false)}}>
          Download Pay Slip
        </Button>
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
          <span>Downloading Invoice...</span>
        </Backdrop>
      </div>
    </div>
  );
}
