import * as React from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from '@apollo/client';
import { DELIVERY_DEPENDENCIES } from '../modules/queries';
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import {Button} from "app/components/forms";
import Modal from "app/services/modal";

import Wizard from "app/services/pagewizard";
import Destination from "./destination";
import Review from "./review";
import Items from "./items";
import Failed from "./failed";
import Rates from "./rates";
import Pay from "./pay";
import Origin from "./origin";
import DropOff from "./drop-off";
import Success from "./success";
import Options from "./options";
import Weight from "./weight";
import Insurance from "./insurance";

const pages = [
    {name: "default", page: Origin},
    {name: "drop_off", page: DropOff},
    {name: "destination", page: Destination},
    {name: "items", page: Items},
    {name: "weight", page: Weight},
    {name: "rates", page: Rates},
    {name: "insurance", page: Insurance},
    {name: "review", page: Review},
    {name: "options", page: Options},
    {name: "pay", page: Pay},
    {name: "failed", page: Failed},
    {name: "success", page: Success}


]
const Page = ({
    initialData={
        incoming_option_code: 'pickup',
    },
    isModal=false,
    open,
    onClose
}) => {
    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(DELIVERY_DEPENDENCIES, {
        // fetchPolicy: 'cache-and-network',
    });


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


    return(
            <Wizard 
                dependencies={data}
                pages={pages}
                initialData={initialData}
                title={"Book Delivery"}
                open={open}
                isModal={isModal}
                onClose={onClose}
                pageClose={router.back}
            />
        
    )
}
export default Page;