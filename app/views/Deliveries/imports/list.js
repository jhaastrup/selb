import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useMutation } from '@apollo/client';
import { formatDate, formatPhone, formatNumber, formatString } from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import { IMPORTS } from '../modules/queries';
import { Button } from "app/components/forms";
import { ChevronRightIcon, MailIcon } from '@heroicons/react/solid'
import { classNames } from "app/lib/utils";
import Alert from "app/services/alerts/simpleAlert";
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import SlideOver from "app/components/slideOver";
import Detail from "./detail";

const ItemComponent = ({ item, isSelected, onItemSelected }) => {
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
        <Fragment>
            {/* Mobile View */}
            <li className="lg:hidden" onClick={onItemSelected}>
                <a className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0 bg-gray-50 flex flex-col items-center justify-center  w-12 h-12 relative">
                                <p className={"text-xs text-black font-semibold uppercase"}>{`${formatNumber(weight, '0,0.0')}`}</p>
                                <p className={"text-xs uppercase text-gray-500"}>{"KG"}</p>
                            </div>
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-black truncate">{source}</p>
                                    <p className="text-sm text-gray-400">{subAddressString}</p>
                                </div>
                                <div className="hidden md:block">
                                    <div>
                                        <p className="mt-2 flex items-center text-sm text-black">{`\u20a6 ${formatNumber(import_fee, '0,0.00')}`}</p>
                                        <p className="mt-2 flex items-center text-sm text-400">{`${status?.name}` || ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                    </div>
                </a>
            </li>

            {/* Desktop View */}
            <li className="hidden lg:block">
                <div onClick={onItemSelected} className={`block cursor-pointer ${isSelected ? "bg-gray-100" : "bg-white hover:bg-gray-100"}`}>
                    <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0 bg-gray-50 flex flex-col items-center justify-center  w-12 h-12 relative">
                                <p className={"text-xs text-black font-semibold uppercase"}>{`${formatNumber(weight, '0,0.0')}`}</p>
                                <p className={"text-xs uppercase text-gray-500"}>{"KG"}</p>
                            </div>
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-black truncate">{source}</p>
                                    <p className="text-sm text-gray-400">{subAddressString}</p>
                                </div>
                                <div>
                                    <div>
                                        <p className={`flex items-center text-sm " ${isSelected ? "text-gray-600" : "text-black"}`}>{`\u20a6 ${formatNumber(import_fee, '0,0.00')}`}</p>
                                        <p className={`flex items-center text-sm " ${isSelected ? "text-gray-600" : "text-black"}`}>{`${status?.name}` || ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </li>
        </Fragment>
    )
}

// Slide-Over Detail
const SideDetail = ({ obj }) => {
    return (
        <div className="max-h-screen">
            <div className="mt-6 relative flex-1">
                {/* Replace with your content */}
                <div className="absolute inset-0">
                    {/* <div className="h-full border-2 border-dashed border-gray-200" aria-hidden="true" /> */}
                    <Detail obj={obj} />
                </div>
                {/* /End replace */}
            </div>
        </div>
    )
};

const Page = () => {
    const [current, setCurrent] = useState(null);
    const [slideVisible, setSlideVisible] = useState(false);
    const dataLabel = "imports";

    const router = useRouter();

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(IMPORTS, {
        // variables: { filter_by, sort_by, page_by, query },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log({ errors });
        },
        onCompleted: (data) => {
            const { imports } = data;
            console.log({ imports });
        },
    });

    if (loading && !data) {
        return (
            <Layout pathname={router.pathname}>
                <Loading />
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout pathname={router.pathname}>
                <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center space-y-2"}>
                    <div>
                        <p className={"text-center"}>{'unknown error occurred'}</p>
                        {/* <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p> */}
                    </div>
                    <div>
                        <Button onClick={() => refetch && refetch()}>
                            {'Try Again'}
                        </Button>
                    </div>
                </div>
            </Layout>
        )
    }

    const onItemSelected = (item) => {
        setCurrent(item);
        setSlideVisible(true);
    }

    const onClose = () => {
        // setCurrent(null);
        setOpen(false);
    }

    const { results, metadata = {} } = data[dataLabel];

    if (results.length === 0) {
        return (
            <Layout pageTitle={"Imports"} pathname={router.pathname}>
                <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center space-y-2"}>
                    <div>
                        <p className={"text-center"}>{'No foreign imports'}</p>
                        <p className={"text-center text-textGrey"}>{'You foreign imports will appear here.'}</p>
                    </div>
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
            <div className="bg-white sticky inset-0 z-30 shadow">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="py-6 flex justify-between items-center">
                        <div className={"text-lg uppercase tracking-wider text-black font-semibold"}>
                            <p>{"Imports"}</p>
                        </div>
                        <div className=" flex space-x-3 md:mt-0 md:ml-4">
                            <button onClick={() => router.push("/overseas")} type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black  focus:outline-none focus:ring-2 focus:ring-offset-2">
                                {"GET RATES"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"overflow-y-auto pb-20 max-h-screen lg:hidden p-2 "}>
                <ul className="divide-y divide-gray-200">
                    {results.map((item, idx) => {
                        return (
                            <ItemComponent key={item.pk} item={item} onItemSelected={() => onItemSelected(item)} />
                        );
                    })}
                </ul>
            </div>
            <div className={"lg:grid lg:grid-cols-5 xl:grid-cols-7 hidden "}>
                <div className=" col-span-5 xl:col-span-7 bg-gray-50 shadow pb-20 min-h-screen">
                    <div className="overflow-y-auto  max-h-screen ">
                        <ul className="divide-y divide-gray-100 ">
                            {results.map((item, idx) => {
                                return (
                                    <ItemComponent key={item.pk} item={item} isSelected={current?.pk === item.pk} onItemSelected={() => onItemSelected(item)} />
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            {current && (
                <SlideOver setOpen={setSlideVisible} open={slideVisible}>
                    <SideDetail obj={current} />
                </SlideOver>
            )}
        </Layout>
    )
}

export default Page;