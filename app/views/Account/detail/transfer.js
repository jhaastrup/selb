import React, { Fragment, useState, useCallback } from 'react';
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import _ from 'lodash';
import { useRouter } from "next/router";
import { formatDate, formatString, formatNumber, formatPhone } from 'app/lib/formatters';
import { ArrowDownLeft, ArrowUpRight } from "app/components/icons";
import { Button } from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"

const Page = ({ obj, user }) => {
    const { sender,
        target,
        status,
        code,
        pk,
        summary,
        narration,
        phrase,
        amount,
        date_created,
        account,
        type,
        description,
        escrow_reference,
        reference_code = '',
        currency, } = obj;
    const { name } = user;
    const currentProfile = name === target?.name ? sender : target;
    const senderMain = _.compact([formatString(currentProfile?.name ?? '', 'capitalize')]).join(', ');
    const senderSub = _.compact([formatPhone(currentProfile?.phone, 'NATIONAL') || '']).join(' \u2022 ');
    const icontype = name === target.name ? <ArrowUpRight /> : <ArrowDownLeft />;

    return (
        <div className={"flex flex-col max-w-lg mx-auto"}>
            <Spacer className={"block h-4"} />
            <div className={"flex flex-col justify-start items-start py-4 border-b border-gray-400 border-opacity-20"}>
                <p className={"w-full text-2xl font-semibold"}>
                    {`\u20a6${formatNumber(amount, '0,0.00',)}`}
                </p>
                <Spacer className={"block h-1"} />
                <p className={"w-full text-xs text-gray-400 tracking-wider"}>
                    {`${formatString(description || 'Payment information archived', 'uppercase',)}`}
                </p>
            </div>
            <div className={"flex flex-row justify-start items-start py-4 border-b border-gray-400 border-opacity-20"}>
                <div className={"flex justify-center items-center uppercase text-xl font-semibold bg-gray-300 p-2 rounded-full "}>
                    {icontype}
                </div>
                <Spacer className={"block w-2"} />
                <div>
                    <p className={"w-full text-sm font-semibold"}>
                        {senderMain}
                    </p>
                    <Spacer className={"block h-1"} />
                    <p className={"w-full text-xs text-gray-400"}>
                        {senderSub}
                    </p>
                </div>
            </div>
            <div className={"py-4"}>
                <div className={"flex justify-between border-b py-4 border-gray-400 border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-gray-400 text-xs tracking-wider"}>{"Date"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${formatDate(date_created, 'lll')}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-gray-400 border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-gray-400 text-xs tracking-wider"}>{"Code"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${formatString(code || '', 'uppercase',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-gray-400 border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-gray-400 text-xs tracking-wider"}>{"Type"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${formatString(type || '-', 'uppercase',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-gray-400 border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-gray-400 text-xs tracking-wider"}>{"Status"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${formatString(status?.name ?? '-', 'uppercase',)}`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;