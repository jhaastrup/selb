import React, { useState, Fragment } from 'react';
import { PublicLayout as Layout } from "app/views/Layout";
import { useRouter } from "next/router";
import {useQuery, useMutation} from "@apollo/client";
import { IMPORTS } from '../modules/queries';
import Loading from "app/components/loading"
import {formatDate, formatString, formatNumber} from "app/lib/formatters";
import {Button} from "app/components/forms";
import { Spacer } from "app/components/assets";

const ItemComponent = ({item, onItemSelected}) => {
    const { 
        pk,
        code,
        origin,
        source,
        date_created,
        status,
        weight,
        billable_weight,
        import_fee,
        import_currency_fee,
        currency = 'NGN',
        description,
    } = item;
    const addressList = [
        formatString(origin.street || '', 'capitalize'),
        formatString(origin.city || '', 'capitalize'),
    ];
    const subAddressList = [
        // formatString(origin.country?.code || '', 'uppercase'),
        code,
        // formatString(origin.state || '', 'capitalize'),
        // formatString(origin.post_code || '', 'uppercase'),
    ];

    const addressString = _.compact(addressList).join(' \u2022 ');
    const subAddressString = _.compact(subAddressList).join(' \u2022 ');
    // const descriptionString = _.compact(description).join(', ');
    const descriptionString = formatString(description, 'capitalize');
    return (
        <div 
            onClick={onItemSelected}
            className={"flex justify-between py-4 cursor-pointer border-b border-textGrey border-opacity-10"}>
            <div className={"flex flex-row"}>
                <div className={"bg-backgroundGrey w-10 h-10 flex flex-col justify-center items-center"}>
                    <p className={"text-sm font-semibold uppercase"}>{`${formatNumber(weight, '0,0.0')}`}</p>
                    <p className={"text-xs uppercase text-textGrey"}>{"KG"}</p>
                </div>
                <Spacer className={"block w-2"} />
                <div>
                    <p className={"text-xs text-left tracking-wider mb-1"}>{source}</p>
                    <p className={"text-xs text-left tracking-wider text-textGrey uppercase"}>{subAddressString}</p>
                </div>
            </div>
            <div>
                <p className={"text-xs text-right tracking-wider mb-1"}>{`\u20a6 ${formatNumber(import_fee, '0,0.00')}`}</p>
                <p className={"text-xs text-right tracking-wider text-textGrey uppercase"}>{`${status?.name ?? ''}`}</p>
            </div>
        </div>
    );
};

const Page = () => {
    const router = useRouter()
    const dataLabel = 'imports';

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(IMPORTS, {
        // variables: { filter_by, sort_by, page_by, query },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log({ errors });
        },
        onCompleted: (shipments) => {
            const { deliveries } = shipments;
            console.log({ deliveries });
        },
    });

    const onItemSelected = (item) => {
        console.log('selected item', { item });
        const { pk: id } = item;
        router.push({
            pathname: "/deliveries/imports/[id]",
            query: {id}
        })
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

    const { results, metadata = {} } = data[dataLabel];


    if (results.length === 0) {
        return (
            <Layout pageTitle={"Imports"} pathname={router.pathname}>
                <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                    <div>
                        <p className={"text-center"}>{'No foreign imports'}</p>
                        <p className={"text-center text-textGrey"}>{'You foreign imports will appear here.'}</p>
                    </div>
                    <Spacer className={"block h-5"} />
                    <div>
                        <Button
                            onClick={() => router.push("/")}
                            uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                        >
                            {'Go Home'}
                        </Button>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout pageTitle={"Imports"} pathname={router.pathname}>
            <Spacer className={"block h-6"} />
            <div className={"flex flex-col max-w-lg mx-auto px-4"}>
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
        </Layout>
    )
}

export default Page;