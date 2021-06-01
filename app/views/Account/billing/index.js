import React, {useState} from 'react';
import {useRouter} from "next/router";
import {useQuery, useMutation} from "@apollo/client";
import _ from "lodash";

import { BILLING_DEPENDENCIES } from '../modules/queries';
import { VERIFY_BILL_PAYMENT } from '../modules/mutations';
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";



import Wizard from "app/services/pagewizard";
import Amount from "./amount";
import Service from './service';
import Customer from "./customer";
import Review from "./review";
import Pay from "./pay";
import Failed from "./error";
import Success from "./success";
import NotAvailable from "./notAvailable";

const pages = [
    // {name: "default", page: Amount},
    {name: "default", page: NotAvailable},
    {name: "service", page: Service},
    {name: "customer", page: Customer},
    {name: "review", page: Review},
    {name: "success", page: Success},
    {name: "failed", page: Failed},
    {name: "pay", page: Pay}
];

const Page = ({category}) => {
    const router = useRouter();
    const open = true;
    const hasGroups = category === 'airtime' ? false : true;
    const minimumAmount = category === 'airtime' ? 100 : 1000;
    const billingData= {category, hasGroups, minimumAmount}


    const { data, loading, error, refetch } = useQuery(BILLING_DEPENDENCIES, {
        fetchPolicy: 'cache-and-network',
    });

    const onCancel = () => {
        router.push("/account");
    };

    if(loading){
        return(
            <div className={"flex h-screen justify-center items-center"}>
                <Loading />
            </div>
        )
    }

    if (error) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <div>
                    <p className={"text-center"}>{'unknown error occurred'}</p>
                    {/* <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p> */}
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

    return (
        <Wizard 
            open={open}
            billingData={billingData}
            onClose={onCancel}
            pageClose={onCancel}
            dependencies={data}
            pages={pages}
        />
    )
}

export default Page;