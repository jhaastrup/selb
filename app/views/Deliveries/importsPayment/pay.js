import React, {useCallback, useEffect} from "react";
import { VERIFY_IMPORT_TRANSACTION } from '../modules/mutations';
import { useQuery, useMutation } from '@apollo/client';



import Pay from "app/services/Pay"; 

const Page = ({onChangePage, pageData, onVerifyTransaction, onClose, setState, onRefresh}) => {
    const { payData = {} } = pageData;

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "options",
        }))
    }, []);

    console.log("FRom HERE!!!!!!!!",{pageData, onRefresh})
    const [verifyImportTransaction] = useMutation(VERIFY_IMPORT_TRANSACTION, {
        onCompleted: (data) => {
            const { verifyImportTransaction: payload } = data;
            console.log({ payload });
            onRefresh && onRefresh();
            onChangePage('success', { payload });
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const verifyTransaction = useCallback(
        (payload) => {
            const { txref } = payload;
            console.log('verifying transaction');
            verifyImportTransaction({ variables: { txref } });
        },
        [verifyImportTransaction],
    );

    const verifyPayment = useCallback(
        (resp) => {
            console.log('i am response', resp);
            verifyTransaction && verifyTransaction(resp);
        },
        [verifyTransaction],
    );
   
    return(
        <Pay 
            payData={payData}
            onSuccess={verifyPayment}
            onFailure={verifyPayment}
            onError={verifyPayment}
            onCancel={onClose}
        />
    )
}
export default Page;