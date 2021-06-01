import React from 'react';
import { useQuery } from '@apollo/client';
import { FOREIGN_WAREHOUSES } from './modules/queries';
import _ from 'lodash';
import { useRouter } from "next/router";
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";

import Wizard from "app/services/pagewizard";
import Start from "./start";
import Detail from "./detail";

const Page = ({ open, isModal }) => {
    const router = useRouter();

    const { loading, error, data, refetch } = useQuery(FOREIGN_WAREHOUSES, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
    });

    const onCancel = () => {
        router.back();
    };

    if (loading && !data) {
        return (
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

    const pages = [
        { name: "default", page: Start },
        { name: "detail", page: Detail },
    ];

    const { getWarehouseAddresses: results = [] } = data || {};

    return (
        <Wizard
            open={open}
            onClose={onCancel}
            pageClose={onCancel}
            isModal={isModal}
            dependencies={results}
            pages={pages}
            onReFresh={() => refetch()}
        />
    )
}

export default Page;