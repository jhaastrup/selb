import React from 'react';
import {useRouter} from "next/router";
import {useQuery, useMutation} from "@apollo/client";
import _ from "lodash";
import {VERIFICATION_DEPENDENCIES} from "./modules/queries";
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";

import Wizard from "app/services/pagewizard";
import Start from './start';
import Bvn from './bvn';
import Otp from './otp';
import Success from "./success";
import Failed from "./error";

const pages = [
    {name: "default", page: Start},
    {name: "bvn", page: Bvn},
    {name: "otp", page: Otp},
    {name: "success", page: Success},
    {name: "failed", page: Failed}
];

const Page = ({onClose}) => {
    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(VERIFICATION_DEPENDENCIES, {
        fetchPolicy: 'cache-and-network',
    });

    const onCancel = () => {
        router.push("/settings");
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
            onClose={onCancel}
            pageClose={onCancel}
            dependencies={data}
            pages={pages}
        />
    );
};

export default Page;

