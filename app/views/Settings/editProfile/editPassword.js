import React, { Fragment, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import metadata from "./metadata";
import { RESET_PASSWORD } from "../modules/mutations";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import { InputField, Button } from "app/components/forms";

const Page = ({ dependencies }) => {
  const formRef = useRef();
  const pageKey = "password";
  const { caption = "", title = "", description = "" } =
    metadata[pageKey] || {};
  const { me = {} } = dependencies;
  const { pk } = me;

  /*  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      previousPage: "default",
    }));
  }, []); */

  const [passwordReset, { loading, data, error }] = useMutation(
    RESET_PASSWORD,
    {
      onCompleted: (data) => {
        const { requestPassword: payload } = data;
        formRef.current.setSubmitting(false);
        onChangePage && onChangePage("success", { payload, pageKey });
      },
      onError: (errors) => {
        formRef.current.setSubmitting(false);
        onChangePage && onChangePage("failed", {});
        console.log({ errors });
      },
    }
  );

  const ValidationSchema = Yup.object().shape({
    old_password: Yup.string()
      .required("This field is required")
      .default(""),
    verify_password: Yup.string()
      .required("This field is required")
      .default(""),
    new_password: Yup.string()
      .required("This field is required")
      .default(""),
    id: Yup.string().required("This field is required"),
  });

  const initialValues = { id: pk };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      enableReinitialize={true}
      validateOnMount={true}
      onSubmit={(variables, formikBag) => {
        console.log({ variables });
        passwordReset({ variables });
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
                <h3 className="font-semibold text-xl">Edit Your Password</h3>
                <p className="text-sm">
                  Edit your sendbox Password, This will be used to login to your account.
                </p>
              </div>

              <Spacer className={"block h-4"} />

      <div className="space-y-5 px-8 sm:px-10">
       


<InputField
                    name={"old_password"}
                    showLabel={false}
                    resizeLabel={false}
                    placeholder={"Enter current password"}
                    className="block w-full sm:text-sm outline-none focus:outline-none"
                  />
      
       </div> 

       <Spacer className={"block h-4"} />

       <div className="space-y-5 px-8 sm:px-10">

       <InputField
                    name={"new_password"}
                    showLabel={false}
                    resizeLabel={false}
                    placeholder={"Enter new password"}
                    className="block w-full sm:text-sm outline-none focus:outline-none"
                  />
      
      </div> 

      <Spacer className={"block h-4"} />

      <div className=" space-y-5 px-8 sm:px-10 ">

      <InputField
                    name={"verify_password"}
                    showLabel={false}
                    resizeLabel={false}
                    placeholder={"Verify new password"}
                    className="block w-full sm:text-sm outline-none focus:outline-none"
                  />

</div> 

<Spacer className={"block h-40"} />


       <div className="border-t flex justify-end pt-4 sm:pt-6 border-gray-300 px-8 sm:px-10">
         <Button
           className="py-1 px-4 rounded uppercase bg-black tracking-widest text-white font-medium md:font-medium"
           type={"submit"}
           showLoading={isSubmitting}
           disabled={!isValid || isSubmitting}
         >
           {"SUBMIT"}
         </Button>
      </div>
     </div>

           {/*  <div className="sm:grid m-4 sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <InputField
                    name={"old_password"}
                    showLabel={false}
                    resizeLabel={false}
                    placeholder={"Enter current password"}
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid m-4 sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <InputField
                    name={"new_password"}
                    showLabel={false}
                    resizeLabel={false}
                    placeholder={"Enter new password"}
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid m-4 sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <InputField
                    name={"verify_password"}
                    showLabel={false}
                    resizeLabel={false}
                    placeholder={"Verify new password"}
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

    /* <div className={"flex flex-col max-w-lg mx-auto px-4"}>
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
                    passwordReset({ variables });
                }}
            >
                {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting}) => {
                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs tracking-wide"}>{"Current Password"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        type={"password"}
                                        classnames={"text-lg md:text-lg"}
                                        name={"old_password"}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"Enter current password"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-4"} />
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs tracking-wide"}>{"New Password"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        type={"password"}
                                        classnames={"text-lg md:text-lg"}
                                        name={"new_password"}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"Enter new password"}
                                    />
                                </div>
                            </div>
                            <Spacer className={"block h-4"} />
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs tracking-wide"}>{"Verify Password"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        type={"password"}
                                        classnames={"text-lg md:text-lg"}
                                        name={"verify_password"}
                                        showLabel={false}
                                        resizeLabel={false}
                                        placeholder={"Verify new password"}
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
    //                             requestPassword({variables});
    //                         }}
    //                     >
    //                         {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting }) => {
    //                             {/* const invalidStyle = flashError ? { color: theme.colors.red } : {}; */}
    //                             return (
    //                                 <form autoComplete={"off"} onSubmit={handleSubmit}>
    //                                     <div>
    //                                         <div>
    //                                             <input
    //                                                 type={"text"}
    //                                                 name={"email"}
    //                                                 value={values.email}
    //                                                 onChange={handleChange}
    //                                                 placeholder={"Email"}
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
