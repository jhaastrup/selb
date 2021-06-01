import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useMutation} from "@apollo/client";
import {LINK_SHOPIFY_, LINK_WOOCOMMERCE} from "../modules/mutations";
import { Spacer } from "app/components/assets";
import { InputField, Button } from "app/components/forms";
import * as Yup from 'yup';
import { Formik, FieldArray } from 'formik';
import Loading from "app/components/loading"
import {ArrowRight} from "app/components/icons";




const Page = ({onChangePage, pageData, updatePageData, setState}) => {
    const formRef = React.useRef();
    const [flashError, setFlashError] = React.useState(false);
    const [errorText, setErrorText] = React.useState("");
    const [storeUrl, setStoreUrl] = React.useState("");
    const { channelName } = pageData;

    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);


    const [ConnectShopifyStorePlugin] = useMutation(LINK_SHOPIFY_, {
        onCompleted: (data) => {
            console.log({ data });
            const { oauthUrl } = data.ConnectShopifyStorePlugin;
            formRef.current.setSubmitting(false);
            window.open(oauthUrl, "_blank");
            onChangePage('validate', { url: oauthUrl, store_url: formRef.current.values.store_url });
        },
        onError: (err) => {
            console.log({ err });
            formRef.current.setSubmitting(false);
            setFlashError(true);
            setErrorText('Error connecting to URL');
        },
    });

    const [ConnectStorePlugin] = useMutation(LINK_WOOCOMMERCE, {
        onCompleted: (data) => {
            console.log({ data });
            const { oauthUrl } = data.ConnectStorePlugin;
            formRef.current.setSubmitting(false);
            console.log(oauthUrl);
            window.open(oauthUrl, "_blank");
            onChangePage('validate', { url: oauthUrl, store_url: formRef.current.values.store_url });

        },
        onError: (err) => {
            console.log({ err });
            formRef.current.setSubmitting(false);
            setFlashError(true);
            setErrorText('Error connecting to URL');
        },
    });


    const connectStore = (variables) => {
        if (channelName === 'woocommerce') {
            ConnectStorePlugin({ variables });
        } else {
            ConnectShopifyStorePlugin({ variables });
        }
    };
    

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

    const ValidationSchema = Yup.object().shape({
        store_url: Yup.string().required('This field is required').default(''),
    });

    const initialValues = {};


    return(
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-3"}>{'CONNECT TO YOUR STORE'}</p>
                <p className={"text-2xl font-semibold mb-3"}>{`Enter your ${channelName} store link`}</p>
                <p className={"text-sm text-textGrey tracking-wide mb-3"}>{'Sendbox will connect via this link to your store.'}</p>
            </div>
            <div className={"pb-2 border-b border-textGrey border-opacity-10"}></div>
            <Spacer className={"block h-6"} />
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={ValidationSchema}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables, formikBag) => {
                    console.log({ variables });
                    connectStore(variables);
                }}
            >
                {({ handleSubmit, errors, values, isValid, setValues, isSubmitting, handleChange }) => {
                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs text-textGrey tracking-wide"}>{"Store url"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        classnames={"text-lg border md:text-lg"}
                                        name={"store_url"}
                                        onChange={handleChange}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"https://dev-myteststore.pantheonsite.io/"}
                                    />
                                </div>
                                {flashError && (
                                    <div className={"text-primary uppercase text-xs pt-2"}>
                                        <p>{errorText}</p>
                                    </div>
                                )}
                            </div>
                            <Spacer className={"block h-10"} />
                            <div className={"flex justify-end items-end"}>
                                <Button
                                    uclasses={"flex rounded-full uppercase tracking-widest font-medium md:font-medium px-6 py-3"}
                                    type={"submit"}
                                    showLoading={isSubmitting}
                                    disabled={!isValid || isSubmitting}
                                >
                                    {"Continue"} <ArrowRight size={18} />
                                </Button>
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div>
        // <div>  
        //     <div style={{margin: "1rem auto", width: "50%"}}>
                
                
               
        //         <div>
                   
        //             <div style={{width: "60%", margin:"1rem auto"}}>
        //                 <p>{"Connect a store type"}</p>
        //                 <form onSubmit={connectStore}>
                    
                    
                    
                    
        //                     <div style={{margin: "1rem"}}>
        //                         <input 
        //                             type={"text"}
        //                             name={"store_url"}
        //                             onChange={handleOnchange}
        //                             placeholder={'https://dev-myteststore.pantheonsite.io/'}
        //                             required
        //                             style={{width: "100%"}}
        //                         />
        //                     </div>
        //                     {errorText ? <p style={{color: "red"}}>{errorText}</p>: ""}

                        
        //                     <div style={{margin: "1rem"}}>
        //                         <button 
        //                             type={"submit"} 
        //                             style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
        //                         >
        //                         connect
        //                         </button>
        //                     </div>
        //                 </form>
        //             </div>

        //         </div>
        //     </div>
        // </div>
    )
}

export default Page;