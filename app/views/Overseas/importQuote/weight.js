import React, { Fragment, useState, useEffect, useCallback, useRef } from 'react';
import { formatNumber, formatString, formatNumberString, toNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {InputField, TextAreaField, Button, ChoiceField} from "app/components/forms";
import { Spacer } from "app/components/assets";

const Page = ({onChangePage, pageData, initialData, dependencies, setState}) => {
    const formRef = useRef();
    const [flashError, setFlashError] = useState(false);

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    const { weight = 0, metric = 'KG', origin } = pageData;
    // console.log({pageData});
    
    const { me = {} } = dependencies;
    const { paymentProfile = {} } = me;

    const ValidationSchema = Yup.object().shape({
        weight: Yup.number().positive().required('This field is required').default(0),
        metric: Yup.string().required('This field is required'),
        total: Yup.number().required(),
    });

    const initialValues = {
        weight,
        metric,
        total: 0,
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
                    const payload = {
                        ...variables,
                        weight: parseFloat(toNumber(variables.weight)),
                        total_cost: parseFloat(toNumber(variables.total)),
                    };
                    formikBag.setSubmitting(false);
                    onChangePage('review', payload);
                }}
            >
                {({ handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting }) => {
                    const total = toNumber(values.weight) * toNumber(origin?.import_fee);
                    values.total = total;

                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <div className={"flex justify-center items-center uppercase pt-10 pb-2"}>
                                    <p className={"text-primary text-lg font-semibold tracking-wide"}>{`Weight (${metric})`}</p>
                                </div>
                                <div className={"w-full"}>
                                    <InputField 
                                        type={"decimal"}
                                        classnames={"text-5xl text-center font-semibold md:text-7xl md:font-semibold"}
                                        name={"weight"}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"0.0"}
                                    />
                                </div>
                                {total !== 0 && (
                                    <Fragment>
                                        <Spacer className={"block h-16"} />
                                        <div className={"flex justify-center items-center border-backgroundGrey border w-1/2 py-4 mx-auto"}>
                                            <p className={"text-primary text-sm text-center"}>{`IMPORT COST ${origin?.import_currency ?? ''}${total}`}</p>
                                        </div>
                                    </Fragment>
                                )}
                            </div>
                            <Spacer className={"block h-16"} />
                            <div className={"flex justify-center items-center"}>
                                <Button
                                    uclasses={"rounded-3xl w-full uppercase tracking-widest font-medium md:font-medium"}
                                    type={"submit"}
                                    showLoading={isSubmitting}
                                    disabled={!isValid}
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