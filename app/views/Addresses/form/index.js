import * as React from "react";
import { useRouter } from "next/router";
import Wizard from "app/services/pagewizard";
import { ADDRESS_DEPENDENCIES } from "../modules/queries";
import {useQuery} from "@apollo/client";
import Address from "./address";
import Success from "./success";
import ErrorPage from "./error";
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";


const pages = [
    {name: "default", page: Address},
    {name: "success", page: Success},
    {name: "error", page: ErrorPage} 
]

const Page = ({onClose}) => {
    const router = useRouter();
    const open = true;

    const { data, loading, error, refetch, networkStatus } = useQuery(ADDRESS_DEPENDENCIES,{
          notifyOnNetworkStatusChange: true,
          fetchPolicy: "cache-and-network",
          onError: (err) => {
            console.log({ err });
          },
        }
      );


      if(loading || !data){
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
    const { dependencies = {} } = data;
    return(
        <Wizard 
            open={open}
            dependencies={dependencies}
            onClose={onClose}
            pages={pages} 
        />
    )
}
export default Page;