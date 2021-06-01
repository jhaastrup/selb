import * as React from "react";
import { GET_THREAD } from './modules/queries';
import { REPLY_THREAD } from './modules/mutations';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from "next/router";
import { PublicLayout as Layout } from "app/views/Layout";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {formatDate, formatPhone, formatString, formatNumber} from "app/lib/formatters";
import Loading from "app/components/loading"
import {Button, TextAreaField} from "app/components/forms";
import {PersonIcon} from "app/components/icons";


const Page = ({query}) => {
    const router = useRouter();
    const formRef = React.useRef();
    const [toggleMessage, setToggleMessage] = React.useState(false);

    const dataLabel = "replyResolutionThreadAsCustomer";
    const { refetch, data: dataThread, error, loading: loadingThread, fetchMore } = useQuery(GET_THREAD, {
        fetchPolicy: 'cache-and-network',
        variables: { id: query.mid },
        // onCompleted: (payload) => {
        //     const {
        //         getResolutionThread: { messages },
        //     } = payload;
        // },
    });
    
    const [replyResolutionThreadAsCustomer, { loading, data }] = useMutation(REPLY_THREAD, {
        onError: (error) => {
            console.log({ error });
        },
    });

   

    if(loadingThread){
        return(
            <Layout pathname={router.pathname}>
                <Loading />
            </Layout>
        )
    }

    if(error){
        return(
            <Layout pathname={router.pathname}>
                <div className={"h-40 mt-auto flex items-center justify-center"}>
                    <Button
                        onClick={() => refetch && refetch()} 
                    >
                       Try Again
                    </Button>
                </div>
            </Layout>
        )
    }
    const {messages=[]} = dataThread.getResolutionThread;

    const ValidationSchema = Yup.object().shape({
        body: Yup.string().required('message is required'),
    });

    const initialValues = {
        body: "",
        id: query.mid
    };

    return(
        <Layout back={router.back} isDynamic={true} pathname={router.pathname}>
            <div className={"max-w-3xl bg-white min-h-screen w-full p-2 md:p-0 mx-auto"}>
                {messages.map((item, idx) => {
                    const { body = '', sender = undefined, date_created } = item || {};
                    const isMe = sender && sender.toLowerCase() !== "support@sendbox.ng" || false;
                return(
                    <div key={`message-${idx}`}>
                        {toggleMessage ? (
                            <div onClick={() => setToggleMessage(!toggleMessage)} className={"flex border-b pb-4 border-transluscent-grey flex-col"}>
                                <div className={"grid grid-cols-6 py-4 px-2"}>
                                    <div className={"col-span-1"}>
                                        <PersonIcon />
                                    </div>
                                <div className={"col-span-5"}>
                                    <p className={"text-black capitalize text-sm md:text-base font-bold"}>{formatString(isMe ? 'Me' : 'Support', 'capitalize')}</p>              
                                    <p className={"text-textGrey capitalize text-sm md:text-base font-bold"}>{isMe ? 'to Support' : 'to me'}</p>
                                    <p className={"text-textGrey capitalize text-sm md:text-base font-bold"}>Date {formatDate(date_created, 'LLL')}</p>

                                </div>
                            </div>
                        <div dangerouslySetInnerHTML={{__html: body}} className={"text-textGrey"}>
                        </div>
                    </div>
                        ):(
                            <div onClick={() => setToggleMessage(!toggleMessage)} className={"flex border-b pb-4 border-transluscent-grey flex-col"}>
                                <div className={"grid grid-cols-6 py-4 px-2"}>
                                    <div className={"col-span-1"}>
                                        <PersonIcon />
                                    </div>
                                    <div className={"col-span-5"}>
                                        <p className={"text-black capitalize text-sm md:text-base font-bold"}>{formatString(isMe ? 'Me' : 'Support', 'capitalize')}</p>              
                                        <p className={"text-textGrey capitalize text-sm md:text-base font-bold"}>{isMe ? 'to Support' : 'to me'}</p>
                                        <p className={"text-textGrey capitalize text-sm md:text-base font-bold"}>Date {formatDate(date_created, 'LLL')}</p>

                                    </div>
                                </div>
                        
                            </div>
                        )}
                    </div>
                    
                    )
                })}
                
                <div className={"flex border-b pb-4 border-transluscent-grey flex-col"}>
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
                                    <div className={"w-full grid grid-cols-1 gap-4 mt-4"}>
                                        <div>
                                            <TextAreaField 
                                                name={"body"}
                                                placeholder={"Reply message"}
                                            />
                                        </div>
                                        <div className={"w-full px-3 flex justify-center items-center mx-auto md:relative md:flex-col md:flex md:items-end"}>
                                            <Button
                                                disable={!isValid || isSubmitting ? 1 : undefined} 
                                                uclasses={"w-full py-2 md:w-1/6"}
                                                type={"submit"}
                                            >
                                                Reply
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            )
                        }}

                        
                    </Formik>
                </div>
            </div>
        </Layout>
    )
}


export default Page;