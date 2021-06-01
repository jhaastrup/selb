import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatNumber, formatString, formatNumberString, toNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Page = ({onChangePage, pageData, dependencies}) => {
    const formRef = useRef();
    const [flashError, setFlashError] = useState(false);

    const { customer_ref = '', category } = pageData;
    
    const { me = {} } = dependencies;
    const { paymentProfile = {} } = me;

    const ValidationSchema = Yup.object().shape({
        customer_ref: Yup.string().required('Required'),
    });

    const initialValues = { customer_ref };

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
                                formikBag.setSubmitting(false);
                                onChangePage('review', {...variables});
                            }}
                        >
                            {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting }) => {
                                {/* const invalidStyle = flashError ? { color: theme.colors.red } : {}; */}
                                return (
                                    <form autoComplete={"off"} onSubmit={handleSubmit}>
                                        <div style={{padding: "1rem 0rem"}}>
                                            <p>{'REFERENCE'}</p>
                                            <p>
                                                {
                                                    `What ${category === 'airtime' ? 'mobile number' : 'meter number'} do you want to recharge?`
                                                }
                                            </p>
                                        </div>
                                        <div style={{height:"1rem"}}></div>
                                        <div>
                                            <div>
                                                <input
                                                    type={"string"}
                                                    name={"customer_ref"}
                                                    value={values.customer_ref}
                                                    onChange={handleChange}
                                                    placeholder={category === 'airtime' ? 'Phone number' : 'Meter Number'}
                                                    style={{width: "100%", padding: "0.5rem 0rem"}}
                                                />
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