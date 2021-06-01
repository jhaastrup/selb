import * as React from "react";
import {useMutation, useLazyQuery, useQuery} from "@apollo/client";
import Modal from "app/services/modal";
import _ from "lodash";
import {DELIVERY_DEPENDENCIES, GET_DELIVERY_QUOTE} from "../modules/queries";
import {formatPhone, formatString, formatNumber} from "app/lib/formatters";
import Link from "next/link";

const initialState = {
    weight: 0.5,
    origin: {
        country: 'NG',
        state: 'Lagos',
        city: 'Lagos',
    },
    destination: {
        country: 'NG',
        state: 'Abuja',
        city: 'Abuja',
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

    const [getDeliveryQuote] = useLazyQuery(GET_DELIVERY_QUOTE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (resp) => {
            const { getDeliveryQuote: payload } = resp;
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
            console.log(err)
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
        const {weight, height, length, width, value, insurance_option_code} = formData
        const items = [
            { name: 'quote', weight, quantity: 1, value },
        ];
        const variables = {
            origin: {
                country: formData.origin.country,
                state: formData.ostate || formData.origin.state,
                city: formData.ostate || formData.origin.state

            }, destination: {
                country: formData.destination.country,
                state: formData.dstate || formData.destination.state,
                city: formData.dstate || formData.destination.city
            },
            items,
            weight: parseFloat(formData.weight),
            length: length ? parseFloat(length) : undefined,
            width: width ? parseFloat(width) : undefined,
            height: height ? parseFloat(height) : undefined,
            insurance_option_code,
            rate_code: 'standard',
        }
        getDeliveryQuote({variables})

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

    const handleCheck = (e) => {
        const isChecked = e.target.checked;
        setShowVolumetric(isChecked);
    }
    

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
                <p>Get Nationwide Quotes</p>
                
                <form onSubmit={getRate}>
                    <div style={{margin: "1rem"}}>
                        
                    <select name={"ostate"} onChange={handleOnchange}>
                            <option>Select Origin state</option>
                            {results.map((s) => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                        </select>
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
                    <label htmlFor={"dimension"}>{showVolumetric ? "Remove" : "Add Package Dimensions"}</label>
                            <input 
                                id={"dimension"}
                                type={"checkbox"}
                                name={"dimension"}
                                onChange={handleCheck}
                            />
                    
                    </div>
                    {showVolumetric && (
                        <div style={{margin: "1rem"}}>
                        <p>{"Including the package dimensions allows us estimate pricing based on the volumetric weight of your shipment."}</p>
                        <input 
                            type={"number"}
                            name={"length"}
                            onChange={handleOnchange}
                            placeholder={"length in cm"}
                            style={{marginRight: "10px"}}
                        />
                        <input 
                            type={"number"}
                            name={"width"}
                            onChange={handleOnchange}
                            placeholder={"width  in cm"}
                            style={{marginRight: "10px"}}
                        />
                        <input 
                            type={"number"}
                            name={"height"}
                            onChange={handleOnchange}
                            placeholder={"height in cm"}
                        />
                    </div>
                    )}
                    <div style={{margin: "1rem"}}>
                        
                        <select name={"dstate"} onChange={handleOnchange}>
                            <option>Select Destination state</option>
                            {results.map((s) => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{margin: "1rem"}}>
                        <select name={"insurance_option_code"} onChange={handleOnchange}>
                            <option>Select Insurance Type</option>
                            
                            <option key={"standard"} value={"standard"}>{"Standard"}</option>
                            <option key={"extended"} value={"extended"}>{"Extended"}</option>
                            
                        </select>
                    
                    </div>

                    {formData.insurance_option_code && (
                        <div style={{margin: "1rem"}}>
                        <input 
                            type={"number"}
                            name={"value"}
                            onChange={handleOnchange}
                            placeholder={"Insurance value"}
                            style={{width: "100%"}}
                        />
                    </div>
                    )}
                
                    
                    
                    
                    <div style={{margin: "1rem"}}>
                        <button 
                            type={"submit"} 
                            style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                        >
                            {'CHECK NATIONWIDE RATES'}
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
                            <div style={{display: "flex"}}>
                                <p>{"Insurance"}</p>
                                <p>{`\u20a6${formatNumber(
                                        quoteData.insurance_fee,
                                        '0,0.00',
                                    )}`}</p>
                            </div>
                        </div>
                    )}
                
                </div>
                
            </div>
        </div>
    )
}
export default Page;