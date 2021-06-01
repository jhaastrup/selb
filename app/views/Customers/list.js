import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { CheckCircleIcon, ChevronRightIcon, MailIcon, PhoneIcon, InformationCircleIcon } from '@heroicons/react/solid'
import { useQuery, useMutation } from '@apollo/client';
import {formatDate, formatString, formatNumber} from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import { MY_CUSTOMERS } from './modules/queries';
import {Button} from "app/components/forms";
import Tabs from "app/components/tabs";
import SlideOver from "app/components/slideOver";
import {classNames} from "app/lib/utils";
import Toolbar from "app/components/toolbar";



const CustomerItem = ({item, isSelected, onItemSelected}) => {
   
    const {
        customer_name,
        customer_email,
        customer_phone,
        trade_volume,
        fulfilled_orders,
        total_orders
    } = item;
    
    return(
        <>
            <li>
            <div onClick={onItemSelected} className="block hover:bg-gray-50">
                <div className="flex items-center py-4 lg:pl-2">
                    {/* visible column on desktop */}
                    <div className="hidden min-w-0 flex-1 lg:flex items-start">
                        <div className="flex-shrink-0 flex-col mr-6 pt-1 w-16">
                            <p className="lg:text-sm font-medium uppercase">{formatDate(item.date_created, "MMM DD")}</p>
                            <p className="text-sm text-gray-400 font-normal mt-0.5">
                                {formatDate(item.date_created, "hh:mm A")}
                            </p>
                        </div>
                        <div className="flex-shrink-0 flex-1 flex-col mr-6">
                            <p className="font-medium line-clamp-1">{customer_name}</p>
                            <p className="text-sm text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${customer_email?? ""}, ${customer_phone?? ""}`}</p>
                        </div>
                        <div className="flex-shrink-0 flex-1 flex-col mr-6 w-1/3">
                            <p className="font-medium line-clamp-1">{trade_volume}</p>
                        </div>
                        <div className="flex flex-col mr-6 w-1/4">
                            <p className="font-medium line-clamp-1">{trade_volume}</p>
                                
                        
                            <p className="text-sm text-gray-400 font-normal line-clamp-1 mt-0.5">
                                {"Fulfilled orders"}
                                {" \u2022 "}
                                <span className="font-medium text-indigo-400 text-xs uppercase">{fulfilled_orders}</span>
                            </p>
                        </div>
                    </div>
                    {/* visible column on mobile */}
                    <div className="lg:hidden min-w-0 flex-1 flex items-center max-w-full">
                        <div className="flex-shrink-0 flex-1 flex-col mr-6">
                            <p className="lg:text-sm font-bold truncate">{customer_name}</p>
                            <p className="text-sm lg:text-xs text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${customer_email}, ${customer_phone}`}</p>
                        </div>
                        <div className="flex-shrink-0 flex-col mr-2 items-end text-right">
                            <p className="lg:text-sm font-bold uppercase">{total_orders}</p>
                            {/* <p className="font-medium text-indigo-400 text-xs mt-0.5 uppercase">{item.status.name}</p> */}
                        </div>
                    </div>
                    <div className="hidden md:visible px-4">
                        <InformationCircleIcon className="h-5 w-5 text-red-700" aria-hidden="true" />
                    </div>
                    <div>
                        <ChevronRightIcon className="h-4 w-4 text-gray-900" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </li>
    </>

    )
}

const tabs = [
    {name: "all"},
    {name: "recent"},
]

