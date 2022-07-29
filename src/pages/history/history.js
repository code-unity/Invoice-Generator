import React, { useState } from "react";
import Card from "../../components/historyCard";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    paddingLeft: "100px",
    marginTop: "20px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function History() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect((open) => {
    const fetchData = () => {
      setOpen(!open);
      axios.get(`${process.env.REACT_APP_API_URL}/invoice`).then((res) => {
        setOpen(false);
        setData(res.data.data.results);
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{ marginLeft: "45%" }}>History</h1>
      <Grid container spacing={1} className={classes.gridContainer}>
        {data.map((historyData, index) => {
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card data={historyData} idx={index} />
            </Grid>
          );
        })}
      </Grid>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="primary" />
      </Backdrop>
    </div>
  );
}
