import React from 'react';
import {useRouter} from "next/router";
import {useQuery, useMutation} from "@apollo/client";
import _ from "lodash";
import {DEPENDENCIES} from "../modules/queries";
import { VERIFY_TRANSFER } from '../modules/mutations';
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";

import Wizard from "app/services/pagewizard";
import BankInfo from './info';
import Otp from './otp';
import Kyc from './kyc';
import Success from "./success";
import Failed from "./error";

const pages = [
    {name: "default", page: BankInfo},
    {name: "otp", page: Otp},
    {name: "kyc", page: Kyc},
    {name: "success", page: Success},
    {name: "failed", page: Failed}
];

const Page = ({onClose, onRefresh}) => {
    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(DEPENDENCIES, {
        fetchPolicy: 'cache-and-network',
    });

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
            onClose={onClose}
            pageClose={onClose}
            dependencies={data}
            pages={pages}
            onRefresh={onRefresh}
        />
    );
};

export default Page;

