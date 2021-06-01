import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import {formatDate,formatPhone, formatString, formatNumber} from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import { MERCHANT_SALES } from '../modules/queries';
import {Button} from "app/components/forms";
import { ChevronRightIcon, InformationCircleIcon} from '@heroicons/react/solid'
import Alert from "app/services/alerts/simpleAlert";
import Modal from "app/services/modal";
import FulfilForm from "../details/fulfill";
import Tabs from "app/components/tabs";
import SlideOver from "app/components/slideOver";
import {classNames} from "app/lib/utils"
import Toolbar from "app/components/toolbar";
import Header from "app/components/header";

const OrderItem = ({ item, onItemSelected, isSelected }) => {
    const {
        pk,
        tracking_code,
        total_weight,
        code,
        name,
        email,
        phone,
        status,
        amount_paid,
        date_created,
        delivery_address,
        items,
    } = item;

    const qty = _.reduce(items, (prev, curr) => _.sum([prev, curr.quantity]), 0);
    const order = items && !_.isEmpty(items) ? items[0] : undefined;
    const uri = (order && order.post?.images[0].url) || undefined;
    const quantityBox = qty && qty > 1 ? true : false;

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
                        {/* <div className="flex-shrink-0 flex-1 flex-col mr-6">
                            <p className="font-medium line-clamp-1">{item.origin.name}</p>
                            <p className="text-sm text-gray-400 font-normal line-clamp-1 capitalize mt-0.5">{`${item.origin.city}, ${item.origin.state}`}</p>
                        </div> */}
                        <div className="flex-shrink-0 flex-1 flex-col mr-6">
                            <div className="w-12 h-12 relative">
                                <img className="h-12 w-12 object-cover" src={uri} alt={name} />
                                {quantityBox && (
                                    <div className={"w-8 h-8 bg-black text-sm text-white flex justify-center items-center absolute -right-2 -bottom-2 rounded-full"}>{qty.length > 9 ? `9+`: qty}</div>
                                )}
                            </div>
                        </div>
                        <div className="flex-shrink-0 flex-1 flex-col mr-6 w-1/3">
                            <p className="font-medium line-clamp-1">{item.buyer_profile.name}</p>
                            <p className="text-sm text-gray-400 font-normal line-clamp-1 mt-0.5">{item.buyer_profile.email ? `${item.buyer_profile.email},`: ""} {item.buyer_profile.phone ?? ""}</p>
                        </div>
                        <div className="flex flex-col mr-6 w-1/4">
                            <p className="font-bold inline-flex items-center whitespace-nowrap line-clamp-1 truncate">
                                {code}
                                {" \u2022 "}
                                <span className="font-medium text-indigo-400 text-xs uppercase">{status.name}</span>
                            </p>
                            
                        </div>
                    </div>
                    {/* visible column on mobile */}
                    <div className="lg:hidden min-w-0 flex-1 flex items-center max-w-full">
                        <div className="flex-shrink-0 flex-col mr-6">
                            <div className="w-12 h-12 relative">
                                <img className="h-12 w-12 object-cover" src={uri} alt={name} />
                                {quantityBox && (
                                    <div className={"w-8 h-8 bg-black text-sm text-white flex justify-center items-center absolute -right-2 -bottom-2 rounded-full"}>{qty.length > 9 ? `9+`: qty}</div>
                                )}
                            </div>
                        </div>
                        <div className="flex-shrink-0 flex-col mr-2 items-end text-right">
                            <p className="lg:text-sm font-bold uppercase">{code}</p>
                            <p className="font-medium text-indigo-400 text-xs mt-0.5 uppercase">{status.name}</p>
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
    {name: "fulfilled"},
    {name: "pending"},
    {name: "cancel"}
]


