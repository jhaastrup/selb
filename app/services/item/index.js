import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, RadioButton, Button, ChoiceField} from "app/components/forms";




const Page = (
    {initialData = {},
    initialPos = undefined,
    optionName = 'item_type_code',
    options = [],
    onClose,
    onCompleted,
    formatValue = null,
    captionProp = 'category_name',
    showHeader = true,
    getOptions,
    searchProducts,
}) => {
    const formRef = React.useRef();
    const [filteredOptions, setFilteredOptions] = React.useState(options);

    const initialValues = initialData || {};
   
    const formatOptionName = (code) => {
        if (_.isEmpty(code)) {
            return;
        }
        const option = _.find(options, { code });
        return option ? option.name : undefined;
    };

    const ValidationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        quantity: Yup.string().required('Required'),
        value: Yup.string().required('Required'),
        [optionName]: Yup.string().required('Required'),
    });


    return(
        <div className={"max-w-3xl mx-auto border border-lightGrey px-3 mt-3 pb-12 flex flex-col"}>
                <Formik
                    innerRef={formRef}
                    validationSchema={ValidationSchema}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={(variables, formikBag) => {
                        const payload = {
                        ...variables,
                    };
                    onCompleted && onCompleted(payload, initialPos);
                    formikBag.setSubmitting(false);
                }}>
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                                <div className="w-full">
                                    <label htmlFor="name" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Description
                                    </label>
                                    <InputField 
                                        name={"name"}
                                        placeholder={"Required"}
                                    />
                                    <div>
                                        <p className={"text-sm text-gray-500"}>{"Give a description of your package. Used for internal reference only."}</p>
                                    </div>
                                </div>

                                <div className={"mt-5"}>
                                    <label htmlFor="name" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        shipping category
                                    </label>
                                    <ChoiceField
                                        name={`${optionName}`}
                                        placeholder={'Required'}
                                        mode={'outline'}
                                        labelProp={'name'}
                                        valueProp={'code'}
                                        format={formatOptionName}
                                        options={filteredOptions}
                                    />
                                </div>
                                <div className={"mb-5"}>
                                    <p className={"text-sm text-gray-500"}>{"Select a category that best describes your item. This is required for effective customs clearance when you ship internationally."}</p>
                                    
                                </div>                             
                               
                                <div className={"grid grid-cols-2 gap-2 md:gap-4"}>
                                    <div className={"flex-1"}>
                                        <label htmlFor="quantity" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                            Number of items
                                        </label>
                                        <InputField
                                            name={"quantity"}
                                            type={"number"}
                                            // label={"Number of Item"}
                                            placeholder={"Required"}
                                            showLabel={false}
                                        />
                                    </div>
                                    <div className={"flex-1"}>
                                        <label htmlFor="value" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                            Total value(NGN)
                                        </label>
                                        <InputField
                                            type={"number"}
                                            name={"value"}
                                            placeholder={"Required"}
                                        />
                                    </div>
                                </div>
                                <div className={"mb-5"}>
                                    <p className={"text-sm text-gray-500"}>{"Provide the value and quantity of the item you are trying to declare for shipping."}</p>
                                </div>   
                              
                                <div className={"w-full px-3 mx-auto md:relative flex-col flex items-end"}>

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