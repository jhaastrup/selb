
import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, RadioButton, Button, ChoiceField} from "app/components/forms";


const Page = ({onChangePage, pageData, setState, dependencies}) => {
    const formRef = React.useRef();
    const { reference = '' } = pageData;
    const nextPage = "form";
    const ValidationSchema = Yup.object().shape({
        reference: Yup.string().notRequired(),
    });
    const initialValues = { reference };

    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    return(
        <div className={"relative border border-gray-200 px-3 mt-3 pb-12 flex flex-col"}>
                <Formik
                    innerRef={formRef}
                    validationSchema={ValidationSchema}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={(variables, formikBag) => {
                        onChangePage(nextPage, { ...variables });
                    }}>
                    
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4"}>
                                <div>
                                <p className={"text-sm font-semibold text-black"}>{"Reference"}</p>
                                    <p className={"text-sm  text-gray-500"}>
                                        {
                                            "Please provide the shipping / payment reference related to your complaint."}
                                    </p>
                                </div>
                                <div className="w-full">
                                    <InputField
                                        showLabel={false}
                                        name={"reference"}
                                        placeholder={'Tracking number / payment reference'}
                                    />
                                    
                                </div>

                                <div className={"w-full px-3  mx-auto md:relative flex-col flex items-end"}>
                                    <Button
                                        disable={!isValid || isSubmitting} 
                                        // uclasses={"w-full py-2 px-2 md:w-24"}
                                        type={"submit"}
                                    >
                                        {values.reference === '' ? 'SKIP' : 'CONTINUE'}

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