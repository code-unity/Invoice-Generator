import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import { Divider } from '@material-ui/core';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { WhatsappShareButton } from "react-share";
import { WhatsappIcon } from "react-share";
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import './historyCard.css';
import EditIcon from '@mui/icons-material/Edit';
import history from '../history';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const useStyles = makeStyles((theme) => ({
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
    float: 'left',
    width: '25%'
  },
  date: {
    fontSize: 14,
    float: 'right',
  },
  pos: {
    marginBottom: 12,
  },
  billTo: {
    fontSize: 15,
    marginBottom: '5px',
    marginTop: '45px'
  },
  shipTo: {
    fontSize: 15,
    marginBottom: '5px',
    marginTop: '15px'
  },
  billToBody: {
    fontSize: 15,
    marginBottom: '10px'
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

  const [open, setOpen] = React.useState(false);

  const [checked, setChecked] = React.useState(false);

  const paidChangeHandler = (event) => {
    setChecked(event.target.checked);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();

  return (
    <div>
      <Card className={classes.root} variant="outlined">
        <CardContent className={checked ? 'cardpaid' : 'card'} >
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            # {props.idx + 1}
          </Typography>
          <Typography className={classes.date} color="textSecondary" gutterBottom>
            Date: {props.data.date.split("", 15)}
          </Typography>
          <Typography className={classes.date} color="textSecondary" gutterBottom>
            Due Date: {props.data.due_date.split("", 15)}
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
          <Divider />
          {props.data.items.map((item, idx) => {
            return (
              <Typography variant="body2" component="p" className={classes.shipTo}>
                {idx + 1}. Item :{item.item}
                <br />
                &emsp; Quantity : {item.quantity}<br />
                &emsp; Rate : {item.rate}<br />
                &emsp; Amount : {item.amount}<br />
              </Typography>
            )

          })}
          <Divider />
          <Typography color="textSecondary" gutterBottom>
            Notes: {props.data.notes}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Terms & conditions: {props.data.terms}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Payment terms: {props.data.payment_terms}
          </Typography>
          <Divider />
          <Typography color="textSecondary" gutterBottom>
            subTotal: {props.data.sub_total}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Discount: {props.data.discount}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Tax: {props.data.tax}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Total: {props.data.total}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Amount paid: {props.data.amount_paid}
          </Typography>
          <Typography color="primary" gutterBottom>
            Balance due: {props.data.balance_due}
          </Typography>

        </CardContent>
        <CardActions disableSpacing>
          <IconButton size="small" aria-label="Delete" >
            <DeleteIcon />
          </IconButton>
          <IconButton size="small" aria-label="share" style={{ marginLeft: "15px" }}>
            <ShareIcon variant="outlined" onClick={handleClickOpen} />
          </IconButton>
          <Button
            size="small"
            style={{ marginLeft: "20px" }}
            startIcon={<EditIcon />}
            variant="text"
            color="primary"
            onClick={(e) => {
              history.push(`/home/ ${props.data.sub_total}`)

            }}>
            Edit
          </Button>
          <FormGroup style={{ marginLeft: "20px" }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label={checked ? 'Paid' : 'Unpaid'}
              checked={checked}
              size="small"
              onChange={paidChangeHandler} />
          </FormGroup>
        </CardActions>
      </Card>
      <div>
        <Dialog
          fullWidth
          maxWidth="sm"
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Share Invoice"}</DialogTitle>
          <DialogContent>
            <WhatsappShareButton
              url="https://www.codeunity.in"
              title={`Date = ${props.data.date}\n
Due Date = ${props.data.due_date}\n
Bill To = ${props.data.bill_to}\n
Ship To = ${props.data.ship_to}\n
Notes = ${props.data.notes}\n
Terms & Conditions = ${props.data.terms}\n
Payment terms = ${props.data.payment_terms}\n
SubTotal = ${props.data.sub_total}\n
          Discount = ${props.data.discount}\n
          Tax = ${props.data.tax}\n
Total = ${props.data.total}\n
Balance due = ${props.data.balance_due}\n
Amount paid = ${props.data.amount_paid}\n
`}
            >
              <WhatsappIcon logofillcolour='white' round={true}></WhatsappIcon>
            </WhatsappShareButton>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog></div>
    </div>
  );
}
