import * as React from "react";
import {useQuery, useMutation} from "@apollo/client";
import { TRANSACTIONS } from './modules/queries';
import { useRouter } from "next/router";
import Link from "next/link";


const Page = () => {
    const router = useRouter();

   
    const opendetail = (id) => {
        router.push(`/transactions/${id}`);

    }

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(TRANSACTIONS, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        // variables: { filter_by, sort_by, page_by, query },
        onError: (errors) => {
            console.log({ errors });
        },
        onCompleted: (data) => {
            const { results } = data.transactions;
           
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
    const {results=[]} = data.transactions;
    return(
        <div style={{display:"flex"}}>
            <div style={{flex: "1"}}>
                <nav>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link style={{textDecoration: "none"}} href={"/"} passHref={true}>Dashboard</Link></div>

                    <div style={{padding: "5px 10px", margin:"10px"}}><Link  href={"/account"} passHref={true}>Accounts</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/business"} passHref={true}>Business</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/deliveries"} passHref={true}>Deliveries</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/quote"} passHref={true}>Quote</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/tracking"} passHref={true}>Track</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/transactions"} passHref={true}>Transactions</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/settings"} passHref={true}>Settings</Link></div>

                </nav>
            </div>
            <div style={{padding:"1rem", height:"100vh", flex:"4", borderLeft: "1px solid"}}>
                <div>Transaction Page</div>
                {results.length ? (
                    <ul>
                        {results.map((item) => (
                            <div role={"button"}  onClick={() => opendetail(item.pk)} key={item.pk} style={{display: "flex", marginBottom: "10px"}}>
                                <li style={{paddingRight: "10px"}} >{`${item.amount} ${item.type}ed`}</li>
                            </div>
                            

                        ))}
                        
                    </ul>
                ): (<div>
                        <p>No records found</p>
                </div>)}
            </div>
        </div>
    )
}
export default Page;

