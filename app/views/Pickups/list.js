import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useMutation } from '@apollo/client';
import {formatDate, formatPhone, formatNumber, formatString} from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import { MY_PICKUPS } from './modules/queries';
import {Button} from "app/components/forms";
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/solid'
import {classNames} from "app/lib/utils";
import Tabs from "app/components/tabs";
import SlideOver from "app/components/slideOver";
import Header from "app/components/header";
import Toolbar from "app/components/toolbar";



const PickupItem = ({ item, isSelected, onItemSelected }) => {
   
    const { 
        code,
         hub,
         status, 
         origin

    } = item;

    const addressList = [
        formatString(origin.street || '', 'capitalize'),
        formatString(origin.city || '', 'capitalize'),
    ];
    const subAddressList = [
        formatString(origin.city || '', 'capitalize'),
        formatString(origin.state || '', 'capitalize'),
        formatString(origin.post_code || '', 'uppercase'),
    ];


    
    const addressString = _.compact(addressList).join(' \u2022 ');
    const subAddressString = _.compact(subAddressList).join(' \u2022 ');
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
                            <p className="font-medium line-clamp-1">{item.courier.name}</p>
                            <p className="text-sm text-gray-400 font-normal line-clamp-1 mt-0.5">{item.courier.email ? `${item.courier.email},`: ""} {item.courier.phone ?? ""}</p>
                        </div>
                        <div className="flex-shrink-0 flex-1 flex-col mr-6 w-1/3">
                            <p className="font-medium line-clamp-1">{item.origin.name}</p>
                            <p className="text-sm text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${item.origin.city}, ${item.origin.state}, ${item.origin.country.name}`}</p>
                        </div>
                        <div className="flex flex-col mr-6 w-1/4">
                            <p className="font-bold inline-flex items-center whitespace-nowrap line-clamp-1 truncate">
                                {item.code}
                                {" \u2022 "}
                                <span className="font-medium text-indigo-400 text-xs uppercase">{item.status.name}</span>
                            </p>
                            
                        </div>
                    </div>
                    {/* visible column on mobile */}
                    <div className="lg:hidden min-w-0 flex-1 flex items-center max-w-full">
                        <div className="flex-shrink-0 flex-1 flex-col mr-6">
                            <p className="lg:text-sm font-bold truncate">{item.origin.name}</p>
                            <p className="text-sm lg:text-xs text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${item.origin.city}, ${item.origin.state}, ${item.origin.country.name}`}</p>
                        </div>
                        <div className="flex-shrink-0 flex-col mr-2 items-end text-right">
                            <p className="lg:text-sm font-bold uppercase">{item.code}</p>
                            <p className="font-medium text-indigo-400 text-xs mt-0.5 uppercase">{item.status.name}</p>
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
    {name: "on hold"},
    {name: "pending"},
    {name: "cancel"},
    {name: "completed"},
    
]
const Page = () => {
    const [current, setCurrent] = React.useState();
    const [slideVisible, setSlideVisible] = React.useState(false);

    const router = useRouter();
    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(MY_PICKUPS, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        
    });


    


   
    const onItemSelected = (item) => {
        setCurrent(item);
        setSlideVisible(true)
    };

    const openCreate = () => {
        router.push("/deliveries/create")
     }


     
    const originMain = _.compact([
        current?.origin?.street || '',
        current?.origin?.city || '',
        formatString(current?.origin?.state || '', 'capitalize'),
        current?.origin?.country?.name || '',
        current?.origin.post_code || '',
    ]).join(', ');

    const originSub = _.compact([current?.origin?.name || '', formatPhone(current?.origin?.phone, 'NATIONAL') || '']).join(' \u2022 ');

    const courierSub = _.compact([current?.courier?.username || '', formatPhone(current?.courier?.phone, 'NATIONAL') || '']).join(' \u2022 ');
    const merchantSub = _.compact([current?.merchant?.username || '', formatPhone(current?.merchant?.phone, 'NATIONAL') || '']).join(' \u2022 ');

    const totalFee = parseFloat(formatNumber(current?.base_fee, '0,0.00')) + parseFloat(formatNumber(current?.extra_fee, '0,0.00'));
    

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
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Pickups</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/shipping/quote")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Check Rates
                        </button>
                        <button
                            onClick={() =>  router.push("/shipping/deliveries/create")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-transparent rounded-sm shadow-sm text-xs tracking-wide font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Book Delivery
                        </button>
                        
                    </div>
                </div>
                <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                    
                    
                    <div className={"my-4"}>
                        <p className={"text-black text-center text-base font-semibold"}>{"An error ocurred"}</p> 
                        <p className={"text-textGrey text-center text-sm "}>{"Your local shipment will appear here"}</p>
                        
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

    const { results, metadata = {} } = data.pickups;

    if(results.length === 0){
        return(
            <Layout  pathname={router.pathname}>
                <div className="md:flex md:items-center md:justify-between p-4 md:px-6 md:py-8 md:sticky md:top-0 bg-white z-20">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Pickups</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/shipping/deliveries/quote")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Check Rates
                        </button>
                        <button
                            onClick={() =>  router.push("/shipping/deliveries/create")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-transparent rounded-sm shadow-sm text-xs tracking-wide font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Book Delivery
                        </button>
                    </div>
                </div>
                
                <div className={"max-w-3xl w-full h-screen p-2 justify-center items-center flex flex-col md:p-0 mx-auto"}>
                    <div className={"my-4"}>
                        <div className={"my-4"}>
                            <p className={"text-black text-center text-base font-semibold"}>{"No pickups available"}</p> 
                            <p className={"text-textGrey text-center text-sm "}>{"You pickups will appear here."}</p>
                            
                        </div>
                        
                        
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
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Pickups</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/shipping/deliveries/quote")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Check Rates
                        </button>
                        <button
                            onClick={() =>  router.push("/shipping/deliveries/create")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-transparent rounded-sm shadow-sm text-xs tracking-wide font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Book Delivery
                        </button>
                    </div>
                </div>
                
                
                    
                <div>
                    {/* <div>
                        <Tabs tabs={tabs} />
                    </div> */}
                    <Header />
                    <Toolbar />
                    <div className="shadow pb-20 min-h-screen">
                        <div className="overflow-y-auto max-h-screen">
                            <ul className="divide-y divide-gray-100 border-t ">
                                <li>
                                    <div className="block">
                                        <div className="flex items-center py-4 lg:pl-2">
                                            <div className="hidden min-w-0 flex-1 lg:flex items-start">
                                                <div className="flex-shrink-0 flex-col mr-6 w-16">
                                                    <p className="font-medium uppercase text-sm text-gray-400">DATE</p>
                                                </div>
                                                <div className="flex-shrink-0 flex-1 flex-col mr-6">
                                                    <p className="font-medium truncate text-sm text-gray-400">{"COURIER"}</p>
                                                </div>
                                                <div className="flex-shrink-0 flex-1 flex-col mr-6 w-1/3">
                                                    <p className="font-medium truncate text-sm text-gray-400">{"ORIGIN"}</p>
                                                </div>
                                                <div className="flex flex-col mr-6 w-1/4">
                                                    <p className="font-medium truncate flex items-center text-sm text-gray-400">{"STATUS"}</p>
                                                </div>
                                            </div>
                                            <div className="w-4"></div>
                                        </div>
                                    </div>
                                </li>
                                {results.map((item, idx) => {
                                    return(
                                        <PickupItem key={item.pk} item={item} isSelected={current?.pk === item.pk} onItemSelected={() => onItemSelected(item)} />
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {current && (<SlideOver setOpen={setSlideVisible} open={slideVisible}>
                       
                            <div className="max-h-screen">
                                <div className={"max-w-3xl w-full relative p-2 pb-20 mx-auto"}> 
                                    <div className={"mt-4 mb-4"}>
                                        <p className={"text-primary text-xs md:text-sm font-semibold"}>
                                            {`${formatString(
                                                'Origin',
                                                'uppercase',
                                            )}`}</p>
                                            <p className={"text-gray-800 capitalize text-sm md:text-base"}>{`${originMain}`}</p>                        
                                            <p className={"text-gray-500 text-sm md:text-base"}>{`${originSub}`}</p>
                                    </div>
                                

                                   
                                    <div className={"mt-4 mb-4"}>
                                        <p className={"text-gray-700 text-xs md:text-sm font-semibold"}>
                                            {`${formatString(
                                                'Courier',
                                                'uppercase',
                                            )}`}</p> 
                                            <p className={"text-gray-800 capitalize text-sm md:text-base"}>{`${current?.courier?.name}`}</p>                        
                                            <p className={"text-gray-500 text-sm md:text-base"}>{`${courierSub}`}</p>                                    </div>
                    
                                    <div>
                                    <div className={"mt-4 mb-4"}>
                                        <p className={"text-gray-700 text-xs md:text-sm font-semibold"}>
                                            {`${formatString(
                                                'Merchant',
                                                'uppercase',
                                            )}`}</p> 
                                            <p className={"text-gray-800 capitalize text-sm md:text-base"}>{`${current?.merchant?.name}`}</p>                        
                                            <p className={"text-gray-500 text-sm md:text-base"}>{`${merchantSub}`}</p>                                    </div>
                    
                                    <div></div>
                                    <dl className="mt-2 border-t border-b border-gray-400 divide-y divide-gray-400">
                                            
                                        <div className="py-3 flex justify-between flex-wrap text-sm font-medium">
                                            <dt className="text-gray-600">{"Code"}</dt>
                                            <dd className="text-black truncate">{`${formatString(
                                                current?.code ?? '-',
                                                'uppercase',
                                            )}`}</dd>
                                        </div>
                                        {/* <div className={"my-4"}>
                                            {current?.items.map((opt, idx) => {
                                                const { name, item_type, quantity: q, post, unit_amount: value } = opt;
                                                const titleText = name;
                                                const subText = item_type?.name || '';
                                                const { weight: wgt = 0 } = post ?? {};

                                                const qty = parseInt(q, 10);
                                                const newQty = qty > 9 ? '9+' : qty;
                                                return(
                                                    <div key={`${idx}-{${name}`} className={"grid grid-cols-7 gap-2 py-2 text-xs"}>
                                                        <div className={"col-span-1 flex justify-center w-8 h-8 items-center rounded-full bg-gray-200"}>
                                                            <span>{newQty}</span>
                                                        </div>
                                                        <div className={"col-span-5 flex flex-col items-start justify-center"}>
                                                            <p className={"font-semibold "}>{titleText}</p>
                                                            <p className={"font-semibold  text-textGrey"} >{subText}</p>
                                                        </div>
                                                        
                                                        <div className={" col-span-1 flex flex-col justify-end items-end"}>
                                                            <p className={"font-semibold "}>{`${formatNumber(value ?? 0, '0,0.00')}`}</p>
                                                            <p className={"font-semibold text-textGrey"}>{`${formatNumber(
                                                            wgt ?? 0,
                                                            '0.00',
                                                        )}KG`}</p>

                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div> */}
                                        
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Courier Payment"}</dt>
                                            <dd className="text-black truncate">{`\u20a6${formatNumber(current?.courier_payment, '0,0.00')}`}</dd>
                                        </div>

                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Fee"}</dt>
                                            <dd className="text-black truncate">{`\u20a6${totalFee}`}</dd>
                                        </div>

                                       
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Status"}</dt>
                                            <dd className="text-black truncate">{current?.status?.name || ""}</dd>
                                        </div>
                                     
                                    </dl>
                                </div>
                    

                            </div>
                        </div>

                        
                    </SlideOver>
                    )}

                </div>

            </Layout>
        </React.Fragment>
        
    )

}

export default Page;