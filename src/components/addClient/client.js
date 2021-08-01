import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { Box } from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import MuiAlert from '@material-ui/lab/Alert';
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
  multiline:{
    width:'400px',
  },
  payment:{
    width:'195px',
  },
  item:{
    width:'500px',
    padding:'5px'
  },
  quantity:{
    width:'50px',
    padding:'5px'
  },
  rate:{
    width:'100px',
    padding:'5px'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column'
  },
}));


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}





export default function FormPropsTextFields() {
  const classes = useStyles();
  const [clientData , setState] = React.useState({client_name:"",billing_address:"",shipping_address:"",payment_terms:"",notes:"",terms:"",date_of_contract:String(new Date())});
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [alert, setMessage] = React.useState({message:"",severity:""});
  const [openLoader, setOpenLoader] = React.useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    clientData.date_of_contract = String(date);
    console.log(selectedDate);
  };


  const handleChange= e =>{
      setState({
        ...clientData,
        [e.target.name]: e.target.value,
      });
  }
  

  function printdata(){
    setOpenLoader(true);
    axios.post('https://codeunity-invoice-backend.herokuapp.com/client', clientData,{ headers: { 'Content-Type': 'application/json' } })
    .then(function (response) {
      setOpenLoader(false);
      console.log("CLient added successfully",clientData);
      const message = alert;
      message.message = "client added successfully";
      message.severity = "success"
      setMessage(message);
      setOpen(true);
      setState({client_name:"",billing_address:"",shipping_address:"",payment_terms:"",notes:"",terms:"",date_of_contract:String(new Date())});
    })
    .catch(error => {
      setOpenLoader(false);
      const message = alert;
      message.message = "add client unsuccessful";
      message.severity = "error"
      setMessage(message);
      console.log(clientData);
      console.log("message",message);
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
        <h1 style={{marginLeft:'300px',marginTop:'50px'}}>
        Add Client
        </h1>
        <Box className="form">
            
          <div style ={{marginLeft:'10px'}}>
              <form  noValidate autoComplete="off">
                  <div className="leftDivision">
                    <div style={{ marginRight: '15px'}} >
                        <TextField
                          id="outlined-required"
                          required
                          label="Name of the client"
                          name="client_name"
                          value={clientData.client_name}
                          variant="outlined"
                          onChange={handleChange}
                          
                        />
                    </div>
                      <div style={{float:"left",marginRight :"15px",marginTop:'30px',marginBottom:'30px'}}>
                        <TextField
                        required
                        id="outlined-required"
                        label="Bill To"
                        variant="outlined"
                        name="billing_address"
                        value={clientData.billing_address}
                        onChange={handleChange}
                        />
                      </div>
                      <div style={{float:"right",marginRight :"15px",marginTop:'30px',marginBottom:'30px'}}>
                        <TextField
                        required
                        id="outlined-required"
                        label="Ship To"
                        variant="outlined"
                        name="shipping_address"
                        value={clientData.shipping_address}
                        onChange={handleChange}
                        />
                      </div>   
                  
             
                      <div style={{marginBottom:'10px',marginRight :"15px"}}>
                        <TextField
                            id="outlined-textarea"
                            label="Payment Terms"
                            multiline
                            variant="outlined"
                            inputProps={{className:classes.payment}}
                            name="payment_terms"
                            value={clientData.payment_terms}
                            onChange={handleChange}
                          />
                      </div>
                      <div style={{marginBottom:'10px',marginRight :"15px"}}>
                      <MuiPickersUtilsProvider  utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          variant="inline"
                          format="yyyy-MM-dd"
                          margin="normal"
                          id="date-picker-inline"
                          label="Date of contract"
                          value={selectedDate}
                          onChange={handleDateChange}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                        </MuiPickersUtilsProvider>
                      </div>
                      
                    </div>
              </form>  
              <div style={{float:'left',overflow:'hidden'}}>
                  <div style={{marginTop:'15px'}}>
                    <TextField
                      id="outlined-textarea"
                      label="Notes"
                      placeholder="Notes - any relevant information already not covered"
                      multiline
                      variant="outlined"
                      inputProps={{
                        className:classes.multiline
                      }}
                      name="notes"
                      value={clientData.notes}
                      onChange={handleChange}


                    />
                  </div>
                  <div style={{marginTop:"15px",marginBottom:"20px"}}>
                    <TextField
                      id="outlined-textarea"
                      label="Terms"
                      placeholder="Terms and conditions"
                      multiline
                      variant="outlined"
                      inputProps={{
                        className:classes.multiline
                      }}
                      name="terms"
                      value={clientData.terms}
                      onChange={handleChange}
                    />
                  </div>
                </div>  
          </div> 
          <div style={{clear:'both'}}>
          </div>
      </Box>
      
      <div style={{marginLeft:"300px",marginTop:"10px"}}>
        <Button type="reset" variant="contained" color="primary" onClick={printdata}>
                Add Client
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alert.severity}>
            {alert.message}
          </Alert>
        </Snackbar>
        <Backdrop className={classes.backdrop} open={openLoader} >
          <div>
          <CircularProgress color="primary" />
          </div>
          <span>adding client...</span>
        </Backdrop>
        
      </div>
    </div>
    
    
  );
}
