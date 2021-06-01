import * as React from "react";
import _ from "lodash";
import {ChevronForward} from "app/components/icons";
import {formatPhone, formatString} from "app/lib/formatters";
import { useQuery} from '@apollo/client';
import { DISCOVERY_CONNECTED_STORES } from '../../modules/queries';
import Loading from "app/components/loading"
import { Button} from "app/components/forms";
import metadata from "./metadata";

const Page = ({onChangePage, dependencies}) => {
    const dataLabel = 'getDiscoveryConnectedStores';
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const pageKey = 'store';
    // const { caption = '', title = '', description = '' } = metadata[pageKey] || {};

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
    const onItemSelected = (store) => {
        onChangePage && onChangePage('products', { store });
    };

    const onRefresh = () => {
        refetch({});
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
           
            <div className={"h-40 mt-auto flex items-center justify-center"}>
                <Button
                    onClick={() => refetch && refetch()} 
                >
                    Try Again
                </Button>
            </div>
        )
    }

    const { results, metadata = {} } = data[dataLabel];
    if(results.length === 0) {
        return (
            
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <Button
                    // onClick={() => refetch && refetch()} 
                    uclasses={"uppercase py-2 md:w-auto"}
                >
                    Connect new store
                </Button>
            </div> 
            
        )
    }

    return (
        <div className={"max-w-3xl px-2 mx-auto"}>
            {results.length && results.map((item, idx) => {
                const { url, source, avatar } = item;
                const imageUrl = avatar ? avatar : undefined;

                const cleanUrl = url.replace(/(http(s?)):\/\//i, ' ');
                const link = cleanUrl.replace('/', ' ').trim();

                return(
                    <div 
                        key={`${url}-${idx}`}
                        onClick={() => onItemSelected(item)}
                        className={"grid py-3 cursor-pointer grid-cols-4 border border-r-0 border-l-0 border-t-0 border-backgroundGrey"}
                        >
                        <div className={"col-span-3"}>
                            <p className={"text-black text-xs md:text-sm font-bold"}>{link}</p>
                            <p className={"text-xs text-textGrey"}>{formatString(source?.name, 'uppercase')}</p>
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