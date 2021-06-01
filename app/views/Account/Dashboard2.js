import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useMutation } from '@apollo/client';
import { formatDate, formatPhone, formatNumber, formatString } from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import { Button } from "app/components/forms";
import { ChevronRightIcon, MailIcon } from '@heroicons/react/solid'
import { classNames } from "app/lib/utils";
import Alert from "app/services/alerts/simpleAlert";
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { GET_PROFILE } from "./modules/queries";
import generateLogos from "./logos";


import { Topups, Withdrawals, Requests, Transfers } from './list';

const tabs = [
    { name: "Topups", value: "topups" },
    { name: "Withdrawals", value: "withdrawals" },
    { name: "Transfers", value: "transfers" },
    { name: "Requests", value: "requests" },

]

const Page = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState('topups');
    const handeleSelectTab = (e) => {
        setCurrentPage(e.target.value);
    }

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_PROFILE, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log({ errors });
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

    let PageComponent;

    switch (currentPage) {
        case "topups":
            PageComponent = Topups;
            break;
        case "withdrawals":
            PageComponent = Withdrawals;
            break;
        case "transfers":
            PageComponent = Transfers;
            break;
        case "requests":
            PageComponent = Requests;
            break;
        default:
            PageComponent = null;
            break;
    }

    const { me = {}, kyc = {} } = data;
    const { paymentProfile = {} } = me;
    const { daily_withdrawal_limit = 0, monthly_withdrawal_limit = 0 } = kyc;
    const serviceLogos = generateLogos();

    return (
        <Layout pageTitle={"Imports"} pathname={router.pathname}>
            <div className="bg-white sticky inset-0 z-30 shadow">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="py-6 flex flex-row justify-between items-center space-y-2">
                        <div className={"flex flex-col space-y-1"}>
                            <p className={"text-xl uppercase tracking-wider text-black font-bold"}>{"PAYMENTS"}</p>
                            <div className={"hidden lg:flex space-x-4 text-gray-400"}>
                                <div className={"flex space-x-1"}>
                                    <p>{"Wallet:"}</p>
                                    <p>{`\u20a6${formatNumber(paymentProfile.funds, "0,0.00")}`}</p>
                                </div>
                                {kyc && (
                                    <>
                                        <div className={"flex space-x-1"}>
                                            <p>{"Daily Limit:"}</p>
                                            <p>{`\u20a6${formatNumber(daily_withdrawal_limit, "0,0.00")}`}</p>
                                        </div>
                                        <div className={"flex space-x-1"}>
                                            <p>{"Monthly Limit:"}</p>
                                            <p>{`\u20a6${formatNumber(monthly_withdrawal_limit, "0,0.00")}`}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Mobile View */}
                        <div className="lg:hidden flex">
                            <span className="relative z-0 inline-flex shadow-sm rounded-md">
                                <button
                                    type="button"
                                    onClick={() => router.push("/account/fund-account")}
                                    className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    Fund Account
                                </button>
                                <Menu as="span" className="-ml-px relative block">
                                    {({ open }) => (
                                        <>
                                            <Menu.Button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                                                <span className="sr-only">Open options</span>
                                                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                            </Menu.Button>
                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items
                                                    static
                                                    className="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                                >
                                                    <div className="py-1">
                                                        {serviceLogos.map((item) => (
                                                            <Menu.Item key={item.name}>
                                                                {({ active }) => (
                                                                    <a
                                                                        onClick={item.onClick}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                            'block px-4 py-2 text-sm'
                                                                        )}
                                                                    >
                                                                        {item.title}
                                                                    </a>
                                                                )}
                                                            </Menu.Item>
                                                        ))}
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </>
                                    )}
                                </Menu>
                            </span>
                        </div>
                        {/* Desktop View */}
                        <div className="hidden lg:flex space-x-3 md:mt-0 md:ml-4">
                            <button
                                type="button"
                                onClick={() => router.push("/account/fund-account")}
                                className="uppercase inline-flex items-center px-4 py-2 text-black bg-white border border-black shadow text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2">
                                {"Fund Account"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/account/withdraw")}
                                className="uppercase inline-flex items-center px-4 py-2 text-black bg-white border border-black shadow text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2">
                                {"Withdraw"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/account/transfer")}
                                className="uppercase inline-flex items-center px-4 py-2 text-black bg-white border border-black shadow text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2">
                                {"Transfer"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/account/request")}
                                className="uppercase inline-flex items-center px-4 py-2 text-black bg-white border border-black shadow text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2">
                                {"Request"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-6">
                <div>
                    <div className={"lg:hidden block"}>
                        <label htmlFor="tabs" className="sr-only">
                            Select a tab
                        </label>
                        <select
                            id="tabs"
                            name="tabs"
                            value={currentPage}
                            onChange={handeleSelectTab}
                            className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                        // defaultValue={tabs[0].name}
                        >
                            {tabs.map((tab) => (
                                <option key={tab.name} value={tab.value}>{tab.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={"hidden lg:block"}>
                        <div className="border-b border-gray-200">
                            <nav className="mt-2 -mb-px flex space-x-8 cursor-pointer" aria-label="Tabs">
                                <a onClick={() => setCurrentPage("topups")} className={`${currentPage === "topups" ? "border-red-400 text-red-500" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                    {"Topups"}
                                </a>
                                <a onClick={() => setCurrentPage("withdrawals")} className={`${currentPage === "withdrawals" ? "border-red-400 text-red-500" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                    {"Withdrawals"}
                                </a>
                                <a onClick={() => setCurrentPage("transfers")} className={`${currentPage === "transfers" ? "border-red-400 text-red-500" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                    {"Transfers"}
                                </a>
                                <a onClick={() => setCurrentPage("requests")} className={`${currentPage === "requests" ? "border-red-400 text-red-500" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                    {"Requests"}
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <Fragment>
                <div className={"overflow-y-auto  max-h-screen"}>
                    <PageComponent userObject={me} />
                </div>
            </Fragment>
        </Layout>
    )
}

export default Page;