import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles , useTheme} from '@material-ui/core/styles';
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
  multiline:{
    width:'400px',
  },
  payment:{
    width:'195px',
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  invoiceNumber:{
    marginRight:'10px',
    float:'right',
    width:'150px',
    padding: '10px'
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  item:{
    width:'490px',
    padding:'5px'
  },
  quantity:{
    width:'45px',
    padding:'5px'
  },
  rate:{
    width:'45px',
    padding:'5px'
  },
  math:{
    width:'150px',
    padding:'10px'
  },
  discount:{
    width:'100px',
    padding:'10px'
  },
  type:{
    width:'50px',
    marginLeft:'5px'
  },
  menu:{
    width:'100px',
    padding:'10px'
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
  const classes = useStyles();
  const theme = useTheme();
  const [inputAdornment, setInputAdornment] = React.useState('₹')
  const [personName, setPersonName] = React.useState([]);
  const [clientData, setClientdata] = React.useState([]);
  const [alert, setMessage] = React.useState({message:"",severity:""});
  const [openAlert, setOpenAlert] = React.useState(false);
  const [fields, setFields] = React.useState([{ item: '' ,quantity: '0',rate:'0',amount:'0'}]);
  const [subTotal,setSubTotal]= React.useState('0');
  const [total,setTotal]= React.useState('0');
  const [tax,setTax]= React.useState(0);
  const [taxType,setTaxType]= React.useState('%');
  const [discountType,setDiscountType]= React.useState('%');
  const [discount,setDiscount]= React.useState('0');
  const [amountPaid,setAmountPaid]= React.useState('0');
  const [balanceDue,setBalanceDue]= React.useState('0');
  const [selectedDate, setSelectedDate] = React.useState(new Date().toDateString());
  const [selectedDueDate, setSelectedDueDate] = React.useState(new Date(new Date(new Date()).setDate(new Date().getDate() + 15)).toDateString());
  const [openDownloader, setOpenDownloader] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [invoiceHistory,setInvoiceHistory] = React.useState([]);
  const [invoiceNumber,setInvoiceNumber] = React.useState(0);

  const [invoiceData,setState] = React.useState({
    client:'',
    bill_from:'',
    bill_to:'',
    ship_to:'',
    items:[{}],
    notes:'',
    terms:'',
    date:String(new Date().toDateString()),
    due_date:String(new Date(new Date(new Date()).setDate(new Date().getDate() + 15)).toDateString()),
    payment_terms:'',
    sub_total:'0',
    total:'0',
    tax:'0',
    discount:0,
    amount_paid:'0',
    balance_due:0,
    invoice_number:''
  });

  function inputAdornmentChange(e){
    setInputAdornment(e.target.value) 
  };

  function handleChange(event){
    if(event.target.value!==""){
      let data=clientData.filter(eachObj => eachObj._id === event.target.value);
      const tempDefault = invoiceData;
      tempDefault.client = data[0]._id;
      tempDefault.bill_to=data[0].billing_address;
      tempDefault.ship_to = data[0].shipping_address;
      tempDefault.terms = data[0].terms;
      tempDefault.notes = data[0].notes;
      tempDefault.payment_terms = data[0].payment_terms;
      setState(tempDefault);
      setPersonName(event.target.value);
      setOpen(!open);
      settinginvoiceNumber(event.target.value);

    }
    
  };
  
  React.useEffect(() => {
    fetchData();
  }, []);

  
  
  const fetchData = () => {
    setOpen(true);
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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    invoiceData.date = date.toDateString();
    // setState({...invoiceData,date:date.toDateString()})

  };
  const handleDueDateChange = (date) => {
    setSelectedDueDate(date);
    invoiceData.due_date = date.toDateString();
    // setState({...invoiceData,due_date:date.toDateString()})

  };
  //functions for invoice number
  function settinginvoiceNumber(id){
    const count = invoiceHistory.filter(data=>data.client ===id);
    const name=clientData.filter(data=>data._id ===id)
    setInvoiceNumber(name[0].client_name +'-CU-'+(count.length +1));
    setOpen(false);
  }
  
  //function for math calculations
  function updateInputFields(dType,tType,sTotal,ptax,pdiscount){
    let b;
    if(dType==='₹'){
      const a=(sTotal-parseInt(pdiscount));
      if(tType==='₹'){
        b=Math.ceil(a+parseInt(ptax));
      }
      else if(tType==='%'){
        b = Math.ceil(a*(1+ptax/100));
      }
      setTotal(b);
      setBalanceDue(b-amountPaid);
    }
    else if(dType==='%'){
      const a=((sTotal*(1-pdiscount/100)));
      if(tType==='₹'){
        b=Math.ceil(a+parseInt(ptax));
      }
      else if(tType==='%'){
        b = Math.ceil(a*(1+ptax/100));
      }
      setTotal(b);
      setBalanceDue(b-amountPaid);
      
    }
    
  }
  //functions for discount and tax type change
  function handleDiscountTypeChange(e){
    setDiscountType(e.target.value);
    updateInputFields(e.target.value,taxType,subTotal,tax,discount);
  }
  function handleTaxTypeChange(e){
    setTaxType(e.target.value);
    updateInputFields(discountType,e.target.value,subTotal,tax,discount);
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
    sub=sub-items[i].amount;
    items[i].quantity = event.target.value;
    items[i].amount = event.target.value * items[i].rate ;
    sub=sub+items[i].amount;
    setSubTotal(sub);
    // setTotal(tot);
    setFields(items);
    // setBalanceDue(tot - amountPaid);
    updateInputFields(discountType,taxType,sub,tax,discount);
  }
  function handleChangesforRate(i, event) {
    const items = [...fields];
    let sub = subTotal;
    sub=sub-items[i].amount;
    items[i].rate = event.target.value;
    items[i].amount = event.target.value*items[i].quantity;
    sub=sub+items[i].amount;
    setSubTotal(sub);
    // setTotal(tot);
    setFields(items);
    // setBalanceDue(tot - amountPaid);
    updateInputFields(discountType,taxType,sub,tax,discount);
  }

  function handleAdd() {
    const items = [...fields];
    items.push({ item: '',quantity:0,rate:0 ,amount:0});
    setFields(items);
  }

  function handleRemove(i) {
    const items = [...fields];
    items.splice(i, 1);
    setSubTotal(subTotal-(fields[i].amount));
    updateInputFields(discountType,taxType,subTotal-(fields[i].amount),tax,discount);
    setFields(items);
  }

  function handleTaxChange(e){
    setTax(e.target.value);
    updateInputFields(discountType,taxType,subTotal,e.target.value,discount)
  }

  function handleDiscountChange(e){
    setDiscount(e.target.value);
    updateInputFields(discountType,taxType,subTotal,tax,e.target.value)
  }
  function handlePaidChange(e){
    setAmountPaid(e.target.value);
    setBalanceDue(total - e.target.value);
  }

  function changeFieldValue(){
    const fieldValues = {
      client:'',
      bill_from:'',
      bill_to:'',
      ship_to:'',
      items:[{}],
      notes:'',
      terms:'',
      date:String(new Date().toDateString()),
      due_date:String(new Date(new Date(new Date()).setDate(new Date().getDate() + 15)).toDateString()),
      payment_terms:'',
      sub_total:'0',
      total:'0',
      tax:'0',
      discount:0,
      amount_paid:'0',
      balance_due:0
    }
    setSelectedDueDate(fieldValues.due_date)
    setSelectedDate(fieldValues.date)
    setInvoiceNumber(0);
    setState(fieldValues);
    setFields([{ item: '' ,quantity: 0,rate:0,amount:0}]);
    setSubTotal(0);
    setTotal(0);
    setDiscount(0);
    setAmountPaid(0);
    setTax(0);
    setBalanceDue(0);
    
  }
  let b64;
  function printdata(){
    setOpenDownloader(!open);
    const data = invoiceData;
    data.items = fields;
     if(inputAdornment==='$'){
    data.sub_total ='US'+ inputAdornment+subTotal;
    data.total = 'US'+ inputAdornment+total;
    data.items[0].rate='US'+ inputAdornment +fields[0].rate
    data.items[0].amount='US'+ inputAdornment +fields[0].amount
    data.amount_paid = 'US'+ inputAdornment+amountPaid;
    data.balance_due ='US'+  inputAdornment+balanceDue;
    }
    else{
      data.sub_total = inputAdornment+subTotal;
      data.total = inputAdornment+total;
      data.items[0].rate=inputAdornment +fields[0].rate
      data.items[0].amount=inputAdornment +fields[0].amount
      data.amount_paid = inputAdornment+amountPaid;
      data.balance_due = inputAdornment+balanceDue;
    }
    if(taxType==='₹'){
      data.tax= '₹'+tax;
    }
    else{
      data.tax = tax+'%';
    }
    
    if(discountType === '₹'){
      data.discount= '₹'+discount;
    }
    else{
      data.discount = discount+'%';
    }
    data.invoice_number = invoiceNumber;
    setState(data);
    console.log(invoiceData)
    axios.post(`${process.env.REACT_APP_API_URL}/invoice`, invoiceData,{ headers: { 'Content-Type': 'application/json' } })
    .then(function (response) {
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
      if(error.response){
        const message = alert;
        message.message = "invoice generation failed. "+ error.response.data.status.message;
        message.severity = "error"
        setMessage(message);
        setOpenAlert(true);
        setOpenDownloader(false);
      }
    })
  }

  const handleDataChange = e =>{
    setState({
      ...invoiceData,
      [e.target.name]: e.target.value

    })
  }


  return (
    <div >
      <h1 style={{marginLeft:'300px',marginTop:'50px'}}>
        Generate Invoice
      </h1>
        <div className="form">
            
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-name-label">Select Client</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  defaultValue={""}
                  value={personName}
                  onChange={e=>handleChange(e)}
                  input={<Input />}
                  MenuProps={MenuProps}
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
                <InputLabel id="demo-mutiple-name-label">Currency</InputLabel>
                <Select
                  labelId="demo-mutiple-name-label"
                  id="demo-mutiple-name"
                  value={inputAdornment}
                  onChange={e=>inputAdornmentChange(e)}
                  input={<Input />}
                  MenuProps={MenuProps}
                >
                  <MenuItem value='₹'>Rupee </MenuItem>
                  <MenuItem value='$'>USD</MenuItem>
                  <MenuItem value='£'>GBP</MenuItem>
                </Select>
              </FormControl>
              <div className={classes.invoiceNumber}>
                <TextField
                  required
                  label="Invoice Number"
                  variant="outlined"
                  value={invoiceNumber}
                  onChange={e=>setInvoiceNumber(e.target.value)}
                />
              </div>
              <form  noValidate autoComplete="off" style={{padding:"10px"}}>
                  <div className="leftDivision">
                    <div style={{ marginRight: '15px'}} >
                        <TextareaAutosize
                          required
                          value={invoiceData.bill_from}
                          name="bill_from"
                          minRows={3}
                          onChange={handleDataChange}
                          placeholder="Who is this invoice from (required)"
                          style={{ width: 425,fontSize:19,padding: '5px',borderRadius: '5px',background: '#fafafa'}}
                           />
                    </div>
                      <div style={{float:"left",marginRight :"15px",marginTop:'30px',marginBottom:'30px'}}>
                          <TextareaAutosize
                          required
                          label="Bill To"
                          name="bill_to"
                          variant="outlined"
                          minRows={3}
                          value={invoiceData.bill_to}
                          onChange={handleDataChange}
                          placeholder="Bill To"
                          style={{ width: 225,fontSize:19,borderRadius: '5px',padding: '5px',background: '#fafafa'}}
                           />
                      </div>
                      <div style={{float:"left",marginRight :"15px",marginTop:'30px',marginBottom:'30px'}}>
                         <TextareaAutosize
                          required
                          label="Ship To"
                          name="ship_to"
                          variant="outlined"
                          minRows={3}
                          value={invoiceData.ship_to}
                          onChange={handleDataChange}
                          placeholder="Ship To"
                          style={{ width: 225,fontSize:19,borderRadius: '5px',padding: '5px',background: '#fafafa'}}
                           />
                      </div>
                  </div>
                  <div className='rightDivision'>
                      <div style={{float:"right",marginTop:'30px',marginRight :"15px",marginBottom:'10px',marginLeft :"45px"}}>
                        <MuiPickersUtilsProvider  utils={DateFnsUtils}>
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
                      
                      <div style={{float:"right",marginBottom:'10px',marginRight :"15px",marginLeft :"45px"}}>
                      <MuiPickersUtilsProvider  utils={DateFnsUtils}>
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
                      <div style={{float:'right',marginLeft :"45px",marginBottom:'10px',marginRight :"15px"}}>
                           <TextareaAutosize
                          required
                          name="payment_terms"
                          value={invoiceData.payment_terms}
                          minRows={2}
                          onChange={handleDataChange}
                          placeholder="Payment Terms"
                          style={{ width: 225,fontSize:19,padding: '5px',borderRadius: '5px',background: '#fafafa'}}
                           />
                      </div>

                  </div>
                  <div style={{clear:'both'}}>
                  </div>
                  <div className="addItem">
                    <div className="item">
                      Item
                    </div>
                    <div className = "quantity">
                      Quantity
                    </div>
                    <div className = "rate">
                      Rate
                    </div>
                    <div className = "rate">
                      Amount
                    </div>          
                  </div>
                  <div className="itemInput">
                    {fields.map((field, idx) => {
                      return (
                        <div key={`${field}-${idx}`}>
                          <TextField
                            style={{ margin: 8 }}
                            placeholder="Description of service or product.."
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              className:classes.item,
                            }}
                            variant="outlined"
                            value={field.item}
                            onChange={e => handleChanges(idx, e)}
                          />
                          <TextField
                            style={{ margin: 8}}
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            type='number'
                            inputProps={{
                              className:classes.quantity,
                            }}
                            variant="outlined"
                            value={field.quantity}
                            onChange={e => handleChangesforQuantity(idx, e)}
                          />
                          <TextField
                            style={{ margin: 8}}
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              className:classes.rate,
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
                            style={{ margin: 8}}
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              className:classes.rate,
                              readOnly: true,
                            }}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
                            }}
                            variant="outlined"
                            value={field.amount}
                            onChange={e => handleChangesforRate(idx, e)}
                          />
                        {idx!==0 && <IconButton size ="small" aria-label="Delete" onClick={() => handleRemove(idx)} style={{marginTop:"6px"}}>
                            <DeleteIcon />
                          </IconButton>} 
                        </div>
                        
                      );
                      
                    })}
                    <Button variant="contained" color="primary" onClick={handleAdd}>
                        Add item
                    </Button>
                    </div>
              </form>    
         
          
              
                <div style={{float:'left',overflow:'hidden',padding:"10px"}}>
                  <div style={{marginTop:'15px'}}>
                    <TextareaAutosize
                          required
                          name="notes"
                          minRows={2}
                          value={invoiceData.notes}
                          onChange={handleDataChange}
                          placeholder="Notes - any relevant information already not covered"
                          style={{ width: 425,fontSize:19,padding: '5px',borderRadius: '5px',background: '#fafafa'}}
                           />
                  </div>
                  <div style={{marginTop:"15px",marginBottom:'20px'}}>
                     <TextareaAutosize
                          required
                          name="terms"
                          value={invoiceData.terms}
                          minRows={2}
                          onChange={handleDataChange}
                          placeholder="Terms and conditions"
                          style={{ width: 425,fontSize:19,padding: '5px',borderRadius: '5px',background: '#fafafa'}}
                           />
                  </div>
                </div>
               <div className='rightDivision'>
                <div style={{float:'right',marginBottom:'10px',marginRight :"15px"}}>
                  <TextField
                  required
                  label="Sub total"
                  inputProps={{
                    readOnly: true,
                    className:classes.math
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
                  }}
                  value={subTotal}
                  variant="outlined"
                  />
                </div>
                <div style={{float:'right',marginBottom:'10px',marginRight :"15px"}}>
                  <TextField
                  required
                  label="Discount"
                  variant="outlined"
                  value = {discount}
                  onChange ={e=> handleDiscountChange(e)}
                  inputProps={{
                    className:classes.discount
                  }}
                  />
                  <FormControl variant="outlined" className={classes.type}>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={discountType}
                      onChange={e=>handleDiscountTypeChange(e)}
                      inputProps={{
                        className:classes.menu
                      }}
                    >
                      
                      <MenuItem value={'₹'}>₹</MenuItem>
                      <MenuItem value={'%'}>%</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div style={{float:'right',marginBottom:'10px',marginRight :"15px"}}>
                  <TextField
                  required
                  label="Tax"
                  variant="outlined"
                  onChange ={e=> handleTaxChange(e)}
                  value={tax}
                  inputProps={{
                    className:classes.discount
                  }}
                  />
                  <FormControl variant="outlined" className={classes.type}>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={taxType}
                      onChange={e=>handleTaxTypeChange(e)}
                      inputProps={{
                        className:classes.menu
                      }}
                    >
                      <MenuItem value={'₹'}>₹</MenuItem>
                      <MenuItem value={'%'}>%</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div style={{float:'right',marginBottom:'10px',marginRight :"15px"}}>
                  <TextField
                  required
                  label="Total"
                  value={total}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
                  }}
                  inputProps={{
                    readOnly: true,
                    className:classes.math
                  }}
                  variant="outlined"
                  />
                </div>
                <div style={{float:'right',marginBottom:'10px',marginRight :"15px"}}>
                  <TextField
                  required
                  label="Amount paid"
                  value={amountPaid}
                  onChange={handlePaidChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
                  }}
                  inputProps={{
                    className:classes.math
                  }}
                  variant="outlined"
                  />
                </div>
                <div style={{float:'right',marginBottom:'10px',marginRight :"15px"}}>
                  <TextField
                  required
                  label="Balance due"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{inputAdornment}</InputAdornment>,
                  }}
                  value={balanceDue}
                  inputProps={{
                    readOnly: true,
                    className:classes.math
                  }}
                  variant="outlined"
                  />
                </div>
                </div>
                
                <div style={{clear:'both'}}>
                </div>
              
      </div>
      <div style={{marginLeft:"300px",marginBottom:"30px",marginTop:"10px"}}>
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
          <span>downloading invoice...</span>
        </Backdrop>
      </div>

    </div>
  );
}
