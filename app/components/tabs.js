import * as React from 'react';
import {classNames} from "app/lib/utils";
import { useRouter } from "next/router";

const Tabs = ({ tabs, setView, fetch}) => {
    const [current, setCurrent] = React.useState(() => tabs[0].name);
    const [mobileTab, setMobileTab] = React.useState("");

    const router = useRouter();

    const handeleSelectTab = (e) => {
        setMobileTab(e.target.value);
    }

    const handleViewChange = React.useCallback((tab) => {
        setView(tab.view);
        setCurrent(tab.name)
        router.push({
            pathname: router.pathname,
            query: { view: tab.view},
        }, undefined, {shallow: true});
        // fetch && fetch();
        
    }, [fetch, setView, setCurrent])
    return (
        <div className="mx-auto sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
            {/* Tabs */}
                <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                <select
                    id="tabs"
                    name="tabs"
                    value={mobileTab}
                    onChange={handeleSelectTab}
                    className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    // defaultValue={tabs[0].name}
                >
                    {tabs.map((tab) => (
                    <option key={tab.name} value={tab.name}>{tab.name}</option>
                    ))}
                </select>
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="mt-2 -mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <div
                                onClick={() => {
                                    handleViewChange(tab)
                                }}
                                key={tab.name}
                                className={classNames(
                                    current === tab.name
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                                    'whitespace-nowrap cursor-pointer capitalize py-4 px-1 border-b-2 font-medium text-sm'
                                )}
                            >
                            {tab.name}
                            {tab.count ? (
                                <span
                                className={classNames(
                                    current === tab.name ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-900',
                                    'hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                                )}
                                >
                                {tab.count}
                                </span>
                            ) : null}
                            </div>
                        ))}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tabs;