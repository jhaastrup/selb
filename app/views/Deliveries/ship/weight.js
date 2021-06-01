import * as React from "react";
import metadata from "./metadata";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, Button} from "app/components/forms";



const Page = (
    {
        onChangePage,
        dependencies,
        pageData, 
        setState,
}) => {
    const formRef = React.useRef(null);
    const pageKey = 'weight';
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const nextPage = "rates";
    const { weight = 2.0, length = 1.0, width = 1.0, height = 1.0 } = pageData;
    
    console.log({pageData});
    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "items",
        }))
    }, []);

    const ValidationSchema = Yup.object().shape({
        length: Yup.number().min(0.1).required('Required'),
        width: Yup.number().min(0.1).required('Required'),
        height: Yup.number().min(0.1).required('Required'),
        weight: Yup.number().min(0.1).required('Required'),
    });

    const initialValues = { weight, length, width, height };

    return(
        <div className={"mx-auto px-4 mt-3 flex flex-col"}>
            <div className={"my-4"}>
                <p className={"text-red-500 text-sm font-semibold"}>{caption}</p> 
                <p className={"text-black text-sm md:text-base font-bold"}>{title}</p>
                <p className={"text-sm text-gray-500"}>{description}</p>
            </div>
            <Formik
                innerRef={formRef}
                validationSchema={ValidationSchema}
                initialValues={initialValues}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables, formikBag) => {
                    formikBag.setSubmitting(false);
                    onChangePage && onChangePage(nextPage, { ...variables });
                }}>
            {({handleSubmit, values, isValid, isSubmitting}) => {
                return(
                    
                    <Form onSubmit={handleSubmit}>
                        <div className={"w-full grid grid-cols-1 py-8 px-2 border border-gray-100 gap-4 mt-4 min-h-full"}>
                            <div className="w-full">
                                <label htmlFor="weight" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                    Weight(KG)
                                </label>
                                <InputField 
                                    id={"weight"}
                                    name={'weight'}
                                    type={"number"}
                                    placeholder={"Required"}
                                />
                                <div>
                                    <p className={"text-sm font-semibold text-black opacity-40"}>{"Give a description of your package. Used for internal reference only."}</p>
                                </div>
                            </div>

                            {/* <div className={"mb-5"}>
                                <p className={"text-sm font-semibold text-black opacity-40"}>{"Select a category that best describes your item. This is required for effective customs clearance when you ship internationally."}</p>
                            </div>                              */}
                            
                            <div className={"grid grid-cols-3 gap-1 md:gap-4"}>
                                <div className={"flex-1"}>
                                    <label htmlFor="length" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Length(CM)
                                    </label>
                                    <InputField
                                        id={"length"}
                                        name={'length'}
                                        type={"number"}
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
                                        type={"number"}
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
                                        type={"number"}
                                        placeholder={"Required"}
                                        type={"number"}
                                    />
                                </div>
                            </div>
                            <div className={"mb-5"}>
                                <p className={"text-sm text-gray-500"}>{"The weight and dimensions for your package are used to calculate your shipping fees."}</p>
                            </div>   
                            
                            
                            <div className={"px-7 w-full mx-auto md:relative flex-col flex items-end"}>

                                <Button
                                    type={"submit"}
                                    // uclasses={"rounded-3xl w-full md:px-4 md:w-auto text-black border-0 focus:outline-none focus:border-opacity-0 outline-none px-2"}
                                >
                                    {"Continue"}
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