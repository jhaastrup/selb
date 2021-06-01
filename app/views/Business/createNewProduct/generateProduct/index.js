import * as React from "react";
import { useRouter } from "next/router";
import {useQuery} from "@apollo/client";
import Wizard from "app/services/pagewizard";
import {PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import Start from "./start";
import Success from './success';
import Error from './error';
import Description from "./description";
import {DISCOVERY_PRODUCT_DEPENDENCIES} from "../../modules/queries";
import { Button} from "app/components/forms";
import Social from "./social";
import Store from "./stores";
const pages = [
    // {name: "default", page: Start},
    {name: "default", page: Description},
    // {name: "socials", page: Social},
    // {name: "stores", page: Store},
    {name: "success", page: Success},
    {name: "error", page: Error}

]
const Page = ({onClose, isModal=false}) => {
    const router = useRouter();

    const { data, loading, error, refetch } = useQuery(DISCOVERY_PRODUCT_DEPENDENCIES, {
        fetchPolicy: 'cache-and-network',
        variables: { sort_by: { asc_desc: 'asc' } },
        onCompleted: (data) => {
            console.log('product dependencies', { data });
        },
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

    const { discoveryDependencies, businessCategories } = data;

   
    return(
        <div>
            <Wizard 
                pages={pages}
                onClose={onClose}
                dependencies={data}
                isModal={isModal}
                title={"List Product"}
                pageClose={router.back}
                onTransition={refetch}
             />
        </div>
        
    )
}
export default Page;