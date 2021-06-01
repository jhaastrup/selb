import React, { Fragment, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import metadata from "./metadata";
import { UPDATE_NAME } from "../modules/mutations";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import { InputField, Button } from "app/components/forms"; 
import Alert from "app/services/alerts/simpleAlert"; 

const Page = ({ dependencies }) => {
  const formRef = useRef();
  const pageKey = "name";
  const { caption = "", title = "", description = "" } =
    metadata[pageKey] || {};
  const { me = {} } = dependencies;
  const { pk, name } = me; 

  const [alertMessage, setAlertMessage] = React.useState('');
    const [alertVisible, setAlertVisible] = React.useState(false); 
    const [isUpdateError, setIsUpdateError] = React.useState(false);

  /*  useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []); */

  const [nameUpdate, { loading, data, error }] = useMutation(UPDATE_NAME, {
    onCompleted: (data) => {
      const { nameUpdate: payload } = data;
      formRef.current.setSubmitting(false);
      setAlertMessage("Name is Successfully edited")
      setAlertVisible(true);
      setIsUpdateError(false);

      //onChangePage && onChangePage("success", { payload, pageKey });
    },
    onError: (errors) => {
      setIsUpdateError(true);
      formRef.current.setSubmitting(false);
      //onChangePage && onChangePage("failed", {});
      setAlertMessage("Failed to edit name")
      setAlertVisible(true); 
     
      console.log({ errors });
    },
  });

  const ValidationSchema = Yup.object().shape({
    id: Yup.string()
      .required("This field is required")
      .default(""),
    name: Yup.string()
      .required("This field is required")
      .default(""),
  });

  const initialValues = { id: pk, name };

  return (
    <Formik
      innerRef={formRef}
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      enableReinitialize={true}
      validateOnMount={true}
      onSubmit={(variables, formikBag) => {
        console.log({ variables });
        nameUpdate({ variables });
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
       
       <div className = "space-y-5 px-8 sm:px-10">
         
       <h3 className="font-semibold text-xl">Edit Your Name</h3> 
       <p className="text-sm">
            Edit your name on sendbox it will be used as your name on shipments.
          </p>
         
       </div> 

       <Spacer className={"block h-4"} />
             <div className="space-y-5 px-8 sm:px-10">
              
                  <InputField
                    name={"name"}
                    showLabel={false}
                    resizeLabel={false}
                    className="block w-full sm:text-sm outline-none focus:outline-none "
                  />
             
              </div> 

              <Spacer className={"block h-40"} />

           
              <div className="border-t flex relative justify-end items-end pt-4 sm:pt-6  border-gray-300 ">
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
            {alertVisible && <Alert description={alertMessage} updateError={isUpdateError} show={alertVisible} onClose={setAlertVisible}/>}
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
                    nameUpdate({variables});
                }}
            >
                {({handleSubmit, handleChange, errors, values, isValid, setValues, isSubmitting}) => {
                    return (
                        <form autoComplete={"off"} onSubmit={handleSubmit}>
                            <div>
                                <div className={"flex justify-start items-start uppercase pt-2 pb-2"}>
                                    <p className={"text-xs tracking-wide"}>{"Name"}</p>
                                </div>
                                <div>
                                    <InputField 
                                        classnames={"text-lg md:text-lg"}
                                        name={"name"}
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
  );
};

export default Page;
