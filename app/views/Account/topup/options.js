import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { formatNumber, toNumber, formatString } from 'app/lib/formatters';
import _ from 'lodash';
import { useMutation } from '@apollo/client';
import { CREATE_TOPUP, VALIDATE_TOPUP } from '../modules/mutations';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";
import getCardImage from 'app/lib/cardImages';


const Page = ({dependencies, pageData = {}, onChangePage, updatePageData}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [cardKey, setCardKey] = useState();
    const { dependencies: paymentOptions = [] } = dependencies;
    const { amount, currency = 'NGN', payment_source_code, card_key } = pageData;

    const [createTopUp, { loading }] = useMutation(CREATE_TOPUP, {
        onCompleted: (resp) => {
            const { createTopUp: payload } = resp;
            // const { card_key, payment_source_code } = pageData;
            const payData = { ...payload, payment_source_code, card_key };
            onChangePage('pay', { payData });
        },
    });

    const initiateTopup = useCallback(() => {
        const variables = {
            payment_source_code,
            amount,
            currency,
            card_key,
        };
        console.log('inside <topup></topup>', { variables });
        createTopUp({ variables });
    }, [amount, createTopUp, currency, payment_source_code, card_key]);

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-2 tracking-wider"}>{'Pay'}</p>
                <p className={"text-2xl font-semibold"}>{'How will you like to fund your account?'}</p>
            </div>
            <Spacer className={"block h-8"} />
            <Fragment>
                <div className={"py-4"}>
                    <Spacer className={"block h-2"} />
                    {paymentOptions.cards.map((opt, idx) => {
                        const { brand, payment_source_code: source, card_key: key, last4 } = opt;
                        const imageSrc = getCardImage(brand);
                        const name = `${brand} \u2022 \u2022 \u2022 \u2022 ${last4}`;
                        const selected = card_key && card_key === key;

                        return(
                            <Fragment key={idx}>
                                <div
                                    onClick={() => updatePageData({payment_source_code: source, card_key: key })}
                                    className={`flex flex-row ${selected ? 'bg-transluscent-green': 'bg-backgroundGrey'} py-3 px-3 mb-4 rounded justify-between cursor-pointer`}
                                >
                                    <div className={"flex flex-row justify-center items-center"}>
                                        <img src={imageSrc} className={"flex justify-center items-center w-6 h-6"}  />
                                        <Spacer className={"block w-2"} />
                                        <p className={"flex justify-center items-center text-sm tracking-wider"}>{formatString(name, 'uppercase')}</p>
                                    </div>
                                    <div className={"flex justify-end items-center"}>
                                        <div className={`flex justify-center items-center w-1/2 h-1/2 font-semibold border-8 border-white ${selected ? 'bg-green': 'bg-backgroundGrey'} p-2 rounded-full `}></div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })}
                </div>
            </Fragment>
            <Fragment>
                <div className={"py-4"}>
                    <Spacer className={"block h-2"} />
                    {_.filter(paymentOptions.topup_options, {payment_source_code: "card"}).map((opt, idx) => {
                        const { name, payment_source_code: source, card_key: key } = opt;
                        const selected = payment_source_code && payment_source_code === source && !card_key;

                        return(
                            <Fragment key={idx}>
                                <div
                                    onClick={() => updatePageData({payment_source_code: source, card_key: key })}
                                    className={`flex flex-row ${selected ? 'bg-transluscent-green': 'bg-backgroundGrey'} py-3 px-3 mb-4 rounded justify-between cursor-pointer`}
                                >
                                    <div className={"flex flex-row justify-center items-center"}>
                                        <p className={"flex justify-center items-center text-sm tracking-wider"}>{formatString(name, 'uppercase')}</p>
                                    </div>
                                    <div className={"flex justify-end items-center"}>
                                        <div className={`flex justify-center items-center w-1/2 h-1/2 font-semibold border-8 border-white ${selected ? 'bg-green': 'bg-backgroundGrey'} p-2 rounded-full `}></div>
                                    </div>
                                </div>
                                <Spacer className={"block h-4"} />
                            </Fragment>
                        )
                    })}
                </div>
            </Fragment>
            <Spacer className={"block h-20"} />
            <div className={"flex flex-col"}>
                <Button
                    onClick={() => initiateTopup()}
                    type={"button"}
                    uclasses={"uppercase tracking-widest md:font-normal"}
                >
                    {"Confirm and pay"}
                </Button>
            </div>
        </div>
    )   
}

export default Page;