import * as React from "react";
import { useRouter } from "next/router";
import Wizard from "app/services/pagewizard";
import Success from './success';
import Error from './error';
import Channel from './channel';
import Orders from "./orders";
import Stores from "./stores";


const pages = [
    {name: "default", page: Channel},
    {name: "orders", page: Orders},
    {name: "stores", page: Stores},
    {name: "success", page: Success},
    {name: "error", page: Error}

]
const Page = ({onClose}) => {
   


   
    return(
        <div style={{position: "relative"}}>
            {/* <button onClick={onClose} style={{position: "absolute", color: "#fff", backgroundColor:"black", width: "2rem", right: "4px", top: "4px"}}>X</button> */}
            <Wizard 
                pages={pages}
             />
        </div>
        
    )
}
export default Page;