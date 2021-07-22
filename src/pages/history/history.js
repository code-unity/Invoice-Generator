import React from "react";
import Card from "../../components/historyCard";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    gridContainer:{
        paddingLeft :"100px",
        marginTop :"20px"
    }

})

export default function History(){
    const classes = useStyles();
    return (
        <div>
            <h1 style={{marginLeft:'45%'}}>History</h1>
            <Grid container spacing={1} className={classes.gridContainer}>
            <Grid item xs={12} sm={6} md={2}>
                <Card/>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
                <Card/>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
                <Card/>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
                <Card/>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
                <Card/>
            </Grid>
        </Grid>

        </div>
        
    )
}
