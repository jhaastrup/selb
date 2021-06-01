import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { formatNumber, toNumber, formatString } from 'app/lib/formatters';
import _ from 'lodash';
import { useMutation } from '@apollo/client';
import { CREATE_TOPUP, VALIDATE_TOPUP } from '../modules/mutations';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";
import getCardImage from 'app/lib/cardImages';
import BankTransferIcon from 'public/images/icons/banks.svg';
import DebitCardIcon from 'public/images/icons/cards.svg';

const Page = ({
    dependencies,
    pageData = {},
    onChangePage,
    updatePageData,
    nextPage = 'pay',
    setState
}) => {
    const { payment_source_code = undefined, card_key = null, payment_data, fee } = pageData;
    console.log('===>', { pageData });
    const { paymentOptions } = dependencies;

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: 'review',
        }))
    }, []);

    const initiatePayment = () => {
        const updatedPayData = { ...payment_data, payment_source_code, card_key };
        console.log({ updatedPayData });
        onChangePage(nextPage, { payData: updatedPayData });
    };

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div className={"py-4"}>
                <p className={"uppercase text-primary text-xs mb-1 tracking-wider"}>{'Pay'}</p>
                <p className={"tracking-wide text-left text-xl font-semibold mb-1"}>{`How will you like to pay?`}</p>
                <p className={"text-sm text-textGrey tracking-wider"}>{'Select one of the payment options available to complete your transaction'}</p>
            </div>
            <Spacer className={"block h-8"} />
            <Fragment>
                <div
                    onClick={() => updatePageData({
                        payment_source_code: paymentOptions.account.payment_source_code,
                        card_key: paymentOptions.account.card_key,
                    })}
                    className={`flex flex-row ${payment_source_code && payment_source_code === paymentOptions.account.payment_source_code ? "bg-transluscent-primary" : "bg-backgroundGrey"} justify-between py-3 px-3 mb-4 rounded cursor-pointer`}
                >
                    <div className={"flex flex-col"}>
                        <p className={"flex justify-center items-center text-sm tracking-wider mb-2"}>{`${formatString('USE YOUR BALANCE', 'uppercase')}`}</p>
                        <p className={"text-textGrey flex text-sm tracking-wider"}>{`NGN ${formatNumber(paymentOptions.profile?.funds,'0,0.00',)}`}</p>
                    </div>
                    <div className={"flex justify-end items-center w-1/12"}>
                        <div className={`flex justify-center items-center w-1/2 h-1/2 font-semibold border-8 border-white ${payment_source_code && payment_source_code === paymentOptions.account.payment_source_code ? 'bg-primary': 'bg-backgroundGrey'} p-2 rounded-full `}></div>
                    </div>
                </div>
            </Fragment>
            {paymentOptions.cards.length > 0 && (
                <Fragment>
                    <Spacer className={"block h-8"} />
                    <div>
                        <p className={"tracking-wider text-sm text-textGrey"}>{"SAVED CARDS"}</p>
                        <Spacer className={"block h-2"} />
                        {paymentOptions.cards.map((opt, idx) => {
                            const { brand, payment_source_code: source, card_key: key, last4 } = opt;
                            const imageSrc = getCardImage(brand);
                            const name = `${brand} \u2022 \u2022 \u2022 \u2022 ${last4}`;
                            const selected = card_key && card_key === key;

                            return(
                                <Fragment key={idx}>
                                    <div
                                        onClick={() => updatePageData({ payment_source_code: source, card_key: key  })}
                                        className={`flex flex-row ${selected ? 'bg-transluscent-primary': 'bg-backgroundGrey'} py-3 px-3 mb-4 rounded justify-between cursor-pointer`}
                                    >
                                        <div className={"flex flex-row justify-center items-center"}>
                                            <img src={imageSrc} className={"flex justify-center items-center w-6 h-6"}  />
                                            <Spacer className={"block w-2"} />
                                            <p className={"flex justify-center items-center text-sm tracking-wider"}>{formatString(name, 'uppercase')}</p>
                                        </div>
                                        <div className={"flex justify-end items-center"}>
                                            <div className={`flex justify-center items-center w-1/2 h-1/2 font-semibold border-8 border-white ${selected ? 'bg-primary': 'bg-backgroundGrey'} p-2 rounded-full `}></div>
                                        </div>
                                    </div>
                                </Fragment>
                            )
                        })}
                    </div>
                </Fragment>
            )}
            <Spacer className={"block h-8"} />
            <div>
                <p className={"tracking-wider text-sm text-textGrey"}>{"OTHERS"}</p>
                <Spacer className={"block h-2"} />
                {_.filter(paymentOptions.topup_options, (elem) => 
                    ['card', 'virtual'].includes(elem.payment_source_code),
                ).map((opt, idx) => {
                    const IconComponent = opt.code === 'card' ? DebitCardIcon : BankTransferIcon;
                    const { name, payment_source_code: source, card_key: key } = opt;
                    const selected = payment_source_code && payment_source_code === source && !card_key;

                    return (
                        <Fragment key={idx}>
                            <div
                                onClick={() => updatePageData({ payment_source_code: source, card_key: key  })}
                                className={`flex flex-row ${selected ? 'bg-transluscent-primary': 'bg-backgroundGrey'} py-3 px-3 mb-4 rounded justify-between cursor-pointer`}
                            >
                                <div className={"flex flex-row justify-center items-center"}>
                                    <IconComponent className={"w-10 h-10"} />
                                    <Spacer className={"block w-2"} />
                                    <p className={"flex justify-center items-center text-sm tracking-wider"}>{formatString(name, 'uppercase')}</p>
                                </div>
                                <div className={"flex justify-end items-center"}>
                                    <div className={`flex justify-center items-center w-1/2 h-1/2 font-semibold border-8 border-white ${selected ? 'bg-primary': 'bg-backgroundGrey'} p-2 rounded-full `}></div>
                                </div>
                            </div>
                        </Fragment>
                    )
                })}
            </div>
            <Spacer className={"block h-4"} />
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
                    onClick={() => initiatePayment()}
                    type={"button"}
                    uclasses={"uppercase tracking-wider md:font-normal"}
                    disabled={!payment_source_code}
                >
                    {`PAY \u20a6${formatNumber(fee, '0,0.00')}`}
                </Button>
            </div>
            <Spacer className={"block h-3"} />
        </div>
    )
}

export default Page;