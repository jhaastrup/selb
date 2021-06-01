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
import {useUser} from "app/lib/hooks";
import _ from "lodash";

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
    const user = useUser();

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
                                    <img className="h-8 w-auto object-left" src="/images/sendbox-logo.svg" alt="Sendbox" />
                                </a>
                            </Link>

                            <p className="font-bold py-2 text-black tracking-tight">{user?.name}</p>
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
                            <img className="h-6 w-auto object-left" src="/images/sendbox-logo.svg" alt="Sendbox" />
                        </a>
                    </Link>
                </div>
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                  {children}
                </main>
            </div>
        </div>
    );
};

export default Component;
