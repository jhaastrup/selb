
import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, Button} from "app/components/forms";
import _ from "lodash";
import { useMutation } from '@apollo/client';
import { CREATE_CUSTOM_CATEGORY } from "../../../modules/mutations";

const Page = (
    {
        onClose, onCompleted, options,
    }) => {
    const formRef = React.useRef();
    
    const [createDiscoveryCustomCategory, { loading, error, data }] = useMutation(CREATE_CUSTOM_CATEGORY, {
        onCompleted: (data) => {
            console.log({ data });
            const { pk, ...rest } = data.createDiscoveryCustomCategory;
            formRef.current.setSubmitting(false);
            onCompleted && onCompleted(rest);
        },
        onError: (err) => {
            console.log('====> errrrr', { err });
            formRef.current.setSubmitting(false);
        },
    });

    const ValidationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().notRequired(),
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
                        createDiscoveryCustomCategory({ variables });
                    
                    }}>
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                            <div className={"my-2"}>
                                <p className={"text-black text-base font-semibold"}>{"Add Custom Category"}</p> 
                                <p className={"text-gray-500 text-sm "}> {'Create your own category'}</p>
                        
                            </div>
                            
                            
                                <div className="w-full">
                                    <label htmlFor="name" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Name
                                    </label>
                                    <InputField
                                        name={'name'}
                                        id={'name'}
                                        placeholder={"Required"}
                                    />
                                    
                                </div>
                                
                                <div className="w-full col-span-1">
                                    <label htmlFor="description" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Description
                                    </label>
                                    <InputField
                                        label ={"DESCRIPTION"}
                                        id={"description"}
                                        name={'description'}
                                        placeholder={"Required"}
                                    />
                                
                                </div>
                                    

                                <div className={"w-full px-3 -ml-3 mx-auto md:relative md:flex-col md:flex md:items-end"}>
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