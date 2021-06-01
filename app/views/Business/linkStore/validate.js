import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useLazyQuery} from "@apollo/client";
import {DISCOVERY_CONNECTED_STORES} from "../modules/queries";
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";
import {AlertIcon} from "app/components/icons";


const Page = ({onChangePage, pageData, updatePageData, setState}) => {
    const url = pageData.url.trim();
    const store_url = pageData.store_url.trim();
    const [socialState, setSocialState] = React.useState(false);
    console.log({pageData})
    const { channelName } = pageData;

    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "url",
        }))
    }, []);


    const [getDiscoveryConnectedStores, { loading, error, refetch, networkStatus }] = useLazyQuery(
        DISCOVERY_CONNECTED_STORES,
        {
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'cache-and-network',
            variables: { filter_by: { source: { op: '$eq', value: channelName } } },
            onError: (errors) => {
                onChangePage('error', {});
            },
            onCompleted: (data) => {
                console.log({ data });
                const { results } = data.getDiscoveryConnectedStores;

                function isFound(store) {
                    return store.url === store_url;
                }
                if (results && !_.isEmpty(results)) {
                    const store = results.find(isFound);
                    console.log('i am results', { store });
                    store ? onChangePage('success', { store }) : onChangePage('error', {});
                } else {
                    setSocialState(true);
                }
            },
        },
    );

    const onRetry = React.useCallback(() => {
        window.open(url, "_blank");
        setSocialState(false);
    }, [setSocialState]);

    
    const linkAccount = React.useCallback(() => {
        getDiscoveryConnectedStores();
    }, [getDiscoveryConnectedStores]);


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

    if(loading){
        return(
            <div className={"flex h-screen justify-center items-center"}>
                <Loading />
            </div>
        )
    }

    if (error) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <div>
                    <p className={"text-center"}>{'unknown error occurred'}</p>
                    {/* <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p> */}
                </div>
                <Spacer className={"block h-5"} />
                <div>
                    <Button
                        onClick={() => refetch && refetch()}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Try Again'}
                    </Button>
                </div>
            </div>
        )
    }

   

    return(
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-20"} />
            <div className={"flex text-primary justify-center items-center"}>
                <AlertIcon size={80} />
            </div>
            <Spacer className={"block h-10"} />
            {socialState ? (
                <div className={"flex flex-col justify-center items-center"}>
                    <p className={"text-center text-xl"}>{'Please try again...unable to link account'}</p>
                    <Spacer className={"block h-40"} />
                    <div className={"flex justify-center items-center"}>
                        <Button
                            onClick={onRetry}
                            uclasses={"bg-transparent border-primary text-primary uppercase tracking-widest font-medium md:font-medium px-4 py-3"}
                            type={"button"}
                        >
                            {"Retry Linking"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className={"flex flex-col justify-center items-center"}>
                    <p className={"text-center text-xl"}>{'Please click to link store account'}</p>
                    <Spacer className={"block h-40"} />
                    <div className={"flex justify-center items-center"}>
                        <Button
                            onClick={linkAccount}
                            uclasses={"bg-transparent border-primary text-primary uppercase tracking-widest font-medium md:font-medium px-4 py-3"}
                            type={"button"}
                        >
                            {"Link Account"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Page;