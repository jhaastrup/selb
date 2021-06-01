import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, RadioButton, Button, ChoiceField} from "app/components/forms";
import fuse from "fuse.js";



const Page = ({
    initialData = {},
    initialPos = undefined,
    optionName = 'item_type_code',
    options = [],
    onClose,
    onCompleted,
    formatValue = null,
    getOptions,
    searchProducts,
    products = [],
}) => {
    const formRef = React.useRef();
    const [filteredOptions, setFilteredOptions] = React.useState(options);
    const [filteredDescription, setFilteredDescription] = React.useState(products);

    const onItemSelected = (data) => {
        const { weight, price, name, description = '', category = undefined, pk, shipping_range } = data;
        if (weight <= 0) {
            formRef.current.setFieldValue('weight', '1', true);
        } else {
            formRef.current.setFieldValue('weight', String(weight), true);
        }
        formRef.current.setFieldValue('value', String(price), true);
        formRef.current.setFieldValue('name', name, true);
        formRef.current.setFieldValue('description', description, true);
        formRef.current.setFieldValue(`${optionName}`, pk, true);
        if (shipping_range && shipping_range.name) {
            formRef.current.setFieldValue('category', shipping_range.code, true);
        }

    };

    const getDescriptionOptions = React.useCallback(
        (input = '', searchKeys = ['name', 'description']) => {
            const fuse = new Fuse(products, {
                keys: searchKeys,
                includeScore: true,
                useExtendedSearch: true,
            });

            if (_.isEmpty(input)) {
                setFilteredDescription([]);
                return products;
            }

            const res = fuse.search(`'${input}`).map((elem) => elem.item); // items that include the particular phrase
            setFilteredDescription(res);
            return res;
        },
        [products],
    );

    const ValidationSchema = Yup.object().shape({
        quantity: Yup.string().required('Required'),
        name: Yup.string().required('Required'),
        value: Yup.string().required('Required'),
        weight: Yup.string().required('Required'),
        description: Yup.string().notRequired(),
        category: Yup.string().required('Required'),
        [optionName]: Yup.string().required('Required'),
    });
    const initialValues = initialData || {};
   
    const formatCategoryName = (code) => {
        if (_.isEmpty(code)) {
            return;
        }
        const option = _.find(options, { code });
        return option ? option.name : undefined;
    };

    

    return(
        <div className={"border border-gray-200 px-3 mt-3 pb-12 flex flex-col"}>
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
                                    <ChoiceField
                                        id={"name"}
                                        name={"name"}
                                        placeholder={'Required'}
                                        mode={'outline'}
                                        labelProp={'name'}
                                        valueProp={'name'}
                                        format={formatCategoryName}
                                        onItemSelected={onItemSelected}
                                        options={filteredDescription}
                                    />
                                    <div>
                                        <p className={"text-sm text-gray-500"}>{"Give a description of your package. Used for internal reference only."}</p>
                                    </div>
                                </div>

                                <div className={"mt-5"}>
                                    <label htmlFor="category" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        category
                                    </label>   
                                    <ChoiceField
                                        // label={'Shipping Category'}
                                        id={"id"}
                                        name={"category"}
                                        placeholder={'Required'}
                                        labelProp={'name'}
                                        valueProp={'code'}
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
                                            id={"quantity"}
                                            name={"quantity"}
                                            placeholder={"Required"}
                                        />
                                    </div>
                                    <div className={"flex-1"}>
                                        <label htmlFor="amount" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                            Total Value(NGN)
                                        </label>      
                                        <InputField
                                            id={"amount"}
                                            name={"value"}
                                            placeholder={"Required"}
                                        />
                                    </div>
                                </div>
                                <div className={"mb-5"}>
                                    <p className={"text-sm text-gray-500"}>{"Provide the value and quantity of the item you are trying to declare for shipping."}</p>
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