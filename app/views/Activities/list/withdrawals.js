import React, { useState, Fragment } from 'react';
import TabLayout from "./tab";
import { useRouter } from "next/router";
import {useQuery, useMutation} from "@apollo/client";
import { WITHDRAWALS } from '../modules/queries';
import Loading from "app/components/loading"
import {formatDate, formatString, formatNumber} from "app/lib/formatters";
import {Button} from "app/components/forms";
import { Spacer } from "app/components/assets";

const ItemComponent = ({item, onItemSelected}) => {
    const {
        pk,
        status,
        name,
        requires_manual_approval,
        email,
        phone,
        bank_account,
        transaction_code,
        code,
        comment,
        amount,
        date_created,
    } = item;

    return (
        <div 
            onClick={onItemSelected}
            className={"flex justify-between py-4 cursor-pointer border-b border-textGrey border-opacity-10"}>
            <div>
                <p className={"text-xs text-left tracking-wider mb-1"}>{`${name ?? ''}`}</p>
                <p className={"text-xs text-left tracking-wider text-textGrey uppercase"}>{formatDate(date_created, 'll')}</p>
            </div>
            <div>
                <p className={"text-xs text-right tracking-wider mb-1"}>{`\u20a6 ${formatNumber(amount, '0,0.00')}`}</p>
                <p className={"text-xs text-right tracking-wider text-textGrey uppercase"}>{`${status?.name ?? ''}`}</p>
            </div>
        </div>
    );
};

const Page = () => {
    const router = useRouter()
    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(WITHDRAWALS, {
        variables: { 
            page_by: {
                per_page: "100"
            } 
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log({ errors });
        },
        onCompleted: (data) => {
            console.log('==>', { data });
            // const { getDiscoveryOrders } = data;
            // console.log({ getDiscoveryOrders });
        },
    });

    const onItemSelected = (item) => {
        console.log('selected item', { item });
        const { pk: id } = item;
    };

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

    const { results, metadata = {} } = data.getWithdrawals;

    if (results.length === 0) {
        return (
            <TabLayout pageTitle={"Withdrawals"} pathname={router.pathname}>
                <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                    <div>
                        <p className={"text-center"}>{'No Withdrawal History'}</p>
                        <p className={"text-center text-textGrey"}>{'Withdrawals will appear here.'}</p>
                    </div>
                    <Spacer className={"block h-5"} />
                    <div>
                        <Button
                            onClick={() => router.push("/account/withdraw")}
                            uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                        >
                            {'Withdraw'}
                        </Button>
                    </div>
                </div>
            </TabLayout>
        )
    }

    return (
        <TabLayout pageTitle={"Withdrawals"} pathname={router.pathname}>
            <div className={"flex flex-col max-w-lg mx-auto px-4"}>
                {/* <Spacer className={"block h-4"} /> */}
                {/* <div className={"sticky my-2"}>
                    <Button
                        onClick={() => router.push("/account")}
                        uclasses={`rounded-full uppercase tracking-widest text-xs font-medium md:font-medium py-3 px-6`}
                    >
                        {'Purchase Utility'}
                    </Button>
                </div>
                <Spacer className={"block h-4"} /> */}
                {results.map((opt, idx) => {
                    return(
                        <Fragment key={idx}>
                            <ItemComponent 
                                item={opt}
                                onItemSelected={() => onItemSelected(opt)}
                            />
                        </Fragment>
                    )
                })}
            </div>
            <Spacer className={"block h-10"} />
        </TabLayout>
    )
}

export default Page;