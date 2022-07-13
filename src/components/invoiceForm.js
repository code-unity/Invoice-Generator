import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import axios from 'axios';
import './invoiceForm.css'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { Typography } from "@material-ui/core";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  invoice: {
    marginLeft: '250px',
    marginTop: '50px',
    marginBottom: '15px',
    fontSize: '30px',
    [theme.breakpoints.down("sm")]: {
      marginLeft: '10px',
      fontSize: '20px',
      width: '150px',
    },
  },
  client: {
    paddingLeft: "15px",
    [theme.breakpoints.down("sm")]: {
      width: '150px',
      fontSize: '13px',
      paddingTop: '3px',
      paddingLeft: '16px',
    },
  },
  currency: {
    [theme.breakpoints.down("sm")]: {
      width: '100px',
      paddingLeft: '1px',
    },
  },
  notes: {
    width: 470,
    fontSize: 19,
    padding: '5px',
    borderRadius: '5px',
    background: '#fafafa',
    [theme.breakpoints.down("sm")]: {
      width: '324px',
    },
  },
  terms: {
    width: 470,
    fontSize: 19,
    padding: '5px',
    borderRadius: '5px',
    background: '#fafafa',
    [theme.breakpoints.down("sm")]: {
      width: '324px',
    },
  },
  multiline: {
    width: '400px',
  },
  payment: {
    width: 225,
    fontSize: 19,
    borderRadius: '5px',
    padding: '5px',
    background: '#fafafa',
    [theme.breakpoints.down("sm")]: {
      width: '324px',
    },
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    maxWidth: 300,
    paddingLeft: '15px',
    [theme.breakpoints.down("sm")]: {
      width: '200px',
    },
  },

  who: {
    width: 475,
    fontSize: 19,
    borderRadius: '5px',
    padding: '5px',
    background: '#fafafa',
    [theme.breakpoints.down("sm")]: {
      width: '324px',
    },
  },
  select: {
    [theme.breakpoints.down("sm")]: {
      width: 100,
    },
  },
  itemh: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  Description: {
    paddingTop: 0,
    width: 470,
    [theme.breakpoints.down("sm")]: {
      width: 250,
      marginTop: 0,
    },

  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  invoiceNumber: {
    margin: theme.spacing(1),
    marginRight: '20px',
    float: 'right',
    width: '150px',
    paddingTop: '10px',
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(-4),
      marginRight: '20px',
      marginTop: '-60px',

    },
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  item: {
    width: '490px',
    padding: '5px',
    [theme.breakpoints.down("sm")]: {
      width: '324px',
    },
  },
  quantity: {
    width: '45px',
    padding: '5px',
  },
  quantitybox: {
    paddingLeft: '20px',
    [theme.breakpoints.down("sm")]: {
      marginTop: '-0px',
      marginRight: '-100px'
    },
  },
  ratebox: {
    paddingLeft: '20px',
    width: '165px',
    [theme.breakpoints.down("sm")]: {
      marginTop: '5px',
      paddingLeft: '0px',
      float: 'left',

    },
  },
  downloadbutton: {
    float: 'right',
    marginRight: "150px",
    marginBottom: "30px",
    marginTop: "20px",
    [theme.breakpoints.down("sm")]: {
      marginRight: '115px',


    },
  },
  amountbox: {
    paddingLeft: '20px',
    width: '165px',
    [theme.breakpoints.down("sm")]: {
      marginTop: '5px',
      paddingLeft: '10px',
    },
  },
  rate: {
    width: '165px',
    padding: '5px'
  },
  math: {
    width: '150px',
    padding: '10px',
  },
  subtotal: {
    float: 'right',
    marginTop: '35px',
    marginBottom: '15px',
    marginRight: "20px",
    [theme.breakpoints.down("sm")]: {
      marginTop: '-20px',

    },
  },
  discontbox: {
    float: 'right',
    marginBottom: '15px',
    marginRight: "20px",
    [theme.breakpoints.down("sm")]: {
      marginTop: '0px',
      marginRight: "20px",
      marginBottom: '-5px',

    },
  },
  totalbox: {
    float: 'right',
    marginBottom: '10px',
    marginTop: '5px',
    marginRight: "20px",
    [theme.breakpoints.down("sm")]: {
      marginTop: '-15px',
      marginLeft: '250px',
    },
  },

  discount: {
    width: '80px',
    padding: '10px',

  },
  type: {
    width: '50px',
    marginLeft: '15px',
    [theme.breakpoints.down("sm")]: {
      marginTop: '-40px',
      marginLeft: "120px"


    },
  },

  menu: {
    width: '200px',
    padding: '10px'
  },
  bill: {
    width: 225,
    height: 150,
    fontSize: 19,
    borderRadius: '5px',
    padding: '5px',
    background: '#fafafa',
    [theme.breakpoints.down("sm")]: {
      width: '324px',
    },
  },
  ship: {
    width: 225,
    fontSize: 19,
    borderRadius: '5px',
    padding: '5px',
    background: '#fafafa',
    [theme.breakpoints.down("sm")]: {
      width: '324px',
    },
  },
  date: {
    float: "right",
    marginTop: '20px',
    marginRight: "20px",
    marginBottom: '10px',
    marginLeft: "45px",
    [theme.breakpoints.down("sm")]: {
      width: '140px',
      float: "left",
      marginLeft: "-240px",
      marginTop: '0px',
    },
  },
  duedate: {
    float: "right",
    marginBottom: '10px',
    marginRight: "20px",
    marginLeft: "45px",
    [theme.breakpoints.down("sm")]: {
      width: '140px',
      marginTop: '0px',
    },
  },
  shipto: {
    float: "left",
    marginRight: "20px",
    marginTop: '30px',
    marginBottom: '20px',
    [theme.breakpoints.down("sm")]: {
      marginTop: '10px',
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column'
  },
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


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


export default function FormPropsTextFields() {
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const classes = useStyles();
  const theme = useTheme();
  const [inputAdornment, setInputAdornment] = React.useState('₹')
  const [personName, setPersonName] = React.useState([]);
  const [clientData, setClientdata] = React.useState([]);
  const [alert, setMessage] = React.useState({ message: "", severity: "" });
  const [openAlert, setOpenAlert] = React.useState(false);
  const [fields, setFields] = React.useState([{ item: '', quantity: '0', rate: '0', amount: '0' }]);
  const [subTotal, setSubTotal] = React.useState('0');
  const [total, setTotal] = React.useState('0');
  const [tax, setTax] = React.useState(0);
  const [taxType, setTaxType] = React.useState('%');
  const [discountType, setDiscountType] = React.useState('%');
  const [discount, setDiscount] = React.useState(0);
  const [amountPaid, setAmountPaid] = React.useState('0');
  const [balanceDue, setBalanceDue] = React.useState('0');
  const [selectedDate, setSelectedDate] = React.useState(new Date().toDateString());
  const [selectedMonth, setSelectedMonth] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState('');
  const [selectedDueDate, setSelectedDueDate] = React.useState(new Date(new Date(new Date()).setDate(new Date().getDate() + 15)).toDateString());
  const [openDownloader, setOpenDownloader] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [invoiceHistory, setInvoiceHistory] = React.useState([]);
  const [invoiceNumber, setInvoiceNumber] = React.useState(0);
  const currency = [{ id: 'Rupee', value: '₹' }, { id: 'USD', value: '$' }, { id: 'GBP', value: '£' }]

  const [invoiceData, setInvoiceData] = React.useState({
    client: '',
    bill_from: '',
    bill_to: '',
    ship_to: '',
    items: [{}],
    notes: '',
    terms: '',
    date: String(new Date().toDateString()),
    month: new Date().getMonth,
    year: new Date().getFullYear,
    due_date: String(new Date(new Date(new Date()).setDate(new Date().getDate() + 15)).toDateString()),
    payment_terms: '',
    sub_total: '0',
    total: '0',
    tax: '0',
    discount: 0,
    amount_paid: '0',
    balance_due: 0,
    invoice_number: ''
  });

  function inputAdornmentChange(e) {
    setInputAdornment(e.target.value)
  };

  function handleChange(event) {
    if (event.target.value !== "") {
      let data = clientData.filter(eachObj => eachObj._id === event.target.value);
      const tempDefault = invoiceData;
      tempDefault.client = data[0]._id;
      tempDefault.bill_to = data[0].billing_address;
      tempDefault.ship_to = data[0].shipping_address;
      tempDefault.terms = data[0].terms;
      tempDefault.notes = data[0].notes;
      tempDefault.payment_terms = data[0].payment_terms;
      setInvoiceData(tempDefault);
      setPersonName(event.target.value);
      setOpen(!open);
      settinginvoiceNumber(event.target.value);

    }

  };

  const fetchData = () => {
    setOpen(true);
    axios.get(`${process.env.REACT_APP_API_URL}/admin/address`, config)
      .then((res) => {
        setInvoiceData({ ...invoiceData, bill_from: res.data.address })
      })
    axios.get(`${process.env.REACT_APP_API_URL}/client`)
      .then((res) => {
        setClientdata(res.data.data.results);
      });
    axios.get(`${process.env.REACT_APP_API_URL}/invoice`)
      .then((res) => {
        setOpen(false);
        setInvoiceHistory(res.data.data.results);
      })
  };

  React.useEffect(() => {
    fetchData();
  }, []);// eslint-disable-line react-hooks/exhaustive-deps



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(date.toDateString().getMonth, date.toDateString().getFullYear)
    setSelectedMonth(date.toDateString().split(" ")[1]);
    setSelectedYear(date.toDateString().split(" ")[3]);
    invoiceData.date = date.toDateString();
    // setInvoiceData({...invoiceData,date:date.toDateString()})
  };
  const handleDueDateChange = (date) => {
    setSelectedDueDate(date);
    invoiceData.due_date = date.toDateString();
    // setInvoiceData({...invoiceData,due_date:date.toDateString()})

  };
  //functions for invoice number
  function settinginvoiceNumber(id) {
    const count = invoiceHistory.filter(data => data.client === id);
    const name = clientData.filter(data => data._id === id)
    setInvoiceNumber(name[0].client_name + '-CU-' + (count.length + 1));
    setOpen(false);
  }

  //function for math calculations
  function updateInputFields(dType, tType, sTotal, ptax, pdiscount) {
    let b;
    if (dType === 'flat') {
      const a = (sTotal - parseInt(pdiscount));
      if (tType === 'flat') {
        b = Math.ceil(a + parseInt(ptax));
      }
      else if (tType === '%') {
        b = Math.ceil(a * (1 + ptax / 100));
      }
      setTotal(b);
      setBalanceDue(b - amountPaid);
    }
    else if (dType === '%') {
      const a = ((sTotal * (1 - pdiscount / 100)));
      if (tType === 'flat') {
        b = Math.ceil(a + parseInt(ptax));
      }
      else if (tType === '%') {
        b = Math.ceil(a * (1 + ptax / 100));
      }
      setTotal(b);
      setBalanceDue(b - amountPaid);

    }
  }
  //functions for discount and tax type change
  function handleDiscountTypeChange(e) {
    setDiscountType(e.target.value);
    updateInputFields(e.target.value, taxType, subTotal, tax, discount);
  }
  function handleTaxTypeChange(e) {
    setTaxType(e.target.value);
    updateInputFields(discountType, e.target.value, subTotal, tax, discount);
  }


  ///functions for add item


  function handleChanges(i, event) {
    const items = [...fields];
    items[i].item = event.target.value;
    setFields(items);
  }
  function handleChangesforQuantity(i, event) {
    const items = [...fields];
    let sub = subTotal;
    sub = sub - items[i].amount;
    items[i].quantity = event.target.value;
    items[i].amount = event.target.value * items[i].rate;
    sub = sub + items[i].amount;
    setSubTotal(sub);
    // setTotal(tot);
    setFields(items);
    // setBalanceDue(tot - amountPaid);
    updateInputFields(discountType, taxType, sub, tax, discount);
  }
  function handleChangesforRate(i, event) {
    const items = [...fields];
    let sub = subTotal;
    sub = sub - items[i].amount;
    items[i].rate = event.target.value;
    items[i].amount = event.target.value * items[i].quantity;
    sub = sub + items[i].amount;
    setSubTotal(sub);
    // setTotal(tot);
    setFields(items);
    // setBalanceDue(tot - amountPaid);
    updateInputFields(discountType, taxType, sub, tax, discount);
  }

  function handleAdd() {
    const items = [...fields];
    items.push({ item: '', quantity: 0, rate: 0, amount: 0 });
    setFields(items);
  }

  function handleRemove(i) {
    const items = [...fields];
    items.splice(i, 1);
    setSubTotal(subTotal - (fields[i].amount));
    updateInputFields(discountType, taxType, subTotal - (fields[i].amount), tax, discount);
    setFields(items);
  }

  function handleTaxChange(e) {
    setTax(e.target.value);
    updateInputFields(discountType, taxType, subTotal, e.target.value, discount)
  }

  function handleDiscountChange(e) {
    setDiscount(e.target.value);
    updateInputFields(discountType, taxType, subTotal, tax, e.target.value)
  }
  function handlePaidChange(e) {
    setAmountPaid(e.target.value);
    setBalanceDue(total - e.target.value);
  }

  function changeFieldValue() {
    const fieldValues = {
      client: '',
      bill_from: '',
      bill_to: '',
      ship_to: '',
      items: [{}],
      notes: '',
      terms: '',
      date: String(new Date().toDateString()),
      month: '',
      year: '',
      due_date: String(new Date(new Date(new Date()).setDate(new Date().getDate() + 15)).toDateString()),
      payment_terms: '',
      sub_total: '0',
      total: '0',
      tax: 0,
      discount: 0,
      amount_paid: '0',
      balance_due: 0,
    }
    setSelectedDueDate(fieldValues.due_date)
    setSelectedDate(fieldValues.date)
    setInvoiceNumber(0);
    setInvoiceData(fieldValues);
    setFields([{ item: '', quantity: 0, rate: 0, amount: 0 }]);
    setSubTotal(0);
    setTotal(0);
    setDiscount(0);
    setAmountPaid(0);
    setTax(0);
    setBalanceDue(0);

  }
  let b64;
  function printdata() {
    setOpenDownloader(!open);
    const data = invoiceData;
    data.items = fields;
    if (inputAdornment === '$') {
      data.sub_total = 'US' + inputAdornment + subTotal;
      data.total = 'US' + inputAdornment + total;
      for (let i = 0; i < data.items.length; i++) {
        data.items[i].rate = 'US' + inputAdornment + fields[i].rate
        data.items[i].amount = 'US' + inputAdornment + fields[i].amount
      }
      data.amount_paid = 'US' + inputAdornment + amountPaid;
      data.balance_due = 'US' + inputAdornment + balanceDue;
    }
    else {
      for (let i = 0; i < data.items.length; i++) {
        data.items[i].rate = inputAdornment + fields[i].rate
        data.items[i].amount = inputAdornment + fields[i].amount
      }
      data.sub_total = inputAdornment + subTotal;
      data.total = inputAdornment + total;
      data.amount_paid = inputAdornment + amountPaid;
      data.balance_due = inputAdornment + balanceDue;
    }
    if (tax !== 0 && tax !== '') {
      if (taxType === 'flat') {
        data.tax = inputAdornment + tax;
      }
      else {
        data.tax = tax + '%';
      }
    }
    else {
      data.tax = ''
    }
    if (discount !== 0 && discount !== '') {
      if (discountType === 'flat') {
        data.discount = inputAdornment + discount;
      }
      else {
        data.discount = discount + '%';
      }
    }
    else {
      data.discount = ''
    }
    data.invoice_number = invoiceNumber;

    setInvoiceData(data);
    axios.post(`${process.env.REACT_APP_API_URL}/invoice`, invoiceData, { headers: { 'Content-Type': 'application/json' } })
      .then(function (response) {
        console.log(invoiceData);
        setOpenDownloader(false);
        const message = alert;
        message.message = "invoice generated successfully";
        message.severity = "success";
        setMessage(message);
        setOpenAlert(true);
        changeFieldValue();
        setPersonName([]);
        b64 = response.data.pdf;
        var link = document.createElement('a');
        link.innerHTML = 'Download PDF file';
        link.download = 'file.pdf';
        link.href = 'data:application/octet-stream;base64,' + b64;
        document.body.appendChild(link);
        link.click();
        link.remove();

      })
      .catch(error => {
        if (error.response) {
          const message = alert;
          message.message = "invoice generation failed. " + error.response.data.status.message;
          message.severity = "error"
          setMessage(message);
          setOpenAlert(true);
          setOpenDownloader(false);
        }
      })
  }

  const handleDataChange = e => {
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div >
      <Typography variant="h1" className={classes.invoice}>
        Generate Invoice
      </Typography>
      <div className="form">
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.client} id="demo-mutiple-name-label">Select Client</InputLabel>
          <Select
            labelId="demo-mutiple-name-label"
            id="demo-mutiple-name"
            defaultValue={""}
            value={personName}
            onChange={e => handleChange(e)}
            input={<Input />}
            MenuProps={MenuProps}
            className={classes.select}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {clientData.map((name) => (
              <MenuItem key={name._id} value={name._id} style={getStyles(name.client_name, personName, theme)}>
                {name.client_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel style={{ paddingLeft: "26px" }} id="demo-mutiple-name-label">Currency</InputLabel>
          <Select
            className={classes.currency}
            labelId="demo-mutiple-name-label"
            id="demo-mutiple-name"
            value={inputAdornment}
            onChange={e => inputAdornmentChange(e)}
            input={<Input />}
            MenuProps={MenuProps}
          >{currency.map(item => (<MenuItem key={item.id} value={item.value}>{item.id}</MenuItem>))}
          </Select>
        </FormControl>
        <div className={classes.invoiceNumber}>
          <TextField size="small"
            required
            label="Invoice Number"
            variant="outlined"
            value={invoiceNumber}
            onChange={e => setInvoiceNumber(e.target.value)}
          />
        </div>
        <form noValidate autoComplete="off" style={{ paddingLeft: "20px" }}>
          <div className="leftDivision">
            <div style={{ marginTop: '20px' }} >
              <TextareaAutosize
                required
                value={invoiceData.bill_from}
                name="bill_from"
                minRows={6}
                onChange={handleDataChange}
                placeholder="Who is this invoice from (required)"
                className={classes.who}
              />
            </div>
            <div style={{ float: "left", marginRight: "20px", marginTop: '30px', marginBottom: '20px' }}>
              <TextareaAutosize
                required
                label="Bill To"
                name="bill_to"
                variant="outlined"
                minRows={6}
                value={invoiceData.bill_to}
                onChange={handleDataChange}
                placeholder="Bill To"
                className={classes.bill}
              />
            </div>
            <div className={classes.shipto}>
              <TextareaAutosize
                required
                label="Ship To"
                name="ship_to"
                variant="outlined"
                minRows={6}
                value={invoiceData.ship_to}
                onChange={handleDataChange}
                placeholder="Ship To"
                className={classes.ship}
              />
            </div>
          </div>
          <div className='rightDivision'>
            <div className={classes.date}>
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
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>

            <div className={classes.duedate}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="yyyy-MM-dd"
                  margin="normal"
                  id="date-picker-inline"
                  label="Due date"
                  value={selectedDueDate}
                  onChange={handleDueDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div style={{ float: 'right', marginTop: "15px", marginBottom: '10px', marginRight: "20px" }}>
              <TextareaAutosize
                required
                name="payment_terms"
                value={invoiceData.payment_terms}
                minRows={6}
                onChange={handleDataChange}
                placeholder="Payment Terms"
                className={classes.payment}
              />
            </div>

          </div>
          <div style={{ clear: 'both' }}>
          </div>
          <div className="addItem">
            <div className="item">
              Item
            </div>
            <div className="quantity">
              Quantity
            </div>
            <div className="rate">
              Rate
            </div>
            <div className="amount">
              Amount
            </div>
          </div>
          <div className="itemInput">
            {fields.map((field, idx) => {
              return (
                <div key={`${field}-${idx}`}>
                  <h4 className={classes.itemh} style={{ fontsize: "19px" }}>Item</h4>
                  <h4 className={classes.itemh} style={{ fontsize: "19px", float: "right", marginRight: '20px', marginTop: '-20px' }}>Quantity</h4>
                  <TextField
                    className={classes.Description}
                    placeholder="Description of service or product.."
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      className: classes.item,
                    }}
                    variant="outlined"
                    value={field.item}
                    onChange={e => handleChanges(idx, e)}
                  />
                  <TextField
                    className={classes.quantitybox}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type='number'
                    inputProps={{
                      className: classes.quantity,
                    }}
                    variant="outlined"
                    value={field.quantity}
                    onChange={e => handleChangesforQuantity(idx, e)}
                  />
                  <h4 className={classes.itemh} style={{ fontsize: "19px" }}>Rate</h4>
                  <h4 className={classes.itemh} style={{ fontsize: "19px", float: "right", marginRight: '115px', marginTop: '-20px' }}>Amount</h4>
                  <TextField
                    className={classes.ratebox}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      className: classes.rate,
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
                    }}
                    type='number'
                    variant="outlined"
                    value={field.rate}
                    onChange={e => handleChangesforRate(idx, e)}
                  />
                  <TextField
                    className={classes.amountbox}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      className: classes.rate,
                      readOnly: true,
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
                    }}
                    variant="outlined"
                    value={field.amount}
                    onChange={e => handleChangesforRate(idx, e)}
                  />
                  {idx !== 0 && <IconButton size="small" aria-label="Delete" onClick={() => handleRemove(idx)} style={{ marginTop: "15px" }}>
                    <DeleteIcon />
                  </IconButton>}
                </div>

              );

            })}
          </div>
          <Button style={{ paddingLeft: 20 }} variant="contained" color="primary" onClick={handleAdd}>
            Add item
          </Button>
        </form>



        <div style={{ float: 'left', overflow: 'hidden', padding: "20px" }}>
          <div style={{ marginTop: '15px' }}>
            <TextareaAutosize
              required
              name="notes"
              minRows={6}
              value={invoiceData.notes}
              onChange={handleDataChange}
              placeholder="Notes - any relevant information already not covered"
              className={classes.notes}
            />
          </div>
          <div style={{ marginTop: "20px", marginBottom: '20px' }}>
            <TextareaAutosize
              required
              name="terms"
              value={invoiceData.terms}
              minRows={6}
              onChange={handleDataChange}
              placeholder="Terms and conditions"
              className={classes.terms}
            />
          </div>
        </div>
        <div className='rightDivision'>
          <div className={classes.subtotal}>
            <TextField
              required
              label="Sub total"
              inputProps={{
                readOnly: true,
                className: classes.math
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
              }}
              value={subTotal}
              variant="outlined"
            />
          </div>
          <div className={classes.discontbox}>
            <TextField
              label="Discount"
              variant="outlined"
              value={discount}
              onChange={e => handleDiscountChange(e)}
              inputProps={{
                className: classes.discount
              }}
            />
            <FormControl variant="outlined" className={classes.type}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={discountType}
                onChange={e => handleDiscountTypeChange(e)}
                inputProps={{
                  className: classes.menu
                }}
              >
                <MenuItem value={'flat'}>{inputAdornment}</MenuItem>
                <MenuItem value={'%'}>%</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ float: 'right', marginBottom: '10px', marginRight: "20px" }}>
            <TextField
              label="GST"
              variant="outlined"
              onChange={e => handleTaxChange(e)}
              value={tax}
              inputProps={{
                className: classes.discount
              }}
            />
            <FormControl variant="outlined" className={classes.type}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={taxType}
                onChange={e => handleTaxTypeChange(e)}
                inputProps={{
                  className: classes.menu
                }}
              >
                <MenuItem value='flat'>{inputAdornment}</MenuItem>
                <MenuItem value={'%'}>%</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={classes.totalbox}>
          <TextField
            required
            label="Total"
            value={total}
            InputProps={{
              startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
            }}
            inputProps={{
              readOnly: true,
              className: classes.math
            }}
            variant="outlined"
          />
        </div>
        <div style={{ float: 'right', marginTop: '5px', marginRight: "20px" }}>
          <TextField
            label="Amount paid"
            value={amountPaid}
            onChange={handlePaidChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
            }}
            inputProps={{
              className: classes.math
            }}
            variant="outlined"
          />
        </div>
        <div style={{ float: 'right', marginTop: '15px', marginBottom: '10px', marginRight: "20px" }}>
          <TextField
            required
            label="Balance due"
            InputProps={{
              startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
            }}
            value={balanceDue}
            inputProps={{
              readOnly: true,
              className: classes.math
            }}
            variant="outlined"
          />

        </div>

        <div style={{ clear: 'both' }}>
        </div>

      </div>
      <div className={classes.downloadbutton}>
        <Button variant="contained" color="primary" onClick={printdata} >
          Download Invoice
        </Button>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alert.severity}>
            {alert.message}
          </Alert>
        </Snackbar>
        <Backdrop className={classes.backdrop} open={open} >
          <div>
            <CircularProgress color="primary" />
          </div>
        </Backdrop>
        <Backdrop className={classes.backdrop} open={openDownloader} >
          <div>
            <CircularProgress color="primary" />
          </div>
          <span>Downloading Invoice...</span>
        </Backdrop>
      </div>

    </div>
  );
}
