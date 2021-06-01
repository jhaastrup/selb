import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useMutation } from '@apollo/client';
import { formatDate, formatPhone, formatNumber, formatString } from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import { TOPUPS } from '../modules/queries';
import _ from "lodash";
import { Button } from "app/components/forms";
import { ChevronRightIcon, MailIcon } from '@heroicons/react/solid'
import { classNames } from "app/lib/utils";
import Alert from "app/services/alerts/simpleAlert";
import SlideOver from "app/components/slideOver";
import { Topup } from "../detail"


const ItemComponent = ({ item, isSelected, onItemSelected }) => {
    const { status = {}, date_created, amount, bank, pk, source, bank_code } = item;
    return (
        <Fragment>
            <li>
                <div
                    onClick={onItemSelected}
                    className={`block md:cursor-pointer ${isSelected ? "bg-gray-100" : "bg-white hover:bg-gray-100"}`}
                >
                    <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                <div>
                                    <p className={"text-xs font-bold text-left tracking-wider text-black mb-1"}>{`${formatString(bank_code ?? '', 'uppercase')}`}</p>
                                    <p className={"text-xs text-left tracking-wider text-gray-400 uppercase"}>{formatDate(date_created, 'll')}</p>
                                </div>
                                <div className="hidden md:block">
                                    <p className={"text-xs font-bold text-left tracking-wider text-black mb-1"}>{`\u20a6 ${formatNumber(amount, '0,0.00')}`}</p>
                                    <p className={"text-xs text-left tracking-wider text-gray-400 uppercase"}>{`${status?.name ?? ''}`}</p>
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

const SideDetail = ({ obj }) => {
    return (
        <div className="max-h-screen">
            <div className="mt-6 relative flex-1">
                {/* Replace with your content */}
                <div className="absolute inset-0">
                    {/* <div className="h-full border-2 border-dashed border-gray-200" aria-hidden="true" /> */}
                    <Topup obj={obj} />
                </div>
                {/* /End replace */}
            </div>
        </div>
    )
};

const Page = () => {
    const router = useRouter();
    const [current, setCurrent] = useState(null);
    const [slideVisible, setSlideVisible] = useState(false);
    // const [open, setOpen] = useState(false);

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(TOPUPS, {
        variables: {
            page_by: {
                per_page: "15"
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

    if (loading && !data) {
        return (
            <div className={"flex h-screen justify-center items-center"}>
                <Loading />
            </div>
        )
    }

    if (error) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center space-y-3"}>
                <div>
                    <p className={"text-center"}>{'unknown error occurred'}</p>
                    {/* <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p> */}
                </div>
                {/* <Spacer className={"block h-5"} /> */}
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

    const onItemSelected = (item) => {
        setCurrent(item);
        setSlideVisible(true);
    }

    const onClose = () => {
        // setCurrent(null);
        setOpen(false);
    }

    const { results, metadata = {} } = data.getTopUps;

    if (results.length === 0) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen mt-32 items-center space-y-3"}>
                <div>
                    <p className={"text-center font-bold"}>{'No topup history'}</p>
                    <p className={"text-center text-gray-400"}>{'Wallet topups will appear here.'}</p>
                </div>
                {/* <Spacer className={"block h-5"} /> */}
                <div>
                    <Button
                        onClick={() => router.push("/account/fund-account")}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Top Up'}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <Fragment>
            <div className="bg-gray-50  shadow overflow-y-auto h-screen">
                <ul className="divide-y divide-gray-100 mb-64 h-screen">
                    {results.map((item, idx) => {
                        return (
                            <ItemComponent key={item.pk} item={item} isSelected={current?.pk === item.pk} onItemSelected={() => onItemSelected(item)} />
                        );
                    })}
                </ul>
            </div>
            {/* <div className={"lg:grid lg:grid-cols-5 xl:grid-cols-7 hidden"}>
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
            </div> */}
            {current && (<SlideOver setOpen={setSlideVisible} open={slideVisible}>
                <SideDetail obj={current} />
            </SlideOver>)}
        </Fragment>
    )
}

export default Page;