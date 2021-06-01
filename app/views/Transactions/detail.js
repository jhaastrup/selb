import * as React from "react";
import {useQuery, useMutation} from "@apollo/client";
import {TRANSACTION_DETAIL} from "./modules/queries";
import { useRouter } from "next/router";


const Page = ({transactionId}) => {
    const router = useRouter();

    const openForm = () => {
        router.push("/deliveries/create");

    }

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(TRANSACTION_DETAIL, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        variables: { id: transactionId },
        onError: (errors) => {
            console.log({ errors });
        },
        
    });

    if(loading){
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
    const {transaction} = data;
    return(
        <div style={{width: "60%", margin:"1rem auto"}}>
            <div>Transaction detail Page</div>
                <div style={{display: "flex", marginBottom: "10px"}}>
                    <p >{`${transaction.amount} ${transaction.type}ed`}</p>
                </div>
        </div>
    )
}
export default Page;

