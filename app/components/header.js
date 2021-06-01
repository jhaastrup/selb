import { ArrowNarrowRightIcon } from '@heroicons/react/outline'
import {useUser} from "app/lib/hooks";
import {formatNumber} from "app/lib/formatters";
import Link from "next/link";

const Header = () => {
    const user = useUser();
    console.log({user});
    return (
         <div className="grid grid-cols-2 lg:grid-cols-2 lg:divide-y-0 bg-gray-50 divide-x divide-gray-100 border border-gray-100 rounded-md">
            <div className="col-span-2 md:col-span-1 p-4 flex items-center justify-between">
                <div className="flex flex-col items-start">
                    <p className="text-xs text-gray-900 font-medium uppercase tracking-wide">Funds</p>
                    <p className="text-2xl md:text-4xl font-bold tracking-normal text-black py-1 align-text-bottom">
                        {`\u20a6 ${formatNumber(
                            user?.paymentProfile.funds,
                            '0,0.00',
                        )}`}
                        <span className="text-xs tracking-wide text-gray-400 font-normal inline-block">NGN</span>
                    </p>
                    <div className="mt-3 flex flex-col items-start">
                        <Link href="/payments/balances" passHref>
                            <a  className="text-indigo-500 text-xs font-medium flex items-center">
                                view balances <ArrowNarrowRightIcon className="h-4 w-4 ml-1" />{" "}
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="mt-3 flex flex-col items-start">
                    <Link href="/payments/topups" passHref>
                        <a
                            className="text-white px-4 py-2 text-xs font-bold uppercase rounded-sm shadow-sm bg-indigo-500 flex items-center"
                        >
                            Add Money
                        </a>
                    </Link>
                </div>
            </div>
            <div className="hidden col-span-1 p-4 md:flex flex-col justify-between">
                <div className="flex flex-col items-start">
                    <p className="text-xs text-gray-900 font-medium uppercase tracking-wide">{user?.paymentProfile.virtual_bank_accounts[0].bank_name}</p>
                    <p className="text-2xl md:text-3xl font-bold tracking-normal text-black py-1 align-text-bottom">{user?.paymentProfile.virtual_bank_accounts[0].account_number}</p>
                </div>
                <div className="mt-3 flex flex-col items-start">
                    <Link href="/payments/topups" passHref>

                        <a href="" className="text-indigo-500 text-sm font-medium flex items-center">
                            add money <ArrowNarrowRightIcon className="h-4 w-4 ml-1" />{" "}
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header;