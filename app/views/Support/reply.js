import { Fragment, useState, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { REPLY_THREAD } from './modules/mutations';
import {GET_RESOLUTION_THREADS} from "./modules/queries";

import * as Yup from "yup";
import { useQuery, useMutation } from '@apollo/client';
import { XIcon } from '@heroicons/react/outline'
import {Formik, Form} from "formik";
import {Button, TextAreaField} from "app/components/forms";
import ClipLoader from "react-spinners/ClipLoader";
import {classNames} from "app/lib/utils";

export default function ReplyForm({messageId, fetchMessage, showReply, setShowReply}) {
    const formRef = useRef();

    const [replyResolutionThreadAsCustomer, { loading, data }] = useMutation(REPLY_THREAD, {
        
        onError: (error) => {
            console.log({ error });
        },
        onCompleted: () => {
            fetchMessage && fetchMessage()
            setShowReply(false)

        },
        refetchQueries: [{query: GET_RESOLUTION_THREADS}]
        
        
    });

    const ValidationSchema = Yup.object().shape({
        body: Yup.string().required('message is required'),
    });

    const initialValues = {
        body: "",
        id: messageId
    };
  return (
    <Transition.Root show={showReply} as={Fragment}>
      <Dialog as="div" static className="fixed z-50  inset-0 overflow-y-auto" open={showReply} onClose={setShowReply}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="md:inline-block w-full align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setShowReply(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
                
                <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        Reply Message
                    </Dialog.Title>
                    <div className={"flex pb-4 flex-col"}>
                        <Formik
                            innerRef={formRef}
                            validationSchema={ValidationSchema}
                            initialValues={initialValues}
                            enableReinitialize={true}
                            validateOnMount={true}
                            onSubmit={(variables, formikBag) => {
                                replyResolutionThreadAsCustomer({ variables });
                            }}
                        >
                        {({handleSubmit, values, isValid, isSubmitting}) => {
                            return(
                                <Form onSubmit={handleSubmit}>
                                    <div className={"w-full mt-4"}>
                                        <div className="mb-3">
                                            <TextAreaField 
                                                name={"body"}
                                                placeholder={"Reply message"}
                                            />
                                        </div>
                                        <div className="flex justify-end items-end">
                                            <button
                                            
                                                disabled={loading || !isValid || isSubmitting}
                                                type="submit"
                                                className={classNames(
                                                    loading || !isValid || isSubmitting ? "cursor-not-allowed opacity-70": "cursor-pointer",
                                                    "mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm")}
                                            >
                                                {loading ? <p className="flex items-center"><ClipLoader size={15} color={"rgba(237, 47, 89, 0.6)"}/> <span className="ml-2">Replying...</span></p> : "Reply"}

                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )
                        }}

                        
                        </Formik>
                    </div>
                
              </div>
              
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}