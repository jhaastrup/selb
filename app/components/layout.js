import { Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    ArchiveIcon,
    CashIcon,
    ShoppingBagIcon,
    CodeIcon,
    CogIcon,
    ExternalLinkIcon,
    ReplyIcon,
    QuestionMarkCircleIcon,
    LogoutIcon,
    BadgeCheckIcon,
    ChartPieIcon,
    XIcon,
    ArrowNarrowRightIcon,
    MenuAlt2Icon,
    ChevronRightIcon,
    UsersIcon,
    SortAscendingIcon,
} from "@heroicons/react/outline";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { classNames } from "app/lib/utils";
import { formatDate, formatString, formatNumber } from 'app/lib/formatters';
import { useRouter } from "next/router";
import Link from "next/link";

import _ from "lodash";

import mockData from './mockData';

const navigation = [
    // Shipping
    {
        label: "Shipping",
        key: "shipping",
        href: "/shipping/pickups",
        icon: ArchiveIcon,
        items: [
            { name: "Pickups", href: "/shipping/pickups", key: "pickups" },
            { name: "Deliveries", href: "/shipping/deliveries", key: "deliveries" },
            { name: "Imports", href: "/shipping/imports", key: "imports" },
        ],
    },
    {
        label: "Payments",
        key: "payments",
        icon: CashIcon,
        href: "/payments/inflows",
        items: [
            { name: "Balances", href: "/payments/balances", key: "balances" },
            { name: "Inflows", href: "/payments/inflows", key: "inflows" },
            { name: "Payouts", href: "/payments/payouts", key: "payouts" },
            { name: "Topups", href: "/payments/topups", key: "topups" },
            { name: "Withdrawals", href: "/payments/withdrawals", key: "withdrawals" },
            { name: "Transactions", href: "/payments/transactions", key: "transactions" },
        ],
    },
    // Commerce
    {
        label: "E-commerce",
        key: "e-commerce",
        icon: ShoppingBagIcon,
        href: "/e-commerce/products",
        items: [
            { name: "Products", href: "/e-commerce/products", key: "products" },
            { name: "Orders", href: "/e-commerce/orders", key: "orders" },
            { name: "Customers", href: "/e-commerce/customers", key: "customers" },
            { name: "Integrations", href: "/e-commerce/integrations", key: "integrations" },
        ],
    },
    {
        label: "Reports",
        icon: ChartPieIcon,
        href: "/reports/overview",
        key: "reports",
        items: [
            { name: "Overview", href: "/reports/overview", key: "overview" },
            { name: "Shipping", href: "/reports/shipping", key: "shipping" },
            { name: "Payments", href: "/reports/payments", key: "payments" },
            { name: "E-commerce", href: "/reports/e-commerce", key: "commerce" },
        ],
    },
    {
        label: "Developers",
        key: "developers",
        icon: CodeIcon,
        href: "/developers",
        items: [],
    },
    {
        label: "Referrals",
        key: "referrals",
        icon: BadgeCheckIcon,
        href: "/referrals",
        items: [],
    },
];

const secondaryNavigation = [
    {
        label: "Settings",
        key: "settings",
        href: "/settings",
        icon: CogIcon,
        items: [],
    },
    {
        label: "Support",
        key: "support",
        href: "https://sendbox.co/support",
        external: true,
        icon: QuestionMarkCircleIcon,
        items: [],
    },
    {
        label: "Feedback",
        key: "feedback",
        href: "/feedback",
        icon: ReplyIcon,
        items: [],
    },
    {
        label: "Log out",
        key: "logout",
        icon: LogoutIcon,
        href: "/logout",
        items: [],
    },
];

const tabs = [
    { name: "Ongoing", href: "#", current: false },
    { name: "Completed", href: "#", current: false },
    { name: "Cancelled", href: "#", current: true },
];


