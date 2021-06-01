import React, { useRef } from 'react';
import {
    formatCardNumber,
    formatCardExpiration,
    formatCardCvc,
    getCardType,
    validateCardNumber,
    validateCardExpiry,
    validateCardCvc,
} from 'app/lib/formatters';
import {InputField, TextAreaField, Button, ChoiceField} from "app/components/forms";
import { Spacer } from "app/components/assets";
import getCardImage from 'app/lib/cardImages';
import _ from 'lodash';

import { useMutation } from '@apollo/client';
import { CHARGE_CARD } from './modules/mutations';

import * as Yup from 'yup';

import { Formik } from 'formik';

const Page = ({onProceed, transData, onFailure, dependencies = {}}) => {
    const formRef = useRef();
    const cardRef = useRef();
    const expiryRef = useRef();
    const cvvRef = useRef();

    const [chargeCard] = useMutation(CHARGE_CARD, {
        onCompleted: (data) => {
            const { chargeCard: chargeCardResponse } = data;
            formRef.current.setSubmitting(false);
            console.log({ chargeCardResponse });
            if (!chargeCardResponse.page) {
                chargeCardResponse.page = 'failed';
            }
            onProceed && onProceed(chargeCardResponse);
        },
        onError: () => {
            onProceed && onProceed({ page: 'error' });
        },
    });

    const prepareData = (values) => {
        const [expiry_month, expiry_year] = values.expiry.split(' / ');
        const card = {
            cvv: values.cvv,
            expiry_month: expiry_month.trim(),
            expiry_year: expiry_year.trim(),
            number: values.number,
        };
        values.card = card;
        return values;
    };

    const ValidationSchema = Yup.object().shape({
        // amount: Yup.string().required("This value must be present"),
        number: Yup.string().min(16, "not less than 16").required('Please enter a valid credit or debit card number'),
        cvv: Yup.string().required('This value must be present'),
        expiry: Yup.string().required('This value must be present'),
        // currency: Yup.string().required('This value must be present').default('NGN'),
    });

    const validateCard = (e) => {
        // console.log("From function",{val})
        const val = e.target.value;
        const formatted = val.replace(/\s/g, '');
        const isValid = validateCardNumber(formatted);
        if (isValid) {
            expiryRef.current.focus();
        }
    };

    const validateExpiry = (e) => {
        const val = e.target.value;
        const formatted = val.replace(/\s/g, '');
        const isValid = validateCardExpiry(formatted, '/');
        if (isValid) {
            cvvRef.current.focus();
        }
    };

    const validateCvc = (e) => {
        const val = e.target.value;
        const formatted = val.replace(/\s/g, '');
    };

    const initialValues = {
        ...transData, 
        number: transData.number || "",
        cvv: transData.cvv || "",
        expiry: transData.expiry || ""
    }; 

    console.log({initialValues, transData})

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-10"} />
            <Formik
                innerRef={formRef}
                validationSchema={ValidationSchema}
                initialValues={initialValues}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables) => {
                    variables = prepareData(variables);
                    // console.log("From submit!!!",{variables})
                    chargeCard({ variables });
            }}
            >
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    const cardType = getCardType(values.number || '') || 'unknown';
                    const imageSrc = getCardImage(cardType);

                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <p className={"text-2xl font-semibold"}>{'Enter your card details'}</p>
                                <p className={"text-sm text-textGrey"}>{'Provide valid credit or debit card information to continue.'}</p>
                            </div>
                            <Spacer className={"block h-20"} />
                            <div className={"flex flex-col"}>
                                <div>
                                    <InputField
                                        innerRef={cardRef}
                                        label={"Card Number"}
                                        name={"number"}
                                        showLabel={true}
                                        format={(val) => formatCardNumber(val)}
                                        placeholder={"0000 0000 0000 0000"}
                                        showRightIcon={true}
                                        image={imageSrc}
                                        onInputChanged={validateCard}
                                    />
                                </div>
                                <Spacer className={"block h-4"} />
                                <div className={"flex flex-row justify-between"}>
                                    <div className={"w-full"}>
                                        <InputField
                                            innerRef={expiryRef}
                                            label={"MM/YY"}
                                            name={"expiry"}
                                            showLabel={true}
                                            format={(val) => formatCardExpiration(val)}
                                            placeholder={"MM / YY"}
                                            onInputChanged={validateExpiry}
                                        />
                                    </div>
                                    <div className={"w-full"}>
                                        <InputField
                                            innerRef={cvvRef}
                                            label={"CVV"}
                                            name={"cvv"}
                                            showLabel={true}
                                            format={(val) => formatCardCvc(val)}
                                            placeholder={"000"}
                                            onInputChanged={validateCvc}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Spacer className={"block h-8"} />
                            <div className={"flex justify-center items-center"}>
                                <Button
                                    uclasses={"rounded w-full uppercase tracking-widest font-medium md:font-medium"}
                                    type={"submit"}
                                    showLoading={isSubmitting}
                                    disabled={!isValid || isSubmitting}
                                >
                                    {"Continue"}
                                </Button>
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default Page;