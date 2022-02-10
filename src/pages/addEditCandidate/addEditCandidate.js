import React from "react";
import { useParams } from "react-router-dom";
import Candidate from "../../components/addCandidate/candidate"

export default function AddCandidate(){
    let {id} = useParams();
    if(id===undefined){
        id = 'none'
    }
   return (
       <div>
           <Candidate candidateId={id}/>
       </div>

   )
}