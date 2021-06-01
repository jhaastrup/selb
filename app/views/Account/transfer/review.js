import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { formatNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { useQuery, useMutation } from '@apollo/client';
import { TRANSFER_TO_BANK, TRANSFER_FUND } from '../modules/mutations';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";

const Page = ({dependencies, pageData = {}, onChangePage, setState}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { me = {}, kyc = {} } = dependencies || {};
    const { daily_withdrawal_limit = 0, monthly_withdrawal_limit = 0 } = kyc;


    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "user",
        }))
    }, []);
    
    const {
        amount,
        currency = 'NGN',
        bank_code = '',
        account_number = '',
        account_name = '',
        description = '',
        bank = {},
        contact = {},
        channel = 'wallet',
    } = pageData;

    const [bankTransfer, { loading: bankTransferLoading }] = useMutation(TRANSFER_TO_BANK, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log('testing sending using bank ===>', { data });
            const { bankTransfer: payload } = data;
            const { payment_data } = payload;
            const { payment_source_code, card_key } = dependencies.dependencies.account;
            const payData = {
                ...payment_data,
                payment_source_code,
                card_key,
            };
            console.log(payData);
            onChangePage('pay', { payData });
        },
        onError: (errors) => {
            console.log({ errors });
        },
    });

    const [createRequest, { loading: walletTransferLoading }] = useMutation(TRANSFER_FUND, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log('testing sending to wallet ===>', { data });
            const { createRequest: payload } = data;

            const { payment_data } = payload;
            const { payment_source_code, card_key } = dependencies.dependencies.account;
            const payData = {
                ...payment_data,
                payment_source_code,
                card_key,
            };
            console.log({ payData });
            onChangePage('pay', { payData });
        },
        onError: (errors) => {
            console.log({ errors });
        },
    });

    const initiateBankTransfer = useCallback(() => {
        const rule = 'instant_payment_rule';
        bankTransfer({
            variables: {
                rule: rule,
                target_type: 'bank',
                requires_shipping: false,
                bank_account: {
                    account_name: account_name,
                    account_number: account_number,
                    bank_code: bank_code,
                },
                request_type: 'send',
                country_code: 'NG',
                amount: parseFloat(amount),
                description,
                currency_code: currency,
            },
        });
    }, [account_name, account_number, amount, bankTransfer, bank_code, currency, description]);

    const initiateWalletTransfer = useCallback(() => {
        const rule = 'instant_payment_rule';
        createRequest({
            variables: {
                rule: rule,
                request_type: 'send',
                target: contact.raw,
                country_code: 'NG',
                amount: parseFloat(amount),
                description,
                currency_code: currency,
            },
        });
    }, [amount, contact.value, createRequest, currency, description]);

    const { paymentProfile = {} } = me;

    console.log({ pageData });
    const transferFee = channel === 'bank' ? 25 : 0;

    const transferLoading = bankTransferLoading || walletTransferLoading;

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-2"}>{'REVIEW'}</p>
                <p className={"text-2xl font-semibold"}>{'Review and complete your transfer'}</p>
            </div>
            <Spacer className={"block h-12"} />
            <div className={"py-4"}>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Amount"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`\u20a6${formatNumber(amount,'0,0.00',)}`}</p>
                    </div>
                </div>
                {channel === "bank" ? (
                    <Fragment>
                        <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                            <div>
                                <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Bank"}</p>
                            </div>
                            <div>
                                <p className={"text-xs text-right font-medium tracking-wider"}>{`${bank.name}`}</p>
                            </div>
                        </div>
                        <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                            <div>
                                <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Account Name"}</p>
                            </div>
                            <div>
                                <p className={"text-xs text-right font-medium tracking-wider"}>{`${account_name}`}</p>
                            </div>
                        </div>
                        <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                            <div>
                                <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Account Number"}</p>
                            </div>
                            <div>
                                <p className={"text-xs text-right font-medium tracking-wider"}>{`${account_number}`}</p>
                            </div>
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                            <div>
                                <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Recipient"}</p>
                            </div>
                            <div>
                                <p className={"text-xs text-right font-medium tracking-wider"}>{`${contact?.value}`}</p>
                                <p className={"text-xs text-right text-textGrey font-medium tracking-wider"}>{`${contact?.name || ''}`}</p>
                            </div>
                        </div>
                    </Fragment>
                )}
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Transfer Fee"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{transferFee ? `${formatNumber(transferFee, '0,0.00')}` : '0.00'}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Amount to Pay"}</p>
                    </div>
                    <div>
                        <p className={"text-sm font-semibold tracking-wider"}>{`\u20a6${formatNumber(transferFee + amount,'0,0.00',)}`}</p>
                    </div>
                </div>
            </div>
            <Spacer className={"block h-24"} />
            <div className={"flex flex-col"}>
                <p className={"text-textGrey text-xs"}>By completing this transaction, I represent that I have read, understand, and agree to the Sendbox{' '}
                    <a className={"text-primary"} href={'https://sendbox.co/legal/privacy'} target={"_blank"}>
                            Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a className={"text-primary"} href={'https://sendbox.co/legal/terms'} target={"_blank"}>
                        Terms of Service
                    </a>
                </p>
                <Spacer className={"block h-4"}/>
                <Button
                    onClick={() => (channel === 'bank' ? initiateBankTransfer() : initiateWalletTransfer())}
                    type={"button"}
                    uclasses={"uppercase tracking-wider md:font-normal"}
                    showLoading={transferLoading}
                    disabled={transferLoading}
                >
                    {"Complete Transfer"}
                </Button>
            </div>
            <Spacer className={"block h-3"} />
        </div>
    )
}

export default Page