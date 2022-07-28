import React from 'react';
import { useEffect } from "react";
import styles from './charts.module.css';
import { Chart } from "react-google-charts";
import TextField from '@mui/material/TextField';
import axios from "axios";


const options = {
    title: "Amount",
    is3D: true,
};


export const options1 = {
    chart: {
        title: "Company Performance",
        subtitle: "Total Amount,TDS,GST",
    },
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

var chartdata
var datab
const Charts = () => {

    const [fromdate, setFromdate] = React.useState(`${currYear}-${Months[Month]}`);
    const [todate, setTodate] = React.useState(`${currYear}-${Months[nextMonth]}`);
    const [data, setData] = React.useState([]);



    useEffect(async function () {
        const dates = {
            fromdate,
            todate,
        }
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/payslip/total/`, dates, {
            headers:
            {
                'Content-type': 'application/json',
            },
        })
        const data = response.data.data
        console.log(data)
        chartdata = [
            ["category", "Amount-share"],
            ["Total Amount", data.totalAmount],
            ["TDS", data.tDs],
            ["GST", data.gST],
            ["salaries", data.salaries],
        ];


        datab = [
            ["Month", "Total Amount", "TDS", "GST"],
            [data.Month, data.totalAmount, data.tDs, data.gST]
        ];
        setData(data)
    }, [fromdate, todate])


    const dateChangeHandler = (event) => {
        var selectedDate = event.target.value;
        console.log(event.target.value)
        const fromdate = new Date();
        const monthNumber = selectedDate.split('-')[1];
        fromdate.setMonth(monthNumber - 1);
        Month = fromdate.toLocaleString('default', { month: 'short' })
        currYear = selectedDate.split('-')[0];
        setFromdate(`${currYear}-${Months[Month]}`);
    }

    const todateChangeHandler = (event) => {
        var selectedDate = event.target.value;
        console.log(event.target.value)
        const todate = new Date();
        const monthNumber = selectedDate.split('-')[1];
        todate.setMonth(monthNumber - 1);
        Month = todate.toLocaleString('default', { month: 'short' })
        currYear = selectedDate.split('-')[0];
        setTodate(`${currYear}-${Months[Month]}`);
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
                    style={{ marginTop: '40px', marginLeft: '5%' }}
                    chartType="PieChart"
                    data={chartdata}
                    options={options}
                    width={"90%"}
                    height={"400px"}
                />
                <Chart
                    style={{ marginTop: '40px', marginLeft: '5%' }}
                    chartType="Bar"
                    width="90%"
                    height="400px"
                    data={datab}
                    options={options1}
                />
            </form>
        </>
    )
}

export default Charts