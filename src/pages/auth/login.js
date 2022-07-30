import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import history from "../../history";
import axios from "axios";
import "./login.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "35ch",
    },
  },
  card: {
    maxWidth: 345,
    margin: "auto",
    marginTop: "100px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function LoginForm() {
  const classes = useStyles();
  const [details, setDetails] = useState({ username: "", password: "" });
  const [open, setOpen] = React.useState(false);
  // const [error, setError] = useState('');
  // const [error1, setError1] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    setOpen(!open);
    const data = {
      username: details.username,
      password: details.password,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/admin`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setOpen(false);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("signedin", res.data.status.success);
        history.push("/home");
      })
      .catch((err) => {
        setOpen(false);
      });
  };

  return (
    <div>
      <Card className={classes.card}>
        <div>
          <div>
            <div className="logo">
              <img
                src="https://www.codeunity.in/images/logo/logo.png"
                loading="lazy"
                alt="CodeUnity logo"
                id="ember499"
                style={{
                  marginLeft: "31%",
                  marginTop: "10%",
                  marginBottom: "10px",
                  height: "0%",
                  width: "40%",
                }}
              ></img>
            </div>
            <h2
              style={{
                marginLeft: "83px",
                marginTop: "10px",
                fontSize: "16px",
                marginBottom: "-5px",
              }}
            >
              Log In to Your Account
            </h2>
            <form className={classes.root} onSubmit={submitHandler}>
              <div style={{ marginLeft: "10px" }}>
                <TextField
                  required
                  id="outlined-full-width"
                  label="Username"
                  variant="outlined"
                  inputProps={{
                    className: classes.textField,
                  }}
                  onChange={(e) => {
                    setDetails({ ...details, username: e.target.value });
                  }}
                />
                {/* {error1 !== '' ? (
                  <div className="error"> &nbsp; &nbsp; &nbsp; {error1}</div>
                  ) : (
                  ''
                  )} */}
                <TextField
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  fullWidth
                  onChange={(e) =>
                    setDetails({ ...details, password: e.target.value })
                  }
                />
                {/* {error !== '' ? (
                  <div className="error"> &nbsp; &nbsp; &nbsp; {error}</div>
                    ) : (
                      ''
                    )} */}
              </div>
              <div
                style={{
                  marginLeft: "20px",
                  marginBottom: "20px",
                  marginTop: "5px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitHandler}
                >
                  Log In
                </Button>
                <Backdrop className={classes.backdrop} open={open}>
                  <CircularProgress color="primary" />
                </Backdrop>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LoginForm;
