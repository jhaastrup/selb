import * as React from "react";
import { useRouter } from "next/router";
import Wizard from "app/services/pagewizard";
import {useQuery} from "@apollo/client";
import {BUSINESS_ORDER_DEPENDENCIES} from "../../modules/queries";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import {Button} from "app/components/forms";

import Success from './success';
import Error from './failed';
import Extra from "./extra";
import Destination from "./destination";
import Review from "./review";
import Items from "./items";


const pages = [
    {name: "default", page: Items},
    {name: "destination", page: Destination},
    {name: "extra", page: Extra},
    {name: "review", page: Review},
    {name: "success", page: Success},
    {name: "error", page: Error}

]
const Page = ({ onClose,
    initialData={},
    isModal=false,
    }) => {
    

    const router = useRouter();

    const { data, loading, error, refetch, networkStatus } = useQuery(BUSINESS_ORDER_DEPENDENCIES, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
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
        <div>
            <Wizard 
                pages={pages}
                dependencies={data}
                isModal={isModal}
                onClose={onClose}
                pageClose={router.back}
                title={"Create Order"}
             />
        </div>
        
    )
}
export default Page;
