import React, {useState, useRef, useEffect} from "react";
import _ from 'lodash';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { InputField, Button, OtpField } from "app/components/forms";
import { handleValidationErrors, handleNetworkErrors } from 'app/lib/errorHandlers';

import { PHONE_UPDATE } from '../modules/mutations';
import { useMutation } from '@apollo/client';

const Page = ({onChangePage, pageData, dependencies, setState}) => {
    const formRef = useRef();
    const [otpError, setOtpError] = useState(false)
    const { phone, pageKey } = pageData;
    const {me = {}} = dependencies
    const {pk} = me

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "phone",
        }))
    }, []);

    console.log("OTP:::", pageData);

    const [phoneUpdate, { loading }] = useMutation(PHONE_UPDATE, {
        onCompleted: (data) => {
            console.log({ data });
            const { phoneUpdate: payload } = data;
            if (['failed', 'error'].includes(payload.status)) {
                formRef.current.setSubmitting(false);
                formRef.current.resetForm();
                alert('OTP Failed', 'We could not verify this OTP. Please check the value and try again.');
            } else {
                formRef.current.setSubmitting(false);
                onChangePage && onChangePage('success', {payload, pageKey});
            }
        },
        onError: (error) => {
            const { graphQLErrors, networkError } = error;
            console.log({ error });
            if (graphQLErrors) {
                const validationErrors = handleValidationErrors(graphQLErrors);
                formRef.current.setErrors(validationErrors);
            }

            if (networkError) {
                handleNetworkErrors(networkError);
            }
            formRef.current.setSubmitting(false);
            setOtpError(true);
        },
    });

    const ValidationSchema = Yup.object().shape({
        code: Yup.string().required('This field is required').default(''),
    });

    const initialValues = {id: pk, code: ''}

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-16"} />
            <Formik
                innerRef={formRef}
                validationSchema={ValidationSchema}
                initialValues={initialValues}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables) => {
                    // console.log({variables});
                    phoneUpdate({ variables });
                }}
            >
                {({handleSubmit, errors, submitForm}) => {

                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <p className={"text-2xl font-semibold"}>{'Verification Code'}</p>
                                <p className={"text-sm text-textGrey tracking-wide"}>{`Please type in the verification code sent to`}</p>
                                <p className={"text-sm text-textGrey tracking-wide"}>{phone}</p>
                            </div>
                            <Spacer className={"block h-20"} />
                            <div>
                                <div>
                                    <OtpField
                                        name={"code"}
                                        onComplete={() => {
                                            submitForm();
                                        }}
                                    />
                                </div>
                                {otpError && (
                                    <p className={"text-primary text-xs md:text-sm tracking-wide"}>
                                        {"Invalid OTP provided. Please check and try again."}
                                    </p>
                                )}
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default Page;

