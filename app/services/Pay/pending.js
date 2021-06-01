import React, { Fragment, useState, useCallback, useEffect, useRef } from 'react';
import _ from 'lodash';


import { VALIDATE_TRANSACTION } from './modules/mutations';
import { useMutation } from '@apollo/client';

const Page = ({onProceed, onFailure, onCancel, transData, dependencies = {}}) => {
    const formRef = useRef();
    const [checkAgain, setCheckAgain] = useState(true);
    const [counter, setCounter] = useState(120);

    const [validateTransaction, { loading }] = useMutation(VALIDATE_TRANSACTION, {
        onCompleted: (data) => {
            const { validateTransaction: validateTransactionResponse } = data;
            console.log({ validateTransactionResponse });
            if (!['pending', 'ongoing'].includes(validateTransactionResponse.page)) {
                setCheckAgain(false);
                onProceed && onProceed(validateTransactionResponse);
            }
        },
        onError: (err) => {
            console.log({ err });
            onProceed && onProceed({ page: 'error' });
        },
    });

    useEffect(() => {
        const timer =
            checkAgain &&
            setInterval(() => {
                if (counter < 1) {
                    setCheckAgain(false);
                    clearInterval(timer);
                }
                console.log({ counter, checkAgain });
                // Check logic only when not loading and every 30 seconds in between
                if (!loading && counter % 20 === 0) {
                    console.log('sending out another probe', counter % 20);
                    validateTransaction({ variables: transData });
                }
                setCounter(counter - 1);
            }, 1000);

        return () => clearInterval(timer);
    }, [checkAgain, counter, loading, transData, validateTransaction]);

    const checkStatus = useCallback(() => {
        setCounter(120);
        setCheckAgain(true);
    }, []);

    return (
        <>
            <div style={{padding: "1rem 0rem"}}>
                <p>{'Transaction pending'}</p>
                <p>
                    {
                        'We are yet to receive confirmation from our service provider. If this persists, please contact support.'
                    }
                </p>
            </div>
            <div style={{height:"2rem"}}></div>
            <div>
                <p style={{textAlign: "center"}}>
                    {counter && counter > 0 ? `${counter} secs` : ''}
                </p>
                <div style={{height:"0.5rem"}}></div>
                <div>
                    <button
                        onClick={() => checkStatus()}
                        type={"button"}
                        style={{color: "#fff", backgroundColor:"black", padding: "10px", marginTop: "10px", width: "100%"}}
                    >
                        {checkAgain ? '' : 'CHECK TRANSACTION STATUS'}
                    </button>
                </div> 
                <div style={{height:"0.5rem"}}></div>
                <div>
                    <button
                        onClick={() => onCancel && onCancel()}
                        type={"button"}
                        style={{color: "black", backgroundColor:"red", padding: "10px", marginTop: "10px", width: "100%"}}
                    >
                        {'CANCEL'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default Page;