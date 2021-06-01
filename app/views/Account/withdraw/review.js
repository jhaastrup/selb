import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { formatNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { useQuery, useMutation } from '@apollo/client';
import { WITHDRAW_FUND } from '../modules/mutations';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";

const Page = ({dependencies, pageData = {}, onChangePage, setState}) => {
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "banks",
        }))
    }, []);

    const { me = {}, banks = { results: [] } } = dependencies;
    const transferFee = 25.0;
    const { amount, currency = 'NGN', bank_account_id } = pageData;
    const bank_account = banks.results.find((elem) => elem.pk === bank_account_id);

    const [requestWithdrawal, { loading }] = useMutation(WITHDRAW_FUND, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log('testing sending to wallet ===>', { data });
            const { requestWithdrawal: payload } = data;
            onChangePage('success', {});
        },
        onError: (errors) => {
            console.log({ errors });
        },
    });

    const initiateWithdrawal = () => {
        const variables = { bank_account_id, amount: amount + transferFee, currency };
        requestWithdrawal({ variables });
    };

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-2"}>{'REVIEW'}</p>
                <p className={"text-2xl font-semibold"}>{'Review and complete your transfer'}</p>
            </div>
            <Spacer className={"block h-8"} />
            <div className={"py-4"}>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Amount"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium"}>{`\u20a6${formatNumber(amount,'0,0.00',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Bank"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${bank_account.bank.name}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Account Name"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${bank_account.account_name}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Account Number"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${bank_account.account_number}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Transfer Fee"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium"}>{transferFee ? `${formatNumber(transferFee, '0,0.00')}` : '0.00'}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Amount To Pay"}</p>
                    </div>
                    <div>
                        <p className={"text-sm font-semibold"}>{`\u20a6${formatNumber(transferFee + amount,'0,0.00',)}`}</p>
                    </div>
                </div>
            </div>
            <Spacer className={"block h-20"} />
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
                    onClick={() => initiateWithdrawal()}
                    type={"button"}
                    uclasses={"uppercase tracking-widest md:font-normal"}
                >
                    {"Withdraw"}
                </Button>
            </div>
            <Spacer className={"block h-3"} />
        </div>
    )
}

export default Page