import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { formatNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { useQuery, useMutation } from '@apollo/client';
import { REQUEST_BILL_PAYMENT } from '../modules/mutations';
import { VERIFY_CUSTOMER } from '../modules/queries';

const Page = ({dependencies, pageData = {}, onChangePage}) => {
    console.log({pageData})
    const { me = {}, dependencies: paymentOptions = [] } = dependencies;
    const { paymentProfile = {} } = me;
    const {
        amount,
        currency = 'NGN',
        payment_code,
        service_id,
        customer_ref,
        payment_source_code = 'account',
        category,
    } = pageData;

    const { data, loading: verifyLoading, error } = useQuery(VERIFY_CUSTOMER, {
        fetchPolicy: 'cache-and-network',
        variables: {
            amount,
            payment_code,
            customer_ref,
        },
        onCompleted: (resp) => {
            const { verifyBillingCustomer: payload } = resp;
            console.log({ payload });
        },
        onError: (error) => {},
    });

    const [requestBillingPayment, { loading, error: billingError }] = useMutation(REQUEST_BILL_PAYMENT, {
        onCompleted: (resp) => {
            const { requestBillingPayment: payload } = resp;
            const { payment_data } = payload;
            const payData = {
                ...payment_data,
                payment_source_code,
            };
            console.log({ payData });
            onChangePage('pay', { payData });
        },
        onError: (errors) => {
            console.log({ errors });
        },
    });

    const initiatePurchase = useCallback(() => {
        const variables = {
            service_id,
            payment_source_code,
            amount,
            currency,
            customer_ref
        };
        requestBillingPayment({ variables });
    }, [amount, requestBillingPayment, currency, payment_source_code]);

    if(verifyLoading || !data){
        return(
            <div style={{width: "60%", margin:"10rem auto"}}>
                Verifying...
            </div>
        )
    }

    if (error || billingError) {
        return (
            <div style={{display: "block", overflow: "auto"}}>
                <div style={{height:"2rem"}}></div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <div style={{padding: "1.5rem", alignSelf: "center", width: "440px", maxWidth: "100%"}}>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            <div>
                                <p>{'Error'}</p>
                                <p>{'Transaction verification was not successful. Please check your values or try again later.'}</p>
                            </div>
                            <div style={{height:"2rem"}}></div>
                            <div>
                                <button
                                    type={"button"}
                                    onClick={() => onChangePage("service", {})}
                                    style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px", width: "100%"}}
                                >
                                    {"TRY AGAIN"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const { verifyBillingCustomer: topup } = data;

    console.log({ pageData, topup });

    return (
        <div style={{display: "block", overflow: "auto"}}>
            <div style={{height:"2rem"}}></div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{padding: "1.5rem", alignSelf: "center", width: "440px", maxWidth: "100%"}}>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <div>
                            <p>{'REVIEW'}</p>
                            <p>{'Review and complete your transaction'}</p>
                        </div>
                        <div style={{height:"4rem"}}></div>
                        <div>
                            <p>{category === 'airtime' ? 'AIRTIME' : 'ELECTRICITY'}</p>
                            {topup && topup.customer_name && (
                                <>
                                    <div 
                                        style={{
                                            display: "flex", 
                                            padding: "0.75rem 0rem",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >
                                        <p>{"NAME"}</p>
                                        <p>{topup.customer_name || '-'}</p>
                                    </div>
                                </>
                            )}
                            <div 
                                style={{
                                    display: "flex", 
                                    padding: "0.75rem 0rem",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <p>{category === 'airtime' ? 'PHONE NUMBER' : 'METER NUMBER'}</p>
                                <p>{topup.customer_ref || "-"}</p>
                            </div>
                            <div 
                                style={{
                                    display: "flex", 
                                    padding: "0.75rem 0rem",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <p>AMOUNT</p>
                                <p>{`\u20a6${formatNumber(topup.amount,'0,0.00[0]',)}`}</p>
                            </div>
                            <div 
                                style={{
                                    display: "flex", 
                                    padding: "0.75rem 0rem",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <p>SERVICE CHARGE</p>
                                <p>{`\u20a6${formatNumber(topup.service_charge,'0,0.00',)}`}</p>
                            </div>
                            <div 
                                style={{
                                    display: "flex", 
                                    padding: "0.75rem 0rem",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <p>AMOUNT TO PAY</p>
                                <p>{`\u20a6${formatNumber(topup.total_amount,'0,0.00',)}`}</p>
                            </div>
                        </div>
                        <div style={{height:"2rem"}}></div>
                        <div>
                            <p>
                                By completing this transaction, I represent I have read, understand, and agree to the Sendbox{' '}
                                <a href={'https://sendbox.co/legal/privacy'}>
                                    Privacy Policy
                                </a>{' '}
                                and{' '}
                                <a href={'https://sendbox.co/legal/terms'}>
                                    Terms of Service
                                </a>
                            </p>
                            <div style={{height:"2rem"}}></div>
                            <button
                                onClick={() => initiatePurchase()}
                                style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px", width: "100%"}}

                            >
                                {"COMPLETE YOUR PURCHASE"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;