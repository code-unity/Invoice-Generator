import React, { Fragment, useEffect, useState } from "react";
import styles from './InvoiceFilter.module.css';
import Card from "../../components/historyCard";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        paddingLeft: "100px",
        marginTop: "20px"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

}))

var currDate = new Date();
var currYear = currDate.getFullYear();
var prevMonth = currDate.getMonth();
if (prevMonth === 0) {
    currYear = currYear - 1;
    prevMonth = 12;
}
prevMonth = prevMonth.toString();
if (Number(prevMonth) < 10)
    prevMonth = '0' + prevMonth;
currYear = currYear.toString();
var defYear = currYear;
var defMonth = prevMonth;

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
const InvoiceReport = () => {
    const [toEmail, setToEmail] = useState('');
    const [ccEmails, setccEmails] = useState('');
    const [date, setDate] = useState(`${currYear}-${prevMonth}`);
    const [data, setData] = useState([]);
    const [openLoader, setOpenLoader] = useState(false);
    const classes = useStyles();

    useEffect((openLoader) => {
        const fetchData = () => {
            setOpenLoader(!openLoader);
            axios.get(`${process.env.REACT_APP_API_URL}/invoice`)
                .then((res) => {
                    setOpenLoader(false);
                    setData(res.data.data.results);
                })
        };
        fetchData();
    }, []);

    const filteredData = data.filter(data => { return data.date.split(" ")[3] === currYear && Months[data.date.split(" ")[1]] === prevMonth })
    console.log(filteredData);
    const sendData = () => {
        const formInfo = {
            toEmail: toEmail,
            month: prevMonth,
            year: currYear,
            invoiceData: filteredData,
        }
        /*fetch always returns a response, if reponse.ok is true then work is done sucessfully else not done
        always use the headers and body should be in json format */
        axios.post(`${process.env.REACT_APP_API_URL}/invoiceFilter`, formInfo,
            {
                headers:
                {
                    'Content-type': 'application/json',
                },
            }).then(response => {
                if (!response.ok)
                    console.log('Send Unsucessful');
            }
            ).catch(error => {
                console.log('Send Unsuccesful');
            })
    }

    const dateChangeHandler = (event) => {
        var selectedDate = event.target.value;
        currYear = selectedDate.split('-')[0];
        prevMonth = selectedDate.split('-')[1];
        setDate(`${currYear}-${prevMonth}`);
    }
    const toChangeHandler = (event) => {
        setToEmail(event.target.value);
    }
    const ccChangeHandler = (event) => {
        setccEmails(event.target.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();
        setToEmail('');
        setccEmails('');
        currYear = defYear;
        prevMonth = defMonth;
        setDate(`${currYear}-${prevMonth}`);
    }
    return (
        <Fragment>
            <form className={styles["container"]} onSubmit={onSubmitHandler}  >
                <div className={styles["date"]} >
                    <TextField label="Date" type="month" required
                        InputLabelProps={{ shrink: true }} value={date} onChange={dateChangeHandler}></TextField>
                </div>
                <div className={styles["email"]}>
                    <div >
                        <TextField label="To" type="email" placeholder="Receivers Email"
                            onChange={toChangeHandler} value={toEmail} required ></TextField>
                    </div>
                    <div >
                        <TextField label="CC" type="email" multiple
                            onChange={ccChangeHandler} value={ccEmails}
                            placeholder="Add , seperated emails" ></TextField>
                    </div>
                </div>
                <Button variant="contained" type="sumbit" color="primary" style={{ width: '10rem', height: '3rem', marginLeft: '38%' }}
                    onClick={sendData}>Send Invoices</Button>

            </form>
            {filteredData.length === 0 && <h2>There is no Invoices for {prevMonth} {currYear}  </h2>}

            {filteredData.length !== 0 && <Grid container spacing={1} className={classes.gridContainer}>
                {filteredData.map((historyData, index) => {
                    return (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card data={historyData} idx={index} />
                        </Grid>
                    );
                })}
            </Grid>
            }
            <Backdrop className={classes.backdrop} open={openLoader} >
                <CircularProgress color="primary" />
            </Backdrop>
        </Fragment>
    )
}
export default InvoiceReport;
/*Bugs
1.Cannot able to add mulitple email address to textfield
2.When moved to other page and come again the previous data is displaying
nodemailer doesn't works in the browser,it requires node for working.
 */ 