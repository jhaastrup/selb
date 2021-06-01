import React, { useCallback, useEffect } from 'react';
import _ from 'lodash';

import { PREPARE_TRANSACTION } from './modules/mutations';
import { useMutation } from '@apollo/client';
import Loading from "app/components/loading"


const Page = ({initialData, onProceed, transData}) => {
    const [initiatePayment] = useMutation(PREPARE_TRANSACTION, {
        onCompleted: (data) => {
            const { prepareTransaction: transaction } = data;
            console.log({ transaction });
            onProceed && onProceed(transaction);
        },
        onError: (error) => {
            console.log(error);
            onProceed && onProceed({ page: 'error' });
        },
    });

    const triggerInit = useCallback(
        (variables) => {
            initiatePayment({ variables });
        },
        [initiatePayment],
    );

    useEffect(() => {
        const initialValues = { ...initialData, ...transData };
        if (!transData || !transData.txref) {
            triggerInit(initialValues);
        }
    }, [initialData, transData, triggerInit]);

    return (
        <div className={"flex h-screen justify-center items-center"}>
            <Loading />
        </div>
    )
}

export default Page;