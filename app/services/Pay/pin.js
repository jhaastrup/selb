import React, { useRef } from 'react';
import _ from 'lodash';

import * as Yup from 'yup';

import { Formik } from 'formik';
import { PinField, Button } from 'app/components/forms';
import { Spacer } from "app/components/assets";
import ActivityIndicator from "app/components/activityIndicator"

import { useMutation } from '@apollo/client';
import { CARD_PIN } from './modules/mutations';

const Page = ({initialData, onProceed, onCancel, transData}) => {
    const formRef = useRef();

    const [validatePin] = useMutation(CARD_PIN, {
        onCompleted: (data) => {
            const { cardPin: pinResponse } = data;
            formRef.current.setSubmitting(false);
            console.log('Pay initiated completed', { pinResponse, data });
            if (!pinResponse.page) {
                pinResponse.page = 'failed';
            }
            onProceed && onProceed(pinResponse);
        },
        onError: () => {
            onProceed && onProceed({ page: 'error' });
        },
    });

    const ValidationSchema = Yup.object().shape({
        // amount: Yup.string().required("This value must be present"),
        pin: Yup.string().required('This value must be present'),
    });

    const initialValues = { ...initialData, ...transData };

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
                    // console.log("Pin!!!!!",{variables})
                validatePin({ variables });
            }} 
            >
                {({isSubmitting, submitForm}) => {
                    return (
                        <form autoComplete={"off"}>
                            <div>
                                <p className={"text-2xl font-semibold"}>{'Please enter your 4-digit pin to authorize this payment'}</p>
                            </div>
                            <Spacer className={"block h-20"} />
                            <div>
                                <div>
                                    <PinField
                                        name={"pin"}
                                        onComplete={() => {
                                            submitForm();
                                        }}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-10"} />
                            {isSubmitting && <ActivityIndicator />}
                            <Spacer className={"block h-10"} />
                            <div className={"w-full"}>
                                <Button
                                    uclasses={"rounded w-full uppercase tracking-widest font-medium md:font-medium bg-white border-white text-primary"}
                                    type={"button"}
                                    onClick={() => onCancel && onCancel()}
                                >
                                    {"CANCEL"}
                                </Button>
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div>
    );
}

export default Page;