import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatNumber, formatString, formatNumberString, toNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { VERIFY_BVN } from './modules/mutations';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { InputField, ChoiceField, Button } from "app/components/forms";
import {LockIcon} from "app/components/icons"

const Page = ({onChangePage, pageData, dependencies, setState}) => {
    const formRef = useRef();

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    const [verifyBvn, { loading }] = useMutation(VERIFY_BVN, {
        onCompleted: (data) => {
            console.log({ data });
            const { data: payload, message, status } = data.verifyBvn;
            formRef.current.setSubmitting(false);
            if (['error', 'failed'].includes(status)) {
                alert('BVN Verification', 'Unable to verify BVN');
            } else {
                onChangePage && onChangePage('success', '', {});
            }
        },
        onError: (error) => {
            formRef.current.setSubmitting(false);
            alert('BVN Verification', 'Unable to verify BVN');
            console.log({ error });
        },
    });

    const ValidationSchema = Yup.object().shape({
        bvn: Yup.string().required('Required').default(''),
        date_of_birth: Yup.string().required('Required'),
    });

    const initialValues = {};

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={ValidationSchema}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(values, formikBag) => {
                    const {bvn, date_of_birth} = values
                    verifyBvn({
                        variables: {
                            bvn
                        }
                    })
                    // console.log({ variables });
                }}
            >
                {({handleSubmit, values, errors, isValid, isSubmitting}) => {

                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs tracking-wide"}>{"Bank Verification Number"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        classnames={"text-lg md:text-lg"}
                                        name={"bvn"}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"Bank Verification Number (11 Digits)"}
                                    />
                                </div>
                                <Spacer className={"block h-2"} />
                                <p className={"text-textGrey tracking-wider text-xs"}>{'Please specify your BVN.This information will be used for internal reference only.'}</p>
                            </div>
                            <Spacer className={"block h-4"} />
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs tracking-wide"}>{"Date of Birth"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        classnames={"text-lg md:text-lg"}
                                        name={"date_of_birth"}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"YYYY-MM-DD e.g 1992-12-30"}
                                    />
                                </div>
                                <Spacer className={"block h-2"} />
                                <p className={"text-textGrey tracking-wider text-xs"}>{'Please specify your date of birth.This information will be used for internal reference only.'}</p>
                            </div>
                            <Spacer className={"block h-8"} />
                            <div className={"bg-backgroundGrey p-4 flex flex-col"}>
                                <div>
                                    <p className={"tracking-wider text-sm"}>{"Why we need your BVN"}</p>
                                    <Spacer className={"block h-2"} />
                                    <p className={"tracking-wider text-sm text-textGrey"}>{"We only get access to your :"}</p>
                                    <Spacer className={"block h-3"} />
                                    <p className={"tracking-wider text-sm text-textGrey"}>{"- Full Name"}</p>
                                    <p className={"tracking-wider text-sm text-textGrey"}>{"- Phone Number"}</p>
                                    <p className={"tracking-wider text-sm text-textGrey"}>{"- Date of Birth"}</p>
                                </div>
                                <Spacer className={"block h-5"} />
                                <div className={"flex"}>
                                    <LockIcon size={40}/>
                                    <Spacer className={"block w-4"} />
                                    <div>
                                        <p className={"tracking-wider"}>{"Your BVN does not gives us access to your bank accounts or transactions"}</p>
                                    </div>
                                </div>
                            </div>
                            <Spacer className={"block h-8"} />
                            <div className={"flex flex-col"}>
                                <Button
                                    type={"submit"}
                                    uclasses={"uppercase tracking-widest md:font-normal"}
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