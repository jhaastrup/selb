import React, { Fragment, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import _ from "lodash";
import metadata from "./metadata";
import { REQUEST_PHONE_UPDATE } from "../modules/mutations";
//import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import { InputField, Button } from "app/components/forms";
import SimpleModal from "app/components/simpleModal";
import EditPhone from "./editPhone";

const Page = ({ dependencies }) => {
  const [pluginModalVisible, setPluginModalVisible] = React.useState(false);
  const formRef = useRef();
  const pageKey = "phone";
  const { caption = "", title = "", description = "" } =
    metadata[pageKey] || {};
  const { me = {}, dependencies: phoneDependencies } = dependencies;
  const { countries = [] } = phoneDependencies;
  const { pk, phone } = me;

  const closeModal = () => {
    setPluginModalVisible(false);
  };

  /*  useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []); */

  const [requestPhoneUpdate, { loading, data, error }] = useMutation(
    REQUEST_PHONE_UPDATE,
    {
      onCompleted: (data) => {
        const { usernameUpdate: payload } = data;
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

  const initialValues = { id: pk, phone };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h6 className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
          {"Phone Number"}
        </h6>
        <p className="text-sm text-gray-700">{phone}</p>
      </div>
      <button
        onClick={() => setPluginModalVisible(true)}
        className={"text-red-500 text-sm"}
      >
        {"Update"}
      </button>
      <SimpleModal
        title=""
        onClose={closeModal}
        open={pluginModalVisible}
      >
        <EditPhone dependencies={dependencies} />
      </SimpleModal>
    </div>
  );
};

export default Page;
