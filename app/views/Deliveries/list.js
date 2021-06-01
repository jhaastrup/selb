import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useMutation } from '@apollo/client';
import {formatDate, formatPhone, formatNumber, formatString} from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import { DELIVERIES } from './modules/queries';
import { DOWNLOAD_RECEIPT } from './modules/mutations';
import {Button} from "app/components/forms";
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/solid'
import { ArrowNarrowRightIcon} from '@heroicons/react/outline'
import {useUser} from "app/lib/hooks";
import {classNames} from "app/lib/utils";
import Alert from "app/services/alerts/simpleAlert";
import Tabs from "app/components/tabs";
import SlideOver from "app/components/slideOver";
import Header from "app/components/header";
import Toolbar from "app/components/toolbar";



const DeliveryItem = ({ item, isSelected, onItemSelected }) => {
   
    const { code, destination, status, items = [] } = item;
    const weight = _.sumBy(items, 'weight');

    const addressList = [
        formatString(destination.street || '', 'capitalize'),
        formatString(destination.city || '', 'capitalize'),
    ];
    const subAddressList = [
        formatString(destination.city || '', 'capitalize'),
        formatString(destination.state || '', 'capitalize'),
        formatString(destination.post_code || '', 'uppercase'),
    ];

    const codeWeight = [
        formatString(code, 'uppercase'),
        formatNumber(weight, '0,0.0'),
    ]
    
    const descriptions = _.map([items[0]], (elem) => formatString(elem.name, 'sentence'));
    const addressString = _.compact(addressList).join(' \u2022 ');
    const subAddressString = _.compact(subAddressList).join(' \u2022 ');
    const descriptionString = _.compact(descriptions).join(', ');
    const codeWeightString = _.compact(codeWeight).join(' \u2022 ')
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
                            <p className="font-medium line-clamp-1">{item.origin.name}</p>
                            <p className="text-sm text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${item.origin.city}, ${item.origin.state}`}</p>
                        </div>
                        <div className="flex-shrink-0 flex-1 flex-col mr-6 w-1/3">
                            <p className="font-medium line-clamp-1">{item.destination.name}</p>
                            <p className="text-sm text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${item.destination.city}, ${item.destination.state}, ${item.destination.country.name}`}</p>
                        </div>
                        <div className="flex flex-col mr-6 w-1/4">
                            <p className="font-bold inline-flex items-center whitespace-nowrap line-clamp-1 truncate">
                                {item.code}
                                {" \u2022 "}
                                <span className="font-medium text-indigo-400 text-xs uppercase">{item.status.name}</span>
                            </p>
                            <p className="text-sm text-gray-400 font-normal line-clamp-1 mt-0.5">
                                {`${item.last_tracking_update?.description || ""}`}
                            </p>
                        </div>
                    </div>
                    {/* visible column on mobile */}
                    <div className="lg:hidden min-w-0 flex-1 flex items-center max-w-full">
                        <div className="flex-shrink-0 flex-1 flex-col mr-6">
                            <p className="lg:text-sm font-bold truncate">{item.destination.name}</p>
                            <p className="text-sm lg:text-xs text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${item.destination.city}, ${item.destination.state}, ${item.destination.country.name}`}</p>
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
    {name: "all",view: "all"},
    {name: "on hold", view: "on-hold"},
    {name: "pending", view: "pending"},
    {name: "assigned", view: "assgined-for-pickup"},
    {name: "cancel", view: "cancelled"},
    {name: "completed", view: "delivered"},  
]

