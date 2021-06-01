import * as React from "react";
import {useMutation} from "@apollo/client";
import {VERIFY_DELIVERY_PAYMENT} from "../modules/mutations";
import PaymentPlugin from "app/services/Pay"

const Page = ({onChangePage, setState, pageData,}) => {

    const { payData = {} } = pageData;

    console.log({ pageData });

    const [verifyDeliveryTransaction] = useMutation(VERIFY_DELIVERY_PAYMENT, {
        onCompleted: (data) => {
            const { verifyDeliveryTransaction: payload } = data;
            console.log({ payload });
            onChangePage('success', { payload });
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const verifyTransaction = React.useCallback(
        (payload) => {
            const { txref } = payload;
            console.log('verifying transaction');
            verifyDeliveryTransaction({ variables: { txref } });
        },
        [verifyDeliveryTransaction],
    );

    const verifyPayment = React.useCallback(
        (resp) => {
            console.log('i am response', resp);
            verifyTransaction && verifyTransaction(resp);
        },
        [verifyTransaction],
    );
    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "options",
        }))
    }, []);

    if(!payData){
        return(
            <div style={{width: "60%", margin:"10rem auto"}}>
               initiating...
            </div>
        )
    }
   
    return(
       
            <div style={{margin: "1rem auto", width: "50%"}}>
                <PaymentPlugin 
                    payData={payData}
                    onSuccess={(data) => {
                        verifyPayment(data)
                    }}

                    onError={(data) => {
                        verifyPayment(data)
                    }}

                    onFailure={(data) => {
                        verifyPayment(data)
                    }}

                />
               
            </div>         
        
        
    )
}
export default Page;