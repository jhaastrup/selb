import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROFILE } from './modules/queries';
import {formatDate, formatString} from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import Activation from "./activate";
import {Button} from "app/components/forms";
import {classNames} from "app/lib/utils";


const ListView = ({titleText, status, subText}) => {
    return (
        <div 
            className={"py-3 flex justify-between border border-r-0 border-l-0 border-t-0 border-gray-100"}
        >
            <div className="flex-1">
                <p className={"text-gray-500 text-xs md:text-sm font-bold"}>{titleText}</p>
            </div>
            <div className="flex-1">
                <p className={classNames("text-xs md:text-sm font-semibold", status === 1 && "text-green-600", status === 0 && "text-red-600")}>{subText}</p>
            </div>
        </div>
    )
}



const Page = () => {

    const { data, loading, error, refetch, networkStatus } = useQuery(GET_PROFILE, {
        fetchPolicy: 'cache-and-network',
        
    });

    const router = useRouter();

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
                <div className={"h-40 mt-auto flex items-center justify-center"}>
                    <Button
                        onClick={() => refetch && refetch()} 
                    >
                       Try Again
                    </Button>
                </div>
            </Layout>
        )
    }

    const navigateToProductCreate = () => {
        router.push("/business/create/product")
    }

    const navigateToOrderCreate = () => {
        router.push("/business/create/order")
    }


   
    const { me = {}, businessOrders = {}, businessProducts = {}, business = {} } = data || {};
    const { username, discoveryProfile } = me;
    const { store_name, store_description, sales_volume, profile_picture, ecommerce_stats } = discoveryProfile;
    const website = `https://my.sendbox.co/${username}`;
    const storeLogo = profile_picture || undefined;
    const showBusiness = me && me.account_type?.code !== 'business';

    const {
        days_left = undefined,
        reward = undefined,
        reward_type = undefined,
        shipments_made = undefined,
        shipments_more = undefined,
        status = undefined,
        start_date = undefined,
        end_date = undefined,
        import_discount = 0,
        shippingProfile = {},
    } = business || {};

    const description = (reward && reward?.type.description) ?? '-';
    const statusIcon = status && status.toLowerCase() === 'active' ? true : false;
    const shipmentSubText = shipments_made ? `${shipments_made ?? ''} of ${shipments_more ?? ''}` : "No shipment made"
    return(
        <React.Fragment>
            <Layout pathname={router.pathname}>
            {showBusiness ? (
                <Activation />
            ):(
                <>
                    <div className="bg-white sticky inset-0 z-30 shadow">
                           
                        <div className="px-4 sm:px-6  lg:px-8">
                            <div className="py-6 md:flex md:items-center md:justify-between">
                                <div className="flex-1 min-w-0">
                                    
                                        <div>
                                            <div className="flex">
                                                <h3 className="ml-3 text-2xl font-bold leading-7 text-black sm:leading-9 sm:truncate">
                                                {"Business Dashboard"}  
                                                </h3>
                                            </div>
                                        </div>
                                </div>
                                <div className="mt-6 flex justify-items-end space-x-3 md:mt-0 md:mr-3">
                                    <button
                                        onClick={navigateToProductCreate}
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                    >
                                    List Product
                                    </button>
                                    <button
                                        onClick={navigateToOrderCreate}
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500" 
                                    >
                                        Create Orders
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"p-4  max-h-screen overflow-y-auto"}> 
                        <div className={"my-4"}>
                            <p className={"text-red-600 text-sm lg:text-base font-semibold"}>{"Business"}</p> 
                            <p className={"text-black mt-2 text-sm md:text-base font-bold"}>{store_name}</p>
                            <p className={"text-sm lg:text-base text-gray-600"}>{store_description}</p>
                            <div className={"mt-2"}>
                                <p onClick={() => window.open(`${website}`)} className={"text-xs md:text-sm lg:text-base text-red-600"}>{website}</p>
                            </div>
                        </div>
                    
                        <div className={"mt-6"}>
                            <p className={"text-green-600 text-sm font-semibold"}>{"BISINESS BENEFITS"}</p> 

                        </div>
                        <div className={"my-4"}>
                            <ListView titleText={'CURRENT STATUS'} status={status === "active" ? 1 : status === "inactive" ? 0 : undefined} subText={status ?`${formatString(status, 'uppercase')}`: "Inactive"}/>
                            <ListView titleText={'AVAILABLE UNTIL'} subText= {end_date ? `${formatString(formatDate(end_date, 'LL'), 'uppercase')}` : '-'} />
                            <ListView titleText={'SHIPMENT SO FAR'} subText={`${shipments_made ?? ''} / ${
                                    shipments_more ?? ''
                                }`} />
                            <ListView titleText={"DISCOUNTS EARNED"} subText={`${
                                    shippingProfile?.business_discount ?? '0'
                                }`}/>
                        </div>
                    
                        <div className={"my-4"}>
                            <p className={"text-sm lg:text-base text-gray-600"}>
                                <span>
                                    {'You can continue to earn discounts on your local and international deliveries. Extend this discount by processing at least 24 deliveries on or before '}
                                </span>
                                <span>{" "}</span>
                                <span className={"text-red-600 underline"}>
                                    {(end_date && end_date !== null) || end_date !== undefined
                                        ? `${formatDate(end_date, 'LL')}`
                                        : ''}
                                </span>
                            
                            </p>
                        </div>
                    </div> 
                   
                </>
            )}
                
            </Layout>
        </React.Fragment>
    )
}
export default Page;

