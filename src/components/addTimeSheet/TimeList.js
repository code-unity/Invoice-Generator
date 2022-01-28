import React, { useState, useEffect } from "react";
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
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { makeStyles , useTheme} from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    maxWidth: 300,
  },
}));
const TimeList = (props) => {
  const [description, setDescription] = useState("");
  const [noOfHours, setNoOfHours] = useState("");
  const [changed, setChanged] = useState("");
  const classes = useStyles();
  const [attendance, setAttendance] = useState("");
  const [selectedDate, setSelectedDate] = useState(props.date);
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
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  useEffect(() => {
    if (props.duplicate) {
      setDescription(props.data.description);
      setNoOfHours(props.data.noOfHours);
    }
  }, []);
  useEffect(() => {
    if (changed == "description")
      props.onChanged("description", description, props.index);
    else if (changed == "noOfHours")
      props.onChanged("noOfHours", noOfHours, props.index);
  }, [description, noOfHours, selectedDate]);
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        <Input
          className="input_text"
          value={description}
          onChange={(event) => {
            setChanged("description");
            setDescription(event.target.value);
          }}
        />
      </TableCell>
      <TableCell align="right">
        <Input
          value={noOfHours}
          onChange={async (event) => {
            setChanged("noOfHours");
            setNoOfHours(event.target.value);
          }}
        />
      </TableCell>
      <TableCell align="right">
        <FormControl className={classes.formControl}>
          <Select
            defaultValue="Absent"
            value={attendance}
            onChange={(e) => {setAttendance(e.target.value)
            }}
            input={<Input />}
            MenuProps={MenuProps}
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      <TableCell align="right">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="yyyy-MM-dd"
            margin="normal"
            label="Date"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      </TableCell>
    </TableRow>
  );
};

export default TimeList;
