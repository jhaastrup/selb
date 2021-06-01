import React, { Fragment, useState, useCallback, useEffect, useRef } from 'react';
import { formatNumber, formatString } from 'app/lib/formatters';
import _ from 'lodash';
import { VALIDATE_TRANSACTION } from './modules/mutations';
import { useMutation } from '@apollo/client';
import * as copy from "copy-to-clipboard";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";
import TrackingIcon from "public/images/tabs/receive-money.svg";

const Page = ({onProceed, onCancel, transData, dependencies = {}}) => {
    const [checkAgain, setCheckAgain] = useState(false);
    const [counter, setCounter] = useState(60);
    const [copied, setCopied] = useState(false);


    const [validateTransaction, { loading }] = useMutation(VALIDATE_TRANSACTION, {
        onCompleted: (data) => {
            const { validateTransaction: validateTransactionResponse } = data;
            console.log({ validateTransactionResponse });
            if (validateTransactionResponse.page === 'success') {
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
                    const { txref, reference_code: reference } = transData;
                    console.log('sending out another probe', counter % 30, { txref, reference });
                    validateTransaction({ variables: {txref, reference} });
                }
                setCounter(counter - 1);
            }, 1000);

        return () => clearInterval(timer);
    }, [checkAgain, counter, loading, transData, validateTransaction]);

    const checkStatus = useCallback(() => {
        setCounter(60);
        setCheckAgain(true);
    }, []);

    const copyNumber = useCallback((value) => {
        copy(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }, []);

    const { payment_instructions = {} } = transData;
    const { bank_code = '', account_name = '', account_number = '', bank_name = '' } = payment_instructions;
    // const message = payment_instructions.message || 'Transfer the requested amount to the bank account displayed below';
    // const message = 'Transfer the requested amount to the bank account displayed below';

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-2"} />
            <div className={"flex justify-center items-center"}>
                <TrackingIcon className={"w-28 h-28"} />
            </div>
            <Spacer className={"block h-8"} />
            <div className={"flex flex-col justify-center items-center"}>
                <p className={"text-center tracking-wider text-xs font-semibold"}>{'TRANSFER YOUR FUNDS TO THE BANK ACOUNT BELOW. ENSURE YOU INCLUDE THE CODE BELOW IN YOUR BANK TRANSFER NARRATION.'}</p>
            </div>
            <Spacer className={"block h-6"} />
            <div 
                onClick={() => copyNumber(bank_code)}
                className={"flex justify-center items-center bg-transluscent-primary rounded-md p-4 cursor-pointer"}>
                <p className={"text-primary tracking-widest text-3xl font-semibold"}>{copied ? "COPIED!!!" : bank_code}</p>
            </div>
            <Spacer className={"block h-6"} />
            <div className={"py-4"}>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-sm tracking-wider"}>{"Account Number"}</p>
                    </div>
                    <div>
                        <p className={"text-sm font-semibold tracking-wider"}>{`${account_number && formatString(account_number,'uppercase',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-sm tracking-wider"}>{"Bank"}</p>
                    </div>
                    <div>
                        <p className={"text-sm font-medium tracking-wider"}>{`${bank_name && formatString(bank_name,'uppercase',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-left text-textGrey text-sm tracking-wider"}>{"Account Name"}</p>
                    </div>
                    <div>
                        <p className={"text-sm text-right font-medium tracking-wider"}>{`${account_name && formatString(account_name,'uppercase',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-sm tracking-wider"}>{"Amount"}</p>
                    </div>
                    <div>
                        <p className={"text-sm font-semibold tracking-wider"}>{`\u20a6${formatNumber(transData.amount,'0,0.00',)}`}</p>
                    </div>
                </div>
            </div>
            <Spacer className={"block h-12"} />
            <div className={"flex flex-col"}>
                <p className={"text-textGrey text-sm text-center"}>
                {checkAgain === true
                            ? `${counter} secs`
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
        //         <p style={{textAlign: "center"}}>
        //             {
        //                 'ENSURE YOU INCLUDE THE CODE BELOW IN YOUR BANK TRANSFER NARRATION'
        //             }
        //         </p>
        //     </div>
        //     <div style={{height:"2rem"}}></div>
        //     <div style={{width: "100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
        //         <div 
        //             onClick={() => copyNumber(virtual_account.account_number)}
        //             style={{backgroundColor: "red", width: "80%", padding: "0.5rem", borderRadius: "0.5rem", cursor: "pointer" }}
        //         >
        //             <p style={{fontSize: "1.5rem", color: "white", textAlign: "center"}}>{copied ? "COPIED!!!" : bank_code}</p>
        //         </div>
        //     </div>
        //     <div style={{height:"2rem"}}></div>
        //     <div>
        //         <div 
        //             style={{
        //                 display: "flex", 
        //                 padding: "0.75rem 0rem",
        //                 flexDirection: "row",
        //                 justifyContent: "space-between",
        //                 alignItems: "center"
        //             }}
        //         >
        //             <p>{"ACCOUNT NUMBER"}</p>
        //             <p>{"0002715833"}</p>
        //         </div>
        //         <div 
        //             style={{
        //                 display: "flex", 
        //                 padding: "0.75rem 0rem",
        //                 flexDirection: "row",
        //                 justifyContent: "space-between",
        //                 alignItems: "center"
        //             }}
        //         >
        //             <p>{"BANK"}</p>
        //             <p>{"Guaranty Trust Bank"}</p>
        //         </div>
        //         <div 
        //             style={{
        //                 display: "flex", 
        //                 padding: "0.75rem 0rem",
        //                 flexDirection: "row",
        //                 justifyContent: "space-between",
        //                 alignItems: "center"
        //             }}
        //         >
        //             <p>{"ACCOUNT NAME"}</p>
        //             <p>{"Sendbox Software Tech."}</p>
        //         </div>
        //         <div 
        //             style={{
        //                 display: "flex", 
        //                 padding: "0.75rem 0rem",
        //                 flexDirection: "row",
        //                 justifyContent: "space-between",
        //                 alignItems: "center"
        //             }}
        //         >
        //             <p>Amount</p>
        //             <p>{`\u20a6${formatNumber(transData.amount,'0,0.00',)}`}</p>
        //         </div>
        //     </div>
        //     <div style={{height:"2rem"}}></div>
        //     <div>
        //         <p style={{textAlign: "center"}}>
        //             {checkAgain === true
        //                     ? `${counter} secs`
        //                     : 'After you make the transfer, please press the button below \n to verify your payment'}
        //         </p>
        //         <div style={{height:"0.5rem"}}></div>
        //         <div>
        //             <button
        //                 onClick={() => checkStatus()}
        //                 type={"button"}
        //                 style={{color: "#fff", backgroundColor:"black", padding: "10px", marginTop: "10px", width: "100%"}}
        //             >
        //                 {checkAgain ? 'VERIFYING...' : 'I HAVE MADE THE TRANSFER'}
        //             </button>
        //         </div> 
        //     </div>
        // </>
    );
}

export default Page;