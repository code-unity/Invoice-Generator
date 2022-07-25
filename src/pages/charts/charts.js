import React from 'react';
import {useEffect} from "react";
import styles from './charts.module.css';
import { Chart } from "react-google-charts";
import TextField from '@mui/material/TextField';
import axios from "axios";

const chartdata = [
    ["Task", "Amount"],
    ["Total Amount", 11],
    ["TDS", 2],
    ["GST", 2],
];
const options = {
    title: "Amount",
    is3D: true,
};

var fromdate = new Date();
fromdate.setMonth(fromdate.getMonth());
var Month = fromdate.toLocaleString('default', { month: 'short' });
var currYear = fromdate.getFullYear().toString();

var todate = new Date();
todate.setMonth(todate.getMonth() + 1);
var nextMonth = todate.toLocaleString('default', { month: 'short' });
var currYear = todate.getFullYear().toString();

const Months = {
    "Jan": '01',
    "Feb": '02',
    "Mar": '03',
    "Apr": '04',
    "May": '05',
    "Jun": '06',
    "Jul": '07',
    "Aug": '08',
    "Sep": '09',
    "Oct": '10',
    "Nov": '11',
    "Dec": '12'
}


const Charts = () => {

    const [fromdate, setFromdate] = React.useState(`${currYear}-${Months[Month]}`);
    const [todate, setTodate] = React.useState(`${currYear}-${Months[nextMonth]}`);
    const [data, setData] = React.useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}//payslip/${fromdate}/${todate}`)
            .then(response => {
                setData(response.data.data);
            });
        }, [])
        

    const dateChangeHandler = (event) => {
        var selectedDate = event.target.value;
        const fromdate = new Date();
        const monthNumber = selectedDate.split('-')[1];
        fromdate.setMonth(monthNumber);
        Month = fromdate.toLocaleString('default', { month: 'short' })
        currYear = selectedDate.split('-')[0];
        setFromdate(`${currYear}-${Months[Month]}`);
    }

    const todateChangeHandler = (event) => {
        var selectedDate = event.target.value;
        const todate = new Date();
        const monthNumber = selectedDate.split('-')[1];
        todate.setMonth(monthNumber);
        Month = todate.toLocaleString('default', { month: 'short' })
        currYear = selectedDate.split('-')[0];
        setTodate(`${currYear}-${Months[nextMonth]}`);
    }


    return (
        <>
            <form className={styles.container} >
                <div>
                    <TextField
                        style={{ float: 'left', marginTop: '40px', marginLeft: '20%' }}
                        label="Start Date"
                        type="month"
                        required
                        value={fromdate}
                        onChange={dateChangeHandler}
                        InputLabelProps={{ shrink: true }}>
                    </TextField>
                    <TextField
                        style={{ float: 'right', marginTop: '40px', marginRight: '20%' }}
                        className={styles.enddate}
                        label="End Date"
                        type="month"
                        required
                        value={todate}
                        onChange={todateChangeHandler}
                        InputLabelProps={{ shrink: true }}>
                    </TextField>
                </div>
                <Chart
                    style={{ marginTop: '40px',marginLeft:'5%' }}
                    chartType="PieChart"
                    data={chartdata}
                    options={options}
                    width={"90%"}
                    height={"400px"}
                />
            </form>
        </>
    )
}

export default Charts