import * as React from "react";
import { useQuery } from '@apollo/client';
import { ENTITY_DEPENDENCIES } from '../../modules/queries';
import { BusinessLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import Wizard from "app/services/pagewizard";
import Address from "./address";
import Username from "./username";
import Success from "./success";
import Description from "./description";
import { useRouter } from "next/router";

const pages = [
    {name: "default", page:Username},
    {name: "address", page: Address},
    {name: "description", page: Description},
    {name: "success", page: Success},

]
const Page = ({
    initialData={},
    onClose,
}) => {
    const { loading, error, data } = useQuery(ENTITY_DEPENDENCIES, {
        variables: {
            countriesInput: {
                page_by: {
                    per_page: '400',
                },
            },
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log({ errors });
        },
    });
    const router = useRouter();

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
                dependencies={data}
                pages={pages}
                initialData={initialData}
                onClose={onClose}
                pageClose={router.back}
             />
        </div>
        
    )
}
export default Page;