import React from 'react';
import {useRouter} from "next/router";
import {useQuery, useMutation} from "@apollo/client";
import {formatNumber} from "app/lib/formatters";
import _ from "lodash";
import {DELIVERY_DEPENDENCIES} from "app/views/Deliveries/modules/queries";
import { VERIFY_TRANSFER } from '../modules/mutations';
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";



import Wizard from "app/services/pagewizard";
import Review from "./review";
import Weight from "./weight";

const pages = [
    {name: "default", page: Weight},
    {name: "review", page: Review},
];

const Page = ({obj, onClose, isModal=false, open}) => {
    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(DELIVERY_DEPENDENCIES, {
        fetchPolicy: 'cache-and-network',
    });

    // const onCancel = () => {
    //     router.push("/overseas");
    // };

    if(loading && !data){
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

    console.log("FROM INDEX!!!!",{obj})

    return (
        <Wizard 
            open={open}
            onClose={onClose}
            pageClose={onClose}
            isModal={isModal}
            initialData={{origin: obj}}
            dependencies={data}
            pages={pages}
        />
    );
};

export default Page;

