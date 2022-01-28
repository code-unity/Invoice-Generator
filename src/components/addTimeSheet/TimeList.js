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
const TimeList = (props) => {
  const [description, setDescription] = useState("");
  const [noOfHours, setNoOfHours] = useState("");
  const [changed, setChanged] = useState("");
  const [attendance, setAttendance] = useState("Absent");
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
    <div className="moniesh_row">
      <div className="moniesh_col">
        <label className="labeled">Description </label>
        <input
          type="text"
          className="input_text"
          value={description}
          onChange={(event) => {
            setChanged("description");
            setDescription(event.target.value);
          }}
        />
      </div>
      <div className="moniesh_col">
        <label className="labeled">No of Hours </label>
        <input
          type="text"
          value={noOfHours}
          className="input_text"
          onChange={async (event) => {
            setChanged("noOfHours");
            setNoOfHours(event.target.value);
          }}
        />
      </div>
      <div className="moniesh_col">
        <FormControl>
          <Select
            defaultValue={"Absent"}
            value={attendance}
            onChange={(e) => setAttendance(e)}
            input={<Input />}
            MenuProps={MenuProps}
          >
            <MenuItem value="">Present</MenuItem>
            <MenuItem>Absent</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="date_cont">
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
      </div>
    </div>
  );
};

export default TimeList;
