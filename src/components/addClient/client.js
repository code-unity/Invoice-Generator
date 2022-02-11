import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useParams } from "react-router-dom";
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
}));


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}





export default function FormPropsTextFields() {
  let { id } = useParams();
  const [Id, setId] = React.useState(id);
  const classes = useStyles();
  const [clientData, setState] = React.useState({ client_name: "", billing_address: "", shipping_address: "", payment_terms: "", notes: "", terms: "", date_of_contract: String(new Date()) });
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [alert, setMessage] = React.useState({ message: "", severity: "" });
  const [openLoader, setOpenLoader] = React.useState(false);

  const fetchData = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/client/${Id}`)
      .then((response) => {
        setState({
          client_name: response.data.data.client_name,
          billing_address: response.data.data.billing_address,
          shipping_address: response.data.data.shipping_address,
          payment_terms: response.data.data.payment_terms,
          notes: response.data.data.notes,
          terms: response.data.data.terms,
          date_of_contract: response.data.data.date_of_contract,
        })
      })
      .catch((error) => {
        const message = alert;
        message.message = "Please check the client ID";
        message.severity = "error"
        setMessage(message);
        setOpen(true);
        setState({ client_name: "", billing_address: "", shipping_address: "", payment_terms: "", notes: "", terms: "", date_of_contract: String(new Date()) });
      })
  }

  useEffect(() => {
    setId(id)
    setState({ client_name: "", billing_address: "", shipping_address: "", payment_terms: "", notes: "", terms: "", date_of_contract: String(new Date()) })
    if (id) {
      fetchData()
    }
  }, [id]);// eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (date) => {
    setSelectedDate(date);
    clientData.date_of_contract = String(date);
  };


  const handleChange = e => {
    setState({
      ...clientData,
      [e.target.name]: e.target.value,
    });
  }


  function printdata() {
    setOpenLoader(true);
    axios.post(`${process.env.REACT_APP_API_URL}/client`, clientData, { headers: { 'Content-Type': 'application/json' } })
      .then(function (response) {
        setOpenLoader(false);
        const message = alert;
        message.message = "client added successfully";
        message.severity = "success"
        setMessage(message);
        setOpen(true);
        setState({ client_name: "", billing_address: "", shipping_address: "", payment_terms: "", notes: "", terms: "", date_of_contract: String(new Date()) });
      })
      .catch(error => {
        setOpenLoader(false);
        const message = alert;
        message.message = "add client unsuccessful";
        message.severity = "error"
        setMessage(message);
        setOpen(true);
      })

  }

  const updateData = () => {
    setOpenLoader(true);
    axios.patch(`${process.env.REACT_APP_API_URL}/client/${Id}`, clientData, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        setOpenLoader(false);
        const message = alert;
        message.message = "Client Details Updated Successfully";
        message.severity = 'success';
        setMessage(message);
        setOpen(true);
        history.push('/view-client')
      })
      .catch((error) => {
        setOpenLoader(false);
        const message = alert;
        message.message = "Updating Client Details Unsuccessful";
        message.severity = "error"
        setMessage(message);
        setOpen(true);
      })
  }

  const deleteData = () => {
    setOpenLoader(true)
    axios.delete(`${process.env.REACT_APP_API_URL}/client/${Id}`)
      .then((response) => {
        setOpenLoader(false);
        const message = alert;
        message.message = "Client Details Deletion Successfully";
        message.severity = 'success';
        setMessage(message);
        setOpen(true);
        history.push('/view-client')
      })
      .catch((error) => {
        setOpenLoader(false);
        const message = alert;
        message.message = "Deletion Client Details Unsuccessful";
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
      <h1 style={{ marginLeft: '300px', marginTop: '50px' }}>
        {Id ? 'Edit Client Details' : 'Add Client'}
      </h1>
      <Box className="form">

        <div style={{ marginLeft: '10px' }}>
          <form noValidate autoComplete="off">
            <div className="leftDivision">
              <div style={{ marginRight: '15px' }} >
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
              <div style={{ float: "left", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
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
              <div style={{ float: "right", marginRight: "15px", marginTop: '30px', marginBottom: '30px' }}>
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


              <div style={{ marginBottom: '10px', marginRight: "15px" }}>
                <TextField
                  id="outlined-textarea"
                  label="Payment Terms"
                  multiline
                  variant="outlined"
                  inputProps={{ className: classes.payment }}
                  name="payment_terms"
                  value={clientData.payment_terms}
                  onChange={handleChange}
                />
              </div>
              <div style={{ marginBottom: '10px', marginRight: "15px" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
          <div style={{ float: 'left', overflow: 'hidden' }}>
            <div style={{ marginTop: '15px' }}>
              <TextField
                id="outlined-textarea"
                label="Notes"
                placeholder="Notes - any relevant information already not covered"
                multiline
                variant="outlined"
                inputProps={{
                  className: classes.multiline
                }}
                name="notes"
                value={clientData.notes}
                onChange={handleChange}


              />
            </div>
            <div style={{ marginTop: "15px", marginBottom: "20px" }}>
              <TextField
                id="outlined-textarea"
                label="Terms"
                placeholder="Terms and conditions"
                multiline
                variant="outlined"
                inputProps={{
                  className: classes.multiline
                }}
                name="terms"
                value={clientData.terms}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div style={{ clear: 'both' }}>
        </div>
      </Box>

      <div style={{ marginLeft: "300px", marginTop: "10px" }}>
        {!Id &&
          <Button type="reset" variant="contained" color="primary" onClick={printdata}>
            Add Client
          </Button>}
        {Id &&
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
    </div>


  );
}
