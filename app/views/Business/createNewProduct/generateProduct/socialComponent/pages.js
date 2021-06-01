import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useMutation, useQuery} from "@apollo/client";
import {LOAD_SOCIAL_PAGES} from "../../../modules/queries";
import {LINK_SOCIAL} from "../../../modules/mutations";



const Page = ({onChangePage, pageData, updatePageData}) => {
    const dataLabel = 'getSocialPagesAddedToDiscovery';

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

    const [authSocialLink] = useMutation(LINK_SOCIAL, {
        onCompleted: (data) => {
            console.log('social link', { data });
            const { login_url } = data.authSocialLink;

            onChangePage('validate', {
                url: login_url,
                source: 'facebook',
            });
        },
        onError: (error) => {
            console.log('social link error', { error });
        },
    });

    const onSocialConnect = React.useCallback(() => {
        authSocialLink({
            variables: {
                url: 'facebook',
                channel: 'web',
                state: 'https://auth.staging.sendbox.co/socials/success',
            },
        });
    }, [authSocialLink]);

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

    const { results, metadata = {} } = data[dataLabel];


    const onItemSelected = (item) => {
        onChangePage("images", {page_id: item.social_id})
    }
   

    return(
        <div>  
            <div style={{margin: "1rem auto", width: "50%"}}>
                
                <p>{"Connect a store type"}</p>
               
                <div>
                   {results.length ? (
                       <div>
                        {results.map((page) =>(
                                <div role={"button"} onClick={() => onItemSelected(page)} key={page.pk} style={{margin: "1rem"}}>
                                    <p>{formatString(`${page.name}`, 'uppercase')}</p>
                                </div>
                        ))}
                        <div>
                       
                            <div>
                                <p>{'Please link account'}</p>
                                <button onClick={onSocialConnect}>Link Another Account</button>
                        </div>
                       
                    </div>
                        </div>
                   ): (
                    <p>No Pages Found</p>
                   )}
                    
                </div>
            </div>
        </div>
    )
}

export default Page;