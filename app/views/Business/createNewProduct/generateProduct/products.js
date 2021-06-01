import * as React from "react";
import _ from "lodash";
import {ChevronForward} from "app/components/icons";
import {formatPhone, formatString} from "app/lib/formatters";
import { useQuery, useMutation} from '@apollo/client';
import { LOAD_EXTERNAL_PRODUCTS } from '../../modules/queries';
import { IMPORT_PRODUCTS_FROM_STORE } from '../../modules/mutations';
import Loading from "app/components/loading"
import { Button} from "app/components/forms";
import metadata from "./metadata";

const Page = ({onChangePage, dependencies}) => {
    const dataLabel = 'getDiscoveryExternalProducts';
    const [selectedList, setselectedList] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const pageKey = 'products';
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
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

    const [discoveryExternalProducts, { loading: importingProducts, data: productData }] = useMutation(
        IMPORT_PRODUCTS_FROM_STORE,
        {
            onCompleted: (data) => {
                console.log({ data });
                onChangePage && onChangePage('success', {});
            },
            onError: (err) => {
                console.log({ err });
                onChangePage && onChangePage('error', {});
            },
        },
    );

    const onItemSelected = (store) => {
        onChangePage && onChangePage('products', { store });
    };

    const onRefresh = () => {
        refetch({});
    };

    const importItems = () => {
        setDialogVisible(false);
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
    // const onSocialConnect = () => {
    //     setDialogVisible(false);
    //     navigation.navigate('business', { screen: 'business.connect.social' });
    // };

    if(loading){
        return(
            
             <Loading />
        )
    }

    if(error){
        return(
           
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <Button
                    onClick={() => refetch && refetch()} 
                >
                    Try Again
                </Button>
            </div>
        )
    }

    if (!productData && importingProducts) {
        <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
            <div className={"my-4"}>
                <p className={"text-gray-500 text-center text-sm "}>{'Importing products to sendbox...'}</p>             
            </div>
        </div>


    }

    const { results, metadata = {} } = data[dataLabel];
    if(results.length === 0) {
        return (
            
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <Button
                    // onClick={() => refetch && refetch()} 
                >
                    Connect new store
                </Button>
            </div> 
            
        )
    }

    const { results, metadata = {} } = data[dataLabel];


    return (
        <div className={"max-w-3xl px-2 mx-auto"}>
            <div className={"my-4"}>
                <p className={"text-primary text-xs md:text-sm font-semibold"}>{caption}</p> 
                <p className={"text-black text-sm md:text-base font-bold"}>{title}</p>
                <p className={"text-xs md:text-sm text-gray-500"}>{description}</p>
            </div>
            {results.length && results.map((item, idx) => {
                const { pk, name, description = '', images, code } = item;
                const uri = images && images.length > 0 && images[0].url ? images[0].url : undefined;
                const strippedString = description ? description.replace(/(<([^>]+)>)/gi, '').trim() : '';
               
                return(
                    <div 
                        key={`${pk}-${idx}`}
                        isSelected={isSelected}
                        onClick={() => 
                            isSelected ? removeCode(pk) : addCode(pk)
                        }
                        className={"grid py-3 cursor-pointer grid-cols-4 border border-r-0 border-l-0 border-t-0 border-backgroundGrey"}
                        >
                        <div className={"col-span-3"}>
                            <p className={"text-black text-xs md:text-sm font-bold"}>{link}</p>
                            <p className={"text-xs text-gray-500"}>{formatString(source?.name, 'uppercase')}</p>
                        </div>
                        <div className={"col-span-1 flex-col justify-center flex items-end"}>
                            <ChevronForward />
                        </div>
                    </div>
                )})}
        </div>
    )
}

export default Page;