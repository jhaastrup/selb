import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROFILE } from './modules/queries';
import {formatDate} from "app/lib/formatters";
import Activation  from "./activate";

const Page = () => {

    const router = useRouter();
    const { data, loading, error, refetch, networkStatus } = useQuery(GET_PROFILE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            
        },
    });

    

    const openConnect = () => {
        router.push("/business/connect/store")
    }

    const openCreateOrder = () => {
        router.push("/business/create/orders")
    }

    const openCreateProduct = () => {
        router.push("/business/create/products")
    }

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

    const { me = {}, businessOrders = {}, businessProducts = {} } = data || {};
    const { username, discoveryProfile,} = me;    
    const { store_name, store_description, sales_volume, profile_picture, ecommerce_stats } = discoveryProfile;
    const website = 'https://my.sendbox.co/' + username;
    const { results: businessProductsResults } = businessProducts;
    const { results: businessOrdersResults } = businessOrders;
    const storeLogo = profile_picture || undefined;
    const showBusiness = me && me.account_type?.code !== 'business';

    return(
        <div>
            {showBusiness ? (
                <Activation />
            )
                :(<div style={{display: "flex"}}>
                    <div style={{flex: "1"}}>
                            <nav>
                                <div style={{padding: "5px 10px", margin:"10px"}}><Link style={{textDecoration: "none"}} href={"/"} passHref={true}>Dashboard</Link></div>

                                <div style={{padding: "5px 10px", margin:"10px"}}><Link  href={"/account"} passHref={true}>Accounts</Link></div>
                                <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/addresses"} passHref={true}>Addresses</Link></div>
                                <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/business"} passHref={true}>Business</Link></div>
                                <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/cards"} passHref={true}>Cards</Link></div>
                                <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/deliveries"} passHref={true}>Deliveries</Link></div>
                                <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/quote"} passHref={true}>Quote</Link></div>
                                <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/tracking"} passHref={true}>Track</Link></div>
                                <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/transactions"} passHref={true}>Transactions</Link></div>
                                <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/support"} passHref={true}>Support</Link></div>


                            </nav>
                        </div>
                    <div style={{padding:"1rem", minHeight:"100vh", flex:"4", borderLeft: "1px solid"}}>

                        <div>Business Page</div>
                        <div>
                        <p>{store_name || ""}</p>
                        <p>{website.replace('https://', '')}</p>
                        <p style={{fontSize: "14px", color:"lightslategray"}}>{store_description || ""}</p>
                        </div>
                        <div style={{display: "flex"}}>
                            {/* <button 
                                onClick={openConnect} 
                                style={{color: "#fff",  backgroundColor:"black", padding: "5px",}}
                            >
                                Connect Store
                            </button> */}
                            <button 
                                onClick={openCreateOrder} 
                                style={{color: "#fff", marginLeft:"10px", backgroundColor:"black", padding: "5px",}}
                            >
                            Create An Order
                            </button>
                            <button 
                                onClick={openCreateProduct} 
                                style={{color: "#fff", marginLeft:"10px", backgroundColor:"black", padding: "5px",}}
                            >
                            List A Product
                            </button>
                        </div>

                        <div style={{padding:"1rem"}}>
                            {/* <h3>Products</h3> */}
                            {/* {businessProductsResults.length ? (
                                    <ul>
                                        {businessProductsResults.map((item) => {
                                            const { images, name, pk } = item;

                                            const uri = images && images.length > 0 && images[0].url ? images[0].url : undefined;
                                            
                                            return(
                                                <div role={"button"} key={item._pk} style={{display: "flex", alignItems: "center", marginBottom: "10px"}}>
                                                    <p style={{marginRight: "1rem"}}>{`${name}`}</p>
                                                    <div style={{width: "50px"}}>
                                                        <img style={{width:"100%"}} src={uri} />
                                                    </div>                           
                                                </div>)
                                            

                                        })}
                                        
                                    </ul>
                                ): null} */}
                        
                        </div>

                        {/* <div style={{padding:"1rem"}}>
                            <h3>orders</h3>
                            {businessOrdersResults && businessOrdersResults.length ? (
                                    <ul>
                                        {businessOrdersResults.map((item) => {
                                            const { status, delivery_address, items, amount_paid, date_created, pk } = item;
                                            const order = items && items.length > 0 ? items[0] : { post: {} };
                                            const uri = order.post?.images[0].url ?? undefined;
                                            const qty = _.reduce(items, (prev, curr) => _.sum([prev, curr.quantity]), 0);
                                            
                                            return(
                                                <div role={"button"} key={item._pk} style={{display: "flex", alignItems: "center", marginBottom: "10px"}}>
                                                    <div style={{width: "50px", marginRight: "1rem"}}>
                                                        <img style={{width:"100%"}} src={uri} />
                                                    </div> 
                                                    <p style={{marginRight: "1rem"}}>{`${qty}`}</p>
                                                    <div style={{marginRight: "1rem"}}>
                                                        <span>{`${delivery_address?.name ?? ''}`}</span>
                                                        <span>{formatDate(date_created, 'LLL')}</span>
                                                    </div>                      
                                                </div>)
                                            

                                        })}
                                        
                                    </ul>
                                ): null}
                        
                        </div> */}
                        
                    </div>
                </div>)
            }
        </div>
    )
}
export default Page;