import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";

const Page = ({onChangePage, pageData, updatePageData}) => {
   

    return(
        <div>  
            <div style={{margin: "1rem auto", width: "50%"}}>
                
                <p>{"Connect a store type"}</p>
               
                <div>
                   
                       
                    <div  onClick={() => onChangePage("stores", { channelName: 'shopify' })} style={{backgroundColor: "#ccc", border: "1px solid black"}}>
                        <p>{"SHOPIFY"}</p>

                    </div>
                    <div onClick={() => onChangePage("stores", { channelName: 'woocommerce' })} style={{backgroundColor: "#ccc", border: "1px solid black"}}>
                        <p>{"WOOCOMMERCE"}</p>

                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Page;