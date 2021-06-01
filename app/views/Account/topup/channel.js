import React, { Fragment, useState, useEffect, useCallback } from 'react';
import _ from "lodash";
import { formatNumber } from "app/lib/formatters";
import * as copy from "copy-to-clipboard";
import { Spacer } from "app/components/assets";

import { ChevronForward } from "app/components/icons"
import BankTransferIcon from 'public/images/icons/banks.svg';
import DebitCardIcon from 'public/images/icons/cards.svg';

const Page = ({onChangePage, pageData = {}, dependencies, setState}) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);

    const {currency = "NGN"} = pageData;
    const { me = {}, dependencies: paymentOptions } = dependencies;
    const { paymentProfile = {} } = me;

    const copyNumber = useCallback((value) => {
        copy(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }, []);

    const virtual_account =
        paymentProfile.virtual_bank_accounts && paymentProfile.virtual_bank_accounts.length > 0
            ? paymentProfile.virtual_bank_accounts[0]
            : {};
    
    // console.log({ virtual_account });
    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-4"} />
            <div className={"my-8 flex flex-col justify-center items-center"}>
                <p className={"text-2xl font-semibold mb-4"}>{'How would you like to fund your account?'}</p>
                <p className={"text-textGrey text-sm font-normal "}>{'Fund your account by transferring money into the account number below or through alternative channels provided.'}</p>
            </div>
            <Spacer className={"block h-4"} />
            <Fragment>
                {virtual_account && virtual_account.account_number && (
                    <div className={"bg-primary p-4 rounded mb-4"}>
                        <div className={"flex flex-row justify-between"}>
                            <div className={"text-white"}>
                                <p className={"text-xs uppercase py-1 tracking-wide"}>{`${virtual_account.bank_name || '--'}`}</p>
                                <p className={"text-3xl font-semibold py-1 tracking-wider"}>{virtual_account.account_number || '--'}</p>
                                <p className={"text-xs py-1 tracking-wide"}>{`SENDBOX - ${virtual_account.account_name}`}</p>
                            </div>
                            <div 
                                onClick={() => copyNumber(virtual_account.account_number)}
                                className={"flex justify-center items-center text-white cursor-pointer"}
                            >
                                <p className={"bg-transluscent-white py-2 px-4 rounded tracking-wider"}>{copied ? "COPIED!!!" : "COPY"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Fragment>
            <Spacer className={"block h-4"} />
            <Fragment>
                <div className={"py-4"}>
                    {paymentOptions.topup_options.map((opt, idx) => {
                        const IconComponent = opt.code === 'card' ? DebitCardIcon : BankTransferIcon;
                        const { payment_source_code } = opt;
                        const name = opt.code === 'card' ? 'Pay with debit card' : 'Pay with bank transfer';

                        return (
                            <Fragment key={idx}>
                                <div
                                    className={"flex flex-row bg-transluscent-primary p-2 mb-4 rounded justify-between cursor-pointer"}
                                    onClick={() => onChangePage('amount', { payment_source_code })}
                                >
                                    <div className={"flex flex-row"}>
                                        <IconComponent className={"w-10 h-10"} />
                                        <Spacer className={"block w-2"} />
                                        <p className={"flex justify-center items-center"}>{name}</p>
                                    </div>
                                    <div className={"flex justify-center items-center"}>
                                        <ChevronForward />
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })}
                </div>
            </Fragment>
        </div>
    )
}

export default Page;