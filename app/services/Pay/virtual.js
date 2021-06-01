import React, { Fragment, useState, useCallback, useEffect, useRef } from 'react';
import { formatNumber, formatString } from 'app/lib/formatters';
import _ from 'lodash';
import { VALIDATE_TRANSACTION } from './modules/mutations';
import { useMutation } from '@apollo/client';
import * as copy from "copy-to-clipboard";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";
import BankTransferIcon from 'public/images/icons/banks.svg';
import {CopyIcon} from "app/components/icons";

const Page = ({onProceed, onCancel, transData, dependencies = {} }) => {
    const [checkAgain, setCheckAgain] = useState(false);
    const [counter, setCounter] = useState(120);
    const [copied, setCopied] = useState(false);


    const [validateTransaction, { loading }] = useMutation(VALIDATE_TRANSACTION, {
        onCompleted: (data) => {
            const { validateTransaction: validateTransactionResponse } = data;
            console.log({ validateTransactionResponse });
            if (validateTransactionResponse.page !== 'virtual') {
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
                if (!loading && counter % 30 === 0) {
                    console.log('sending out another probe', counter % 30);
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


    const copyNumber = useCallback((value) => {
        copy(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }, []);

    const { payment_instructions = { virtual_bank_accounts: [] } } = transData;
    const virtual_account = payment_instructions.virtual_bank_accounts[0] || {};
    // const message = payment_instructions.message || 'Transfer the requested amount to the bank account displayed below';
    const message = 'Transfer the requested amount to the bank account displayed below to complete your transaction.';

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-10"} />
            <div className={"flex justify-center items-center"}>
                <BankTransferIcon className={"w-28 h-28"} />
            </div>
            <Spacer className={"block h-4"} />
            <div className={"flex flex-col justify-center items-center"}>
                <p className={"text-center tracking-wider text-sm font-semibold"}>{message}</p>
            </div>
            <Spacer className={"block h-8"} />
            <div className={"bg-transluscent-primary p-4 rounded mb-4"}>
                <div className={"flex flex-row justify-between"}>
                    <div className={"text-black"}>
                        <p className={"text-xs uppercase py-1 tracking-wide"}>{`${virtual_account.bank_name || '--'}`}</p>
                        <p className={"text-3xl text-primary font-semibold py-1 tracking-wider"}>{virtual_account.account_number || '--'}</p>
                        <p className={"text-xs py-1 tracking-wide"}>{`SENDBOX - ${virtual_account.account_name}`}</p>
                    </div>
                    <div 
                        onClick={() => copyNumber(virtual_account.account_number)}
                        className={"flex justify-center items-center text-white cursor-pointer"}
                    >
                        <div className={"text-primary focus:outline-none"}>
                            {copied ? "COPIED" : <CopyIcon />}
                        </div>
                        {/* <p className={"bg-transluscent-white py-2 px-4 rounded tracking-wider"}>{copied ? "COPIED!!!" : "COPY"}</p> */}
                    </div>
                </div>
            </div>
            <Spacer className={"block h-20"} />
            <div className={"flex flex-col"}>
                <p className={"text-textGrey text-sm text-center"}>
                {checkAgain === true
                            ? `Verifying in ${counter} secs`
                            : 'After you make the transfer, please press the button below \n to verify your payment'}
                </p>
                <Spacer className={"block h-4"}/>
                <Button
                    onClick={() => checkStatus()}
                    showLoading={checkAgain}
                    disabled={checkAgain}
                    type={"button"}
                    uclasses={"uppercase tracking-wider md:font-normal"}
                >
                    {checkAgain ? 'VERIFYING...' : 'I HAVE MADE THE TRANSFER'}
                </Button>
            </div>
            <Spacer className={"block h-4"}/>
        </div>
        // <>
        //     <div style={{padding: "1rem 0rem"}}>
        //         <p>{message}</p>
        //     </div>
        //     <div style={{height:"2rem"}}></div>
        //     <div>
        //         {virtual_account && virtual_account.account_number && (
        //             <div style={{display: "flex", justifyContent: "space-between"}}>
        //                 <div>
        //                     <p>{`${virtual_account.bank_name || '--'}`}</p>
        //                     <p>{virtual_account.account_number || '--'}</p>
        //                     <p>{`SENDBOX - ${virtual_account.account_name}`}</p>
        //                 </div>
        //                 <div style={{width:"1rem"}}></div>
        //                 <div 
        //                     onClick={() => copyNumber(virtual_account.account_number)} 
        //                     style={{display: "flex", justifyContent:"center", alignSelf:"center", cursor: "pointer"}}
        //                 >
        //                     {copied ? "COPIED!!!" : "CLICK TO COPY"}
        //                 </div>
        //             </div>
        //         )}
        //     </div>
        //     <div style={{height:"2rem"}}></div>
        //     <div>
        //         <p>
        //             {checkAgain === true
        //                     ? `Verifying in ${counter} secs`
        //                     : 'After you make the transfer, please press the button below \n to verify your payment'}
        //         </p>
        //         <div style={{height:"2rem"}}></div>
        //         <div>
        //             <button
        //                 type={"button"}
        //                 onClick={() => checkStatus()}
        //                 style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px", width: "100%"}}
        //             >
        //                 {checkAgain ? '' : 'I HAVE MADE THE TRANSFER'}
        //             </button>
        //         </div>
        //     </div>
        // </>
    );
};

export default Page;