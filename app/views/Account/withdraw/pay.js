import * as React from "react";

const Page = ({onChangePage, pageData, title}) => {
   
    return(
       
            <div style={{margin: "1rem auto", width: "50%"}}>
                <p>{`You will pay ${pageData.payData.amount}`}</p>
               
            </div>         
        
        
    )
}
export default Page;