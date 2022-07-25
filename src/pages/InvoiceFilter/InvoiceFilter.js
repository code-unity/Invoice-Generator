import React, { Fragment, useEffect, useState } from 'react'
import styles from './InvoiceFilter.module.css'
import Card from '../../components/historyCard'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import TextField from '@mui/material/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Backdrop from '@material-ui/core/Backdrop'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    paddingLeft: '100px',
    marginTop: '20px',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

var today = new Date()
today.setMonth(today.getMonth() - 1)
var prevMonth = today.toLocaleString('default', { month: 'short' })
var currYear = today.getFullYear().toString()

const Months = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const InvoiceReport = () => {
  const [toEmails, setToEmail] = useState('')
  const [ccEmails, setccEmails] = useState('')
  const [date, setDate] = useState(`${currYear}-${Months[prevMonth]}`)
  const [data, setData] = useState([])
  const [openLoader, setOpenLoader] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [openDownloader, setOpenDownloader] = useState(false)
  const [alert, setMessage] = useState({ message: '', severity: '' })
  const classes = useStyles()

  //getting the filtered data from backend
  useEffect(() => {
    setOpenLoader(true)
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/invoiceFilter/${prevMonth}/${currYear}`,
      )
      //when everything went fine
      .then((response) => {
        setData(response.data.data)
        setOpenLoader(false)
        const message = alert
        message.message = response.data.status.message
        message.severity = 'success'
        setMessage(message)
        setOpenAlert(true)
      })
      //when lost connection with backend or no internet connection
      .catch(() => {
        setOpenLoader(false)
        const message = alert
        message.message = 'Invoices Fetching Failed'
        message.severity = 'error'
        setMessage(message)
        setOpenAlert(true)
      })
  }, [date, alert])

  const sendData = () => {
    const currToEmails = toEmails.split(',')
    const currCCEmails = ccEmails.split(',')
    const finalToEmails = []
    const finalCCEmails = []
    const regx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    currToEmails.forEach((toEmail) => {
      if (regx.test(toEmail.trim())) finalToEmails.push(toEmail.trim())
    })
    currCCEmails.forEach((ccEmail) => {
      if (regx.test(ccEmail.trim())) finalCCEmails.push(ccEmail.trim())
    })
    const formInfo = {
      toEmails: finalToEmails,
      ccEmails: finalCCEmails,
      month: prevMonth,
      year: currYear,
      invoiceData: data,
    }
    //post call for backend for pdf generation and mail sending
    setOpenDownloader(true)
    axios
      .post(`${process.env.REACT_APP_API_URL}/invoiceFilter`, formInfo, {
        headers: {
          'Content-type': 'application/json',
        },
      })
      //When everything worked perfectly fine
      .then((res) => {
        console.log('inside then', res)
        setOpenDownloader(false)
        const message = alert
        message.message = res.data.status.message
        message.severity = 'success'
        setMessage(message)
        setOpenAlert(true)
      })
      .catch((error) => {
        //if there is any validations error, or  no internet to sent email or pdf generation error
        if (error.response) {
          setOpenDownloader(false)
          const message = alert
          message.message = error.response.data.status.message
          message.severity = 'error'
          setMessage(message)
          setOpenAlert(true)
        }
        //when lost connection with backend
        else {
          console.log('inside catch else')
          setOpenDownloader(false)
          const message = alert
          message.message = 'invoices sending Failed'
          message.severity = 'error'
          setMessage(message)
          setOpenAlert(true)
        }
      })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenAlert(false)
  }

  const dateChangeHandler = (event) => {
    var selectedDate = event.target.value
    const date = new Date()
    const monthNumber = selectedDate.split('-')[1]
    date.setMonth(monthNumber - 1)
    prevMonth = date.toLocaleString('default', { month: 'short' })
    currYear = selectedDate.split('-')[0]
    setDate(`${currYear}-${Months[prevMonth]}`)
  }
  const toChangeHandler = (event) => {
    setToEmail(event.target.value)
  }
  const ccChangeHandler = (event) => {
    setccEmails(event.target.value)
  }
  const onSubmitHandler = (event) => {
    event.preventDefault()
    setToEmail('')
    setccEmails('')
    setDate(`${currYear}-${Months[prevMonth]}`)
  }
  return (
    <Fragment>
      <form className={styles['container']} onSubmit={onSubmitHandler}>
        <div className={styles['date']}>
          <TextField
            label="Date"
            type="month"
            required
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={dateChangeHandler}
          ></TextField>
        </div>
        <div className={styles['email']}>
          <div>
            <TextField
              label="To"
              placeholder="Add , seperated Emails"
              onChange={toChangeHandler}
              value={toEmails}
            ></TextField>
          </div>
          <div>
            <TextField
              label="CC"
              onChange={ccChangeHandler}
              value={ccEmails}
              placeholder="Add , seperated Emails"
            ></TextField>
          </div>
        </div>
        <Button
          variant="contained"
          type="sumbit"
          color="primary"
          style={{ width: '10rem', height: '3rem', marginLeft: '38%' }}
          onClick={sendData}
        >
          Send Invoices
        </Button>

        {/* Dispalying message when there are no invoices */}
      </form>
      {data.length === 0 && (
        <h2>
          There is no Invoices for {prevMonth} {currYear}{' '}
        </h2>
      )}

      {/*dipslaying the invoice cards */}
      {data.length !== 0 && (
        <Grid container spacing={1} className={classes.gridContainer}>
          {data.map((historyData, index) => {
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card data={historyData} idx={index} />
              </Grid>
            )
          })}
        </Grid>
      )}
      <Snackbar open={openAlert} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
      <Backdrop className={classes.backdrop} open={openLoader}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Backdrop className={classes.backdrop} open={openDownloader}>
        <div>
          <CircularProgress color="primary" />
        </div>
        <span>Sending Invoices....</span>
      </Backdrop>
    </Fragment>
  )
}
export default InvoiceReport
