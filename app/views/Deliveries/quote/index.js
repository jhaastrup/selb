import * as React from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from '@apollo/client';
import { DELIVERY_DEPENDENCIES } from '../modules/queries';
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import {Button} from "app/components/forms";
import Wizard from "app/services/pagewizard";
import Form from "./form";
import Rate from "./rate"
const pages = [
    {name: "default", page: Form},
    {name: "rate", page: Rate},
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
            title={"Delivery Quote"}
            open={open}
            isModal={isModal}
            onClose={onClose}
            pageClose={router.back}
        />
        
    )
}
export default Page;