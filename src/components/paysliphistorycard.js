import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import ShareIcon from '@material-ui/icons/Share';
import { Divider } from '@material-ui/core';
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

function deleteData (value) {
  axios.delete(`${process.env.REACT_APP_API_URL}/payslip/${value}`)
    .then((response) => {
      alert('successfully deleted Schedule');
      history.push('/payslip')
      history.push('/paysliphistory')
    })
    .catch((error) => {
      alert('Failed to delete Schedule');
    })
}
export default function OutlinedCard(props) {
  const classes = useStyles();
  
  return (
    
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          # {props.idx +1}
        </Typography>
        <Typography className={classes.date} color="primary" gutterBottom>
          Month & Year: {props.data.date.split("",15)}
        </Typography>
        <Typography className={classes.billTo}>
          Name: { props.data.candidate}
        </Typography>
        <Typography className={classes.billToBody}>
          Designation: 
        </Typography>
        <Typography className={classes.billToBody}>
          {props.data.Designation}
        </Typography>
        <Typography className={classes.billToBody}>
          Candidate Id: 
        </Typography>
        <Typography className={classes.billToBody}>
          {props.data.candidate_id}
        </Typography>

        <Divider/>
        <div style={{fontSize:"10px"}}>
        <Typography color="textSecondary" gutterBottom>
          Basic Salary: {props.data.Basic}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
        Dearness Allowance(DA): {props.data.D_allow}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          HR Allowance: {props.data.HR_allow}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Bonus: {props.data.Bonus}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
        Conveyance Allowance: {props.data.conveyance}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Other Allowances: {props.data.others}
        </Typography>
        <Typography  color="primary" gutterBottom>
          Total Earnings: {props.data.total_earnings}
        </Typography>
        <Divider/>
        
        <Typography  color="textSecondary" gutterBottom>
          Professional Tax: {props.data.prof_tax}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Employer PF: {props.data.p_f_employer}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Employee PF: {props.data.p_f_employee}
        </Typography>
        <Typography color="textSecondary">
        Total Tax(Professional Tax + Employer PF): {props.data.total_tax}
        </Typography>

        <Typography  color="textSecondary" gutterBottom>
          TDS: {props.data.td_S}
        </Typography>
        <Typography  color="textSecondary" gutterBottom>
          Other Taxes: {props.data.other_tax}
        </Typography>

        <Typography  color="primary" gutterBottom>
          Net Deductions: {props.data.net_deductions}
        </Typography>
        <Divider/>
        <Typography  color="textSecondary" gutterBottom>
          Remarks: {props.data.remarks}
        </Typography>
        </div>
        <div className='net' style={{float:'right', color:'red'}}>
        <Typography gutterBottom>
          Net Salary: {props.data.net_salary}
        </Typography>
        </div>
        
      </CardContent>
      <CardActions disableSpacing>
        <IconButton size ="small" aria-label="Delete" onClick={() => deleteData(props.data._id)}>
          <DeleteIcon />
        </IconButton>
        <IconButton size ="small" aria-label="share">
          <ShareIcon />
        </IconButton>

      </CardActions>
    </Card>
  );
}
