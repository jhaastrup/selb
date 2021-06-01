import * as React from "react";
import {useMutation, useLazyQuery, useQuery} from "@apollo/client";
import Modal from "app/services/modal";
import _ from "lodash";
import {DELIVERY_DEPENDENCIES, GET_IMPORT_QUOTE} from "../modules/queries";
import {formatPhone, formatString, formatNumber} from "app/lib/formatters";
import Link from "next/link";

const initialState = {
    weight: 0.5,
    origin: {
        country: 'GB',
        state: 'London',
        city: 'London',
    },
    destination: {
        country: 'NG',
        state: 'Lagos',
        city: 'Lagos',
    },
};
const Page = () => {
    const [formData, setFormData] = React.useState(initialState)
    const [quoteData, setQuoteData] = React.useState();
    const [showVolumetric, setShowVolumetric] = React.useState(false);

    const { data, loading, error, refetch } = useQuery(DELIVERY_DEPENDENCIES, {
        fetchPolicy: 'cache-and-network',
        onError: (err) => {
            console.log({ err });
        },
    });

    const [getQuoteForImport] = useLazyQuery(GET_IMPORT_QUOTE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (resp) => {
            const { getQuoteForImport: payload } = resp;
            console.log({ payload });
            setQuoteData(payload);
            // formRef.current.setSubmitting(false);
        },
        onError: (err) => {
            // const { graphQLErrors, networkError } = err;
            // if (graphQLErrors) {
            //     const validationErrors = handleValidationErrors(graphQLErrors);
            //     formRef.current.setErrors(validationErrors);
            // }

            // if (networkError) {
            //     handleNetworkErrors(networkError);
            // }
            // formRef.current.setSubmitting(false);
            console.log(err);
        },
    });

    const formatCountryName = (countries, code) => {
        console.log({ code });
        if (_.isEmpty(code)) {
            return;
        }
        const country = _.find(countries, { code });
        console.log({ country });
        return country ? country.name : undefined;
    };

    const getRate = React.useCallback((e) => {
        e.preventDefault();

        const variables = {
            origin: {
                country: formData.country || formData.origin.country,
                state: formData.ostate || formData.origin.state,
                city: formData.ostate || formData.origin.state,
            }, 
            destination: {
                country: formData.destination.country,
                state: formData.state || formData.destination.state,
                city:  formData.state || formData.destination.state,

            },
            weight: parseFloat(formData.weight),
            delivery_option_code: formData.delivery_option_code
            
        }
        getQuoteForImport({variables})

    },[formData])

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

   
    const handleOnchange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
        
    }

    // const handleCheck = (e) => {
    //     const isChecked = e.target.checked;
    //     setShowVolumetric(isChecked);
    // }
    

    console.log({...formData})
    const { states = {}, dependencies = {} } = data;
    const { results = [] } = states;
    return(
        <div style={{display: "flex"}}>
            <div style={{flex: "1"}}>
                <nav>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link style={{textDecoration: "none"}} href={"/"} passHref={true}>Dashboard</Link></div>

                    <div style={{padding: "5px 10px", margin:"10px"}}><Link  href={"/account"} passHref={true}>Accounts</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/business"} passHref={true}>Business</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/deliveries"} passHref={true}>Deliveries</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/quote"} passHref={true}>Quote</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/tracking"} passHref={true}>Track</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/transactions"} passHref={true}>Transactions</Link></div>
                    <div style={{padding: "5px 10px", margin:"10px"}}><Link href={"/settings"} passHref={true}>Settings</Link></div>


                </nav>
            </div>
            <div style={{padding:"1rem", height:"100vh", flex:"4", borderLeft: "1px solid"}}>
                <p>Get Foreign Quotes</p>
                
                <form onSubmit={getRate}>
                    <div style={{margin: "1rem"}}>
                        
                        <select name={"country"} onChange={handleOnchange}>
                            <option>Select country to import from</option>
                            {dependencies.destination_countries.map((c) => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{margin: "1rem"}}>
                        <input 
                            type={"text"}
                            name={"ostate"}
                            onChange={handleOnchange}
                            placeholder={"State to Import from"}
                            required
                            style={{width: "100%"}}
                        />
                    </div>
                    
                    <div style={{margin: "1rem"}}>
                        <input 
                            type={"number"}
                            name={"weight"}
                            onChange={handleOnchange}
                            placeholder={"weight"}
                            required
                            style={{width: "100%"}}
                        />
                    </div>
                    

                
                    
                    <div style={{margin: "1rem"}}>
                        
                        <select name={"state"} onChange={handleOnchange}>
                            <option>select destination state</option>
                            {results.map((s) => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{margin: "1rem"}}>
                        <select name={"delivery_option_code"} onChange={handleOnchange}>
                            <option>Select Delivery Option Type</option>
                            
                            <option key={"home_delivery"} value={"home_delivery"}>{"Home Delivery"}</option>
                            <option key={"pickup"} value={"pickup"}>{"Pick Up"}</option>
                            
                        </select>
                    
                    </div>

                    <div style={{margin: "1rem"}}>
                        <button 
                            type={"submit"} 
                            style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                        >
                            Check Import Rates
                        </button>
                    </div>
                    
                </form>
                <div style={{margin: "1rem"}}>
                    {quoteData && (
                        <div>
                            <p>{'PLEASE TREAT RESULTS AS ESTIMATES AS FEES MAY VARY AT THE TIME OF PURCHASE'}</p>
                            <div style={{display: "flex"}}>
                                <p>{quoteData.name}</p>
                                <p>{`\u20a6${formatNumber(
                                        quoteData.fee,
                                        '0,0.00',
                                    )}`}</p>
                            </div>
                            {/* <div style={{display: "flex"}}>
                                <p>{"Insurance"}</p>
                                <p>{`\u20a6${formatNumber(
                                        quoteData.insurance_fee,
                                        '0,0.00',
                                    )}`}</p>
                            </div> */}
                        </div>
                    )}
                
                </div>
                
            </div>
        </div>
    )
}
export default Page;