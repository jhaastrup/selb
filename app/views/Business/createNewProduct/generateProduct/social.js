import * as React from "react";
import _ from "lodash";
import {ChevronForward} from "app/components/icons";
import {formatPhone, formatString} from "app/lib/formatters";
import { useQuery} from '@apollo/client';
import { LOAD_SOCIAL_PAGES } from '../../modules/queries';
import Loading from "app/components/loading"
import { Button} from "app/components/forms";
import metadata from "./metadata";

const Page = ({onChangePage, dependencies}) => {
    const dataLabel = 'getSocialPagesAddedToDiscovery';
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const pageKey = 'social';
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(LOAD_SOCIAL_PAGES, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log({ errors });
        },
        onCompleted: (data) => {
            console.log({ data });
        },
    });
    const onItemSelected = (item) => {
        onChangePage && onChangePage('socialItems', { page_id: item.social_id });
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

    return (
        <div className={"max-w-3xl px-2 mx-auto"}>
            {results.length ? results.map((item, idx) => {
                const { social_id, name, source } = item;

                return(
                    <div 
                        key={social_id}
                        onClick={() => onItemSelected(item)}
                        className={"grid py-3 cursor-pointer grid-cols-4 border border-r-0 border-l-0 border-t-0 border-backgroundGrey"}
                        >
                        <div className={"col-span-3"}>
                            <p className={"text-black text-xs md:text-sm font-bold"}>{name}</p>
                            <p className={"text-xs text-textGrey"}>{formatString(source, 'uppercase')}</p>
                        </div>
                        <div className={"col-span-1 flex-col justify-center flex items-end"}>
                            <ChevronForward />
                        </div>
                    </div>
                )
            }):(
                <div className={"h-40 mt-auto flex items-center justify-center"}>
                <Button
                    // onClick={() => refetch && refetch()} 
                >
                    Add Social Page
                </Button>
            </div> 
            )}
        </div>
    )
}

export default Page;