import React from 'react';
import {useRouter} from "next/router";
import {useQuery, useMutation} from "@apollo/client";
import {formatNumber} from "app/lib/formatters";
import _ from "lodash";
import {WALLET_DEPENDENCIES} from "../modules/queries";
import { VERIFY_TRANSFER } from '../modules/mutations';
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";

import Wizard from "app/services/pagewizard";
import Amount from "./amount";
import Review from "./review";
import Kyc from "./kyc";
import User from "./user";
import Success from "./success";
import Failed from "./error";
import Pay from "./pay";


const Page = () => {
    const router = useRouter();
    const open = true;

    const { data, loading, error, refetch } = useQuery(WALLET_DEPENDENCIES, {
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

    console.log("FROM WITHDRAW!!!", {data});
    const { bvn_validated: validated = false } = data?.kyc ?? {};

    const pages = [
        {name: "default", page: validated ? Amount : Kyc},
        {name: "user", page: User},
        {name: "review", page: Review},
        {name: "success", page: Success},
        {name: "failed", page: Failed},
        {name: "pay", page: Pay}
    ];

    return (
        <Wizard 
            open={open}
            onClose={onCancel}
            pageClose={onCancel}
            title={`NGN ${formatNumber(data.me.paymentProfile.funds, '0,0.00')}`}
            dependencies={data}
            pages={pages}
        />
    );
};

export default Page;

