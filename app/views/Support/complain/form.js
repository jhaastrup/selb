
import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, TextAreaField, Button, ChoiceField} from "app/components/forms";
import { REPORT_ISSUE } from "../modules/mutations";
import {formatPhone, formatString} from "app/lib/formatters";
import {toBase64, uuid} from "app/lib/utils";
import {useQuery, useMutation} from "@apollo/client";


const Page = (
    {
        onChangePage, pageData, setState, dependencies, updatePageData
    }) => {
    const formRef = React.useRef();
    const fileRef = React.useRef();
    const { complaint, reference, images=[] } = pageData;
    const {me:{email=""}, getResolutionComplaintTypes: {results=[]}} = dependencies;
    const complaintObj = _.find(results, { pk: complaint });
    const [headerName, setheaderName] = React.useState(complaintObj?.name ?? 'Please provide a description');
    const [description, setDescription] = React.useState(complaintObj?.description || '');

    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "reference",
        }))
    }, []);

    // const imgUrl = React.useMemo(() => images && images.length > 0 ? images[0].url ? images[0].url : `data:image/gif;base64,${images[0].data}` : "", [images]);
    const src = React.useMemo(() => images.map((img) => img.url ? img.url : `data:image/gif;base64,${img.data}`), [images]);
    
    const formatName = (pk) => {
        if (_.isEmpty(pk)) {
            return;
        }
        const issue = _.find(results, { pk });
        return issue ? issue.name : undefined;
    };
   
    const [sendResolutionMessage, { loading: submittingIssue }] = useMutation(REPORT_ISSUE, {
        onCompleted: (data) => {
            formRef.current.setSubmitting(false);
            onChangePage('success', {});
        },
        onError: (err) => {
            formRef.current.setSubmitting(false);
            console.log({ err });
        },
    });

    const onUploadClicked = () => {
        fileRef.current.click();
    };

    const addFiles = async (file) => {
        const base64 = await toBase64(file);
        const processedFile = { data: base64, name: file.name, media_type: file.type };
        const items = formRef.current.values.attachment || [];
        formRef.current.setFieldValue('attachment', [...items, processedFile], true);
    };

    const onFileChanged = async (e) => {
        const payload = e.target.files[0];
        if(payload){
            await addFiles(payload);
        }
        return;
    };
        
    
        

    const removeImage = (id) => {
        const items = formRef.current.values.attachment || [];
        const arr = items.filter(function (item) {
            return item.name !== id;
        });
        formRef.current.setFieldValue('attachment', arr, true);
    };


    // const onItemSelected = (item) => {
    //     const { name, description } = item;
    //     setDescription(description);
    //     setheaderName(name);
    // };

    const ValidationSchema = Yup.object().shape({
        subject: Yup.string().required('subject required'),
        complaint: Yup.string().notRequired(),
        issue_code: Yup.string().notRequired(),
        attachment: Yup.array().notRequired(),
        email: Yup.string().required('subject is required'),
        body: Yup.string().required('message is required'),
    });

    const initialValues = {
        email,
        subject: complaintObj ? complaintObj.name : '',
        complaint,
        issue_code: reference,
        attachment: [],
    };


    return(
        <div className={"border border-gray-200 px-3 mt-3 pb-12 flex flex-col"}>
                <Formik
                    innerRef={formRef}
                    validationSchema={ValidationSchema}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={(variables, formikBag) => {
                        sendResolutionMessage({ variables });
                    }}
                >
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                            <div className={"my-2"}>
                                <p className={"text-black text-base font-semibold"}>{headerName}</p> 
                                <p className={"text-gray-500 text-sm "}>{description}</p>
                        
                            </div>
                                <div className="w-full">
                                    <InputField 
                                        showLabel={false}
                                        name={'issue_code'}
                                        placeholder={"Reference"}
                                    />
                                    
                                </div>

                                <div className={"mt-2"}>
                                    <ChoiceField
                                        label={'complaint Type'}
                                        name={`complaint`}
                                        placeholder={'Required'}
                                        labelProp={'name'}
                                        valueProp={'pk'}
                                        options={results}
                                        format={formatName}
                                        
                                    />
                                </div>
                                {values && values.complaint === 'other' && (
                                     <InputField 
                                        showLabel={false}
                                        name={'subject'}
                                        placeholder={"What is your request"}
                                    />
                                )}
                                <div className={"mt-2"}>
                                    <TextAreaField 
                                        name={"body"}
                                        placeholder={"Describe your inquiry or complaint."}
                                    />
                                </div>
                                <div className={"mt-2"}>
                                    <Button
                                        onClick={onUploadClicked}
                                        className={"appearance-none font-semibold text-xs rounded border py-2 px-2 border-textGrey outline-none focus:outline-none bg-white text-black"}>
                                        <input 
                                            ref={fileRef} 
                                            type="file" 
                                            onChange={onFileChanged} 
                                            style={{display: "none"}} 

                                        />
                                        {"ADD ATTACHMENT"}
                                    </Button>
                                </div>
                                 {values && values.attachment && values.attachment.length > 0 ? (
                                    <div className={"flex flex-wrap"}>
                                        {values.attachment.map((elem, idx) => {
                                            return(
                                                <div className={"col-span-1 relative mr-1 w-12 h-12 bg-backgroundGrey"}>                                    
                                                    <img className={"w-full h-full object-cover"} src={`data:image/gif;base64,${elem.data}`} alt={`image${idx}`} />
                                                </div>
                                            
                                        )})}
                                    </div>
                                ): null}
                                
                              
                            <div className={"w-full mx-auto md:relative flex-col flex items-end"}>
                                    <Button
                                        disabled={!isValid || isSubmitting}
                                        showLoading={isSubmitting}
                                        // uclasses={"w-full py-2 md:w-1/6"}
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