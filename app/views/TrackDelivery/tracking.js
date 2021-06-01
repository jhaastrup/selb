import * as React from "react";
import {useMutation} from "@apollo/client";
import { TRACK_SHIPMENT } from "./modules/mutations";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, Button} from "app/components/forms";
import _ from "lodash";

const initialState = {
   code: "",
}
const Page = () => {
    const [formData, setFormData] = React.useState(initialState) 
    const [trackingData, setTrackingData] = React.useState(null);
    const [trackingError, setTrackingError] = React.useState("")

    const [getDeliveryTracking, { data, loading, error }] = useMutation(TRACK_SHIPMENT, {
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log({ data });
            const { getDeliveryTracking } = data;
            setTrackingData(getDeliveryTracking);
            trackingError && setTrackingError("");
        },
        onError: (errors) => {
            setTrackingError('Error fetching delivery detail');
            trackingData && setTrackingData(null);
        },
    });

    const handleOnchange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
        
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const variables = {
            ...formData
        }
        getDeliveryTracking({variables})

    }

    return(
        <div className={"max-w-3xl mx-auto border border-lightGrey px-3 mt-3 pb-12 flex flex-col"}>
                <Formik
                    innerRef={React.formRef}
                    // validationSchema={ValidationSchema}
                    // initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={(variables, formikBag) => {
                        formikBag.setSubmitting(false);
                        onCompleted && onCompleted(variables);
                    
                }}>
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                            <div className={"my-2"}>
                                <p className={"text-primary text-base font-semibold"}>{"Pricing"}</p> 
                                <p className={"text-black text-sm font-semibold "}> {'Provide your item price and quantity'}</p>
                        
                            </div>
                            
                            
                                <div className="w-full">
                                <p className={"text-xs text-textGrey"}>{"PRICE(NGN)"}</p>

                                    <InputField
                                        name={'standard_price'}
                                        placeholder={"Required"}
                                    />
                                    
                                </div>
                                <div className={"grid grid-cols-2 gap-3"}>
                                    <div className="w-full col-span-1">
                                        <p className={"text-xs text-textGrey"}>{"DISCOUNT PRICE(NGN)"}</p>

                                        <InputField
                                    
                                            name={'discount_price'}
                                            placeholder={"Required"}
                                        />
                                    
                                    </div>
                                    <div className="w-full col-span-1">
                                        <p className={"text-xs text-textGrey"}>{"STOCK"}</p>
                                        <InputField
                                            
                                            name={'stock'}
                                            placeholder={"Required"}
                                        />
                                        
                                    </div>
                                </div>

                                <div>
                                    <p className={"text-textGrey text-sm "}> {'The price of your product are used to calculate the insurance fees.'}</p>

                                </div>
                                
                                
                                <div className={"fixed bottom-1 w-full px-3 -ml-3 mx-auto md:relative md:flex-col md:flex md:items-end"}>
                                        <Button
                                            disable={!isValid || isSubmitting} 
                                            uclasses={"w-full py-2 md:w-1/6"}
                                            type={"submit"}
                                        >
                                            Confirm
                                        </Button>
                                </div>
                            </div>
                            
                            
                        </Form>
                        
                    )
                }}

                </Formik>
        </div>        
    )
}
export default Page;


