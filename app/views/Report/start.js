import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatNumber, formatString, formatNumberString, toNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { REPORT_ISSUE } from './modules/mutations';

const Page = ({onChangePage, pageData, dependencies}) => {
    const formRef = useRef();
    const [validatedData, setValidatedData] = useState();

    const {account_number, bank_code} = pageData

    const [sendResolutionMessage, { loading }] = useMutation(REPORT_ISSUE, {
        onCompleted: (data) => {
            formRef.current.setSubmitting(false);
            console.log({ data });
            const {
                sendResolutionMessage: { payload },
            } = data;
            onChangePage && onChangePage("success", {payload});
        },
        onError: (errors) => {
            console.log({ errors });
            formRef.current.setSubmitting(false);
            formRef.current.resetForm();
            onChangePage && onChangePage("failed", {payload});
        },
    });

    const ValidationSchema = Yup.object().shape({
        body: Yup.string().required('This field is required').default(''),
        subject: Yup.string().required('This field is required').default(''),
        email: Yup.string().required('This field is required').default(''),
    });

    const initialValues = {};

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
                                formikBag.setSubmitting(false);
                                sendResolutionMessage({variables})
                            }}
                        >
                            {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting }) => {
                                {/* const invalidStyle = flashError ? { color: theme.colors.red } : {}; */}
                                return (
                                    <form autoComplete={"off"} onSubmit={handleSubmit}>
                                        <div>
                                            <div>
                                                <select value={values.subject} onChange={handleChange} name={"subject"} style={{width: "100%", padding: "0.5rem 0rem"}}>
                                                    <option>Subject Issue</option>
                                                    {dependencies.getResolutionComplaintTypes.results.map((opt) => (
                                                        <option key={opt.pk} value={opt.pk}>{opt.name}</option>
                                                    ))}
                                                </select>
                                                <div style={{height:"1rem"}}></div>
                                                <input
                                                    type={"email"}
                                                    name={"email"}
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    placeholder={"Email"}
                                                    style={{width: "100%", padding: "0.5rem 0rem"}}
                                                />
                                                <div style={{height:"1rem"}}></div>
                                                <textarea
                                                    name={"body"}
                                                    value={values.body}
                                                    onChange={handleChange}
                                                    placeholder={"Enter a message"}
                                                    rows={"5"}
                                                    cols={"55"}
                                                />
                                            </div>
                                        </div>
                                        <div style={{height:"5rem"}}></div>
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