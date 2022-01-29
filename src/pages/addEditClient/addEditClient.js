import React from "react";
import { useParams } from "react-router-dom";
import Client from "../../components/addClient/client"

export default function AddClient(){
    let {id} = useParams();
    if(id===undefined){
        id = 'none'
    }
   return (
       <div>
           <Client clientId={id}/>
       </div>

   )
}