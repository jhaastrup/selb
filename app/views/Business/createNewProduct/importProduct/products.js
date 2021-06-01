import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useQuery, useMutation} from "@apollo/client";
import {LOAD_EXTERNAL_PRODUCTS} from "../../modules/queries";
import {IMPORT_PRODUCTS_FROM_STORE} from "../../modules/mutations";




const Page = ({onChangePage, pageData, updatePageData}) => {
    const [selectedList, setselectedList] = React.useState([]);

    const {
        id,
        source: { code, name: storeType },
    } = pageData.store;

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(LOAD_EXTERNAL_PRODUCTS, {
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

    const [discoveryExternalProducts, { loading: importingProducts }] = useMutation(IMPORT_PRODUCTS_FROM_STORE, {
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
        discoveryExternalProducts({
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

   
    const {results} = data.getDiscoveryExternalProducts;
    return(
        <div>  
            <div style={{margin: "1rem auto", width: "50%"}}>
                
                <p>{"Connect a store type"}</p>
               
                <div>
                   
                    <div style={{width: "60%", margin:"1rem auto"}}>
                        <div style={{display: "flex"}}>
                            {results.length ? data.results.map((item) => {
                                

                                const { pk, name, price, regular_price, description = '', images } = item;
                                const uri = images && images.length > 0 && images[0].url ? images[0].url : undefined;
                                const strippedString = description ? description.replace(/(<([^>]+)>)/gi, '') : '';
                                const isSelected = item.pk === selectedStore;
                                return(
                                    <div key={idx} style={{borderBottom: "1px solid black"}}>
                                    <div style={isSelected ? {backgroundColor: "blue"} : undefined}   onClick={() => onItemSelected(isSelected, item.pk)}>
                                        <div style={{width: "40%"}}>
                                             <img style={{width:"100%"}} src={uri} />
                                        </div>
                                        <p>{`name: ${name || ''}`}</p>
                                        <p>{`description: ${strippedString}`}</p>
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