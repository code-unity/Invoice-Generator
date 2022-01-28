import React, { useState, useEffect } from "react";
import "./TimeSheetCompstyle.css";
import TimeList from "./TimeList";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
let sheet = [];
const date = new Date();
const TimeSheetComp = () => {
  const [timelen, setTimelen] = useState(1);
  const [duplicate, setDuplicate] = useState(false);
  const onChanged = (type, value, index) => {
    if (type == "description") {
      sheet[index].description = value;
    } else if (type == "noOfHours") {
      sheet[index].noOfHours = value;
    } else if (type == "attendance") {
      sheet[index].attendance = value;
    } else if (type == "date") {
      sheet[index].selectedDate = value;
    }
  };
  useEffect(() => {
    if (timelen == 1) {
      sheet.push({
        description: "",
        noOfHours: "",
        attendance: "Absent",
        selectedDate: new Date(),
      });
    } else if (duplicate) {
      const datee = new Date(sheet[timelen - 2].selectedDate);
      sheet.push({
        description: sheet[timelen - 2].description,
        noOfHours: sheet[timelen - 2].noOfHours,
        attendance: new Date(datee.getTime()+(24*60*60*1000)),
        selectedDate: datee,
      });
    } else {
      const datee = new Date(sheet[timelen - 2].selectedDate);
      sheet.push({
        description: "",
        noOfHours: "",
        attendance: "Absent",
        selectedDate: new Date(datee.getTime()+(24*60*60*1000)),
      });
    }
  }, [timelen]);
  let timeSheet = [];
  for (let i = 0; i < timelen; i++) {
    if (i == 0) {
      timeSheet.push(
        <TimeList
          key={i}
          onChanged={onChanged}
          index={i}
          duplicate={false}
          date={new Date()}
          data={[]}
          sheet={sheet}
        />
      );
    } else if (duplicate) {
      timeSheet.push(
        <TimeList
          key={i}
          onChanged={onChanged}
          index={i}
          duplicate={true}
          data={sheet[timelen - 2]}
          date={sheet[timelen - 2].selectedDate}
          sheet={sheet}
        />
      );
    } else
      timeSheet.push(
        <TimeList
          key={i}
          onChanged={onChanged}
          index={i}
          duplicate={false}
          date={sheet[timelen - 2].selectedDate}
          data={[]}
          sheet={sheet}
        />
      );
  }
  return (
    <>
      <div className="table_cont">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Number of Hours</TableCell>
                <TableCell align="right">Attendance</TableCell>
                <TableCell align="right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{timeSheet}</TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="sheet_container">
        <div className="btncont">
          <button
            className="addbtn"
            onClick={() => {
              setDuplicate(false);
              setTimelen(timelen + 1);
            }}
          >
            Add
          </button>
          <button
            onClick={() => {
              setTimelen(timelen + 1);
              setDuplicate(true);
            }}
            className="addbtn"
          >
            Duplicate
          </button>
        </div>
      </div>
      <div className="sheet_container">
        <button onClick={() => console.log(sheet)} className="submit_button">
          Submit
        </button>
      </div>
    </>
  );
};

export default TimeSheetComp;
