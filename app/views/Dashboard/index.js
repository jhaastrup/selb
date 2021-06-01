import * as React from "react";
import { PublicLayout as Layout } from "app/views/Layout";
import {useQuery, useMutation} from "@apollo/client";
import { UserIcon } from '@heroicons/react/outline'

import {formatNumber, formatDate} from "app/lib/formatters";
import {GET_PROFILE} from "./modules/queries";
import { useRouter } from "next/router";
import {Button} from "app/components/forms"
import { Spacer } from "app/components/assets";
import Card from "app/components/homeCard";
import Modal from "app/services/modal";
import generateLogos from "./logos";
import Loading from "app/components/loading"
// import Header from "app/components/header";


const Page = () => {
   
    const router = useRouter();


    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_PROFILE, {
        fetchPolicy: 'cache-and-network',
        // variables: { filter_by, sort_by, page_by, query },
        onError: (errors) => {
            console.log({ errors });
        },
      
    });

    if(loading){
        return(
            <Layout pathname={router.pathname}>
                <Loading />
            </Layout>
        )
    }

    if (error) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <div>
                    <p className={"text-center"}>{'unknown error occurred'}</p>
                </div>
                <Spacer className={"block h-5"} />
                <div>
                    <Button
                        onClick={() => refetch && refetch()}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Try Again'}
                    </Button>
                </div>
            </div>
        )
    }

    const { me = {} } = data;
    const { paymentProfile = {}, photo } = me;
    const serviceLogos = generateLogos(router);
    const avatarUrl = photo ? photo : undefined;
    return(
        <React.Fragment>
            <Layout pathname={router.pathname}>
                <div className="bg-white shadow">
                    <div className="px-4 sm:px-6  lg:px-8">
                        <div className="py-6 md:flex md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                {/* Profile */}
                                <div className="flex items-center">
                                    {/* <img className="hidden h-16 w-16 rounded-full sm:block" src={avatarUrl} alt="profile photo" /> */}
                                    {avatarUrl ? (<img className="hidden h-12 w-12 rounded-full sm:block" src={avatarUrl} alt="profile photo" />) : (
                                        <div className="hidden items-center justify-center h-12 w-12 bg-textGrey rounded-full sm:flex">
                                            <UserIcon className="flex-shrink-0 h-10 w-10 text-gray-500 group-hover:text-gray-500" aria-hidden="true"/>
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center">
                                            <h1 className="ml-3 text-2xl font-bold leading-7 text-black sm:leading-9 sm:truncate">
                                            {`Hello, ${me.name}`}  
                                            </h1>
                                        </div>
                                        <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                            <dt className="sr-only">Account Balance</dt>
                                            <dd className="flex items-center text-sm text-textGrey font-medium capitalize sm:mr-6">
                                                {/* Heroicon name: solid/office-building */}
                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                                </svg>
                                                <span style={{fontSize:"10px"}} className={"text-textGrey"}>{"NGN"}</span>
                                                {`${formatNumber(
                                                    paymentProfile.funds,
                                                    '0,0.00',
                                                )}`}
                                            </dd>
                                            <dt className="sr-only">Account status</dt>
                                            <dd className="mt-3 flex items-center text-sm text-gray-500 font-medium sm:mr-6 sm:mt-0 capitalize">
                                                {/* Heroicon name: solid/check-circle */}
                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Verified account
                                            </dd>
                                        </dl>

                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-items-end space-x-3 md:mt-0 md:ml-4">
                                <button type="button" 
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                >
                                Add money
                                </button>
                                <button type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500" 
                                >
                                    Send money
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Header /> */}

                <div className={"mx-auto"}>
                    
                    <div className="mt-8 min-h-screen">
                        <div class="px-4 sm:px-6 lg:px-8 pb-20 max-h-screen overflow-y-auto ">
                            <h2 className="text-lg leading-6 font-medium text-gray-900">Overview</h2>
                            <div className="mt-2 grid grid-cols-1  gap-5 sm:grid-cols-2 2xl:grid-cols-4 lg:grid-cols-3">
                                {serviceLogos.map((item, idx) => {
                                const {title, description, onPress, Logo, mainColor} = item;
                                    return(
                                        <Card
                                            key={`${title}-${idx}`} 
                                            title={title}
                                            description={description}
                                            onPress={onPress}
                                            Logo={Logo}
                                            mainColor={mainColor}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
            
        </React.Fragment>
        
    )
}
export default Page;