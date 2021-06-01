import React, { Fragment, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import metadata from "./metadata";
import { RESET_PASSWORD } from "../modules/mutations";
//import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import { InputField, Button } from "app/components/forms";
import  SimpleModal  from 'app/components/simpleModal';
import EditPassword from './editPassword';

const Page = ({ dependencies }) => { 

  const [pluginModalVisible, setPluginModalVisible] = React.useState(false);
  const formRef = useRef();
  const pageKey = "password";
  const { caption = "", title = "", description = "" } =
    metadata[pageKey] || {};
  const { me = {} } = dependencies;
  const { pk } = me; 

  const closeModal = () => {
    setPluginModalVisible(false);
    
}

  /*  useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []); */

    const [passwordReset, { loading, data, error }] = useMutation(
        RESET_PASSWORD, {
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
  });



  //const initialValues = { id: pk, username };

  return (
   <div className='flex justify-between items-center'>
     <div>
       <h6 className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">{"Password"}</h6>
       <p className = "text-sm "></p>
     </div>
     <button
     onClick={()=>setPluginModalVisible(true)}
  
     className={'text-red-500 text-sm'}>{"Reset"}</button> 
     <SimpleModal
     title=""
     onClose={closeModal}
     open={pluginModalVisible}
     > 
     <EditPassword dependencies={dependencies}/>
     </SimpleModal>
   </div>  
   );
};

export default Page;