const Page = () => {
    const router = useRouter();
    const [current, setCurrent] = React.useState();
    const [slideVisible, setSlideVisible] = React.useState(false);

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(MY_CUSTOMERS, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log({ errors });
        },
        
    });


    const onItemSelected = (item) => {
        setCurrent(item);
        setSlideVisible(true)
    };


    

    if(loading){
        return(
            <Layout pathname={router.pathname}>
                <Loading />
            </Layout>
        )
    }

    if(error){
        return(
            <Layout pathname={router.pathname}>
            
                <div className="md:flex md:items-center md:justify-between p-4 md:px-6 md:py-8 md:sticky md:top-0 bg-white z-20">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Customers</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/e-commerce/create/order")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Order
                        </button>
                        <button
                            onClick={() =>  router.push("/e-commerce/create/product")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-transparent rounded-sm shadow-sm text-xs tracking-wide font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            List Product
                        </button>
                        
                    </div>
                </div>
                <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                    
                    
                    <div className={"my-4"}>
                        <p className={"text-black text-center text-base font-semibold"}>{"An error ocurred"}</p> 
                        <p className={"text-textGrey text-center text-sm "}>{"Your customers will appear here"}</p>
                        
                    </div>
                    <button
                        className="uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        
                        onClick={() => refetch && refetch()} 
                    >
                       Try Again
                    </button>
                </div>
            </Layout>
        )
    }
    const { results, metadata = {} } = data.customers;

    if(results.length === 0){
        return(
            <Layout pathname={router.pathname}>
               <div className="md:flex md:items-center md:justify-between p-4 md:px-6 md:py-8 md:sticky md:top-0 bg-white z-20">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Customers</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/e-commerce/create/order")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Order
                        </button>
                        <button
                            onClick={() =>  router.push("/e-commerce/create/product")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-transparent rounded-sm shadow-sm text-xs tracking-wide font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            List Product
                        </button>
                    </div>
                </div>
                <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                    <div className={"my-4"}>
                        <p className={"text-black text-center text-base font-semibold"}>{"No customers yet"}</p> 
                        <p className={"text-textGrey text-center text-sm "}>{"Your customers will appear here"}</p>
                        
                    </div>
                    
                    
                </div>
            </Layout>
        )
    }
    return(
        <React.Fragment>
            <Layout pathname={router.pathname}>
                <div className="md:flex md:items-center md:justify-between p-4 md:px-6 md:py-8 md:sticky md:top-0 bg-white z-20">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Customers</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/e-commerce/create/order")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Order
                        </button>
                        <button
                            onClick={() =>  router.push("/e-commerce/create/product")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-transparent rounded-sm shadow-sm text-xs tracking-wide font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            List Product
                        </button>
                    </div>
                </div>
                
                <div>
                    {/* <div>
                        <Tabs tabs={tabs} />
                    </div> */}
                    <Toolbar />
                    <div className="shadow pb-20 min-h-screen">
                        <div className="overflow-y-auto  max-h-screen ">                        
                            <ul role="list" className="divide-y divide-gray-100 ">
                                <li>
                                    <div className="block">
                                        <div className="flex items-center py-4 lg:pl-2">
                                            <div className="hidden min-w-0 flex-1 lg:flex items-start">
                                                <div className="flex-shrink-0 flex-col mr-6 w-16">
                                                    <p className="font-medium uppercase text-sm text-gray-400">DATE</p>
                                                </div>
                                                <div className="flex-shrink-0 flex-1 flex-col mr-6">
                                                    <p className="font-medium truncate text-sm text-gray-400">{"Customer"}</p>
                                                </div>
                                                <div className="flex-shrink-0 flex-1 flex-col mr-6 w-1/3">
                                                    <p className="font-medium truncate text-sm text-gray-400">{"TOTAL VOLUME"}</p>
                                                </div>
                                                <div className="flex flex-col mr-6 w-1/4">
                                                    <p className="font-medium truncate flex items-center text-sm text-gray-400">{"TOTAL ORDERS"}</p>
                                                </div>
                                            </div>
                                            <div className="w-4"></div>
                                        </div>
                                    </div>
                                </li>
                                {results.map((item, idx) => {
                                    return(
                                        <CustomerItem key={`${item.customer_id}-${idx}`} isSelected={current?.customer_id === item.customer_id} item={item} onItemSelected={() => onItemSelected(item)} />
                                    );
                                })}
                            </ul>
                        </div> 
                    </div>
                    {current && (<SlideOver setOpen={setSlideVisible} open={slideVisible}>
                        <div className="pb-16 space-y-6">
                                
                            <div className={"mt-8 mb-4"}>
                                <p className={"text-primary text-xs md:text-sm font-semibold"}>
                                    {`${formatString(
                                        current?.customer_name,
                                        'uppercase',
                                    )}`}</p> 
                                <p className={"text-gray-600 flex text-sm 2xl:text-base"}>
                                    <MailIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span className="truncate">{current?.customer_email}</span>
                                </p>
                                <p className={"text-gray-600 flex text-sm 2xl:text-base"}>
                                    <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    <span className="truncate">{current?.customer_phone}</span>
                                </p> 
                            </div>
                            
                        
                            
                            <div>
                                <dl className="mt-2 border-t border-b border-gray-400 divide-y divide-gray-400">
                                
                                    <div className="py-3 flex justify-between flex-wrap text-sm font-medium">
                                        <dt className="text-gray-600">{"Trade Volume"}</dt>
                                        <dd className="text-black">{current?.trade_volume?? '-'}</dd>
                                    </div>
                                    
                                    <div className="py-3 flex justify-between  text-sm font-medium">
                                        <dt className="text-gray-600">{"Total Orders"}</dt>
                                        <dd className="text-black truncate">{current?.total_orders}</dd>
                                    </div>
                                    
                                    <div className="py-3 flex justify-between text-sm font-medium">
                                        <dt className="text-gray-600">{"Fulfilled Orders"}</dt>
                                        <dd className="text-black truncate">{current?.fulfilled_orders}</dd>
                                    </div>
                                
                                    
                                </dl>
                            </div>
                                
                        </div>
                    </SlideOver>)}
                    
                </div>
                
                
            </Layout>
        </React.Fragment>
        
    )
}

export default Page;