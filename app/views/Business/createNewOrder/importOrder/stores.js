import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useQuery} from "@apollo/client";
import {DISCOVERY_CONNECTED_STORES} from "../../modules/queries";
import { useRouter } from "next/router";



const Page = ({onChangePage, pageData, updatePageData}) => {
    const router = useRouter();
    const [selectedStore, setSelectedStore] = React.useState([]);
    console.log("from stores",{pageData})
    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(DISCOVERY_CONNECTED_STORES, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log({ errors });
        },
        onCompleted: (data) => {
            console.log({ data });
        },
    });


const openForm = () => {
        router.push("/business/connect/store");

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

    const onItemSelected = (store) => {
        console.log({store})
        onChangePage("orders", {store})
        setSelectedStore(store.pk)
    }

    // https://dev-myteststore.pantheonsite.io/
    // 9Zu9k$p%Iy8PNEjft!
    // Mohammed
    //
    // https://finalmohammedstore.myshopify.com/
    //tweuyi
    //aminuolawaleji@gmail.com
    //aminuolawaleji
    //Jhaastrup21@gmail.com

    //  haastrup001
    //https://sendbox-stores.myshopify.com/
    const {results} = data.getDiscoveryConnectedStores

    return(
        <div>  
            <div style={{margin: "1rem auto", width: "50%"}}>
                
                
               
                <div>
                   
                    <div style={{width: "60%", margin:"1rem auto"}}>
                        <p>{"Connect a store type"}</p>
                        {results.map((item, idx) => {
                            const isAvatar = item.avatar;
                            
                            return(
                                <div key={idx} style={{borderBottom: "1px solid black"}}>
                                <div style={item.pk === selectedStore ? {backgroundColor: "blue"} : undefined}   onClick={() => onItemSelected(item)}>
                                    <div style={{width: "40%"}}>
                                        {isAvatar && <img style={{width:"100%"}} src={item.avatar} />}
                                    </div>
                                    <p>{item.url}</p>
                                </div>
                            </div>
                            )
                        })}

                        <button 
                            onClick={openForm} 
                            style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                        >
                            connect store
                     </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Page;