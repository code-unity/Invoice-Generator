import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import history from '../../history';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@mui/material/IconButton';
import DateFnsUtils from '@date-io/date-fns';
import {CSVLink}  from "react-csv";
import jsPDF from 'jspdf'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';

//npm install xlsx
//yarn add react-csv

function deleteData (value) {
    axios.delete(`${process.env.REACT_APP_API_URL}/payslip/${value}`)
      .then((response) => {
        alert('successfully deleted Payslip');
        history.push('/schedule-invoice')
        history.push('/view-payslip')
      })
      .catch((error) => {
        alert('Failed to delete payslip');
      })
  }


  export default function ViewPayslip() {

    
    const [newdate, setDate] = useState(null);
    const [fromdate, setfromDate] = useState(null); 
    const [todate, settoDate] = useState(null); 

    const state= {
        fromdate,
        todate
    }
    const handleDateChange = (date) => {
        var dateInReqFormat=convert(date);
        setDate(dateInReqFormat)
      };
      const handlefromDateChange = (date) => {
        const dateInReqFormat=convert(date);
        setfromDate(dateInReqFormat)
      };
      const handletoDateChange = (date) => {
        const dateInReqFormat=convert(date);
        settoDate(dateInReqFormat)
      };


    const convert = (str) => {
        
        var date = new Date(str),
        mnth = date.toLocaleString('en-us', { month: 'long' });
        
        return [mnth, date.getFullYear()].join(" ");
    }


    const [things, setThings] = useState([]);
    const fetchData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/payslip`)
            .then((data) => {
                setThings(data.data.data.results)
            
            });
        }

    useEffect(() => {
        fetchData()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

const [filterdate,setFilterdate] =useState('')
function filterData(newdate){
    axios.get(`${process.env.REACT_APP_API_URL}/payslip/filter/${newdate}`)
        .then((response) => {
            setThings(response.data.data)
            setFilterdate(newdate)
})
        .catch((error) => {
            console.log("failed")
            history.push('/payslip')
        })
}

const headers = [
  { label: "MONTH&YEAR", key: "date" },
  { label: "EMPLOYEE ID", key: "candidate_id" },
  { label: "EMPLOYEE NAME", key: "candidate" },
  { label: "DESIGNATION", key: "Designation" },
  { label: "BASIC", key: "Basic" },
  { label: "DA", key: "D_allow" },
  { label: "HRA", key: "HR_allow" },
  { label: "CONVEYANCE", key: "conveyance" },
  { label: "BONUS", key: "Bonus" },
  { label: "OTHERS", key: "others" },
  { label: "TOTAL EARNINGS", key: "total_earnings" },
  { label: "PROFESSIONAL TAX (PF)", key: "prof_tax" },
  { label: "EMPLOYER PF", key: "p_f_employer" },
  { label: "EMPLOYEE PF", key: "p_f_employee" },
  { label: "TOTAL PF(PF + EMPLOYEE PF)", key: "total_tax" },
  { label: "ADVANCE TAX / TDS", key: "td_S" },
  { label: "OTHER TAX", key: "other_tax" },
  { label: "NET DEDUCTIONS", key: "net_deductions" },
  { label: "NET SALARY", key: "net_salary" },
];

const csvReport = {
    data: things,
    headers: headers,
    filename: 'PayslipData.csv'
  };


// function fullData(){
//     axios.post(`${process.env.REACT_APP_API_URL}/payslip/total`, state)
//     .then((response) => {
//         console.log(response)
//     })
//     .catch((error) => {
//         console.log("failed")})
// }

// function halfData(){
//     axios.post(`${process.env.REACT_APP_API_URL}/payslip/half`, state)
//     .then((response) => {
//         console.log(response)
//     })
//     .catch((error) => {
//         console.log("failed")})
// }


var tds = []
  async function tdsData(){
    await axios.post(`${process.env.REACT_APP_API_URL}/payslip/tds/`, state)
    .then((response) => {
        tds=response.data.data
        console.log(response.data.data)
        print(tds)
    })
    .catch((error) => {
        console.log("failed")})
}
const columns = [
    { title: "Month & Year", field: "date", },
    { title: "Employee Name", field: "candidate", },
    { title: "PAN NO.", field: "candidate_id" },
    { title: "Gross Salary", field: "total_earnings" },
    { title: "ADVANCE TAX / TDS", field: 'td_S', type: "currency" },
]

function print(tds){
    const doc =new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(18);
    doc.text(" Advance TAX/TDS Details In The Given Range Of Months", 50, 50)
    doc.setFontSize(13);
    doc.text("Full Time Employees Data", 30, 90);
    let finalY = 90;
    
    for(var i=0;i<(tds.fullTimedata).length-1;i++){
    doc.autoTable({
      theme: "grid",
      startY: (finalY) + 10,
      startX: 0,
      //columnStyles: { 1: { halign: 'center'} },
      columns: columns.map(col => ({ ...col, dataKey: col.field })),
      body: ((tds.fullTimedata)[i]).slice(0, -1),
      headStyles: {
        halign: "center",
        valign: "middle",
        lineWidth: 0.25,
        lineColor: 200
      },
      bodyStyles: {
        halign: "center",
        valign: "middle",
        lineWidth: 0.25,
        lineColor: 200
      },
      rowStyles:{ 0:{ content: 'Text', rowSpan: 5} }
    })
    finalY = doc.previousAutoTable.finalY+15;
    doc.setFontSize(10);
    doc.setTextColor("Blue");
    var k=((tds.fullTimedata)[i]).length
    doc.text(`Sub Total:${(tds.fullTimedata)[i][k-1]}`, 50, finalY);
    doc.setFontSize(13);
    doc.setTextColor("black");
    finalY+=10
}
    finalY+=10
    doc.setTextColor("red");
    doc.setFontSize(11);
    var len=((tds.fullTimedata)).length
    doc.text(`Full Time Total:${(tds.fullTimedata)[len-1]}`, 50, finalY);
    doc.setTextColor("black");
    doc.setFontSize(13);
    finalY+=40
    doc.text("Part TIme / Internship Employees Data", 30, finalY);

    for(i=0;i<(tds.internData).length-1;i++){
        doc.autoTable({
        theme: "grid",
        startY: (finalY) + 10,
        startX: 0,
        //columnStyles: { 1: { halign: 'center'} },
        columns: columns.map(col => ({ ...col, dataKey: col.field })),
        body: ((tds.internData)[i]).slice(0, -1),
        headStyles: {
            halign: "center",
            valign: "middle",
            lineWidth: 0.25,
            lineColor: 200
        },
        bodyStyles: {
            halign: "center",
            valign: "middle",
            lineWidth: 0.25,
            lineColor: 200
        },
        rowStyles:{ 0:{ content: 'Text', rowSpan: 5} }
        })
        finalY = doc.previousAutoTable.finalY+15;
        doc.setFontSize(10);
        doc.setTextColor("Blue");
        k=((tds.internData)[i]).length
        doc.text(`Sub Total:${(tds.internData)[i][k-1]}`, 50, finalY);
        doc.setFontSize(13);
        doc.setTextColor("black");
        finalY+=10
    }
    finalY+=10
    doc.setTextColor("red");
    doc.setFontSize(11);
    var len1=((tds.internData)).length
    doc.text(`Part Time Total:${(tds.internData)[len1-1]}`, 50, finalY);
    doc.setTextColor("black");
    finalY+=20
    var totalTds= parseFloat((tds.internData)[len1-1])+parseFloat((tds.fullTimedata)[len-1])
    doc.text(`TOTAL TDS AMOUNT:${totalTds}`, 50, finalY);
    doc.setFontSize(13);   
    doc.save('ADVANCE TAX/TDS Report.pdf')

}

    return (
        <div style={{ overflowX:'hidden', padding:'1.5%'}}>
            <div style={{ padding:'1%',paddingBottom:"0", display:"flex",alignItems:"center"}}>
            <div style={{flexGrow:"1",textAlign:"left", padding:"0"}}>
            <Button type="button" variant='contained' color="primary" onClick={() => history.push('/payslip')}>
                Add New Payslip
            </Button>
            </div>
            <div style={{marginRight:"8px", fontSize:"12px",marginTop:"3px"}}>
            <h2>Select Month:</h2>
            </div>
            
        <div style={{ float: "right", width:"150px",textalign:'center', marginTop:'-25px'}}>

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  views={["year", "month"]}
                  format="MMMM/yyyy"
                  margin="normal"
                  label="Month/Year"
                  value={newdate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
        </div>

        <div style={{marginLeft:"8px"}}>
            <Button  variant='contained' color="primary" onClick={()=>{filterData(newdate)}}>
                Filter
            </Button>
            </div>
          </div>
          <hr style={{border: ".5px solid black"}}/>


          <TableContainer component={Paper} sx={{ ml: 5 }} style={{marginLeft:'0',marginBottom:'10px', borderWidth:"2px", borderColor:"white", borderStyle:'solid'}}>
                
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow style={{backgroundColor:'lightblue'}}>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Month & Year </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Employee Id</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Employee Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Designation</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Basic</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>DA</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>HRA</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Conveyance</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Bonus</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Others</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Total Earnings</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Professional Tax</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Employer PF</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Employee PF</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Total PF(PF + Employee PF)</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>ADVANCE TAX/TDS</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Other Tax</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Net Deductions</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Net Salary</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Remarks</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Edit</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
            
            {things.length !== 0 &&
                    <TableBody >
                        {things.map((temp) => (
                            <TableRow key={temp._id} >
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.date}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.candidate_id}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.candidate}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.Designation}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.type}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.Basic}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.D_allow}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.HR_allow}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.conveyance}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.Bonus}</TableCell>

                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.others}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.total_earnings}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.prof_tax}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.p_f_employer}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.p_f_employee}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.total_tax}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.td_S}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.other_tax}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.net_deductions}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.net_salary}</TableCell>
                        <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>{temp.remarks}</TableCell>

                                
                                <TableCell sx={{ fontWeight: 'light' }} style={{border: ".25px solid black"}}>
                                    <IconButton 
                                        aria-label="delete-client"
                                        size='small'
                                        onClick={() => history.push(`/payslip/${temp._id}`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} style={{border: ".5px solid black"}}>
                                    <IconButton 
                                        aria-label="delete-client"
                                        size='small'
                                        onClick={() => deleteData(temp._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>}
                </Table>
            </TableContainer>
            {things.length === 0 && 
                <div className='side' style={{width:"100%", padding:"2%",fontSize: "20px", textAlign:"center", flexGrow:"1"}}>
        
                <h2 style={{fontFamily:"Candara"}}>There are no Payslips for {filterdate}  </h2>
                
            </div>}
            <div style={{ padding:'1%', display:"flex",alignItems:"center"}}>
            <div style={{ float: "left",textalign:'center',flexGrow:"1" }}>
            <Button  variant='contained' color="primary"> 
                <CSVLink {...csvReport} style={{textDecoration:"none",color:"white"}}>Print</CSVLink>
            </Button>
            </div>
            <div style={{marginRight:"0px", fontSize:"13px",marginTop:"3px",width:"120px"}}>
            <h3>Select From & To Months:</h3>
            </div>

            <div style={{ float: "right", width:"150px",textalign:'center',marginTop:'-25px',marginLeft:'7px'}}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                views={["year", "month"]}
                format="MMMM/yyyy"
                name="fromdate"
                margin="normal"
                label="From"
                value={fromdate}
                onChange={handlefromDateChange}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
            />
            </MuiPickersUtilsProvider>
            </div>
            <div style={{marginRight:"0px", fontSize:"13px",marginTop:"3px"}}>
            <h3>-</h3>
            </div>
            <div style={{ float: "right", width:"150px",textalign:'center',marginTop:'-25px',marginLeft:'15px'}}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                views={["year", "month"]}
                format="MMMM/yyyy"
                margin="normal"
                name="todate"
                label="To"
                value={todate}
                onChange={handletoDateChange}
                KeyboardButtonProps={{
                'aria-label': 'change date',
                }}
            />
            </MuiPickersUtilsProvider>
            </div>
            <div style={{ float: "right",textalign:'center',marginLeft:'15px'}}>
            <Button  variant='contained' color="primary" onClick={tdsData}>
                Print Tds Data
            </Button>

            </div>
            </div>

            {/* <div style={{ padding:'1%', display:"flex",alignItems:"center" }}>
            <Button  variant='contained' color="primary" onClick={fullData}>
                send
            </Button>

            </div>
            <div style={{ padding:'1%', display:"flex",alignItems:"center" }}>
            <Button  variant='contained' color="primary" onClick={halfData}>
                Half Data
            </Button>

            </div> */}

        </div>
    )
}

