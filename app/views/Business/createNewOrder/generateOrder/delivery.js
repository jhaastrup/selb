
import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, Button} from "app/components/forms";
import _ from "lodash";


const Page = (
    {
       onCompleted, 
       options,
    }) => {
    const formRef = React.useRef();
    

    const ValidationSchema = Yup.object().shape({
        fee: Yup.string().required('Delivery fee is required'),
    });

    const initialValues = {
        fee: '',
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
                        formikBag.setSubmitting(false);
                        onCompleted && onCompleted(variables.fee);
                    
                }}>
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                            <div className={"my-2"}>
                                <p className={"text-red-500 text-sm font-semibold"}>{"SHIPPING FEE"}</p> 
                                <p className={"text-gray-600 text-base font-semibold "}> {'Enter shipping charge for this order'}</p>
                        
                            </div>
                            
                            
                                <div className="w-full">
                                    <label htmlFor="fee" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Fee(NGN)
                                    </label>
                                    <InputField
                                        id={"fee"}
                                        name={'fee'}
                                        placeholder={"Required"}
                                    />
                                    
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