import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatNumber, formatString, formatNumberString, toNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Page = ({onChangePage, pageData, dependencies, billingData}) => {
    const formRef = useRef();
    const [flashError, setFlashError] = useState(false);
    const {category, hasGroups, minimumAmount} = billingData;

    const { amount = 0, currency = 'NGN' } = pageData;
    
    const { me = {} } = dependencies;
    const { paymentProfile = {} } = me;

    const ValidationSchema = Yup.object().shape({
        amount: Yup.number().positive().min(minimumAmount).required('This field is required'),
        currency: Yup.string().required('This field is required'),
    });

    const initialValues = {
        amount,
        currency,
    };

    return (
        <div style={{display: "block", overflow: "auto"}}>
            <div style={{height:"2rem"}}></div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{padding: "1.5rem", alignSelf: "center", width: "440px", maxWidth: "100%"}}>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <Formik
                            innerRef={formRef}
                            initialValues={initialValues}
                            validationSchema={ValidationSchema}
                            enableReinitialize={true}
                            validateOnMount={true}
                            onSubmit={(variables, formikBag) => {
                                console.log({ variables });
                                const payload = { ...variables, amount: parseFloat(variables.amount), category, hasGroups, minimumAmount };
                                console.log({ payload });
                                formikBag.setSubmitting(false);
                                onChangePage('service', payload);
                            }}
                        >
                            {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting }) => {
                                {/* const invalidStyle = flashError ? { color: theme.colors.red } : {}; */}
                                return (
                                    <form autoComplete={"off"} onSubmit={handleSubmit}>
                                        <div>
                                            <div>
                                                <input
                                                    type={"number"}
                                                    name={"amount"}
                                                    value={values.amount}
                                                    onChange={handleChange}
                                                    placeholder={"amount"}
                                                    style={{width: "100%", padding: "0.5rem 0rem"}}
                                                />
                                                {errors.amount && <p>{errors.amount}</p>}
                                                <div style={{height:"0.5rem"}}></div>
                                                {/* <div>
                                                    <p>
                                                        The value specified above will be added to you account using any one of the payment channels below 
                                                    </p>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div style={{height:"1rem"}}></div>
                                            <div>
                                                <button
                                                    type={"submit"}
                                                    style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px", width: "100%"}}
                                                >
                                                    {"Continue"}
                                                </button>
                                            </div>
                                    </form>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Page;