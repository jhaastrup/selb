import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useMutation} from "@apollo/client";
import {LINK_SHOPIFY_, LINK_WOOCOMMERCE} from "../modules/mutations";



const Page = ({onChangePage, pageData, updatePageData}) => {
    const [errorText, setErrorText] = React.useState("");
    const [storeUrl, setStoreUrl] = React.useState("");
    const { channelName } = pageData;

    const [ConnectShopifyStorePlugin] = useMutation(LINK_SHOPIFY_, {
        onCompleted: (data) => {
            console.log({ data });
            const { oauthUrl } = data.ConnectShopifyStorePlugin;
            onChangePage('validate', { url: oauthUrl });
        },
        onError: (err) => {
            console.log({ err });
            setErrorText('Error connecting to URL');
        },
    });

    const [ConnectStorePlugin] = useMutation(LINK_WOOCOMMERCE, {
        onCompleted: (data) => {
            console.log({ data });
            const { oauthUrl } = data.ConnectStorePlugin;
            console.log(oauthUrl);
            onChangePage('validate', { url: oauthUrl });

        },
        onError: (err) => {
            console.log({ err });
            formRef.current.setSubmitting(false);
            setErrorText('Error connecting to URL');
        },
    });

    const handleOnchange = (e) => {
        setStoreUrl(e.target.value)
    }

    const connectStore = React.useCallback((e) => {
        e.preventDefault();
        if (channelName === 'woocommerce') {
            ConnectStorePlugin({ variables: {store_url: storeUrl} });
        } else {
            ConnectShopifyStorePlugin({ variables: {store_url: storeUrl}});
        }
    }, [storeUrl]);
    

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


    return(
        <div>  
            <div style={{margin: "1rem auto", width: "50%"}}>
                
                
               
                <div>
                   
                    <div style={{width: "60%", margin:"1rem auto"}}>
                        <p>{"Connect a store type"}</p>
                        <form onSubmit={connectStore}>
                    
                    
                    
                    
                            <div style={{margin: "1rem"}}>
                                <input 
                                    type={"text"}
                                    name={"store_url"}
                                    onChange={handleOnchange}
                                    placeholder={'https://dev-myteststore.pantheonsite.io/'}
                                    required
                                    style={{width: "100%"}}
                                />
                            </div>
                            {errorText ? <p style={{color: "red"}}>{errorText}</p>: ""}

                        
                            <div style={{margin: "1rem"}}>
                                <button 
                                    type={"submit"} 
                                    style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                                >
                                connect
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Page;