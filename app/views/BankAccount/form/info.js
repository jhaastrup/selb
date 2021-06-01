import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatNumber, formatString, formatNumberString, toNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { VERIFY_BANK } from '../modules/mutations';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { InputField, ChoiceField, Button } from "app/components/forms";

const Page = ({onChangePage, pageData, dependencies}) => {
    const formRef = useRef();
    const [validatedData, setValidatedData] = useState();

    const {account_number, bank_code} = pageData

    const [verifyBankAccount, { loading }] = useMutation(VERIFY_BANK, {
        onCompleted: (data) => {
            formRef.current.setSubmitting(false);
            console.log({ data });
            const {
                verifyBankAccount: { payload },
            } = data;
            setValidatedData(payload);
        },
        onError: (errors) => {
            console.log({ errors });
            formRef.current.setSubmitting(false);
            formRef.current.resetForm({ values: { account_number: null, bank_code: null } });
            alert(
                'Verification Failed',
                'We are unable to resolve this account number. Please check the number or try again later.',
            );
        },
    });

    const onItemSelected = useCallback((item) => {
        console.log(formRef, item);
        const variables = {
            account_number: formRef.current.values.account_number,
            bank_code: item.code
        };
        verifyBankAccount({ variables });

    }, [verifyBankAccount]);

    const ValidationSchema = Yup.object().shape({
        account_number: Yup.string().required('This field is required').default(''),
        bank_code: Yup.string().required('This field is required').default(),
    });

    const initialValues = {
        account_number,
        bank_code
    };

    // console.log({ initialValues, dependencies });

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
             <Spacer className={"block h-10"} />
            <div>
                <p className={"text-2xl font-semibold mb-2"}>{'What bank account do you want to add?'}</p>
                <p className={"text-sm text-textGrey tracking-wide mb-2"}>{'Provide the account number and bank information to continue.'}</p>
            </div>
            <Spacer className={"block h-6"} />
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={ValidationSchema}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables, formikBag) => {
                    console.log({ variables });
                    formikBag.setSubmitting(false);
                    onChangePage('otp', variables);
                }}
            >
                {({ handleSubmit, values, errors, isValid, isSubmitting }) => {
                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2"}>
                                    <p className={"text-xs tracking-wide"}>{"Account Number"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        classnames={"text-lg md:text-lg"}
                                        name={"account_number"}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"Required"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-4"} />
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs tracking-wide"}>{"Select Bank"}</p>
                                </div>
                                <div>
                                    <ChoiceField
                                        name={"bank_code"}
                                        placeholder={'Required'}
                                        mode={'outline'}
                                        labelProp={'name'}
                                        valueProp={'code'}
                                        options={_.sortBy(dependencies.banks.results, 'name')}
                                        isSearchable={true}
                                        isClearable={true}
                                        onItemSelected={onItemSelected}
                                    />
                                </div>
                            </div>
                            {loading ? (
                                <div>
                                    <p>{"Validating, please wait..."}</p>
                                </div>
                            ) : (
                                <div>
                                    {validatedData && (
                                        <div>
                                            <p>{`${validatedData?.account_name}`}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <Spacer className={"block h-12"} />
                            <div className={"flex justify-center items-center"}>
                                <Button
                                    uclasses={"rounded w-full uppercase tracking-widest font-medium md:font-medium"}
                                    type={"submit"}
                                    showLoading={isSubmitting}
                                    disabled={!isValid || isSubmitting || loading}
                                >
                                    {"Continue"}
                                </Button>
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div>
        // <div style={{display: "block", overflow: "auto"}}>
        //     <div style={{height:"2rem"}}></div>
        //     <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        //         <div style={{padding: "1.5rem", alignSelf: "center", width: "440px", maxWidth: "100%"}}>
        //             <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        //                 <Formik
        //                     innerRef={formRef}
        //                     initialValues={initialValues}
        //                     validationSchema={ValidationSchema}
        //                     enableReinitialize={true}
        //                     validateOnMount={true}
        //                     onSubmit={(variables, formikBag) => {
        //                         console.log({ variables });
        //                         formikBag.setSubmitting(false);
        //                         onChangePage('otp', variables);
        //                     }}
        //                 >
        //                     {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting }) => {
        //                         {/* const invalidStyle = flashError ? { color: theme.colors.red } : {}; */}
        //                         return (
        //                             <form autoComplete={"off"} onSubmit={handleSubmit}>
        //                                 <div>
        //                                     <p>{'What bank account do you want to add?'}</p>
        //                                     <p>{'Provide the account number and bank information to continue.'}</p>
        //                                 </div>
        //                                 <div>
        //                                     <div>
        //                                         <input
        //                                             type={"text"}
        //                                             name={"account_number"}
        //                                             value={values.account_number}
        //                                             onChange={handleChange}
        //                                             placeholder={"Account Number"}
        //                                             style={{width: "100%", padding: "0.5rem 0rem"}}
        //                                         />
        //                                         <div style={{height:"1rem"}}></div>
        //                                         <select value={values.bank_code} disabled={!values.account_number} onChange={handleChange} name={"bank_code"} style={{width: "100%", padding: "0.5rem 0rem"}}>
        //                                             <option>Select Bank</option>
        //                                             {dependencies.banks.results.map((bank) => (
        //                                                 <option key={bank.pk} value={bank.pk}>{bank.name}</option>
        //                                             ))}
        //                                         </select>
        //                                     </div>
        //                                 </div>
        //                                 {!validatedData && !loading && (<>
        //                                     <div style={{height:"1rem"}}></div>
        //                                     <div>
        //                                         <button
        //                                             type={"button"}
        //                                             onClick={onItemSelected}
        //                                             style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px"}}
        //                                         >
        //                                             {"Check"}
        //                                         </button>
        //                                     </div>
        //                                 </>)}
        //                                 {loading ? (
        //                                     <div>
        //                                         <p>{"Validating, please wait..."}</p>
        //                                     </div>
        //                                 ) : (
        //                                     <div>
        //                                         {validatedData && (
        //                                             <div>
        //                                                 <p>{`${validatedData?.account_name}`}</p>
        //                                             </div>
        //                                         )}
        //                                     </div>
        //                                 )}
        //                                 {validatedData &&(<>
        //                                     <div style={{height:"5rem"}}></div>
        //                                     <div>
        //                                         <button
        //                                             type={"submit"}
        //                                             style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px", width: "100%"}}
        //                                         >
        //                                             {"Continue"}
        //                                         </button>
        //                                     </div>
        //                                 </>)}
        //                             </form>
        //                         )
        //                     }}
        //                 </Formik>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )

}

export default Page;