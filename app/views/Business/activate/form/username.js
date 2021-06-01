import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import Link from "next/link";
import {InputField, RadioButton, Button, ChoiceField} from "app/components/forms";
import {useMutation, useLazyQuery, useQuery} from "@apollo/client";
import {CREATE_BUSINESS_USERNAME } from "../../modules/mutations";
import {SENDBOX_USERS} from "../../modules/queries";
import {useDebounce} from "app/lib/hooks";
import { handleValidationErrors, handleNetworkErrors } from 'app/lib/errorHandlers';




const Page = ({dependencies, onChangePage, setState, updatePageData}) => {
    const formRef = React.useRef();
    const [searchInput, setSearchInput] = React.useState('');
    const [userExists, setuserExists] = React.useState(null);
    const [allowUser, setAllow] = React.useState(false);
    const debouncedSearchInput = useDebounce(searchInput, 200);
    const { pk = '' } = (dependencies && dependencies?.me) || {};
    const initialValues = { id: pk, username: "" };
    


    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);
    
    const [getUsernames, { data, loading: searchLoading }] = useLazyQuery(SENDBOX_USERS, {
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        onCompleted: ({ getUsernames: resp }) => {
            console.log('done fetching', { data });
            const { results } = resp;
            if (results.length < 1 || _.isEmpty(results)) {
                setuserExists(true);
                setAllow(false);
            } else {
                const user = results[0].user;
                if (user?.pk === pk) {
                    setuserExists(false);
                    setAllow(true);
                } else {
                    setuserExists(true);
                    setAllow(false);
                    formRef.current.setFieldError('username', 'username already exists', false);
                }
            }
        },
        onError: (errors) => {
            setuserExists(true);
        },
    });
    const [usernameUpdate] = useMutation(CREATE_BUSINESS_USERNAME, {
        onCompleted: ({ usernameUpdate: resp }) => {
            formRef.current.setSubmitting(false);
            onChangePage('address', {});
        },
        onError: (error) => {
            console.log('===>', { error });
           
            const { graphQLErrors, networkError } = error;
            if (graphQLErrors) {
                const validationErrors = handleValidationErrors(graphQLErrors);
                formRef.current.setErrors(validationErrors);
            }

            if (networkError) {
                handleNetworkErrors(networkError);
            }
            formRef.current.setSubmitting(false);
        },
    });

 

    const checkIfExists = (username) => {
        if (debouncedSearchInput) {
            getUsernames({
                variables: {
                    filter_by: {
                        value: {
                            op: '$eq',
                            value: username,
                        },
                    },
                    page_by: {
                        per_page: '5',
                    },
                },
            });
        } else {
            // formRef.current.setFieldError('username', 'enter your username');
        }
    };

    const checkValues = () => {
        setTimeout(() => {
            const { values, isValid } = formRef && formRef.current ? formRef.current : {};
            const { username } = values || {};
            if (isValid && username) {
                setSearchInput(username);
                checkIfExists(username);
            }
            
        }, 200);
    };

    

    const ValidationSchema = Yup.object().shape({
        username: Yup.string().required('Only letters, numbers, -, _ and . allowed'),
        id: Yup.string().required(),
    });

    return(
        <div className={"max-w-3xl mx-auto border border-lightGrey px-3 mt-3 pb-12 flex flex-col"}>
            <Formik
                innerRef={formRef}
                validationSchema={ValidationSchema}
                initialValues={initialValues}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables) => {
                        console.log({ variables });
                        updatePageData({ username: variables.username });
                        if (allowUser === true && userExists === false) {
                            onChangePage('address', {});
                        } else {
                            usernameUpdate({ variables });
                        }
                }}>
            {({handleSubmit, values, isValid, isSubmitting}) => {
                return(
                
                    <Form onSubmit={handleSubmit}>
                        <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                            <div className={"pb-2"}>
                                <p className={"text-sm font-semibold text-textGrey"}>
                                    {'Your username will be used as your business handle. Every username is unique.'}
                                </p>
                            </div>
                            <div className="w-full mt-2">
                                
                                <InputField 
                                    name={"username"}
                                    showLabel={false}
                                    // label={"Description"}
                                    placeholder={"Enter username"}
                                    onInputChanged={() => {                                   
                                        checkValues();
                                    }}
                                />
                                <div>
                                    <p className={"text-sm font-semibold text-textGrey"}>{"Give a description of your package. Used for internal reference only."}</p>
                                </div>
                            </div>
                            <div className={"my-4"}>
                                <p className={"text-xs"}>
                                <span>
                                    {"By signing up, I represent that I have read, understand, and agree to the"}
                                </span>
                                <span>{" "}</span>
                                <Link href={"/legal/privacy"} passHref={true}>
                                    <a className={"text-primary"}>Privacy Policy</a>
                                </Link>
                                {" "}
                                {"and"}
                                {" "}
                                <Link href={"/legal/terms"} passHref={true}>
                                    <a className={"text-primary"}>Terms of Service</a>
                                </Link>
                                {" "}
                                of Sendbox Software Technologies Limited.
                                </p>
                            </div>
                            <div className={"fixed bottom-1 w-full px-3 -ml-3 mx-auto md:relative md:flex-col md:flex md:items-end"}>

                                <Button
                                    disable={!isValid || isSubmitting ? 1 : undefined} 
                                    uclasses={"rounded-3xl w-full md:w-auto px-2 focus:border-opacity-0 outline-none w-24"}
                                    type={"submit"}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                        
                        
                    </Form>
                    
                )
            }}

        </Formik>
    </div>
    )
}
export default Page;
