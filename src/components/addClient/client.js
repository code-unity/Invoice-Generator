import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { Box } from '@material-ui/core';
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
  item:{
    width:'500px',
    padding:'5px'
  },
  quantity:{
    width:'50px',
    padding:'5px'
  },
  rate:{
    width:'100px',
    padding:'5px'
  }
}));


export default function FormPropsTextFields() {
  const classes = useStyles();
  const [clientData , setState] = React.useState({client_name:"",billing_address:"",shipping_address:"",payment_terms:"",notes:"",terms:"",date_of_contract:""});
  
  const handleChange= e =>{
      setState({
        ...clientData,
        [e.target.name]: e.target.value,
      });
  }

  function printdata(){
    
    axios.post('https://codeunity-invoice-backend.herokuapp.com/client', clientData,{ headers: { 'Content-Type': 'application/json' } })
    .then(function (response) {
      console.log(response);
    })
    

    console.log(clientData);
  }

  
  



  return (
    <div>
        <h1 style={{marginLeft:'300px',marginTop:'50px'}}>
        Add Client
        </h1>
        <Box className="form">
            
          <div style ={{marginLeft:'10px'}}>
              <form  noValidate autoComplete="off">
                  <div className="leftDivision">
                    <div style={{ marginRight: '15px'}} >
                        <TextField
                          id="outlined-required"
                          required
                          label="Name of the client"
                          name="client_name"
                          value={clientData.client_name}
                          variant="outlined"
                          onChange={handleChange}
                          
                        />
                    </div>
                      <div style={{float:"left",marginRight :"15px",marginTop:'30px',marginBottom:'30px'}}>
                        <TextField
                        required
                        id="outlined-required"
                        label="Bill To"
                        variant="outlined"
                        name="billing_address"
                        value={clientData.billing_address}
                        onChange={handleChange}
                        />
                      </div>
                      <div style={{float:"right",marginRight :"15px",marginTop:'30px',marginBottom:'30px'}}>
                        <TextField
                        required
                        id="outlined-required"
                        label="Ship To"
                        variant="outlined"
                        name="shipping_address"
                        value={clientData.shipping_address}
                        onChange={handleChange}
                        />
                      </div>   
                  
             
                      <div style={{marginBottom:'10px',marginRight :"15px"}}>
                        <TextField
                            id="outlined-textarea"
                            label="Payment Terms"
                            multiline
                            variant="outlined"
                            inputProps={{className:classes.payment}}
                            name="payment_terms"
                            value={clientData.payment_terms}
                            onChange={handleChange}
                          />
                      </div>
                      <div style={{marginBottom:'10px',marginRight :"15px"}}>
                        <TextField
                            id="outlined-required"
                            label="Date of contract"
                            placeholder="yyyy-mm-dd"
                            variant="outlined"
                            inputProps={{className:classes.payment}}
                            name="date_of_contract"
                            value={clientData.date_of_contract}
                            onChange={handleChange}
                          />
                      </div>
                      
                    </div>
              </form>    
          </div> 
              <div>
                <div style={{float:'left',overflow:'hidden'}}>
                  <div style={{marginTop:'15px',marginRight:"300px"}}>
                    <TextField
                      id="outlined-textarea"
                      label="Notes"
                      placeholder="Notes - any relevant information already not covered"
                      multiline
                      variant="outlined"
                      inputProps={{
                        className:classes.multiline
                      }}
                      name="notes"
                      value={clientData.notes}
                      onChange={handleChange}


                    />
                  </div>
                  <div style={{marginTop:"15px",marginRight:"200px"}}>
                    <TextField
                      id="outlined-textarea"
                      label="Terms"
                      placeholder="Terms and conditions"
                      multiline
                      variant="outlined"
                      inputProps={{
                        className:classes.multiline
                      }}
                      name="terms"
                      value={clientData.terms}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
      </Box>
      
      <div style={{marginLeft:"300px",marginTop:"10px"}}>
        <Button variant="contained" color="primary" onClick={printdata}>
                Add Client
        </Button>
      </div>

    </div>
    
  );
}
