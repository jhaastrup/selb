import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { formatNumber, toNumber, formatString } from 'app/lib/formatters';
import _ from 'lodash';
import {CloseIcon, ArrowLeft} from "app/components/icons";
import {Button} from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import getCardImage from 'app/lib/cardImages';


const options = [
    {
        id: 1,
        name: 'level 0',
        description: 'DEFAULT',
        status: 'completed',
        code: 'registration',
    },
    {
        id: 2,
        name: 'Level 1',
        description: 'bvn',
        status: undefined,
        code: 'bvn',
    },
    // {
    //     id: 3,
    //     description: 'Address',
    //     status: undefined,
    //     name: 'level 2',
    //     code: 'address',
    // },
];


const Page = ({dependencies, pageData = {}, onChangePage, updatePageData, setState}) => {
    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);
    const { bvn_validated = false, daily_withdrawal_limit = 0, monthly_withdrawal_limit = 0 } = dependencies?.kyc ?? {};
    const { verification: initialValue = bvn_validated ? 'bvn' : 'registration' } = pageData;

    return(
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-2"}>{'ACCOUNT VERIFICATION'}</p>
                <p className={"text-2xl font-semibold mb-2"}>{'Verify your information'}</p>
                <p className={"text-sm text-textGrey tracking-wide mb-2"}>{'Your level of verification increases your daily and monthly transaction limits.'}</p>
            </div>
            <Spacer className={"block h-4"} />
            <div className={"py-4"}>
                <Spacer className={"block h-2"} />
                {options.map((opt, idx) => {
                    const { name, code, id, description, status } = opt;
                        const isSelected = initialValue === code || (status && status === 'completed');
                        {/* const selectedStyle = isSelected ? { backgroundColor: theme.colors.white } : {}; */}
                        const isCompleted = (status && status === 'completed') || (bvn_validated && code === 'bvn');

                        return (
                            <Fragment key={idx}>
                                <div
                                    onClick={() => bvn_validated ? () => {} : updatePageData({verification: code})}
                                    className={`flex flex-row bg-backgroundGrey py-3 px-3 mb-4 rounded cursor-pointer`}
                                >
                                    <div className={"flex flex-row justify-between w-11/12 mr-4"}>
                                        <p className={"flex justify-center items-center text-sm tracking-wider"}>{formatString(name, 'uppercase')}</p>
                                        <p className={"text-textGrey flex justify-center items-center text-sm tracking-wider"}>{formatString(description, 'uppercase')}</p>
                                    </div>
                                    <div className={"flex justify-end items-center w-1/12"}>
                                        <div className={`flex justify-center items-center w-1/2 h-1/2 font-semibold border-8 border-white ${isCompleted ? 'bg-green': 'bg-backgroundGrey'} p-2 rounded-full `}></div>
                                    </div>
                                </div>
                            </Fragment>
                        )
                })}
            </div>
            <Spacer className={"block h-6"} />
            {initialValue && (
                <div className={"flex flex-col"}>
                    <div className={"py-2 border-b border-textGrey border-opacity-10"}>
                        <p className={"text-primary text-xs tracking-wider"}>{formatString('transaction limits', 'uppercase')}</p>
                    </div>
                    <div>
                        <div className={"mb-1 pt-4 flex flex-row items-center justify-center"}>
                            <div className={"flex flex-row w-full justify-between border-b border-textGrey border-opacity-10 pb-4"}>
                                <div className={"flex justify-center items-center uppercase text-xs text-textGrey tracking-wide"}>
                                    <p>{'DAILY LIMIT'}</p>
                                </div>
                                <div>
                                    <p>{`${formatNumber(daily_withdrawal_limit,'0,0.00',)}`}</p>
                                </div>
                            </div>
                        </div>
                        <div className={"mb-1 pt-4 flex flex-row items-center justify-center"}>
                            <div className={"flex flex-row w-full justify-between border-b border-textGrey border-opacity-10 pb-4"}>
                                <div className={"flex justify-center items-center uppercase text-xs text-textGrey tracking-wide"}>
                                    <p>{'MONTHLY LIMIT'}</p>
                                </div>
                                <div>
                                    <p>{`${formatNumber(monthly_withdrawal_limit,'0,0.00',)}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Spacer className={"block h-8"} />
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
                    onClick={() => onChangePage('bvn', {})}
                    type={"button"}
                    uclasses={"uppercase tracking-widest md:font-normal"}
                    disabled={bvn_validated}
                >
                    {"Continue"}
                </Button>
            </div>
            <Spacer className={"block h-8"}/>
        </div>
    );
};

export default Page;