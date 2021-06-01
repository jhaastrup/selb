import * as React from "react";
import {useQuery, useMutation} from "@apollo/client";
import { PROFILE} from "./modules/queries";
import { useRouter } from "next/router";

const Page = () => {
    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(PROFILE, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        // variables: { filter_by, sort_by, page_by, query },
        onError: (errors) => {
            console.log({ errors });
        },
      
    });


    if(loading || !data){
        return(
            <div style={{width: "60%", margin:"10rem auto"}}>
                Loading...
            </div>
        )
    }

    if(error){
        return(
            <div style={{width: "60%", margin:"10rem auto"}}>
                <p>An error occurred</p>
                <button 
                    onClick={() => refetch && refetch()} 
                    style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                >
                Refetch
             </button>
            </div>
        )
    }
    const { name, email, phone, default_address } = data.me;
    const address = `${default_address?.street ?? ''} ${default_address?.city ?? ''} ${default_address?.state ?? ''} ${
        default_address?.country.name ?? ''
    }`;
    
    return(
        <div style={{width: "60%", margin:"1rem auto"}}>
            <div>Profile Page</div>
            <h3>{name}</h3>
            <p>{phone}</p>
            <p>{email}</p>
            <p>{address}</p>


        </div>
    )
}
export default Page;