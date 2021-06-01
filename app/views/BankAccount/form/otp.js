import React, {useRef, useEffect, useState} from "react";
import _ from 'lodash';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { InputField, Button, OtpField } from "app/components/forms";
import { handleValidationErrors, handleNetworkErrors } from 'app/lib/errorHandlers';

import { VERIFY_BANK_OTP } from '../modules/mutations';
import { useMutation } from '@apollo/client';

const Page = ({onChangePage, pageData, dependencies, setState}) => {
    const formRef = useRef();
    const [otpError, setOtpError] = useState(false)

    const { bank_code, account_number } = pageData;

    console.log("OTP:::", pageData);

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    const [verifyBankOtp, { loading }] = useMutation(VERIFY_BANK_OTP, {
        onCompleted: (data) => {
            console.log({ data });
            const { verifyBankOtp: payload } = data;
            if (['failed', 'error'].includes(payload.status)) {
                formRef.current.setSubmitting(false);
                formRef.current.resetForm();
                setOtpError(true);
            } else {
                formRef.current.setSubmitting(false);
                onChangePage && onChangePage('success', {});
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
            
        },
    });

    const ValidationSchema = Yup.object().shape({
        otp: Yup.string().required('Valid entry required'),
    });

    const initialValues = {
        bank_code,
        account_number,
        otp: ""
    }

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
                    verifyBankOtp({ variables });
                }}
            >
                {({handleSubmit, errors, submitForm}) => {

                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <p className={"text-2xl font-semibold"}>{'Verification Code'}</p>
                                <p className={"text-sm text-textGrey tracking-wide"}>{'Please type in the verification code sent to your email address'}</p>
                            </div>
                            <Spacer className={"block h-20"} />
                            <div>
                                <div>
                                    <OtpField
                                        name={"otp"}
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

