
import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, RadioButton, Button, ChoiceField} from "app/components/forms";
import {VERIFY_DELIVERY_COUPON} from "../modules/mutations";
import {useMutation} from "@apollo/client";
import { handleValidationErrors, handleNetworkErrors } from 'app/lib/errorHandlers';


const Page = (
    {initialData = {},
    onCompleted,
}) => {
    const formRef = React.useRef();
    const initialValues = initialData || {};
   
    const [validateDeliveryCoupon, { loading }] = useMutation(VERIFY_DELIVERY_COUPON, {
        onCompleted: (data) => {
            const { validateDeliveryCoupon: payload } = data;
            if (payload.valid) {
                onCompleted(payload.code);
            }
            formRef.current.setSubmitting(false);
        },
        onError: (error) => {
            const { graphQLErrors, networkError } = error;
            if (graphQLErrors) {
                const validationErrors = handleValidationErrors(graphQLErrors);
                formRef.current.setErrors(validationErrors);
            }

            if (networkError) {
                handleNetworkErrors(networkError);
            }
            formRef.current.setSubmitting(false);
        },
    });

    const ValidationSchema = Yup.object().shape({
        code: Yup.string().required('Code does not exist.'),
    });


    const onItemSelected = (item) => {
        closeModal();
        onChangePage(nextPage, { [pageKey]: item });
    };


    return(
        <div className={"max-w-3xl mx-auto border border-lightGrey px-3 mt-3 pb-12 flex flex-col"}>
                <Formik
                    innerRef={formRef}
                    validationSchema={ValidationSchema}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={(variables, formikBag) => {
                        validateDeliveryCoupon({ variables });
                        formikBag.setSubmitting(false);
                    }}>
                    
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                                <div>
                                <p className={"text-sm font-semibold text-gray-700 "}>Promotions</p>
                                    <p className={"text-sm  text-gray-500"}>
                                        {
                                            "The discount from this promo code will automatically be applied to your transaction if valid."
                                        }
                                    </p>
                                </div>
                                <div className="w-full">
                                    <label htmlFor="code" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        discount code
                                    </label>
                                    <InputField
                                        name={"code"}
                                        placeholder={"Required"}
                                    />
                                    
                                </div>

                               
                                                          
                               
                                
                                
                                <div className={"md:flex-col md:flex md:items-end"}>
                                    <Button
                                        disable={!isValid || isSubmitting} 
                                        uclasses={"w-full py-2 px-2 md:w-auto"}
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