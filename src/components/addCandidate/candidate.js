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
import { Box } from '@material-ui/core';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import MuiAlert from '@material-ui/lab/Alert';
import { useParams } from "react-router-dom";
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
  const [Id, setId] = React.useState(id);
  const [clientData, setClientdata] = React.useState([]);
  const [candidateData, setState] = React.useState({ name: "", email: "", assigned_to: "", payment_terms: "", date_of_birth: String(new Date()), date_of_Joining: String(new Date()) });
  const [open, setOpen] = React.useState(false);
  const [alert, setMessage] = React.useState({ message: "", severity: "" });
  const [openLoader, setOpenLoader] = React.useState(false);


  useEffect(() => {
    const fetchData = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/candidate/${Id}`)
        .then((response) => {
          setState({
            name: response.data.data.name,
            email: response.data.data.email,
            assigned_to: response.data.data.assigned_to,
            payment_terms: response.data.data.payment_terms,
            date_of_birth: response.data.data.date_of_birth,
            date_of_Joining: response.data.data.date_of_Joining
          })
        })
        .catch((error) => {
          const message = alert;
          message.message = "Please check the candidate ID";
          message.severity = "error"
          setMessage(message);
          setOpen(true);
          setId(null)
          setState({ name: "", email: "", assigned_to: "", payment_terms: "", date_of_birth: String(new Date()), date_of_Joining: String(new Date()) });
        })
    }
    const fetchClientData = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/client`)
        .then((res) => {
          setClientdata(res.data.data.results);
        });
    }
    setId(id)
    fetchClientData()
    if (id) {
      fetchData()
    }
  }, [id])// eslint-disable-line react-hooks/exhaustive-deps


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
        setState({ name: "", email: "", assigned_to: "", payment_terms: "", date_of_birth: String(new Date()), date_of_Joining: String(new Date()) });
      })
      .catch(error => {
        setOpenLoader(false);
        const message = alert;
        message.message = error.response.data.status.message;
        message.severity = "error"
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
        message.message = error.response.data.status.message;
        message.severity = "error"
        setMessage(message);
        setOpen(true);
      })
  }

  const deleteData = () => {
    setOpenLoader(true)
    axios.delete(`${process.env.REACT_APP_API_URL}/candidate/${Id}`)
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
        message.message = error.response.data.status.message;
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
        {Id ? 'Edit Candidate Details' : 'Add Candidate'}
      </h1>
      <Box className="form">

        <div style={{ marginLeft: '10px' }}>
          <form noValidate autoComplete="off">
            <div className="leftDivision">
              <div style={{ marginRight: '15px' }} >
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
              <div style={{ marginRight: "15px", marginTop: '30px', marginBottom: '15px' }}>
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
              <div style={{ marginBottom: '10px', marginRight: "15px" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
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
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-name-label">Assigned To</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  value={candidateData.assigned_to}
                  onChange={handleChange}
                  name="assigned_to"
                  input={<Input />}
                  MenuProps={MenuProps}
                >{clientData.map((name) => (
                  <MenuItem key={name._id} value={name._id}>{name.client_name}</MenuItem>
                ))}</Select>
              </FormControl>
              <div style={{ marginBottom: '10px', marginRight: "15px" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy-MM-dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date of Joining"
                    value={candidateData.date_of_Joining}
                    onChange={joiningDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div style={{ marginBottom: '10px', marginRight: "15px" }}>
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
      </Box>

      <div style={{ marginLeft: "300px", marginTop: "10px" }}>
        {!Id &&
          <Button type="reset" variant="contained" color="primary" onClick={printdata}>
            Add Candidate
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
