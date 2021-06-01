import React, { useState, useEffect } from 'react';

import { VALIDATE_TRANSACTION } from './modules/mutations';
import { useMutation } from '@apollo/client';
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";
import { ShieldIcon } from "app/components/icons"

import Modal from "app/services/modal";

const Page = ({ onProceed, onCancel, transData }) => {
    const [checkAgain, setCheckAgain] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    const [validateTransaction, { loading }] = useMutation(VALIDATE_TRANSACTION, {
        onCompleted: (data) => {
            const { validateTransaction: validateTransactionResponse } = data;
            console.log({ validateTransactionResponse });
            if (!['ongoing', 'pending', 'open_url'].includes(validateTransactionResponse.page)) {
                setCheckAgain(false);
                setModalVisible(false);
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
                if (!checkAgain) {
                    clearInterval(timer);
                }
                console.log({ modalVisible });
                // Check logic only when not loading and every 30 seconds in between
                if (!loading) {
                    console.log('sending out another probe');
                    validateTransaction({ variables: transData });
                }
            }, 1000);

        return () => clearInterval(timer);
    }, [checkAgain, loading, modalVisible, transData, validateTransaction]);

    const onAuthorize = () => {
        window.open(data.url, "_blank")
        // setModalVisible(true);
        setCheckAgain(true);
        console.log('starting the long polling process here');
    };

    const cancel = () => {
        setModalVisible(false);
        setCheckAgain(false);
        onCancel && onCancel();
    };

    const { data = {} } = transData;
    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-8"} />
            <div>
                <div className={"flex justify-center items-center"}>
                    <ShieldIcon color={"rgba(237, 47, 89, 1)"} size={80}/>
                </div>
                <Spacer className={"block h-14"} />
                <div className={"flex flex-col justify-center items-center"}>
                    <p className={"text-lg text-center font-semibold tracking-wider"}>{'Please click the button below to authenticate with your bank'}</p>
                    <Spacer className={"block h-2"} />
                    {/* <p className={"text-textGrey tracking-wide"}>{'Your recipient will get notified shortly.'}</p> */}
                </div>
                <Spacer className={"block h-20"} />
                <div className={"flex justify-center items-center"}>
                    <Button
                        type={"button"}
                        onClick={() => onAuthorize(true)}
                        uclasses={"bg-primary border-primary rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8"}
                        disabled={loading}
                    >
                        {checkAgain ? 'AUTHORIZING' : 'AUTHENTICATE'}
                    </Button>
                </div>
                <Spacer className={"block h-10"} />
                <div className={"flex justify-center items-center"}>
                    <Button
                        type={"button"}
                        onClick={() => onCancel && onCancel()}
                        uclasses={"text-primary bg-transparent border-primary rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8"}
                    >
                        {"Cancel"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Page;