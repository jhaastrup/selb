import React, {useState, useRef} from "react";
import _ from 'lodash';
import * as Yup from 'yup';
import { Formik } from 'formik';

import { VERIFY_BVN_OTP } from './modules/mutations';
import { useMutation } from '@apollo/client';

import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { InputField, Button, OtpField } from "app/components/forms";
import { handleValidationErrors, handleNetworkErrors } from 'app/lib/errorHandlers';

const Page = ({onChangePage, pageData, dependencies}) => {
    const formRef = useRef();
    const [otpError, setOtpError] = useState(false)
    const { bvn } = pageData;

    console.log("OTP:::", pageData);

    const [verifyBvnOtp, { loading }] = useMutation(VERIFY_BVN_OTP, {
        onCompleted: (data) => {
            console.log({ data });
            const { verifyBvnOtp: payload } = data;
            if (['failed', 'error'].includes(payload.status)) {
                formRef.current.setSubmitting(false);
                formRef.current.resetForm();
                alert('OTP Failed', 'We could not verify this OTP. Please check the value and try again.');
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
            setOtpError(true);
        },
    });

    const ValidationSchema = Yup.object().shape({
        otp: Yup.string().required('Valid entry required'),
    });

    const initialValues = {}

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
                    verifyBvnOtp({ variables });
                }}
            >
                {({handleSubmit, errors, submitForm}) => {

                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <p className={"text-2xl font-semibold"}>{'Verification Code'}</p>
                                <p className={"text-sm text-textGrey tracking-wide"}>{'Please type in the verification code sent to the number registered with your BVN'}</p>
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