const MainNav = ({ nav = [], isMobile = false, setSidebarOpen }) => {
    const router = useRouter();
    const [openNav, setOpenNav] = useState();
    const { pathname } = router;
    const pathGroup = _.find(nav, { items: [{ href: pathname }] }) || _.find(nav, { href: pathname });

    return (
        <nav className="py-2 space-y-1 pl-6 w-full">
            {nav.map((item) => {
                const { label, key, items = [], icon: Icon, external } = item;
                const visible = pathGroup?.key === key;
                console.log({ Icon });
                return (
                    <div key={key} className="flex flex-col">
                        {isMobile ? (
                            <a
                                target={external ? "_blank" : undefined}
                                className={classNames(
                                    visible ? "text-black font-bold" : "text-gray-500 hover:text-gray-900",
                                    "group flex items-center py-1.5 lg:text-sm",
                                )}
                                onClick={() => setOpenNav(key)}
                            >
                                {Icon && <Icon className="h-5 w-5 mt-0.5 flex-shrink-0 mr-3" aria-hidden="true" />}
                                {label}
                                {external && <ExternalLinkIcon className="h-3 w-3 ml-2 flex-shrink-0" aria-hidden="true" />}
                            </a>
                        ) : (
                            <Link href={item.href} passHref>
                                <a
                                    target={external ? "_blank" : undefined}
                                    className={classNames(
                                        visible ? "text-black font-bold" : "text-gray-500 hover:text-gray-900",
                                        "group flex items-center py-1.5 lg:text-sm",
                                    )}
                                >
                                    {Icon && <Icon className="h-5 w-5 mt-0.5 flex-shrink-0 mr-3" aria-hidden="true" />}
                                    {label}
                                    {external && <ExternalLinkIcon className="h-3 w-3 ml-2 flex-shrink-0" aria-hidden="true" />}
                                </a>
                            </Link>
                        )}
                        <div className={classNames((isMobile && openNav === key) || visible ? "block" : "hidden", "ml-8")}>
                            {items.map((i) => (
                                <Link key={i.key} href={i.href} passHref>
                                    <a
                                        onClick={() => isMobile && setSidebarOpen && setSidebarOpen(false)}
                                        target={i.external ? "_blank" : undefined}
                                        className={classNames(
                                            i.href === pathname ? "text-indigo-500 font-medium" : "text-gray-500 hover:text-gray-900",
                                            "group flex items-center px-0 py-1 lg:text-sm font-normal tracking-normal",
                                        )}
                                    >
                                        {i.name}
                                        {i.external && <ExternalLinkIcon className="h-3 w-3 ml-2 flex-shrink-0" aria-hidden="true" />}
                                    </a>
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            })}
        </nav>
    );
};

const Component = ({ children, ...props }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const initialFocusRef = useRef();
    const router = useRouter();

    const { pathname } = router;

    return (
        <div className="h-screen flex overflow-hidden bg-white">
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    static
                    className="fixed inset-0 flex z-40 lg:hidden"
                    open={sidebarOpen}
                    onClose={setSidebarOpen}
                    initialFocus={initialFocusRef}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-75" />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <div className="relative flex-1 flex flex-col max-w-sm w-full bg-white">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-in-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in-out duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button
                                        ref={initialFocusRef}
                                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="sr-only">Close sidebar</span>
                                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </Transition.Child>
                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <MainNav isMobile={true} nav={navigation} setSidebarOpen={setSidebarOpen} />
                            </div>
                            {/* Footer navigation */}
                            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                                <MainNav isMobile={true} nav={secondaryNavigation} setSidebarOpen={setSidebarOpen} />
                            </div>
                        </div>
                    </Transition.Child>
                    <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
                </Dialog>
            </Transition.Root>
            {/* Static sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-shrink-0 bg-gray-50">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 border-gray-200 bg-transparent">
                        <div className="flex flex-col items-start flex-shrink-0 px-6 py-4 pt-7">
                            <Link href={"/"} passHref>
                                <a href="">
                                    <img className="h-8 w-auto object-left" src="/images/sendbox.svg" alt="Sendbox" />
                                </a>
                            </Link>

                            <p className="font-bold py-2 text-black tracking-tight">Emotu Balogun</p>
                        </div>
                        <div className="flex-1 flex flex-col py-2 overflow-y-auto">
                            <MainNav nav={navigation} setSidebarOpen={setSidebarOpen} />
                        </div>
                        <div className="flex-shrink-0 flex w-full border-t border-gray-200 py-2">
                            <MainNav nav={secondaryNavigation} setSidebarOpen={setSidebarOpen} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-0 flex-1 overflow-hidden shadow-md">
                <div className="lg:hidden pl-1 pt-2 pb-2 sm:pl-3 sm:pt-3 flex items-center justify-between">
                    <button
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-900 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <Link href={"/"} passHref>
                        <a className="px-6">
                            <img className="h-6 w-auto object-left" src="/images/sendbox.svg" alt="Sendbox" />
                        </a>
                    </Link>
                </div>
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    {/* Sample header design - will be used on every page */}
                    <div className="md:flex md:items-center md:justify-between p-4 md:px-6 md:py-8 md:sticky md:top-0 bg-white z-20">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Deliveries</h2>
                        </div>
                        <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                            <button
                                type="button"
                                className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Check Rates
                            </button>
                            <button
                                type="button"
                                className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-transparent rounded-sm shadow-sm text-xs tracking-wide font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Book Delivery
                            </button>
                        </div>
                    </div>
                    {/* Alert section */}
                    <div className="p4 md:px-6 md:py-2">
                        <div className="rounded-sm bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <InformationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3 flex-1 md:flex md:justify-between">
                                    <p className="text-sm text-red-700">A new software update is available. See what’s new in version 2.0.4.</p>
                                    <p className="mt-3 text-sm md:mt-0 md:ml-6">
                                        <a href="#" className="whitespace-nowrap font-medium text-red-700 hover:text-red-600">
                                            Details <span aria-hidden="true">&rarr;</span>
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Sample layout for page content */}
                    <div className="min-h-screen p-4 md:px-6 md:py-2">
                        {/* Sample header section - use where necessary */}
                        <div className="grid grid-cols-2 lg:grid-cols-2 lg:divide-y-0 bg-gray-50 divide-x divide-gray-100 border border-gray-100 rounded-md">
                            <div className="col-span-2 md:col-span-1 p-4 flex items-center justify-between">
                                <div className="flex flex-col items-start">
                                    <p className="text-xs text-gray-900 font-medium uppercase tracking-wide">Funds</p>
                                    <p className="text-2xl md:text-4xl font-bold tracking-normal text-black py-1 align-text-bottom">
                                        {`\u20a6190,524.32 `}
                                        <span className="text-xs tracking-wide text-gray-400 font-normal inline-block">NGN</span>
                                    </p>
                                    <div className="mt-3 flex flex-col items-start">
                                        <a href="" className="text-indigo-500 text-xs font-medium flex items-center">
                                            view balances <ArrowNarrowRightIcon className="h-4 w-4 ml-1" />{" "}
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-col items-start">
                                    <a
                                        href=""
                                        className="text-white px-4 py-2 text-xs font-bold uppercase rounded-sm shadow-sm bg-indigo-500 flex items-center"
                                    >
                                        Add Money
                                    </a>
                                </div>
                            </div>
                            <div className="hidden col-span-1 p-4 md:flex flex-col justify-between">
                                <div className="flex flex-col items-start">
                                    <p className="text-xs text-gray-900 font-medium uppercase tracking-wide">ZENITH BANK</p>
                                    <p className="text-2xl md:text-3xl font-bold tracking-normal text-black py-1 align-text-bottom">00098123349</p>
                                </div>
                                <div className="mt-3 flex flex-col items-start">
                                    <a href="" className="text-indigo-500 text-sm font-medium flex items-center">
                                        add money <ArrowNarrowRightIcon className="h-4 w-4 ml-1" />{" "}
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Views / navigation section */}

                        {/* <div className="pb-5 border-b-2 border-gray-100 sm:pb-0">
                            <div className="sm:mt-4">
                                <div className="sm:hidden">
                                    <label htmlFor="current-tab" className="sr-only">
                                        Select a tab
                                    </label>
                                    <select
                                        id="current-tab"
                                        name="current-tab"
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        defaultValue={tabs.find((tab) => tab.current).name}
                                    >
                                        {tabs.map((tab) => (
                                            <option key={tab.name}>{tab.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="hidden sm:block">
                                    <nav className="-mb-px flex space-x-8">
                                        {tabs.map((tab) => (
                                            <a
                                                key={tab.name}
                                                href={tab.href}
                                                className={classNames(
                                                    tab.current
                                                        ? "border-indigo-500 text-indigo-600"
                                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                                    "whitespace-nowrap pb-4 px-1 border-b-4 font-medium text-sm",
                                                )}
                                                aria-current={tab.current ? "page" : undefined}
                                            >
                                                {tab.name}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div> */}

                        {/* Toolbar section */}
                        <div className="my-4 flex rounded-xs shadow-sm bg-white">
                            <div className="relative flex items-stretch flex-grow focus-within:z-10">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UsersIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="right-0 flex items-center">
                                <label htmlFor="currency" className="sr-only">
                                    Currency
                                </label>
                                <select
                                    id="currency"
                                    name="currency"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-gray-300 bg-transparent -ml-px text-gray-500 sm:text-sm rounded-none"
                                >
                                    <option>USD</option>
                                    <option>CAD</option>
                                    <option>EUR</option>
                                </select>
                            </div>
                            <button className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                                <SortAscendingIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                <span>Sort</span>
                            </button>
                        </div>

                        {/* Grid / data section */}
                        <div className="bg-white lg:my-2 rounded-md">
                            <ul className="divide-y divide-gray-100 border-t">
                                {/* header section */}
                                <li>
                                    <div className="block">
                                        <div className="flex items-center py-4 lg:pl-2">
                                            <div className="hidden min-w-0 flex-1 lg:flex items-start">
                                                <div className="flex-shrink-0 flex-col mr-6 w-16">
                                                    <p className="font-medium uppercase text-sm text-gray-400">DATE</p>
                                                </div>
                                                <div className="flex-shrink-0 flex-1 flex-col mr-6">
                                                    <p className="font-medium truncate text-sm text-gray-400">{"ORIGIN"}</p>
                                                </div>
                                                <div className="flex-shrink-0 flex-1 flex-col mr-6 w-1/3">
                                                    <p className="font-medium truncate text-sm text-gray-400">{"DESTINATION"}</p>
                                                </div>
                                                <div className="flex flex-col mr-6 w-1/4">
                                                    <p className="font-medium truncate flex items-center text-sm text-gray-400">{"STATUS"}</p>
                                                </div>
                                            </div>
                                            <div className="w-4"></div>
                                        </div>
                                    </div>
                                </li>
                                {mockData.results.map((elem, idx) => {
                                    return (
                                        <li key={idx}>
                                            <a href="#" className="block hover:bg-gray-50">
                                                <div className="flex items-center py-4 lg:pl-2">
                                                    {/* visible column on desktop */}
                                                    <div className="hidden min-w-0 flex-1 lg:flex items-start">
                                                        <div className="flex-shrink-0 flex-col mr-6 pt-1 w-16">
                                                            <p className="lg:text-sm font-medium uppercase">{formatDate(elem.date_created, "MMM DD")}</p>
                                                            <p className="text-sm text-gray-400 font-normal mt-0.5">
                                                                {formatDate(elem.date_created, "hh:mm A")}
                                                            </p>
                                                        </div>
                                                        <div className="flex-shrink-0 flex-1 flex-col mr-6">
                                                            <p className="font-medium line-clamp-1">{elem.origin.name}</p>
                                                            <p className="text-sm text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${elem.origin.city}, ${elem.origin.state}`}</p>
                                                        </div>
                                                        <div className="flex-shrink-0 flex-1 flex-col mr-6 w-1/3">
                                                            <p className="font-medium line-clamp-1">{elem.destination.name}</p>
                                                            <p className="text-sm text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${elem.destination.city}, ${elem.destination.state}, ${elem.destination.country.name}`}</p>
                                                        </div>
                                                        <div className="flex flex-col mr-6 w-1/4">
                                                            <p className="font-bold inline-flex items-center whitespace-nowrap line-clamp-1 truncate">
                                                                {elem.code}
                                                                {" \u2022 "}
                                                                <span className="font-medium text-indigo-400 text-xs uppercase">{elem.status.name}</span>
                                                            </p>
                                                            <p className="text-sm text-gray-400 font-normal line-clamp-1 mt-0.5">
                                                                {`${elem.last_tracking_update?.description || ""}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {/* visible column on mobile */}
                                                    <div className="lg:hidden min-w-0 flex-1 flex items-center max-w-full">
                                                        <div className="flex-shrink-0 flex-1 flex-col mr-6">
                                                            <p className="lg:text-sm font-bold truncate">{elem.destination.name}</p>
                                                            <p className="text-sm lg:text-xs text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${elem.destination.city}, ${elem.destination.state}, ${elem.destination.country.name}`}</p>
                                                        </div>
                                                        <div className="flex-shrink-0 flex-col mr-2 items-end text-right">
                                                            <p className="lg:text-sm font-bold uppercase">{elem.code}</p>
                                                            <p className="font-medium text-indigo-400 text-xs mt-0.5 uppercase">{elem.status.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="hidden md:visible px-4">
                                                        <InformationCircleIcon className="h-5 w-5 text-red-700" aria-hidden="true" />
                                                    </div>
                                                    <div>
                                                        <ChevronRightIcon className="h-4 w-4 text-gray-900" aria-hidden="true" />
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Component;
