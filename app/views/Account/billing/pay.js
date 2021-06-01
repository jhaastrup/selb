import React, {useCallback} from "react";

import Pay from "app/services/Pay"; 

const Page = ({onChangePage, pageData, onVerifyTransaction}) => {

    const verifyPayment = useCallback(
        (resp) => {
            console.log('i am response', resp);
            onVerifyTransaction && onVerifyTransaction(resp);
        },
        [onVerifyTransaction],
    );
   
    return(
            <div style={{margin: "1rem auto", width: "100%"}}>
                <p>{`You will pay ${pageData.payData.amount}`}</p>
                <Pay 
                    payData={pageData.payData}
                    onSuccess={verifyPayment}
                    onFailure={verifyPayment}
                    onError={verifyPayment}
                />
            </div>         
        
        
    )
}
export default Page;