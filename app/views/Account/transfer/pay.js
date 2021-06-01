import React, {useCallback} from "react";

import Pay from "app/services/Pay"; 

const Page = ({onChangePage, pageData, onVerifyTransaction, onClose}) => {
    // console.log("FRom HERE!!!!!!!!",{pageData})
    const verifyPayment = useCallback(
        (resp) => {
            console.log('i am response', resp);
            onVerifyTransaction && onVerifyTransaction(resp);
        },
        [onVerifyTransaction],
    );
   
    return(
        <Pay 
            payData={pageData.payData}
            onSuccess={verifyPayment}
            onFailure={verifyPayment}
            onError={verifyPayment}
            onCancel={onClose}
        />
    )
}
export default Page;