const Page = () => {
    const dataLabel = 'getDiscoverySales';
    const router = useRouter();
    const [current, setCurrent] = React.useState();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [fullfillmentError, setFullfillmentError] = React.useState(false);
    const [slideVisible, setSlideVisible] = React.useState(false);

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(MERCHANT_SALES, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log('===> in merchant orders error', { errors });
        },
        onCompleted: (data) => {
            const { getDiscoverySales } = data;
        },
    });

    

    const onItemSelected = (item) => {
        setCurrent(item);
        setSlideVisible(true)
    };


    const addressList = [
        formatString(current?.delivery_address?.street ?? '', 'capitalize'),
        formatString(current?.delivery_address?.city ?? '', 'capitalize'),
        formatString(current?.delivery_address?.state ?? '', 'capitalize'),
        formatString(current?.delivery_address?.country?.name ?? '', 'capitalize'),
        formatString(current?.delivery_address?.post_code ?? '', 'uppercase'),
    ];

    const originAddressList = [
        formatString(current?.store_location?.street ?? '', 'capitalize'),
        formatString(current?.store_location?.city ?? '', 'capitalize'),
        formatString(current?.store_location?.state ?? '', 'capitalize'),
        formatString(current?.store_location?.country?.name ?? '', 'capitalize'),
        formatString(current?.store_location?.post_code ?? '', 'uppercase'),
    ];

    

    const addressString = _.compact(addressList).join(', ');
    const originAddressString = _.compact(originAddressList).join(', ');

    const destinationSub = _.compact([
        current?.delivery_address?.email || '',
        formatPhone(current?.delivery_address?.phone, 'NATIONAL') || '',
    ]).join(' \u2022 ');

    const originSub = _.compact([
        current?.store_location?.email || '',
        formatPhone(current?.store_location?.phone, 'NATIONAL') || '',
    ]).join(' \u2022 ');

    const _onOrderCompleted = () => {
        setModalVisible(false);
        setAlertVisible(true);
        setFullfillmentError(false);
        setAlertMessage("Order has been fullfilled successfully")
        refetch && refetch();
    };
    const _onOrderError = () => {
        setModalVisible(false);
        setAlertVisible(true);
        setAlertMessage('Order fullfillment failed');
        setFullfillmentError(true);
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
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Orders</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/e-commerce/create/order")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Order
                        </button>
                        
                    </div>
                </div>
                <div className={"max-w-3xl w-full p-2 min-h-full  m-auto justify-center items-center flex flex-col md:p-0 mx-auto"}>
                    <div className={"my-4"}>
                        <p className={"text-black text-center text-base font-semibold"}>{"An error ocurred"}</p> 
                        <p className={"text-textGrey text-center text-sm "}>{"Your orders will appear here"}</p>
                        
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

    const { results, metadata = {} } = data[dataLabel];
   

    if(results.length === 0){
        return(
            <Layout  pathname={router.pathname}>
               <div className="md:flex md:items-center md:justify-between p-4 md:px-6 md:py-8 md:sticky md:top-0 bg-white z-20">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Orders</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/e-commerce/create/order")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Order
                        </button>
                       
                    </div>
                </div>
                <div className={"max-w-3xl w-full p-2  m-auto justify-center items-center flex flex-col md:p-0 mx-auto"}>
                    <div className={"my-4"}>
                        <div className={"my-4"}>
                            <p className={"text-black text-center text-base font-semibold"}>{"No Orders"}</p> 
                            <p className={"text-textGrey text-center text-sm "}>{"Your Orders will appear here"}</p>
                            
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
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Orders</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/e-commerce/create/order")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Order
                        </button>
                        
                    </div>
                </div>
                {/* <div>
                    <Tabs tabs={tabs} />
                </div> */}
                <div>
                    <Header />
                    <Toolbar />
                    <div className="bg-gray-50  shadow overflow-y-auto pb-20 max-h-screen">
                    
                        <ul className="divide-y divide-gray-100 ">
                            <li>
                                <div className="block">
                                    <div className="flex items-center py-4 lg:pl-2">
                                        <div className="hidden min-w-0 flex-1 lg:flex items-start">
                                            <div className="flex-shrink-0 flex-col mr-6 w-16">
                                                <p className="font-medium uppercase text-sm text-gray-400">DATE</p>
                                            </div>
                                            <div className="flex-shrink-0 flex-1 flex-col mr-6">
                                                <p className="font-medium truncate text-sm text-gray-400">{"PRODUCT"}</p>
                                            </div>
                                            <div className="flex-shrink-0 flex-1 flex-col mr-6 w-1/3">
                                                <p className="font-medium truncate text-sm text-gray-400">{"BUYER"}</p>
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
                                    <OrderItem key={item.pk} item={item} isSelected={current?.pk === item.pk} onItemSelected={() => onItemSelected(item)} />
                                );
                            })}
                        </ul>
                    </div>
                    {current && (<SlideOver setOpen={setSlideVisible} open={slideVisible}>
                        <div className="pb-16 space-y-6">
                                
                                <div className={"mt-8 mb-4"}>
                                    <p className={"text-primary text-xs md:text-sm font-semibold"}>
                                        {`${formatString(
                                            'DELIVERY TO',
                                            'uppercase',
                                        )}`}</p> 
                                    <p className={"text-black capitalize text-sm xl:text-base"}>{`${current?.delivery_address?.name ?? ''}`}</p>
                                </div>
                                <div className={"mt-8 mb-4"}>
                                    <p className={"text-gray-700 uppercase text-sm xl:text-base font-semibold"}>{"Origin"}</p> 
                                        <p className={"text-gray-600 capitalize text-sm 2xl:text-base"}>{`${originAddressString}`}</p>                    
                                        <p className={"text-gray-600 capitalize text-sm 2xl:text-base"}>{`${current?.delivery_address?.name ?? ''}`}</p>
                                        <p className={"text-gray-400 text-sm 2xl:text-base"}>{`${originSub}`}</p>

                                </div>

                                <div className={"mt-8 mb-4"}>
                                    <p className={"text-gray-700 text-sm xl:text-base font-semibold"}>
                                        {`${formatString(
                                            'Destination',
                                            'uppercase',
                                        )}`}</p> 
                                        <p className={"text-gray-700 capitalize  text-sm 2xl:text-base"}>{`${addressString}`}</p>                        
                                        <p className={"text-gray-600 capitalize  text-sm 2xl:text-base"}>{`${current?.delivery_address?.name ?? ''}`}</p>
                                        <p className={"text-gray-400 text-sm 2xl:text-base"}>{`${destinationSub}`}</p>

                                </div>
                                <div className="flex">
                                    <div>
                                        {['pending', 'assigned_for_pickup'].includes(current?.fulfillment_status.code) ? (<button
                                                onClick={() => setModalVisible(true)}
                                                type="button"
                                                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-gray-100 focus:outline-none"
                                            >
                                                Fullfill Order
                                            </button>): null}
                                    </div>
                                
                                   
                                    <div className="flex ml-3 justify-items-center items-center ">
                                        <button
                                            type="button"
                                            className="bg-indigo-700  py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <Link href={`mailto:${current?.delivery_address?.email || ""}`} passHref={true}>
                                            Send Message
                                        </Link>
                                        </button>
                                    </div>
                                       
                                    
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
                                        <div>
                                            {current?.items.map((opt, idx) => {
                                                const { name, item_type, weight, quantity: q, post, unit_amount: value } = opt;
                                                const titleText = name;
                                                const subText = item_type?.name || '';
                                                {/* const { weight: wgt = 0 } = post ?? {}; */}

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
                                                            weight ?? 0,
                                                            '0.00',
                                                        )}KG`}</p>

                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            </div>
                                        <div className="py-3 flex justify-between  text-sm font-medium">
                                            <dt className="text-gray-600">{"Sku"}</dt>
                                            <dd className="text-black truncate">{`${formatString(current?.fulfillment_status?.code ?? 'pending', 'uppercase')}`}</dd>
                                        </div>
                                        
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Total Weight"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(
                                                current?.total_weight ?? 0,
                                                '0,0.[00]',
                                            )}KG`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Toatl Value"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(
                                                current?.amount ?? 0,
                                                '0,0.[00]',
                                            )}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-gray-600">{"Number of Items"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(
                                                current?.quantity ?? 0,
                                                '0,0',
                                            )}`}</dd>
                                        </div>
                                    </dl>
                                </div>
                                
                            </div>
                    </SlideOver>)}
                    {/* <aside className="hidden bg-gray-50 col-span-2  pb-16 max-h-screen p-4 overflow-y-auto lg:block">
                        {current && (
                           
                        )}
                    </aside> */}
                </div>
                {modalVisible ? (
                    <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
                        <FulfilForm 
                            orderObject={current} 
                            onSuccess={_onOrderCompleted}
                            onError={_onOrderError}
                        />
                    </Modal>

                ): null}
                {alertVisible && <Alert updateError={fullfillmentError} description={alertMessage} show={alertVisible} onClose={setAlertVisible}/>}

            </Layout>
        </React.Fragment>
        
    )

}

export default Page;