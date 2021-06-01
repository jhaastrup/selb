import React, {Fragment, useCallback, useState, useEffect} from "react";
import Pay from "app/services/Pay"
import { useMutation } from '@apollo/client';
import {CREATE_TOPUP} from "../modules/mutations"
import Loading from "app/components/loading"


const Page = ({onVerifyTransaction, onClose}) => {
    const [addCardPayData, setAddCardPayData] = useState({})

    useEffect(() => {
        const variables = {
            amount: 10,
            currency: "NGN",
            payment_source_code: "card"
        }
        createTopUp({variables});
    }, [createTopUp])

    const [createTopUp, { loading }] = useMutation(CREATE_TOPUP, {
        onCompleted: (resp) => {
            const { createTopUp: payload } = resp;
            // const { card_key, payment_source_code } = pageData;
            const payData = { ...payload, payment_source_code: "card" };
            setAddCardPayData(payData);
        },
    });

    const verifyPayment = useCallback(
        (resp) => {
            console.log('i am response', resp);
            onVerifyTransaction && onVerifyTransaction(resp);
        },
        [onVerifyTransaction],
    );

    return(
        <div>
            {loading && (
                <div className={"flex h-screen justify-center items-center"}>
                    <Loading />
                </div>
            )}
            {!loading && (<Pay 
                payData={addCardPayData}
                onSuccess={verifyPayment}
                onFailure={verifyPayment}
                onError={verifyPayment}
                onCancel={onClose}
            />)}
        </div>
    )
}
export default Page;