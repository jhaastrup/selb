import React, {useState, useCallback, useRef} from "react";
import {Formik, FieldArray} from "formik";
import * as Yup from "yup";
import {InputField, Button, TextAreaField,  ChoiceField} from "app/components/forms";
import Fuse from 'fuse.js';
import { useQuery, useMutation } from '@apollo/client';
import _ from 'lodash';
import { formatNumberString, formatString} from "app/lib/formatters";
import { APPLICATION_DETAIL } from './modules/queries';
import { UPDATE_APPLICATION } from './modules/mutations';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import { CloseIcon } from "app/components/icons";

const Page = ({obj, onClose, onRefresh}) => {
    const formRef = useRef();

    const [updateExternalApplication] = useMutation(UPDATE_APPLICATION, {
        onCompleted: () => {
            formRef.current.setSubmitting(false);
            onRefresh && onRefresh();
            onClose && onClose();
        },
        onError: (errors) => {
            console.log(errors);
        },
    });

    // console.log("From edit....", {obj});

    const editApp = (variables) => {
        const { pk, name, description, logo_url, redirect_urls, privacy_url, website_url, terms_and_conditions_url } = variables;
        const applicationData = {
            id: pk,
            name,
            description,
            logo_url,
            redirect_urls,
            privacy_url,
            website_url,
            terms_and_conditions_url
        };
        console.log("From edit....", applicationData);
        updateExternalApplication({ variables: applicationData });
    };

    const ValidationSchema = Yup.object().shape({
        name: Yup.string().required("This field is required"),
        description: Yup.string().required("This field is required"),
        redirect_urls: Yup.array()
            .of(
                Yup.string().required("This field is required"),
            ),
        logo_url: Yup.string(),
        privacy_url: Yup.string(),
        website_url: Yup.string(),
        terms_and_conditions_url: Yup.string(),
    });

    const {...applicationData} = obj
    const initialValues = { ...applicationData, redirect_urls: obj.web_hooks.map((hook) => hook) };

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-10"} />
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validateOnLoad={true}
                validationSchema={ValidationSchema}
                enableReinitialize={true}
                onSubmit={(values, formikBag) => {
                    formikBag.setSubmitting(false);
                    // const payload = {...values, id: obj.pk}
                    console.log({values})
                    editApp(values);
                }}
            >
                {({ handleSubmit, isValid, isSubmitting, handleChange, values }) => {
                    if (!values.redirect_urls || values.redirect_urls.length === 0) {
                        values.redirect_urls = [""];
                    }
                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs text-textGrey tracking-wide"}>{"Name"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        name={"name"}
                                        onChange={handleChange}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"Required"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-2"} />
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs text-textGrey tracking-wide"}>{"Description"}</p>
                                </div>
                                <div>
                                    <TextAreaField 
                                        name={"description"}
                                        onChange={handleChange}
                                        placeholder={"Describe your Application (Required)"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-2"} />
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs text-textGrey tracking-wide"}>{"Logo"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        name={"logo_url"}
                                        onChange={handleChange}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"Optional"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-2"} />
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs text-textGrey tracking-wide"}>{"website"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        name={"website_url"}
                                        onChange={handleChange}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"Optional"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-3"} />
                            <div>
                                <FieldArray name="redirect_urls">
                                    {(arrayHelpers) => (
                                        <div>
                                            {values.redirect_urls.map((opt, idx) => (
                                                <div key={idx}>
                                                    {values.redirect_urls.length > 1 && (
                                                        <div className={"flex flex-row justify-end items-center"}>
                                                            <div 
                                                                onClick={() => arrayHelpers.remove(idx)}
                                                                className={"p-1 rounded-full cursor-pointer bg-lightGrey"}
                                                            >
                                                                <p className={"text-xs font-medium uppercase"}>
                                                                    <CloseIcon size={16} />
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                                        <p className={"text-xs text-textGrey tracking-wide"}>{"Redirect Url"}</p>
                                                    </div>
                                                    <div>
                                                        <InputField 
                                                            name={`redirect_urls[${idx}]`}
                                                            onChange={handleChange}
                                                            showLabel={false}
                                                            resizeLabel={false}
                                                            placeholder={"Required"}
                                                        />
                                                    </div>
                                                    <Spacer className={"block h-3"} />
                                                </div>
                                            ))}
                                            <Spacer className={"block h-2"} />
                                            <div className={"flex justify-start items-center"}>
                                                <div
                                                    onClick={() => arrayHelpers.push()}
                                                    className={"py-1 px-2 bg-lightGrey rounded-sm cursor-pointer"}
                                                >
                                                    <p className={"text-xs font-medium uppercase"}>
                                                        {"Add More"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>
                            <Spacer className={"block h-2"} />
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs text-textGrey tracking-wide"}>{"privacy policy"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        name={"privacy_url"}
                                        onChange={handleChange}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"Optional"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-2"} />
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs text-textGrey tracking-wide"}>{"terms and conditions"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        name={"terms_and_conditions_url"}
                                        onChange={handleChange}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"Optional"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-16"} />
                            <div className={"fixed bottom-1 w-full px-3 -ml-3 mx-auto md:relative md:flex-col md:flex md:items-end"}>
                                <Button
                                    uclasses={"rounded-3xl w-full md:px-4 md:w-auto text-black border-0 focus:outline-none focus:border-opacity-0 outline-none px-2"}
                                    type={"submit"}
                                    showLoading={isSubmitting}
                                    disabled={!isValid || isSubmitting}
                                >
                                    {"Save Changes"}
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