import React, { useState } from "react";
import MaterialTable from "material-table";
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import MuiAlert from '@material-ui/lab/Alert';
import axios from "axios";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column'
    },
    bgContainer: {
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: '2%',
        marginBottom: '5%'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
        maxWidth: 300,
    }
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

const ViewTimeSheet = () => {
    const classes = useStyles();
    const [sheet, setSheet] = useState([]);
    const [open, setOpen] = useState(false);
    const [openLoader, setOpenLoader] = useState(false);
    const [candidateData, setCandidateData] = useState([]);
    const [candidateName, setCandidateName] = React.useState([]);

    const columns = [
        { title: 'Descrition', field: 'description', type: 'string', align: 'left' },
        { title: 'Number of Hours', field: 'no_of_hours', type: 'numeric', align: 'left' },
        { title: 'Attendance', field: 'attendance', lookup: { Absent: 'Absent', Present: 'Present' }, align: 'left' },
        { title: 'Date', field: 'date', type: 'date', align: 'left' }
    ]

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
    function handleChange(event) {
        if (event.target.value !== "") {
          setCandidateName(event.target.value);
            axios.get(`${process.env.REACT_APP_API_URL}/timesheet`, {
                headers: { "Content-Type": "application/json" },
            })
                .then(function (response) {
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

    };
        
    const fetchCandidateData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/candidate`)
            .then((res) => {
                setCandidateData(res.data.data)
            })
    }

    React.useEffect(() => {
        fetchCandidateData();
    }, []);
    return (<div className={classes.bgContainer}>
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-name-label">Select Candidate</InputLabel>
            <Select
                labelId="demo-mutiple-name-label"
                id="demo-mutiple-name"
                defaultValue={""}
                value={candidateName}
                onChange={e => handleChange(e)}
                input={<Input />}
                MenuProps={MenuProps}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {candidateData.map((name) => (
                    <MenuItem key={name._id} value={name._id} >
                        {name.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

        <MaterialTable
            title='Time Sheet Table'
            data={sheet}
            columns={columns}
            options={options}
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

export default ViewTimeSheet;
