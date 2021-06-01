import * as React from "react";
import {UsersIcon, SortAscendingIcon} from "@heroicons/react/outline"
const Toolbar = () => {
    return (
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
    )
}

export default Toolbar;
