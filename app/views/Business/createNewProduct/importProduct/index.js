import * as React from "react";
import { useRouter } from "next/router";
import Wizard from "app/services/pagewizard";
import Success from './success';
import Error from './error';
import Products from './products';
import Stores from "./stores";


const pages = [
    {name: "default", page: Stores},
    {name: "products", page: Products},
    {name: "success", page: Success},
    {name: "error", page: Error}

]
const Page = ({onClose}) => {
   
    return(
        <div style={{position: "relative"}}>
            {/* <button onClick={onClose} style={{position: "absolute", color: "#fff", backgroundColor:"black", width: "2rem", right: "4px", top: "4px"}}>X</button> */}
            <Wizard 
                pages={pages}
                onClose={onClose}
             />
        </div>
        
    )
}
export default Page;