import React, { Fragment, useState } from "react";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useMutation } from '@apollo/client';
import { formatDate, formatPhone, formatNumber, formatString } from "app/lib/formatters";
import { useRouter } from "next/router";
import Loading from "app/components/loading"
import { PAYMENTS } from '../modules/queries';
import _ from "lodash";
import { Button } from "app/components/forms";
import { ChevronRightIcon, MailIcon } from '@heroicons/react/solid'
import SlideOver from "app/components/slideOver";
import { Transfer } from "../detail"

const ItemComponent = ({ item, isSelected, onItemSelected }) => {
    const { currency, status = {}, date_created, amount, type, description, sender, target, pk, code } = item;

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
                                    <p className={"text-xs font-bold text-left tracking-wider text-black mb-1"}>{`${formatString(target?.name || target?.email || target?.phone || '', 'uppercase')}`}</p>
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

const SideDetail = ({ obj, user }) => {
    return (
        <div className="max-h-screen">
            <div className="mt-6 relative flex-1">
                {/* Replace with your content */}
                <div className="absolute inset-0">
                    {/* <div className="h-full border-2 border-dashed border-gray-200" aria-hidden="true" /> */}
                    <Transfer obj={obj} user={user} />
                </div>
                {/* /End replace */}
            </div>
        </div>
    )
};

const Page = ({ userObject }) => {
    const router = useRouter();
    const [current, setCurrent] = useState(null);
    const [slideVisible, setSlideVisible] = useState(false);
    // const [open, setOpen] = useState(false);

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(PAYMENTS, {
        variables: {
            page_by: {
                per_page: "15"
            }
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
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

    const { results, metadata = {} } = data.payments;

    if (results.length === 0) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen mt-32 items-center space-y-3"}>
                <div>
                    <p className={"text-center font-bold"}>{'No Payments History'}</p>
                    <p className={"text-center text-gray-400"}>{'Payments information will appear here.'}</p>
                </div>
                {/* <Spacer className={"block h-5"} /> */}
                <div>
                    <Button
                        onClick={() => router.push("/account/transfer")}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Transfer'}
                    </Button>
                </div>
            </div>
        )
    };

    return (
        <Fragment>
            <div className="bg-gray-50  shadow overflow-y-auto h-screen">
                <ul className="divide-y divide-gray-100 mb-64 h-screen">
                    {results.map((item, idx) => {
                        return (
                            <ItemComponent
                                key={item.pk}
                                item={item}
                                isSelected={current?.pk === item.pk}
                                onItemSelected={() => onItemSelected(item)}
                            />
                        );
                    })}
                </ul>
            </div>
            {current && (<SlideOver setOpen={setSlideVisible} open={slideVisible}>
                <SideDetail obj={current} user={userObject} />
            </SlideOver>)}
        </Fragment>
    )
}

export default Page;