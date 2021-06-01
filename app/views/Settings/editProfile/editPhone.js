import React, { Fragment, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import metadata from "./metadata";
import { REQUEST_PHONE_UPDATE } from "../modules/mutations";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import { InputField, ChoiceField, Button } from "app/components/forms";
import { formatNumber, formatPhone, formatString } from "app/lib/formatters";

const Page = ({ dependencies }) => {
  const formRef = useRef();
  const pageKey = "phone";
  const { caption = "", title = "", description = "" } =
    metadata[pageKey] || {};
  const { me = {}, dependencies: phoneDependencies } = dependencies;
  const { countries = [] } = phoneDependencies;
  const { pk, phone } = me;

  /* useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      previousPage: "default",
    }));
  }, []); */

  const [requestPhoneUpdate, { loading, data, error }] = useMutation(
    REQUEST_PHONE_UPDATE,
    {
      onCompleted: (data) => {
        const { requestPhoneUpdate: payload } = data;
        const phone = formRef.current.values.phone;
        formRef.current.setSubmitting(false);
        onChangePage && onChangePage("otp", { phone, pageKey });
      },
      onError: (errors) => {
        formRef.current.setSubmitting(false);
        onChangePage && onChangePage("failed", {});
        console.log({ errors });
      },
    }
  );

  const onItemSelected = (item) => {
    console.log({ item });
    const { code, pk } = item;
    formRef.current.setFieldValue("country_code", pk, true);
  };

  const ValidationSchema = Yup.object().shape({
    id: Yup.string()
      .required("This field is required")
      .default(""),
    phone: Yup.string()
      .required("This field is required")
      .default(""),
    country_code: Yup.string()
      .required("This field is required")
      .default(""),
  });

  const initialValues = { id: pk, phone };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      enableReinitialize={true}
      validateOnMount={true}
      onSubmit={(variables, formikBag) => {
        console.log({ variables });
        requestPhoneUpdate({ variables });
      }}
    >
      {({
        handleSubmit,
        handleChange,
        errors,
        values,
        isValid,
        setValues,
        isSubmitting,
      }) => {
        return (
          <form autoComplete={"off"} onSubmit={handleSubmit}> 



<div className="pt-5  text-left overflow-hidden transform transition-all sm:mt-8 sm:align-middle max-w-sm sm:w-full  h-4/6 flex flex-col  justify-between w-full ">

<div className="space-y-5 px-8 sm:px-10">
                <h3 className="font-semibold text-xl">Edit Your Phone</h3>
                <p className="text-sm">
                  Edit your sendbox phone number, Information about your shipments will be sent
                </p>
              </div>

              <Spacer className={"block h-4"} />
<div className="space-y-5 px-8 sm:px-10">
       
<ChoiceField
                    name={"country_code"}
                    placeholder={"Select a country"}
                    //mode={"outline"}
                    labelProp={"name"}
                    valueProp={"code"}
                    options={_.sortBy(countries, "name")}
                    isSearchable={true}
                    isClearable={true}
                    onItemSelected={onItemSelected}
                    className="block w-full sm:text-sm outline-none border-transparent focus:outline-none"
                  />
  
   </div> 
 
   <Spacer className={"block h-4"} />

   <div className="space-y-5 px-8 sm:px-10 ">
   <InputField
                    name={"phone"}
                    format={(val) => formatPhone(val, values.country_code)}
                    showLabel={false}
                    resizeLabel={false}
                    className="block w-full sm:text-sm outline-none focus:outline-none"
                  />
      
    </div> 

    <Spacer className={"block h-40"} />
    
       <div className="border-t flex justify-end pt-4 sm:pt-6 border-gray-300 px-8 sm:px-10">
         <Button 
           uclasses={
            "rounded uppercase tracking-widest font-medium md:font-medium"
          }
           className="py-1 px-4 rounded uppercase bg-black tracking-widest text-white font-medium md:font-medium"
           type={"submit"}
           showLoading={isSubmitting}
           disabled={!isValid || isSubmitting}
         >
           {"SUBMIT"}
         </Button>
      </div>
     </div>


            {/* <div className="sm:grid m-4 sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
             
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300">
                  <ChoiceField
                    name={"country_code"}
                    placeholder={"Select a country"}
                    mode={"outline"}
                    labelProp={"name"}
                    valueProp={"code"}
                    options={_.sortBy(countries, "name")}
                    isSearchable={true}
                    isClearable={true}
                    onItemSelected={onItemSelected}
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid m-4 sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
             
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <InputField
                    name={"phone"}
                    format={(val) => formatPhone(val, values.country_code)}
                    showLabel={false}
                    resizeLabel={false}
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
              <Button
                uclasses={
                  "rounded uppercase tracking-widest font-medium md:font-medium"
                }
                type={"submit"}
                showLoading={isSubmitting}
                disabled={!isValid || isSubmitting}
              >
                {"SUBMIT"}
              </Button>
            </div>
            </div> */}
          </form>
        );
      }}
    </Formik>

    /*  <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-2"}>{caption}</p>
                <p className={"text-2xl font-semibold mb-2"}>{title}</p>
                <p className={"text-sm text-textGrey tracking-wide mb-2"}>{description}</p>
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
                    requestPhoneUpdate({variables});
                }}
            >
                {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting}) => {
                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs tracking-wide"}>{"Country"}</p>
                                </div>
                                <div>
                                    <ChoiceField
                                        name={"country_code"}
                                        placeholder={'Required'}
                                        mode={'outline'}
                                        labelProp={'name'}
                                        valueProp={'code'}
                                        options={_.sortBy(countries, 'name')}
                                        isSearchable={true}
                                        isClearable={true}
                                        onItemSelected={onItemSelected}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-4"} />
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs tracking-wide"}>{"Phone Number"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        classnames={"text-lg md:text-lg"}
                                        name={"phone"}
                                        format= {(val) => formatPhone(val, values.country_code) }
                                        showLabel={false}
                                        resizeLabel={false}
                                    />
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
                                    {"SUBMIT"}
                                </Button>
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div> */

    // <div style={{padding:"1rem", height:"100vh", flex:"4", borderLeft: "1px solid"}}>
    //     <div style={{display: "block", overflow: "auto"}}>
    //         <div style={{height:"2rem"}}></div>
    //         <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
    //             <div style={{padding: "1.5rem", alignSelf: "center", width: "440px", maxWidth: "100%"}}>
    //                 <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
    //                     <div>
    //                         <p>{caption}</p>
    //                         <p>{title}</p>
    //                         <p>{description}</p>
    //                     </div>
    //                     <div style={{height:"4rem"}}></div>
    //                     <Formik
    //                         innerRef={formRef}
    //                         initialValues={initialValues}
    //                         validationSchema={ValidationSchema}
    //                         enableReinitialize={true}
    //                         validateOnMount={true}
    //                         onSubmit={(variables, formikBag) => {
    //                             console.log({ variables });
    //                             requestPhoneUpdate({variables});
    //                         }}
    //                     >
    //                         {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting }) => {
    //                             {/* const invalidStyle = flashError ? { color: theme.colors.red } : {}; */}
    //                             return (
    //                                 <form autoComplete={"off"} onSubmit={handleSubmit}>
    //                                     <div>
    //                                         <div>
    //                                             <select value={values.country_code} onChange={handleChange} name={"country_code"} style={{width: "100%", padding: "0.5rem 0rem"}}>
    //                                                 <option>Select Country</option>
    //                                                 {countries.map((opt) => (
    //                                                     <option key={opt.pk} value={opt.code}>{opt.name}</option>
    //                                                 ))}
    //                                             </select>
    //                                             <div style={{height:"1rem"}}></div>
    //                                             <input
    //                                                 type={"text"}
    //                                                 name={"phone"}
    //                                                 value={values.phone}
    //                                                 onChange={handleChange}
    //                                                 placeholder={"Phone Number"}
    //                                                 style={{width: "100%", padding: "0.5rem 0rem"}}
    //                                             />
    //                                             <div style={{height:"0.5rem"}}></div>
    //                                         </div>
    //                                     </div>
    //                                     <div style={{height:"1rem"}}></div>
    //                                         <div>
    //                                             <button
    //                                                 type={"submit"}
    //                                                 style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px", width: "100%"}}
    //                                             >
    //                                                 {"Submit"}
    //                                             </button>
    //                                         </div>
    //                                 </form>
    //                             )
    //                         }}
    //                     </Formik>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // </div>
  );
};

export default Page;