const Page = (props) => {
    const [current, setCurrent] = React.useState();
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [slideVisible, setSlideVisible] = React.useState(false);
    const [view, setView] = React.useState(() => props.view || "");
    const [loading, setLoading] = React.useState(true)
    const [deliveries, setDeliveries] = React.useState([]);
    const [isDownloadError, setIsDownloadError] = React.useState(false);
    const dataLabel = 'deliveries';
    


    const router = useRouter();
    const {error, data, fetchMore, refetch, networkStatus } = useQuery(DELIVERIES, {
        // notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        // variables:{
        //     view
        // },
        onError: () => {
            setLoading(false);
        },
        onCompleted: (data) => {
            setLoading(false)
            setDeliveries(data.deliveries.results)
        }
        
    });

   const [sendDeliveryReceipt, { loading: downloading, data: downloadData, error: downloadError }] = useMutation(
        DOWNLOAD_RECEIPT,
        {
            onCompleted: (data) => {
                setAlertVisible(true)
                setIsDownloadError(false)
                setAlertMessage("Receipt has been sent to your email")
            },
            onError: (err) => {
                console.log({ err });
                setIsDownloadError(true)
                setAlertMessage("Failed to send receipt, please try again later")
                setAlertVisible(true)
            },
        },
    );

    const downloadReceipt = (id, code) => {
        sendDeliveryReceipt({
            variables: {
                id,
                code,
            },
        });
    };


   
    const onItemSelected = (item) => {
        setCurrent(item);
        setSlideVisible(true)
    };

 
    const originMain = _.compact([
        current?.origin?.street || '',
        current?.origin?.city || '',
        formatString(current?.origin?.state || '', 'capitalize'),
        current?.origin?.country?.name || '',
        current?.origin.post_code || '',
    ]).join(', ');
    const originSub = _.compact([current?.origin?.name || '', formatPhone(current?.origin?.phone, 'NATIONAL') || '']).join(' \u2022 ');

    const destinationMain = _.compact([
        current?.destination?.street || '',
        current?.destination?.city || '',
        formatString(current?.destination?.state || '', 'capitalize'),
        current?.destination?.country?.name || '',
        current?.destination.post_code || '',
    ]).join(', ');
    const destinationSub = _.compact([current?.destination?.name || '', formatPhone(current?.destination?.phone, 'NATIONAL') || '']).join(
        ' \u2022 ',
    );

    const toTracking = (code) => {
        router.push({
            pathname: '/tracking',
            query: {code},
          })
    }


    if(loading || !deliveries){
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
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Deliveries</h2>
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

    // const { results, metadata = {} } = data[dataLabel];

    if(deliveries.length === 0){
        return(
            <Layout  pathname={router.pathname}>
                
                <div className="md:flex md:items-center md:justify-between p-4 md:px-6 md:py-8 md:sticky md:top-0 bg-white z-20">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Deliveries</h2>
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
                <Header />
                <div className={"max-w-3xl w-full h-screen p-2 justify-center items-center flex flex-col md:p-0 mx-auto"}>
                    <div className={"my-4"}>
                        <div className={"my-4"}>
                            <p className={"text-black text-center text-base font-semibold"}>{"No local shipment"}</p> 
                            <p className={"text-textGrey text-center text-sm "}>{"Your local shipments will appear here."}</p>
                            
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
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Deliveries</h2>
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
                    <Header />
                    {/* <div>
                        <Tabs setView={setView} fetch={refetch} tabs={tabs} />
                    </div> */}
                    <Toolbar />
                    

                    <div className="shadow pb-20 min-h-screen">
                        
                            <ul className="divide-y divide-gray-100 border-t ">
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
                                {deliveries.map((item, idx) => {
                                    return(
                                        <DeliveryItem key={item.pk} item={item} isSelected={current?.pk === item.pk} onItemSelected={() => onItemSelected(item)} />
                                    );
                                })}
                            </ul>
                        
                    </div>

                    {current && (<SlideOver setOpen={setSlideVisible} open={slideVisible}>
                       
                            <div className="max-h-screen">
                                <div className={"max-w-3xl w-full relative p-2 pb-20 mx-auto"}> 
                                    <div className={"mt-8 mb-4"}>
                                        <p className={"text-primary text-xs md:text-sm font-semibold"}>
                                            {`${formatString(
                                                'DELIVERY TO',
                                                'uppercase',
                                            )}`}</p> 
                                        <p className={"text-black capitalize text-sm md:text-base"}>{`${current?.destination?.name }`}</p>
                                    </div>
                                    <div className={"mt-8 mb-4"}>
                                        <p className={"text-gray-700 text-xs md:text-sm font-semibold"}>{"Origin"}</p> 
                                            <p className={"text-gray-600 capitalize text-sm md:text-base"}>{`${originMain}`}</p>                        
                                            <p className={"text-gray-400 text-sm md:text-base"}>{`${originSub}`}</p>

                                    </div>

                                    <div className={"mt-8 mb-4"}>
                                        <p className={"text-gray-700 text-xs md:text-sm font-semibold"}>
                                            {`${formatString(
                                                'Destination',
                                                'uppercase',
                                            )}`}</p> 
                                            <p className={"text-gray-600 capitalize text-sm md:text-base"}>{`${destinationMain}`}</p>                        
                                            <p className={"text-gray-400 text-sm md:text-base"}>{`${destinationSub}`}</p>

                                    </div>
                                    <div className={"my-4 py-4 text-xs font-semibold px-2 gap-6 md:flex grid grid-cols-2 md:justify-start"}>
                                            <button
                                                disable={downloading}
                                                onClick={() => downloadReceipt(current?.pk, current?.code)}
                                                className={classNames("py-2 px-2 w-auto border border-black rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-100 focus:outline-none", downloading && "cursor-not-allowed opacity-50")}
                                            >
                                            {downloading ?<><ClipLoader size={15} color={"rgba(237, 47, 89, 1)"}/> Send Receipt</> : "Send Receipt"}
                                            </button>
                                            <button
                                                onClick={() => toTracking(current?.code)}
                                                className="bg-indigo-700 w-20 py-2 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                {"Track"}
                                            </button>
                                            
                                    </div>
                    
                                <div>
                                    <dl className="mt-2 border-t border-b border-gray-400 divide-y divide-gray-400">
                                            
                                        <div className="py-3 flex justify-between flex-wrap text-sm font-medium">
                                            <dt className="text-textGrey">{"Tracking Code"}</dt>
                                            <dd className="text-black truncate">{`${formatString(
                                                current?.code ?? '-',
                                                'uppercase',
                                            )}`}</dd>
                                        </div>
                                        <div className={"my-4"}>
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
                                        </div>
                                        <div className="py-3 flex justify-between  text-sm font-medium">
                                            <dt className="text-gray-600">{"Declared Weight"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(current?.weight, '0.0')}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Declared Value"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(current?.total_value, '0,0.00')}`}</dd>
                                        </div>
                                            
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Insurance"}</dt>
                                            <dd className="text-black truncate">{`${formatString(
                                                current?.insurance_option?.name || '-',
                                                'uppercase',
                                                )}`}
                                            </dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Air Waybill"}</dt>
                                            <dd className="text-black truncate">{`${formatString(
                                                current?.current_awb || '-',
                                                'uppercase',
                                            )}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Number of pieces"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(current?.pieces?.length || current?.partner?.pieces?.length || 1, '0,0')}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Verified Weight"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(current?.partner?.weight, '0.0')}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Volumetric Weight"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(
                                                current?.partner?.dimension_weight,
                                                '0.0',
                                            )}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Billable Weight"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(
                                                current?.partner?.billable_weight,
                                                '0.0',
                                            )}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Total Fee"}</dt>
                                            <dd className="text-black truncate">{`\u20a6${formatNumber(current?.fee, '0,0.00')}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Amount Due"}</dt>
                                            <dd className="text-black truncate">{`\u20a6${formatNumber(current?.fee_balance, '0,0.00')}`}</dd>
                                        </div>
                                        
                                    </dl>
                                </div>
                    

                            </div>
                        </div>

                        
                    </SlideOver>
                    )}

                </div>
                {alertVisible && <Alert updateError={isDownloadError} description={alertMessage} show={alertVisible} onClose={setAlertVisible}/>}

            </Layout>
        </React.Fragment>
        
    )

}

export default Page;