import React, { useState, useEffect } from "react";
import "./TimeSheetCompstyle.css";
import TimeList from "./TimeList";
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
    }
  };
  useEffect(() => {
    if (timelen == 1 && !duplicate) {
      sheet.push({
        description: "",
        noOfHours: "",
        selectedDate: new Date(),
      });
    } else if (duplicate) {
      const datee = new Date(sheet[timelen - 2].selectedDate);
      datee.setDate(datee.getDate() + 1);
      sheet.push({
        description: sheet[timelen - 2].description,
        noOfHours: sheet[timelen - 2].noOfHours,
        selectedDate: datee,
      });
    } else {
      const datee = new Date(sheet[timelen - 2].selectedDate);
      datee.setDate(datee.getDate() + 1);
      sheet.push({
        description: "",
        noOfHours: "",
        selectedDate: datee,
      });
    }
  }, [timelen]);
  let timeSheet = [];
  for (let i = 0; i < timelen; i++) {
    if (i == 0) {
      <TimeList
        key={i}
        onChanged={onChanged}
        index={i}
        duplicate={false}
        date={new Date()}
        data={[]}
        sheet={sheet}
      />;
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
      <div className="outer_moniesh">
        <div className="sheeted">{timeSheet}</div>
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
