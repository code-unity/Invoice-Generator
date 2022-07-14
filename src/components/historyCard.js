import React , {}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import { Divider } from '@material-ui/core';
import axios from "axios";
import EditIcon from '@material-ui/icons/Edit';
import history from '../history';


const useStyles = makeStyles((theme)=>({
  root: {
    minWidth: 255,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    float:'left',
    width: '25%'
  },
  date: {
    fontSize: 14,
    float:'right',
  },
  pos: {
    marginBottom: 12,
  },
  billTo:{
    fontSize: 15,
    marginBottom:'5px',
    marginTop: '45px'
  },
  shipTo:{
    fontSize: 15,
    marginBottom:'5px',
    marginTop: '15px'
  },
  billToBody:{
    fontSize: 15,
    marginBottom:'10px'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));


export default function OutlinedCard(props) {
  // const { row } = props
  const classes = useStyles();
  
    function deleteInvoice() {
      axios.delete(`${process.env.REACT_APP_API_URL}/invoice/${props.data._id}`)
    }
    // function editInvoice(){
      // axios.put(`${process.env.REACT_APP_API_URL}/invoice/${props.data._id}`)
    // }

  return (

    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          # {props.idx +1}
        </Typography>
        <Typography className={classes.date} color="textSecondary" gutterBottom>
          Date: {props.data.date.split("",15)}
        </Typography>
        <Typography className={classes.date} color="textSecondary" gutterBottom>
          Due Date: {props.data.due_date.split("",15)}
        </Typography>
        <Typography className={classes.billTo}>
          Bill to: 
        </Typography>
        <Typography className={classes.billToBody}>
          {props.data.bill_to}
        </Typography>
        <Typography className={classes.shipTo}>
          Ship to:
        </Typography>
        <Typography className={classes.billToBody}>
          {props.data.ship_to}
        </Typography>
        <Divider/>
        {props.data.items.map((item,idx)=>{
          return(
          <Typography variant="body2" component="p" className= {classes.shipTo}>
          {idx+1}. Item :{item.item}
          <br/>
          &emsp; Quantity : {item.quantity}<br/>
          &emsp; Rate : {item.rate}<br/>
          &emsp; Amount : {item.amount}<br/>
          </Typography>
          )
          
        })}
        <Divider/>
        <Typography color="textSecondary" gutterBottom>
          Notes: {props.data.notes}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Terms & conditions: {props.data.terms}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Payment terms: {props.data.payment_terms}
        </Typography>
        <Divider/>
        <Typography  color="textSecondary" gutterBottom>
          subTotal: {props.data.sub_total}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Discount: {props.data.discount}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Tax: {props.data.tax}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Total: {props.data.total}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Amount paid: {props.data.amount_paid}
        </Typography>
        <Typography  color="primary" gutterBottom>
          Balance due: {props.data.balance_due}
        </Typography>
        
        
      </CardContent>
      <CardActions disableSpacing>
        <IconButton size ="small" aria-label="Delete" onClick= {deleteInvoice} >
         
        <DeleteIcon/>
        </IconButton>
        
        <IconButton size ="small" aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton 
                        aria-label="edit-client"
                        size='small'
                        // onClick= {editInvoice}
                        onClick={() => history.push(`/home/${props.data._id}`)}
                    >
                        <EditIcon />
                    </IconButton>
      </CardActions>
    </Card>
  );
}
  