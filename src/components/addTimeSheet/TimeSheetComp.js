import React, { useState } from "react";
import "./TimeSheetCompstyle.css";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Select from "@material-ui/core/Select";
import { FormControl, MenuItem } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MaterialTable from "material-table";
import Box from '@mui/material/Box';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import MuiAlert from '@material-ui/lab/Alert';
import DeleteModal from "../DeleteModal";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    maxWidth: 300,
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

const TimeSheetComp = () => {
  const classes = useStyles();
  const [alert, setMessage] = useState({ message: "", severity: "" });
  const [openLoader, setOpenLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [noOfHours, setNoOfHours] = useState('');
  const [attendance, setAttendance] = useState('Present');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [inputMode, setInputMode] = useState('new');
  const [rowData, setRowData] = useState();
  const [sheet, setSheet] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // Row Actions Callback Functions
  //Function to Edit particular row
  const onClickEdit = (event, rowData) => {
    setInputMode('edit');
    setDescription(rowData.description);
    setNoOfHours(rowData.noOfHours);
    setAttendance(rowData.attendance);
    setSelectedDate(new Date(rowData.selectedDate))
    setRowData(rowData);
  }
  //Function to duplicate a particular row
  const onClickDuplicate = (event, rowData) => {
    setInputMode('duplicate');
    setDescription(rowData.description);
    setNoOfHours(rowData.noOfHours);
    setAttendance(rowData.attendance);
    setSelectedDate(rowData.selectedDate);
    setRowData(rowData);
  }
  //Function to delete a particular row
  const onClickDelete = (event, rowData) => {
    setDeleteModal(true)
    setRowData(rowData)
  }
  const onConfirmDelete = () => {
    const data = sheet.filter((item) => item.itemId !== rowData.itemId)
    setSheet(data)
    setRowData('')
    setDeleteModal(false)
    const message = alert;
    message.message = "Deleted Successfully";
    message.severity = "success";
    setMessage(message);
    setOpen(true);
  }
  const onCancelDelete = () => {
    setDeleteModal(false);
    setRowData('');
  }

  //Input Container Callback Functions
  //Function for adding new row with new data
  const onPressAdd = () => {
    if (description.length < 1 || noOfHours.length === 0) {
      const message = alert;
      message.message = "Please Fill All Fields";
      message.severity = "error";
      setMessage(message);
      setOpen(true);
      return
    }
    const item = {
      itemId: selectedDate.toISOString(),
      description: description,
      noOfHours: noOfHours,
      attendance: attendance,
      selectedDate: selectedDate.toISOString()
    }
    setSheet(prevSheet => [...prevSheet, item])
    setDescription('');
    setNoOfHours('');
    setAttendance('Present');
    setSelectedDate(new Date());
    const message = alert;
    message.message = "Details Added Successfully";
    message.severity = "success";
    setMessage(message);
    setOpen(true);
  }
  //Function for adding duplicated row
  const onPressDone = () => {
    if (selectedDate === rowData.selectedDate) {
      const message = alert;
      message.message = "Please Use Different Date";
      message.severity = "error";
      setMessage(message);
      setOpen(true);
      return
    }
    const item = {
      itemId: selectedDate.toISOString(),
      description: description,
      noOfHours: noOfHours,
      attendance: attendance,
      selectedDate: selectedDate
    }
    setSheet(prevSheet => [...prevSheet, item])
    setDescription('');
    setNoOfHours('');
    setAttendance('Present');
    setSelectedDate(new Date());
    setInputMode('new');
    const message = alert;
    message.message = "Duplication Successfull";
    message.severity = "success";
    setMessage(message);
    setOpen(true);
  }
  //Function for saving edited row
  const onPressSave = () => {
    if (description.length < 1 || noOfHours.length === 0) {
      const message = alert;
      message.message = "Please Fill All Fields";
      message.severity = "error";
      setMessage(message);
      setOpen(true);
      return
    }
    const filteredList = sheet.filter((item) => item.itemId !== rowData.itemId)
    const item = {
      itemId: rowData.itemId,
      description: description,
      noOfHours: noOfHours,
      attendance: attendance,
      selectedDate: selectedDate
    }
    setSheet([...filteredList, item]);
    setDescription('');
    setNoOfHours('');
    setAttendance('Present');
    setSelectedDate(new Date());
    setInputMode('new');
    const message = alert;
    message.message = "Details Saved";
    message.severity = "success";
    setMessage(message);
    setOpen(true);
    setRowData('');
  }
  //Function for cancelling duplicate or edit action
  const onPressClear = () => {
    setInputMode('new');
    setDescription('');
    setNoOfHours('');
    setAttendance('Present');
    setSelectedDate(new Date());
    setRowData('');
  }


  function submitData() {
    if (sheet.length === 0) {
      const message = alert;
      message.message = "Please Add Atleast One Entry";
      message.severity = "error";
      setMessage(message);
      setOpen(true);
      return
    }
    setOpenLoader(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}/timesheet`, sheet, {
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

  return (
    <div className="bg-container">
      <div className="input-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="center">Number of Hours</TableCell>
                <TableCell align="center">Attendance</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Input
                    value={description}
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Input
                    type='number'
                    value={noOfHours}
                    onChange={(event) => {
                      setNoOfHours(event.target.value);
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <FormControl className={classes.formControl}>
                    <Select
                      value={attendance}
                      onChange={(e) => {
                        setAttendance(e.target.value);
                      }}
                      input={<Input />}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="Absent">Absent</MenuItem>
                      <MenuItem value="Present">Present</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="dd-MM-yyyy"
                      margin="normal"
                      value={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date)
                      }}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </TableCell>
                <TableCell>
                  {inputMode === 'new' ? (
                    <Tooltip title='Add' arrow>
                      <AddIcon onClick={onPressAdd} />
                    </Tooltip>
                  )
                    : (inputMode === 'edit' ? (
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title='Cancel' arrow>
                          <ClearIcon sx={{ marginRight: '20%' }} onClick={onPressClear} />
                        </Tooltip>
                        <Tooltip title='Save' arrow>
                          <SaveIcon onClick={onPressSave} />
                        </Tooltip>
                      </Box>
                    )
                      : (
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title='Cancel' arrow>
                            <ClearIcon sx={{ marginRight: '20%' }} onClick={onPressClear} />
                          </Tooltip>
                          <Tooltip title='Confirm' arrow>
                            <DoneIcon onClick={onPressDone} />
                          </Tooltip>
                        </Box>
                      )
                    )
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <DeleteModal onCancel={onCancelDelete} onDelete={onConfirmDelete} openModal={deleteModal} />
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
      <MaterialTable
        title='Time Sheet Table'
        columns={[
          { title: 'Descrition', field: 'description', disableClick: true },
          { title: 'Number of Hours', field: 'noOfHours' },
          { title: 'Attendance', field: 'attendance' },
          { title: 'Date', field: 'selectedDate', type: 'date' }
        ]}
        data={sheet}
        actions={[
          { icon: () => <EditIcon />, tooltip: 'Edit Entry', onClick: onClickEdit },
          { icon: () => <ContentCopyIcon />, tooltip: 'Duplicate Entry', onClick: onClickDuplicate },
          { icon: () => <DeleteIcon />, tooltip: 'Delete Entry', onClick: onClickDelete }
        ]}
        options={{
          actionsColumnIndex: -1,
          search: false,
          paging: false,
          draggable: false,
          sorting: false,
          rowStyle: (rowData) => ({
            backgroundColor: (new Date(rowData.selectedDate).getDay() === 0 || new Date(rowData.selectedDate).getDay() === 6) && 'red',
            color: (new Date(rowData.selectedDate).getDay() === 0 || new Date(rowData.selectedDate).getDay() === 6) && 'white'
          })
        }}
      />
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
