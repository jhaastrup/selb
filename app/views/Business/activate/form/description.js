import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import Link from "next/link";
import {InputField, RadioButton, Button, TextAreaField, ChoiceField} from "app/components/forms";
import {useMutation, useLazyQuery, useQuery} from "@apollo/client";
import {REGISTER_BUSINESS } from "../../modules/mutations";
import {SENDBOX_USERS} from "../../modules/queries";
import {useDebounce} from "app/lib/hooks";
import { handleValidationErrors, handleNetworkErrors } from 'app/lib/errorHandlers';




const Page = ({dependencies, onChangePage, setState, updatePageData}) => {
    const formRef = React.useRef();
    const options = dependencies?.businessCategories.results ?? {};
    const entity = dependencies?.entityTypes.results ?? [];
    const [filteredOptions, setFilteredOptions] = React.useState(options);
    const { name = '', phone = '', email = '' } = (dependencies && dependencies?.me) || {};
    
    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "address",
        }))
    }, []);

    const initialValues = {
        email,
        phone,
        type: 'seller',
    };

    const [registerEntity] = useMutation(REGISTER_BUSINESS, {
        onCompleted: ({ registerEntity: resp }) => {
            formRef.current.setSubmitting(false);
            recordAction('description_submitted', { date_created, page: 'description' })();
            changePage('success', {});
        },
        onError: (errors) => {
            console.log({ errors });
            formRef.current.setSubmitting(false);
        },
    });
   

    const formatOptionName = (code) => {
        if (_.isEmpty(code)) {
            return;
        }
        const option = _.find(options, { code });
        return option ? option.name : undefined;
    };

    

    const ValidationSchema = Yup.object().shape({
        name: Yup.string().required('This field is required'),
        email: Yup.string().email().required('This field is required'),
        phone: Yup.string().required('This field is required'),
        type: Yup.string().required('This field is required'),
        category: Yup.string().required('This field is required'),
        description: Yup.string().notRequired(),
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
                    registerEntity({ variables });
                }}>
            {({handleSubmit, values, isValid, isSubmitting}) => {
                return(
                
                    <Form onSubmit={handleSubmit}>
                        <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                            <div className={"pb-2"}>
                                <p className={"text-sm font-semibold text-black"}>{"Describe your business"}</p>
                                <p className={"text-sm font-semibold text-textGrey"}>
                                    {"Give us a brief description of your business"}
                                </p>
                            </div>
                            <div className="w-full mt-2">
                                <p className={"text-sm  text-textGrey"}>{"Business Name"}</p>
                                <InputField 
                                    name={"username"}
                                    showLabel={false}
                                    // label={"Description"}
                                    placeholder={"Required"}
                                    
                                />
                                <div>
                                    <p className={"text-sm font-semibold text-textGrey"}>{"Give a description of your package. Used for internal reference only."}</p>
                                </div>
                            </div>

                            <div className={"mt-4"}>
                                <p className={"text-sm pb-2  text-textGrey"}>{"Shipping Category"}</p>

                                <ChoiceField
                                    // label={'Shipping Category'}
                                    format={formatOptionName}
                                    name={"category"}
                                    placeholder={'Required'}
                                    labelProp={'name'}
                                    valueProp={'code'}
                                    options={filteredOptions}
                                />
                                <p className={"text-sm pb-2  text-textGrey"}> {'Select a category that best describes your business.'}</p>
                            </div>

                            <div className={"mt-2"}>
                                <TextAreaField 
                                    name={"description"}
                                    placeholder={"Briefly describe your business"}
                                />
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
                                    disable={!isValid || isSubmitting} 
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
