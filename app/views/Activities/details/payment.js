
import React, {Fragment, useState, useCallback} from 'react'
import TabLayout from './tab';
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import { PAYMENT_DETAIL } from '../modules/queries';
import _ from 'lodash';
import { useRouter } from "next/router";
import { formatDate, formatString, formatNumber, formatPhone } from 'app/lib/formatters';
import {CloseIcon, ArrowLeft, ArrowDownLeft, ArrowUpRight} from "app/components/icons";
import {Button} from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"

const Page = ({query}) => {
    const {id} = query

    const { loading, data, error, refetch } = useQuery(PAYMENT_DETAIL, {
        fetchPolicy: 'cache-and-network',
        variables: { id },
        notifyOnNetworkStatusChange: true,
    });

    if(loading && !data){
        return(
            <div className={"flex h-screen justify-center items-center"}>
                <Loading />
            </div>
        )
    }

    if (error) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <div>
                    <p className={"text-center"}>{'unknown error occurred'}</p>
                    {/* <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p> */}
                </div>
                <Spacer className={"block h-5"} />
                <div>
                    <Button
                        onClick={() => refetch && refetch()}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Try Again'}
                    </Button>
                </div>
            </div>
        )
    }

    const {
        sender,
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
        currency,
    } = data.payment
    const { name } = data.me;
    const currentProfile = name === target?.name ? sender : target;
    const senderMain = _.compact([formatString(currentProfile?.name ?? '', 'capitalize')]).join(', ');
    const senderSub = _.compact([formatPhone(currentProfile?.phone, 'NATIONAL') || '']).join(' \u2022 ');
    const icontype = name === target.name ? <ArrowUpRight /> : <ArrowDownLeft />;


    return (
        <TabLayout pageTitle={"Transfer Detail"}>
            <div className={"flex flex-col max-w-lg px-4 mx-auto"}>
                <Spacer className={"block h-4"} />
                <div className={"flex flex-row justify-between py-4 border-b border-textGrey border-opacity-20"}>
                    <div>
                        <p className={"w-full text-2xl font-semibold"}>
                            {`\u20a6${formatNumber(amount,'0,0.00',)}`}
                        </p>
                        <Spacer className={"block h-1"} />
                        <p className={"w-full text-xs text-textGrey tracking-wider"}>
                            {`${formatString(description || 'Request information archived','uppercase',)}`}
                        </p>
                    </div>
                    <div className={"flex justify-center items-center uppercase h-1/2 text-xl font-semibold bg-backgroundGrey p-2 rounded-full "}>
                        {icontype}
                    </div>
                </div>
                <div className={"flex flex-row justify-start items-start py-4 border-b border-textGrey border-opacity-20"}>
                    <div>
                        <p className={"w-full text-sm font-semibold"}>
                        {senderMain}
                        </p>
                        <Spacer className={"block h-1"} />
                        <p className={"w-full text-xs text-textGrey"}>
                            {senderSub}
                        </p>
                        </div>
                    </div>
                <div className={"py-4"}>
                    <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                        <div>
                            <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Date"}</p>
                        </div>
                        <div>
                            <p className={"text-xs font-medium tracking-wider"}>{`${formatDate(date_created, 'lll')}`}</p>
                        </div>
                    </div>
                    <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                        <div>
                            <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Code"}</p>
                        </div>
                        <div>
                            <p className={"text-xs font-medium tracking-wider"}>{`${formatString(code || '','uppercase',)}`}</p>
                        </div>
                    </div>
                    <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                        <div>
                            <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Type"}</p>
                        </div>
                        <div>
                            <p className={"text-xs font-medium tracking-wider"}>{`${formatString(type || '-','uppercase',)}`}</p>
                        </div>
                    </div>
                    <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                        <div>
                            <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Status"}</p>
                        </div>
                        <div>
                            <p className={"text-xs font-medium tracking-wider"}>{`${formatString(status?.name ?? '-','uppercase',)}`}</p>
                        </div>
                    </div>
                </div>
            </div>
        </TabLayout>
    )
}

export default Page;