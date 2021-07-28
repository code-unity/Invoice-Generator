import React,{useState} from "react";
import Card from "../../components/historyCard";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

const useStyles = makeStyles({
    gridContainer:{
        paddingLeft :"100px",
        marginTop :"20px"
    }

})

export default function History(){
    const classes = useStyles();
    const [data ,setData] = useState([]);

    React.useEffect(() => {
        const fetchData = () => {
            axios.get("https://codeunity-invoice-backend.herokuapp.com/invoice")
              .then((res) => {
                setData(res.data.data.results);
              })
          };
        fetchData();
      }, []);

    
    return (
        <div>
            <h1 style={{marginLeft:'45%'}}>History</h1>
            <Grid container spacing={1} className={classes.gridContainer}>
            {data.map((historyData,index)=>{
                return(
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card data= {historyData} idx = {index}/>
                    </Grid>
                );
            })}
            </Grid>
        </div>
        
    )
}
