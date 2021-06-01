import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, Button,  ChoiceField} from "app/components/forms";
import Fuse from 'fuse.js';
import _ from 'lodash';


const Page = (
    {
    onCompleted, options,
}) => {
    const formRef = React.useRef(null);
    const newCategory = [...options];
    const [filteredCategories, setFilteredCategories] = React.useState(newCategory);

    const ValidationSchema = Yup.object().shape({
        weight: Yup.number().required('Weight is required'),
        shipping_category: Yup.string().required('Shipping category is required'),
        length: Yup.number().notRequired().nullable(),
        width: Yup.number().notRequired().nullable(),
        height: Yup.number().notRequired().nullable(),
    });

    const initialValues = {
        weight: 2.0,
        length: 1.0,
        width: 1.0,
        height: 1.0,
        shipping_category: '',
    };

    const formatCategoryName = (code) => {
        if (_.isEmpty(code)) {
            return;
        }
        const category = _.find(newCategory, { code });
        return category ? category.name : undefined;
    };

    const getOptions = ({ searchInput = '', searchKeys = ['name', 'code'] }) => {
        const fuse = new Fuse(newCategory, {
            keys: searchKeys,
            includeScore: true,
            useExtendedSearch: true,
        });

        if (_.isEmpty(searchInput)) {
            setFilteredCategories(newCategory);
            return newCategory;
        }

        const res = fuse.search(`'${searchInput}`).map((elem) => elem.item); // items that include the particular phrase
        setFilteredCategories(res);
        return res;
    };

    return(
        <div className={"max-w-3xl border border-lightGrey mx-auto px-3 mt-3 pb-12 flex flex-col"}>
            <div className={"my-4"}>
                <p className={"text-primary text-xs md:text-sm font-semibold"}>{"WEIGHT"}</p> 
                <p className={"text-gray-500 text-xs md:text-sm"}>{"Provide weight and dimension of your product"}</p>
            </div>
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
                            <div className="w-full">
                                <label htmlFor="weight" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                    Weight(KG)
                                </label>
                                <InputField
                                    id={"weight"}
                                    name={'weight'}
                                    placeholder={"Required"}
                                />
                               
                            </div>

                            <div className={"mt-4"}>
                                <label htmlFor="shipping_category" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                   Shipping Category
                                </label>
                                <ChoiceField
                                id={"shipping_category"}
                                    name={'shipping_category'}
                                    placeholder={'Required'}
                                    labelProp={'name'}
                                    valueProp={'code'}
                                    options={filteredCategories}
                                    format={formatCategoryName}
                                        
                                />
                            </div>                             
                            
                            <div className={"grid mt-4 grid-cols-3 gap-1 md:gap-4"}>
                                <div className={"flex-1"}>
                                    <label htmlFor="length" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        length(CM)
                                    </label>
                                    <InputField
                                        id={"length"}
                                        name={'length'}
                                        placeholder={"Required"}
                                        type={"number"}
                                    />
                                </div>
                                <div className={"flex-1"}>
                                    <label htmlFor="width" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Width(CM)
                                    </label>
                                    <InputField
                                        id={"width"}
                                        name={'width'}
                                        placeholder={"Required"}
                                        type={"number"}
                                    />
                                </div>
                                <div className={"flex-1"}>
                                    <label htmlFor="height" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Height(CM)
                                    </label>
                                    <InputField
                                        id={"height"}
                                        name={'height'}
                                        placeholder={"Required"}
                                        type={"number"}
                                    />
                                </div>
                            </div>
                            <div className={"mb-5"}>
                                <p className={"text-sm text-gray-500"}>{"The weight and dimensions for your package are used to calculate your shipping fees."}</p>
                            </div>   
                            
                            
                            <div className={"w-full px-4 mx-auto md:relative flex-col flex items-end"}>

                                <Button
                                    disabled={!isValid || isSubmitting}
                                    showLoading={isSubmitting}
                                >
                                    {"Confirm"}
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