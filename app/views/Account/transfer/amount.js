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
        currency: Yup.string().required('This field is required'),
        description: Yup.string().nullable()
    });

    const initialValues = {
        amount,
        currency,
        description
    };

    const validateAmount = (val) => {
        console.log("From function...",val.target.value)
        if (val && parseFloat(toNumber(val.target.value)) > paymentProfile.funds) {
            setFlashError(true);
            // setTimeout(() => setFlashError(false), 200);
            return false;
        }
        setFlashError(false);
        return true;
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
                                    <p className={"text-primary text-lg font-semibold tracking-wide"}>{"Amount to Transfer"}</p>
                                </div>
                                <div className={"w-full"}>
                                    <InputField 
                                        classnames={"text-5xl text-center font-semibold md:text-7xl md:font-semibold"}
                                        name={"amount"}
                                        format={(val) => formatNumberString(val, "0,0.[00]")}
                                        showLabel={false}
                                        resizeLabel={false}
                                        onInputChanged={validateAmount}
                                    />
                                </div>
                                {flashError && (
                                    <div className={"text-primary uppercase text-xs pt-2"}>
                                        <p>{"You can't transfer more than your available balance"}</p>
                                    </div>
                                )}
                                <Spacer className={"block h-8"} />
                                <div className={"w-full"}>
                                    <InputField 
                                        classnames={"text-xl font-medium md:text-xl md:font-medium"}
                                        name={"description"}
                                        showLabel={true}
                                        resizeLabel={true}
                                        label={"Reason (Optional)"}
                                        // placeholder={"Description"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-8"} />
                            <div className={"flex justify-center items-center"}>
                                <Button
                                    uclasses={`rounded-3xl w-full uppercase tracking-widest font-medium md:font-medium`}
                                    type={"submit"}
                                    disabled={!isValid || flashError}
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