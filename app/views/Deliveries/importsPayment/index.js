import React from 'react';
import {useRouter} from "next/router";
import {useQuery, useMutation} from "@apollo/client";
import {formatNumber} from "app/lib/formatters";
import _ from "lodash";
import {DELIVERY_DEPENDENCIES} from "../modules/queries";
import { VERIFY_TRANSFER } from '../modules/mutations';
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";

import Wizard from "app/services/pagewizard";
import Destination from "./destination";
import Review from "./review";
import PaymentOption from "./options";
import Pay from "./pay";
import Success from "./success";

const Page = ({open, isModal=false, onClose, obj, onRefresh}) => {
    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(DELIVERY_DEPENDENCIES, {
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

    console.log("FROM WITHDRAW!!!", {obj});

    const dataFixed = _.omit(obj, ["destination"]);

    const pages = [
        {name: "default", page: Destination},
        {name: "review", page: Review},
        {name: "options", page: PaymentOption},
        {name: "pay", page: Pay},
        {name: "success", page: Success},
    ];

    return (
        <Wizard 
            open={open}
            isModal={isModal}
            onClose={onClose}
            pageClose={onClose}
            initialData={dataFixed}
            dependencies={data}
            pages={pages}
            onRefresh={onRefresh}
        />
    );
};

export default Page;