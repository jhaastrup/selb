
import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, TextAreaField, Button, ChoiceField} from "app/components/forms";
import _ from "lodash";
import ProductCategoryModal from "./category";
import Modal from "app/components/simpleModal";

const Page = (
    {
        onCompleted, getOptions,  options, refetchDependencies
    }) => {
    const formRef = React.useRef();
    const { custom_categories: results } = options;
    const [categoryModal, setcategoryModal] = React.useState(false);

    const ValidationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        product_category: Yup.string().required('Product category is required'),
    });
       
    const formatCategoryName = (code) => {
        if (_.isEmpty(code)) {
            return;
        }
        const category = _.find(results, { code });
        return category ? category.name : undefined;
    };

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
                        console.log("formik")
                    onCompleted(variables);
                    setDescriptionModal(false)
                }}>
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                            <div className={"my-2"}>
                                <p className={"text-black text-base font-semibold"}>{"Product Information"}</p> 
                                <p className={"text-gray-500 text-sm "}> {'Specify your product name, category and description'}</p>
                        
                            </div>
                            <div className={"mt-2"}>
                                <Button
                                    onClick={() => setcategoryModal(true)}
                                    className={"appearance-none font-semibold text-xs rounded-3xl border border-gray-900 py-2 px-4  w-auto outline-none focus:outline-none bg-black text-white"}>
                        
                                    {"CREATE CATEGORY"}
                                </Button>
                            </div>
                            
                            <div className="w-full">
                                <label htmlFor="name" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Name
                                </label>
                                <InputField
                                    id={"name"}
                                    name={'name'}
                                    placeholder={"Required"}
                                />
                                
                            </div>

                                <div className={"mt-2"}>
                                    <label htmlFor="category" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Name
                                    </label>
                                    <ChoiceField
                                        id={"category"}
                                        name={'product_category'}
                                        placeholder={'Required'}
                                        labelProp={'name'}
                                        valueProp={'pk'}
                                        options={results}
                                        format={formatCategoryName}
                                        
                                    />
                                </div>
                                <div className={"mt-2"}>
                                    <label htmlFor="description" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        description
                                    </label>

                                    <TextAreaField
                                        id={"description"}
                                        name={"description"}
                                        placeholder={"Describe your product."}
                                    />
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
                {categoryModal ? (
                <Modal open={categoryModal} title={"create your own category"} onClose={() => setcategoryModal(false)}>
                    <ProductCategoryModal
                        onCompleted={() => {
                        
                            setcategoryModal(false);
                            refetchDependencies && refetchDependencies();
                        }}
                    />
                </Modal>

            ): null}
        </div>
    )
}
export default Page;