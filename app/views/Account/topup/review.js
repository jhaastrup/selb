import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { formatNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { useQuery, useMutation } from '@apollo/client';
import { WALLET_DEPENDENCIES, VERIFY_TOPUP } from '../modules/queries';
import { CREATE_TOPUP, VALIDATE_TOPUP } from '../modules/mutations';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";



const Page = ({dependencies, pageData = {}, onChangePage, setState}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [cardKey, setCardKey] = useState();

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "amount",
        }))
    }, []);

    const { me = {}, dependencies: paymentOptions = [] } = dependencies;
    const { paymentProfile = {} } = me;
    const { amount, currency = 'NGN', payment_source_code } = pageData;

    const { data, loading: verifyLoading } = useQuery(VERIFY_TOPUP, {
        fetchPolicy: 'cache-and-network',
        variables: {
            amount,
            currency,
            payment_source_code,
        },
        onCompleted: (resp) => {
            const { verifyTopUpDetail: payload } = resp;
            console.log({ payload });
        },
        onError: (error) => {},
    });

    const [createTopUp, { loading }] = useMutation(CREATE_TOPUP, {
        onCompleted: (resp) => {
            const { createTopUp: payload } = resp;
            // const { card_key, payment_source_code } = pageData;
            const payData = { ...payload, payment_source_code, card_key: cardKey };
            onChangePage('pay', { payData });
        },
    });

    const initiateTopup = useCallback(() => {
        setModalVisible(false);
        const variables = {
            payment_source_code,
            amount,
            currency,
        };
        createTopUp({ variables });
    }, [amount, createTopUp, currency, payment_source_code]);

    const initiateFunding = useCallback(() => {
        console.log({ paymentOptions });
        if (paymentOptions.cards.length > 0 && payment_source_code === 'card') {
            onChangePage('options', {});
        } else {
            initiateTopup();
        }
    }, [initiateTopup, paymentOptions, payment_source_code, onChangePage]);

    if(verifyLoading || !data){
        return(
            <div className={"flex h-screen justify-center items-center"}>
                <Loading />
            </div>
        )
    }

    const { verifyTopUpDetail: topup } = data;

    console.log({ pageData, topup });
    const cards = [...paymentOptions.cards, {}];

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-2"}>{'REVIEW'}</p>
                <p className={"text-2xl font-semibold"}>{'Review and complete your transaction'}</p>
            </div>
            <Spacer className={"block h-6"} />
            <div className={"py-4"}>
                <p className={"uppercase text-xs tracking-wider border-b py-4 border-textGrey border-opacity-10"}>
                    {payment_source_code === 'card' ? 'FUND WITH DEBIT CARD' : 'FUND WITH BANK TRANSFER'}
                </p>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Amount"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium"}>{`\u20a6${formatNumber(topup.amount,'0,0.00',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Transaction Fee"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium"}>{`${formatNumber(topup.amount * topup.fee,'0,0.00[0]',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Amount to Pay"}</p>
                    </div>
                    <div>
                        <p className={"text-sm font-semibold"}>{`\u20a6${formatNumber(topup.payable,'0,0.00',)}`}</p>
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
                    onClick={() => initiateFunding()}
                    type={"button"}
                    uclasses={"uppercase tracking-wider md:font-normal"}
                    showLoading={loading}
                    disabled={loading}
                >
                    {"Fund Your Account"}
                </Button>
            </div>
            <Spacer className={"block h-3"} />
        </div>
    )
}

export default Page