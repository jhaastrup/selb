import React, {useRef} from "react";
import _ from 'lodash';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import TrackingIcon from "public/images/tabs/receive-money.svg";
import {InputField, TextAreaField, Button, ChoiceField} from "app/components/forms";


import { CARD_OTP } from './modules/mutations';
import { useMutation } from '@apollo/client';

const Page = ({onProceed, onCancel, transData, dependencies = {}}) => {
    const formRef = useRef();

    const [validateOtp, { loading }] = useMutation(CARD_OTP, {
        onCompleted: (data) => {
            const { cardOtp: otpResponse } = data;
            formRef.current.setSubmitting(false);

            if (!otpResponse.page) {
                otpResponse.page = 'failed';
            }

            onProceed && onProceed(otpResponse);
        },
        onError: () => {
            onProceed && onProceed({ page: 'error' });
        },
    });

    const ValidationSchema = Yup.object().shape({
        // amount: Yup.string().required("This value must be present"),
        otp: Yup.string().required('Valid entry required'),
    });

    const initialValues = {...transData}

    const { message = 'Further action is required. Please provide the requested information below' } = transData;

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-8"} />
            <Formik
                innerRef={formRef}
                validationSchema={ValidationSchema}
                initialValues={initialValues}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables) => {
                    validateOtp({ variables });
                }}
            >
                {({ handleSubmit, isValid, isSubmitting }) => (
                    <div>
                        <div className={"flex justify-center items-center"}>
                            <TrackingIcon className={"w-28 h-28"} />
                        </div>
                        <Spacer className={"block h-4"} />
                        <p className={"text-lg text-center"}>{message}</p>
                        <Spacer className={"block h-10"} />
                        <div className={"flex flex-row"}>
                            <div className={"w-1/2"}>
                                <InputField 
                                    name={"otp"}
                                    showLabel={false}
                                    placeholder={"000000"}
                                />
                            </div>
                            <Spacer className={"block w-4"} />
                            <div className={"w-1/2"}>
                                <Button
                                    uclasses={"rounded w-full uppercase tracking-widest font-medium md:font-medium bg-primary border-primary"}
                                    type={"button"}
                                    onClick={handleSubmit}
                                    disabled={!isValid}
                                >
                                    {"AUTHORIZE"}
                                </Button>
                            </div>
                        </div>
                        <Spacer className={"block h-40"} />
                        <div className={"w-full"}>
                            <Button
                                uclasses={"rounded w-full uppercase tracking-widest font-medium md:font-medium bg-white border-white text-primary"}
                                type={"button"}
                                onClick={() => onCancel && onCancel()}
                            >
                                {"CANCEL"}
                            </Button>
                        </div>
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default Page;