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
  const [openb, setOpenb] = React.useState(false)
  const [openc, setOpenc] = React.useState(false)
  const [opent, setOpent] = React.useState(false)
  const [openi, setOpeni] = React.useState(false)

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
          <div className={openb ? "sidebar-item open" : "sidebar-item"}>
            <ListItem button className="sidebar-title" onClick={() => setOpenb(!openb)}>
              <ListItemText primary='Client' />
              <KeyboardArrowDownIcon className="bi-chevron-down toggle-btn" onClick={() => setOpenb(!openb)} ></KeyboardArrowDownIcon>
            </ListItem>
            <div className="sidebar-content">
              <ListItem button onClick={() => history.push('/client')}>
                <ListItemIcon><AccountBoxRoundedIcon /></ListItemIcon>
                <ListItemText primary='Add Client' />
              </ListItem>
              <ListItem button onClick={() => history.push('/view-client')}>
                <ListItemIcon><ViewComfyIcon /></ListItemIcon>
                <ListItemText primary='View Client' />
              </ListItem>
            </div>
          </div >
          <div style={{ marginTop: -10 }}>
            <div className={openc ? "sidebar-item open" : "sidebar-item"}>
              <ListItem button className="sidebar-title" onClick={() => setOpenc(!openc)}>
                <ListItemText primary='Candidate' />
                <KeyboardArrowDownIcon className="bi-chevron-down toggle-btn" onClick={() => setOpenc(!openc)} ></KeyboardArrowDownIcon>
              </ListItem>
              <div className="sidebar-content">
                <ListItem button onClick={() => history.push('/candidate')}>
                  <ListItemIcon><AccountBoxRoundedIcon /></ListItemIcon>
                  <ListItemText primary='Add Candidate' />
                </ListItem>
                <ListItem button onClick={() => history.push('/view-candidate')}>
                  <ListItemIcon><ViewComfyIcon /></ListItemIcon>
                  <ListItemText primary='View Candidate' />
                </ListItem>
              </div>
            </div></div>
          <div style={{ marginTop: -10 }}>
            <div className={opent ? "sidebar-item open" : "sidebar-item"}>
              <ListItem button className="sidebar-title" onClick={() => setOpent(!opent)}>
                <ListItemText primary='Time Sheet' />
                <KeyboardArrowDownIcon className="bi-chevron-down toggle-btn" onClick={() => setOpent(!opent)} ></KeyboardArrowDownIcon>
              </ListItem>
              <div className="sidebar-content">
                <ListItem button onClick={() => history.push("/timesheet")}>
                  <ListItemIcon>
                    <ListAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Time Sheet" />
                </ListItem>
                <ListItem button onClick={() => history.push('/view-timesheet')}>
                  <ListItemIcon><ViewComfyIcon /></ListItemIcon>
                  <ListItemText primary='View Time Sheet' />
                </ListItem>
              </div>
            </div></div>
          <div style={{ marginTop: -10 }}>
            <div className={openi ? "sidebar-item open" : "sidebar-item"}>
              <ListItem button className="sidebar-title" onClick={() => setOpeni(!openi)}>
                <ListItemText primary='Invoice' />
                <KeyboardArrowDownIcon className="bi-chevron-down toggle-btn" onClick={() => setOpeni(!openi)} ></KeyboardArrowDownIcon>
              </ListItem>
              <div className="sidebar-content">
                <ListItem button onClick={() => history.push('/home')}>
                  <ListItemIcon><AssignmentRoundedIcon /></ListItemIcon>
                  <ListItemText primary='Generate Invoice' />
                </ListItem>
                <ListItem button onClick={() => history.push('/history')}>
                  <ListItemIcon><AccessTimeRoundedIcon /></ListItemIcon>
                  <ListItemText primary='Invoice History' />
                </ListItem>
              </div>
            </div></div>
          <ListItem button style={{ marginTop: -10 }} onClick={() => { history.push('/'); localStorage.clear() }}>
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
