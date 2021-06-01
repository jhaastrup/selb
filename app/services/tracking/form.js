import React, { Fragment, useState, useRef, useCallback, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_TRACKING } from './modules/queries';
import TrackingIcon from 'public/images/tabs/tracking.svg';
import {InputField, TextAreaField, Button, ChoiceField} from "app/components/forms";
import { Spacer } from "app/components/assets";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const Page = ({onChangePage, pageData, dependencies, setState}) => {
    const formRef = useRef();
    const { code = '' } = pageData || {};

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);

    const ValidationSchema = Yup.object().shape({
        code: Yup.string().required(),
    });
  
    const initialValues = {
        code,
    };


    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-10"} />
            <div className={"flex justify-center items-center"}>
                <TrackingIcon className={"w-28 h-28"} />
            </div>
            <p className={"text-center tracking-wide text-xs md:text-sm"}>{"Track your local and international deliveries"}</p>
            <Spacer className={"block h-1"} />
            <p className={"text-center tracking-wide text-textGrey text-xs md:text-sm"}>{"Enter the tracking code, order reference or air waybill of the delivery you are trying to track"}</p>
            <Spacer className={"block h-8"} />
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={ValidationSchema}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables, formikBag) => {
                    const payload = variables;
                    console.log({ payload });
                    formikBag.setSubmitting(false);
                    onChangePage('detail', payload);
                }}
            >
                {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting }) => {
                    return (
                        <Form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div className={"w-full"}>

                                <InputField 
                                    classnames={"text-5xl text-black text-center font-semibold md:text-6xl md:font-semibold"}
                                    name={"code"}
                                    placeholder={"shipping code"}
                                />
                            </div>
                            <Spacer className={"block h-8"} />
                            <div className={"flex justify-center items-center"}>
                                <Button
                                    uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                                    type={"submit"}
                                    disabled={!values.code}
                                >
                                    {"Search"}
                                </Button>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default Page;

