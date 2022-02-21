import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@mui/material/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import MuiAlert from '@material-ui/lab/Alert';
import axios from "axios";
import './timeSheet.css';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column'
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const TimeSheetComp = () => {
  const classes = useStyles();
  const [sheet, setSheet] = useState([]);
  const [updatedsheet,setUpdatedsheet] = useState([]);
  const [duplicateData, setDuplicateData] = useState({ description: '', no_of_hours: '', attendance: 'Present', date: '' });
  const [open, setOpen] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [dates, setDates] = useState({
    from_date:new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to_date:new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  })

    const fromDateChange = (date) => {
        setDates({...dates, from_date: date })
    };
    const toDateChange = (date) => {
        setDates({...dates, to_date: date })
    };

  const columns = [
    { title: 'Descrition', field: 'description', type: 'string', align: 'left' },
    { title: 'Number of Hours', field: 'no_of_hours', type: 'numeric', align: 'left' },
    { title: 'Attendance', field: 'attendance', lookup: { Absent: 'Absent', Present: 'Present' }, align: 'left' },
    { title: 'Date', field: 'date', type: 'date', align: 'left' }
  ]

  const onRowAdd = (newData) =>
    new Promise((resolve, reject) => {
      setDuplicateData({ description: '', no_of_hours: '', attendance: 'Present', date: '' })
      setTimeout(() => {
        setSheet([...sheet, newData]);
        resolve();
      }, 1000)
    })

  const onRowUpdate = (newData, oldData) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const dataUpdate = [...sheet];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        if (newData._id) {
          setUpdatedsheet([...updatedsheet,newData._id])
        }
        setSheet([...dataUpdate]);
        setDuplicateData({})
        resolve();
      }, 1000)
    })

  const onRowDelete = oldData =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const dataDelete = [...sheet];
        const index = oldData.tableData.id;
        console.log(oldData)
        if(oldData._id){
        axios.delete(`${process.env.REACT_APP_API_URL}/timesheet/${oldData._id}`)
      }
        dataDelete.splice(index, 1);
        setSheet([...dataDelete]);
        resolve()
      }, 1000)
    })

  const onRowAddCancelled = () => {
    setDuplicateData({ description: '', no_of_hours: '', attendance: 'Present', date: '' })
  }
  const onClickDuplicate = (event, rowData) => {
    const id= rowData.tableData.id+1
    const date=new Date(rowData.date)
    date.setDate(date.getDate() + 1)

    const newData = {
      description: rowData.description, no_of_hours: rowData.no_of_hours,
      attendance: rowData.attendance, date:new Date(date).toISOString()
    }

   sheet.splice(id, 0, newData)
    setSheet([...sheet])

  }
  const options = {
    actionsColumnIndex: -1,
    search: false,
    paging: false,
    draggable: false,
    sorting: false,
    rowStyle: (rowData) => ({
      backgroundColor: (new Date(rowData.date).getDay() === 0 || new Date(rowData.date).getDay() === 6) && '#FF5252',
      color: (new Date(rowData.date).getDay() === 0 || new Date(rowData.date).getDay() === 6) && 'white',
      overflowWrap: 'break-word'
    })
  }
  const [alert, setMessage] = useState({ message: "", severity: "" });
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const submitData=()=> {
    if (sheet.length === 0) {
      const message = alert;
      message.message = "Please Add Atleast One Entry";
      message.severity = "error";
      setMessage(message);
      setOpen(true);
      return
    }
    if (updatedsheet.length) {
    const unique=[...new Set(updatedsheet)]
    const putSheet=sheet.filter((data)=>unique.includes(data._id))
      axios.put(`${process.env.REACT_APP_API_URL}/timesheet`, putSheet, {
        headers: { "Content-Type": "application/json" },
      })
        .then(function (response) {
          setOpenLoader(false);
          const message = alert;
          message.message = "Time Sheet Added Successfully";
          message.severity = "success";
          setMessage(message);
          setOpen(true);
        })
        .catch((error) => {
          setOpenLoader(false);
          const message = alert;
          message.message = "Submission Failed";
          message.severity = "error";
          setMessage(message);
          setOpen(!open);
        });
    }
    const postData = sheet.filter(item => !item._id)
    if (postData.length) {
      axios.post(`${process.env.REACT_APP_API_URL}/timesheet`, postData, {
        headers: { "Content-Type": "application/json" },
      })
        .then(function (response) {
          setOpenLoader(false);
          const message = alert;
          message.message = "Time Sheet Added Successfully";
          message.severity = "success";
          setMessage(message);
          setOpen(true);
        })
        .catch((error) => {
          setOpenLoader(false);
          const message = alert;
          message.message = "Submission Failed";
          message.severity = "error";
          setMessage(message);
          setOpen(true);
        });
    }
  }
  function searchData() {
    axios.get(`${process.env.REACT_APP_API_URL}/timesheet?from_date=${dates.from_date}&&to_date=${dates.to_date}`, {
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        response.data.status.data.sort((a,b) =>  new Date(a.date) - new Date(b.date))
        setSheet(response.data.status.data)

      })
      .catch((error) => {
        setOpenLoader(false);
        const message = alert;
        message.message = "Submission Failed";
        message.severity = "error";
        setMessage(message);
        setOpen(!open);
      });
  }
  useEffect(() => {
    const fetchData = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/timesheet?from_date=${dates.from_date}&&to_date=${dates.to_date}`, {
        headers: { "Content-Type": "application/json" },
      })
        .then(function (response) {
        response.data.status.data.sort((a,b) =>  new Date(a.date) - new Date(b.date))
          setSheet(response.data.status.data)
        })
        .catch((error) => {
          setOpenLoader(false);
          const message = alert;
          message.message = "Failed to get the results";
          message.severity = "error";
          setMessage(message);
          setOpen(true);
        });
    }
    fetchData()
  }, [open])// eslint-disable-line react-hooks/exhaustive-deps

  return (<div  className="bg-container">
    <div className="first-row">
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id="date-picker-inline"
                label="From"
                value={dates.from_date}
                onChange={fromDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id="date-picker-inline"
                label="To"
                value={dates.to_date}
                onChange={toDateChange}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
    <div className="search-container">
      <Button
        type="button"
        variant='contained'
        color="primary"
        onClick={searchData}
      >
        Search
      </Button>
      </div>
      </div>
    <MaterialTable
      title='Time Sheet Table'
      data={sheet}
      columns={columns}
      editable={{
        onRowAdd,
        onRowUpdate,
        onRowDelete,
        onRowAddCancelled
      }}
      initialFormData={duplicateData}
      actions={[{ icon: 'library_add', tooltip: 'Duplicate Entry', onClick: onClickDuplicate }]}
      options={options}
    />
    <div className="btn-container">
      <Button
        type="button"
        variant='contained'
        color="primary"
        onClick={submitData}
      >
        Submit
      </Button>
    </div>
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={alert.severity}>
        {alert.message}
      </Alert>
    </Snackbar>
    <Backdrop className={classes.backdrop} open={openLoader} >
      <div>
        <CircularProgress color="primary" />
      </div>
      <span>Submitting Data...</span>
    </Backdrop>
  </div>
  );
};

export default TimeSheetComp;
