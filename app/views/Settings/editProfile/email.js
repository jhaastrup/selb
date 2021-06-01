import React, { Fragment, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import metadata from "./metadata";
import { REQUEST_EMAIL_UPDATE } from "../modules/mutations";
//import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import { InputField, Button } from "app/components/forms";
import  SimpleModal  from 'app/components/simpleModal';
import EditEmail from './editEmail';

const Page = ({ dependencies }) => { 

  const [pluginModalVisible, setPluginModalVisible] = React.useState(false);
  const formRef = useRef();
  const pageKey = "email";
  const { caption = "", title = "", description = "" } =
    metadata[pageKey] || {};
  const { me = {} } = dependencies;
  const { pk, email } = me; 

  const closeModal = () => {
    setPluginModalVisible(false);
    
}

  /*  useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []); */

    const [requestEmailUpdate, { loading, data, error }] = useMutation(
        REQUEST_EMAIL_UPDATE, {
    onCompleted: (data) => {
      const { requestEmailUpdate: payload } = data;
      formRef.current.setSubmitting(false);
      onChangePage && onChangePage("success", { payload, pageKey });
    },
    onError: (errors) => {
      formRef.current.setSubmitting(false);
      onChangePage && onChangePage("failed", {});
      console.log({ errors });
    },
  });



  const initialValues = { id: pk, email };

  return (
   <div className='flex justify-between items-center'>
     <div>
       <h6 className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">{"Email"}</h6>
       <p className = "text-sm text-gray-700">{email}</p>
     </div>
     <button
     onClick={()=>setPluginModalVisible(true)}
  
     className={'text-red-500 text-sm'}>{"Update"}</button> 
     <SimpleModal
     title=""
     onClose={closeModal}
     open={pluginModalVisible}
     > 
     <EditEmail dependencies={dependencies}/>
     </SimpleModal>
   </div>  
   );
};

export default Page;
