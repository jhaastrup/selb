import React, {Fragment, useState, useCallback} from 'react'
import TabLayout from './tab';
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import { UTILITY_DETAIL } from '../modules/queries';
import _ from 'lodash';
import { useRouter } from "next/router";
import { formatDate, formatString, formatNumber, formatPhone } from 'app/lib/formatters';
import {CloseIcon, ArrowLeft} from "app/components/icons";
import {Button} from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"

const Page = ({query}) => {
    const {id} = query
    const [obj, setObj] = useState(null);

    const { loading, data, error, refetch } = useQuery(UTILITY_DETAIL, {
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
        pk,
        pin = '',
        amount = 0,
        group = {},
        service = {},
        customer_id = '',
        code = '',
        biller_status = '',
        attempts = [],
    } = data.billingPayment

    const description = `${service.category.name}`;

    return (
        <TabLayout pageTitle={"Utility Detail"}>
            <div className={"flex flex-col max-w-lg px-4 mx-auto"}>
                <Spacer className={"block h-4"} />
                <div className={"flex flex-col justify-start items-start py-4 border-b border-textGrey border-opacity-20"}>
                    <p className={"w-full text-2xl font-semibold"}>
                        {`\u20a6${formatNumber(amount,'0,0.00',)}`}
                    </p>
                    <Spacer className={"block h-1"} />
                    <p className={"w-full text-sm text-textGrey"}>
                        {`${formatString(description || '','uppercase',)}`}
                    </p>
                </div>
                <div className={"py-4"}>
                    <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                        <div>
                            <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Customer"}</p>
                        </div>
                        <div>
                            <p className={"text-xs font-medium tracking-wider"}>{`${formatString(customer_id || '','capitalize',)}`}</p>
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
                            <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Category"}</p>
                        </div>
                        <div>
                            <p className={"text-xs font-medium tracking-wider"}>{`${formatString(service?.category.name ?? '-','uppercase',)}`}</p>
                        </div>
                    </div>
                    <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                        <div>
                            <p className={"uppercase text-textGrey text-xs tracking-wider"}>{'DISBURSEMENT'}</p>
                        </div>
                        <div>
                            <p className={"text-xs font-medium tracking-wider"}>{`${formatString(biller_status ?? '-' ,'uppercase',)}`}</p>
                        </div>
                    </div>
                    <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                        <div>
                            <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Pin"}</p>
                        </div>
                        <div>
                            <p className={"text-xs font-medium tracking-wider"}>{`${formatString(pin || '-','uppercase',)}`}</p>
                        </div>
                    </div>
                </div>
            </div>
        </TabLayout>
    )
}

export default Page;