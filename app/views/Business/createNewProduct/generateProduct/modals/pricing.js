
import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, Button} from "app/components/forms";
import _ from "lodash";


const Page = (
    {
       onCompleted, options,
    }) => {
    const formRef = React.useRef();
    

    const ValidationSchema = Yup.object().shape({
        standard_price: Yup.number().required('Price is required'),
        discount_price: Yup.number().notRequired('Discount price'),
        stock: Yup.number().required('Stock is required'),
    });

    const initialValues = {};
    
    

    return(
        <div className={"max-w-3xl mx-auto border border-lightGrey px-3 mt-3 pb-12 flex flex-col"}>
                <Formik
                    innerRef={formRef}
                    validationSchema={ValidationSchema}
                    initialValues={initialValues}
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
                                <p className={"text-gray-500 text-sm"}> {'Provide your item price and quantity'}</p>
                        
                            </div>
                            
                            
                                <div className="w-full">
                                    <label htmlFor="standard_price" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Standard Price(NGN)
                                    </label>
                                    <InputField
                                        id={"standard_price"}
                                        type={"number"}
                                        name={'standard_price'}
                                        placeholder={"Required"}
                                    />
                                    
                                </div>
                                <div className={"grid grid-cols-2 gap-3"}>
                                    <div className="w-full col-span-1">
                                        <label htmlFor="discount_price" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                            Discount Price(NGN)
                                        </label>
                                        <InputField
                                            id={"discount_price"}
                                            type={"number"}
                                            name={'discount_price'}
                                            placeholder={"Required"}
                                        />
                                    
                                    </div>
                                    <div className="w-full col-span-1">
                                        <label htmlFor="stock" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                            Quantity
                                        </label>   
                                        <InputField
                                            id={"stock"}
                                            type={"number"}
                                            name={'stock'}
                                            placeholder={"Required"}
                                        />
                                        
                                    </div>
                                </div>

                                <div>
                                    <p className={"text-gray-500 text-sm "}> {'The price of your product are used to calculate the insurance fees.'}</p>

                                </div>
                                
                                
                                <div className={"w-full px-4 mx-auto md:relative flex-col flex items-end"}>
                                        <Button
                                            disabled={!isValid || isSubmitting}
                                            showLoading={isSubmitting}
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