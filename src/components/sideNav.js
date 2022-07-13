import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccessTimeRoundedIcon from "@material-ui/icons/AccessTimeRounded";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import history from '../history';
import Box from '@mui/material/Box';
import './sideNav.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
}));

export default function PersistentDrawerLeft(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    client: false,
    candidate: false,
    timesheet: false,
    invoice: false,
  });
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (e, index) => {
    setSelectedIndex(index);
  };


  const handleChange = (e) => {
    setState({ ...state, [e]: !state[e] });
  };


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Invoice Generator
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <div onChange={(e) => handleChange('client')} className={state.client ? "sidebar-item open" : "sidebar-item"} >
            <ListItem button selected={selectedIndex === 0} className="sidebar-title" onClick={(e) => {
              handleChange('client')
              handleListItemClick(e, 0)
            }}>
              <ListItemText primary='Client' />
              <KeyboardArrowDownIcon className="bi-chevron-down toggle-btn" onClick={(e) => handleChange('client')} ></KeyboardArrowDownIcon>
            </ListItem>
            <div className="sidebar-content">
              <ListItem button onClick={() => history.push('/client')}>
                <ListItemIcon style={{ marginLeft: '15px' }}><AccountBoxRoundedIcon /></ListItemIcon>
                <ListItemText style={{ marginLeft: '-10px' }} primary='Add Client' />
              </ListItem>
              <ListItem button onClick={() => history.push('/view-client')}>
                <ListItemIcon style={{ marginLeft: '15px' }}><ViewComfyIcon /></ListItemIcon>
                <ListItemText style={{ marginLeft: '-10px' }} primary='View Client' />
              </ListItem>
            </div>
          </div >
          <div style={{ marginTop: -5 }}>
            <div onChange={(e) => handleChange('candidate')} className={state.candidate ? "sidebar-item open" : "sidebar-item"}>
              <ListItem button selected={selectedIndex === 1} className="sidebar-title" onClick={(e) => {
                handleChange('candidate')
                handleListItemClick(e, 1)
              }}>
                <ListItemText primary='Candidate' />
                <KeyboardArrowDownIcon className="bi-chevron-down toggle-btn" onClick={() => handleChange('candidate')}></KeyboardArrowDownIcon>
              </ListItem>
              <div className="sidebar-content">
                <ListItem button onClick={() => history.push('/candidate')}>
                  <ListItemIcon style={{ marginLeft: '15px' }}><AccountBoxRoundedIcon /></ListItemIcon>
                  <ListItemText style={{ marginLeft: '-10px' }} primary='Add Candidate' />
                </ListItem>
                <ListItem button onClick={() => history.push('/view-candidate')}>
                  <ListItemIcon style={{ marginLeft: '15px' }}><ViewComfyIcon /></ListItemIcon>
                  <ListItemText style={{ marginLeft: '-10px' }} primary='View Candidate' />
                </ListItem>
              </div>
            </div></div>
          <div style={{ marginTop: -5 }}>
            <div onChange={(e) => handleChange('timesheet')} className={state.timesheet ? "sidebar-item open" : "sidebar-item"}>
              <ListItem button selected={selectedIndex === 2} className="sidebar-title" onClick={(e) => {
                handleChange('timesheet')
                handleListItemClick(e, 2)
              }}>
                <ListItemText primary='Time Sheet' />
                <KeyboardArrowDownIcon className="bi-chevron-down toggle-btn" onClick={(e) => handleChange('timesheet')} ></KeyboardArrowDownIcon>
              </ListItem>
              <div className="sidebar-content">
                <ListItem button onClick={() => history.push("/timesheet")}>
                  <ListItemIcon style={{ marginLeft: '15px' }}>
                    <ListAltIcon />
                  </ListItemIcon>
                  <ListItemText style={{ marginLeft: '-10px' }} primary="Add Time Sheet" />
                </ListItem>
                <ListItem button onClick={() => history.push('/view-timesheet')}>
                  <ListItemIcon style={{ marginLeft: '15px' }} ><ViewComfyIcon /></ListItemIcon>
                  <ListItemText style={{ marginLeft: '-10px' }} primary='View Time Sheet' />
                </ListItem>
              </div>
            </div></div>
          <div style={{ marginTop: -5 }}>
            <div onChange={(e) => handleChange('invoice')} className={state.invoice ? "sidebar-item open" : "sidebar-item"}>
              <ListItem button selected={selectedIndex === 3} className="sidebar-title" onClick={(e) => {
                handleChange('invoice')
                handleListItemClick(e, 3)
              }}>
                <ListItemText primary='Invoice' />
                <KeyboardArrowDownIcon className="bi-chevron-down toggle-btn" onClick={(e) => handleChange('invoice')} ></KeyboardArrowDownIcon>
              </ListItem>
              <div className="sidebar-content">
                <ListItem button onClick={() => history.push('/home')}>
                  <ListItemIcon style={{ marginLeft: '15px' }}><AssignmentRoundedIcon /></ListItemIcon>
                  <ListItemText style={{ marginLeft: '-10px' }} primary='Generate Invoice' />
                </ListItem>
                <ListItem button onClick={() => history.push('/history')}>
                  <ListItemIcon style={{ marginLeft: '15px' }}><AccessTimeRoundedIcon /></ListItemIcon>
                  <ListItemText style={{ marginLeft: '-10px' }} primary='Invoice History' />
                </ListItem>
                <ListItem button onClick={() => history.push('/invoice-filter')}>
                  <ListItemIcon style={{ marginLeft: '15px' }}><AccessTimeRoundedIcon /></ListItemIcon>
                  <ListItemText style={{ marginLeft: '-10px' }} primary='Invoice Filter' />
                </ListItem>
              </div>
            </div></div>

          <ListItem button style={{ marginTop: 0 }} onClick={() => { history.push('/'); localStorage.clear() }}>
            <ListItemText primary='Logout' />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
    </div>
  );
}
