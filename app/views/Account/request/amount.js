import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatNumber, formatString, formatNumberString, toNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {InputField, TextAreaField, Button, ChoiceField} from "app/components/forms";
import { Spacer } from "app/components/assets";

const Page = ({onChangePage, pageData, dependencies, setState}) => {
    const formRef = useRef();
    const [flashError, setFlashError] = useState(false);

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);

    const { amount = 0, currency = 'NGN', description } = pageData;
    
    const { me = {} } = dependencies;
    const { paymentProfile = {} } = me;

    const ValidationSchema = Yup.object().shape({
        amount: Yup.string().required("This field is required"),
        description: Yup.string().nullable(),
        currency: Yup.string().required('This field is required'),
    });

    const initialValues = {
        amount,
        currency,
        description
    };

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-10"} />
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={ValidationSchema}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables, formikBag) => {
                    console.log({ variables });
                    const payload = { ...variables, amount: parseFloat(toNumber(variables.amount)) };
                    console.log({ payload });
                    formikBag.setSubmitting(false);
                    onChangePage('user', payload);
                }}
            >
                {({ handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting }) => {
                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <div className={"flex justify-center items-center uppercase pt-10 pb-2"}>
                                    <p className={"text-primary text-lg font-semibold tracking-wide"}>{"Amount to Request"}</p>
                                </div>
                                <div className={"w-full"}>
                                    <InputField 
                                        classnames={"text-5xl text-center font-semibold md:text-7xl md:font-semibold"}
                                        name={"amount"}
                                        format={(val) => formatNumberString(val, "0,0.[00]")}
                                        showLabel={false}
                                        resizeLabel={false}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* {flashError && (
                                    <div className={"text-primary uppercase text-xs pt-2"}>
                                        <p>{"You can't transfer more than your available balance"}</p>
                                    </div>
                                )} */}
                                <Spacer className={"block h-8"} />
                                <div className={"w-full"}>
                                    <InputField 
                                        classnames={"text-xl font-medium md:text-xl md:font-medium"}
                                        name={"description"}
                                        showLabel={true}
                                        resizeLabel={true}
                                        label={"Reason (Optional)"}
                                        onChange={handleChange}
                                        // placeholder={"Reason"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-8"} />
                            <div className={"flex justify-center items-center"}>
                                <Button
                                    uclasses={`rounded-3xl w-full uppercase tracking-widest font-medium md:font-medium`}
                                    type={"submit"}
                                    disabled={!isValid}
                                >
                                    {"Continue"}
                                </Button>
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div>
        // <div style={{display: "block", overflow: "auto"}}>
        //     <div style={{height:"2rem"}}></div>
        //     <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        //         <div style={{padding: "1.5rem", alignSelf: "center", width: "440px", maxWidth: "100%"}}>
        //             <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        //                 <Formik
        //                     innerRef={formRef}
        //                     initialValues={initialValues}
        //                     validationSchema={ValidationSchema}
        //                     enableReinitialize={true}
        //                     validateOnMount={true}
        //                     onSubmit={(variables, formikBag) => {
        //                         console.log({ variables });
        //                         const payload = { ...variables, amount: parseFloat(variables.amount) };
        //                         console.log({ payload });
        //                         formikBag.setSubmitting(false);
        //                         onChangePage('user', payload);
        //                     }}
        //                 >
        //                     {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting }) => {
        //                         {/* const invalidStyle = flashError ? { color: theme.colors.red } : {}; */}
        //                         return (
        //                             <form autoComplete={"off"} onSubmit={handleSubmit}>
        //                                 <div>
        //                                     <div>
        //                                         <input
        //                                             type={"number"}
        //                                             name={"amount"}
        //                                             value={values.amount}
        //                                             onChange={handleChange}
        //                                             placeholder={"amount"}
        //                                             style={{width: "100%", padding: "0.5rem"}}
        //                                         />
        //                                         {errors.amount && <p>{errors.amount}</p>}
        //                                     </div>
        //                                     <div style={{height:"1rem"}}></div>
        //                                     <div>
        //                                         <input
        //                                             type={"text"}
        //                                             name={"reason"}
        //                                             value={values.reason}
        //                                             onChange={handleChange}
        //                                             placeholder={"reason"}
        //                                             style={{width: "100%", padding: "0.5rem"}}
        //                                         />
        //                                         <div style={{height:"0.5rem"}}></div>
        //                                     </div>
        //                                 </div>
        //                                 <div style={{height:"1rem"}}></div>
        //                                     <div>
        //                                         <button
        //                                             type={"submit"}
        //                                             style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px", width: "100%"}}
        //                                         >
        //                                             {"Continue"}
        //                                         </button>
        //                                     </div>
        //                             </form>
        //                         )
        //                     }}
        //                 </Formik>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )

}

export default Page;