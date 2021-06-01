import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useQuery, useMutation} from "@apollo/client";
import {LOAD_EXTERNAL_ORDERS} from "../../modules/queries";
import {IMPORT_ORDERS_FROM_STORE} from "../../modules/mutations";




const Page = ({onChangePage, pageData, updatePageData}) => {
    const [selectedList, setselectedList] = React.useState([]);

    const {
        id,
        source: { code, name: storeType },
    } = pageData.store;

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(LOAD_EXTERNAL_ORDERS, {
        variables: { source: code, external_store_id: id },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log('store orders', { errors });
        },
        onCompleted: (data) => {
            console.log('==> store', { data });
        },
    });

    const [discoveryExternalOrders, { loading: importingOrders }] = useMutation(IMPORT_ORDERS_FROM_STORE, {
        onCompleted: (data) => {
            console.log({ data });
            onChangePage('success', {});
        },
        onError: (err) => {
            console.log({ err });
            onChangePage('error', {});
        },
    });

    const importItems = () => {
        discoveryExternalOrders({
            variables: {
                ids: selectedList,
                source: code,
                external_store_id: id,
            },
        });
    };
   
    const addCode = (id) => {
        const items = selectedList || [];
        setselectedList([...items, id]);
        console.log({ selectedList });
    };

    const removeCode = (id) => {
        const items = selectedList || [];
        const arr = items.filter(function (item) {
            return item !== id;
        });
        setselectedList([...arr]);
        console.log({ selectedList });
    };

    const onItemSelected = (isSelected, pk) =>{
        isSelected ? removeCode(pk): addCode(pk)
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

   
    const {results} = data.getDiscoveryExternalOrders;
    return(
        <div>  
            <div style={{margin: "1rem auto", width: "50%"}}>
                
                <p>{"Connect a store type"}</p>
               
                <div>
                   
                    <div style={{width: "60%", margin:"1rem auto"}}>
                        <div style={{display: "flex"}}>
                            {results.length ? data.results.map((item) => {
                                const { pk, status, amount_paid, fulfillment_status, description, delivery_address, items } = item;
                                const addressList = [
                                    formatString(delivery_address?.street ?? '', 'capitalize'),
                                    formatString(delivery_address?.city ?? '', 'capitalize'),
                                    formatString(delivery_address?.state ?? '', 'capitalize'),
                                    formatString(delivery_address?.country?.name ?? '', 'capitalize'),
                                    formatString(delivery_address?.post_code ?? '', 'uppercase'),
                                ];

                                // const descriptions = _.map([items[0]], (elem) => formatString(elem.post.name, 'sentence'));
                                const addressString = _.compact(addressList).join(', ');

                                const order = items && items.length > 0 ? items[0] : { post: {} };
                                const uri = order.post?.images[0].url ?? undefined;
                                const isSelected = item.pk === selectedStore;
                                return(
                                    <div key={idx} style={{borderBottom: "1px solid black"}}>
                                    <div style={isSelected ? {backgroundColor: "blue"} : undefined}   onClick={() => onItemSelected(isSelected, item.pk)}>
                                        <div style={{width: "40%"}}>
                                             <img style={{width:"100%"}} src={uri} />
                                        </div>
                                        <p>{`${delivery_address?.name ?? ''}`}</p>
                                        <p>{`description: ${addressString}`}</p>
                                    </div>
                                    </div>
                                )
                            }): <p>No Records Found</p>}
                            {selectedList && selectedList.length ? (
                                <button 
                                    onClick={importItems} 
                                    style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                                >
                                    Import Orders
                            </button>
                            ): null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;