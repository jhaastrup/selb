import * as React from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from '@apollo/client';
import { SUBJECT_TYPE } from '../modules/queries';
import { PublicLayout as Layout } from "app/views/Layout";
import Wizard from "app/services/pagewizard";
import Chanels from "./start";
import Types from "./types";
import Form from "./form";
import Success from "./success";
import Failed from "./error";
import Loading from "app/components/loading"
import Reference from "./reference";
import {Button} from "app/components/forms";

const pages = [
    {name: "default", page: Chanels},
    {name: "reference", page: Reference},
    {name: "form", page: Form},
    {name: "types", page: Types},
    {name: "success", page: Success},
    {name: "failed", page: Failed},
]
const Page = ({
    onClose,
    initialData={},
    isModal=false,
}) => {
    const router = useRouter();
    const { data, loading, error, refetch } = useQuery(SUBJECT_TYPE, {
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
            <Wizard
                isModal={isModal}
                onClose={onClose}
                dependencies={data}
                pages={pages}
                pageClose={router.back}
                initialData={initialData}
             />
        
    )
}
export default Page;