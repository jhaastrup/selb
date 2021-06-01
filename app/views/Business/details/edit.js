import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, Button, TextAreaField,  ChoiceField} from "app/components/forms";
import Fuse from 'fuse.js';
import { useQuery, useMutation } from '@apollo/client';
import _ from 'lodash';
import { formatNumberString, formatString} from "app/lib/formatters";
import { DISCOVERY_PRODUCT_DEPENDENCIES } from '../modules/queries';
import { UPDATE_DISCOVERY_POST } from '../modules/mutations';
import Loading from "app/components/loading";

const Page = (
    {
    itemObject = {}, onUpdateCompleted, onUpdateError 
}) => {
    const formRef = React.useRef();
    const [filteredCategories, setFilteredCategories] = React.useState();

    const { data, loading, error, refetch } = useQuery(DISCOVERY_PRODUCT_DEPENDENCIES, {
        fetchPolicy: 'cache-and-network',
        variables: { sort_by: { asc_desc: 'asc' } },
        onCompleted: (data) => {
            const { results } = data.businessCategories;
            const newCategory = [...results];
            setFilteredCategories(newCategory);
        },
        onError: () => {},
    });

    const [updateDiscoveryPost] = useMutation(UPDATE_DISCOVERY_POST, {
        onCompleted: (data) => {
            formRef.current.setSubmitting(false);
            onUpdateCompleted && onUpdateCompleted();
        },
        onError: (err) => {
            console.log({ err });
            formRef.current.setSubmitting(false);
            onUpdateError && onUpdateError();
        },
    });
    
    const updateProduct = (data) => {
        const { pk, images = [] } = itemObject;
        const { length, width, height } = data;

        updateDiscoveryPost({
            variables: {
                id: pk,
                name: data.name,
                description: data.description,
                category: data.category,
                weight: parseFloat(data.weight),
                price: parseFloat(data.price),
                stock: parseFloat(data.stock),
                length: length === '' ? parseFloat(0) : parseFloat(length),
                width: width === '' ? parseFloat(0) : parseFloat(width),
                height: height === '' ? parseFloat(0) : parseFloat(height),
            },
        });
    };

  

    const ValidationSchema = Yup.object().shape({
        description: Yup.string().required('Description is required'),
        category: Yup.string().required('Category is required'),
        price: Yup.string().required('Price is required'),
        stock: Yup.string().required('Quantity is required'),
        name: Yup.string().required('Provide a name'),
        weight: Yup.string().required('Weight is required'),
        length: Yup.string().notRequired().nullable(),
        width: Yup.string().notRequired().nullable(),
        height: Yup.string().notRequired().nullable(),
    });

    const initialValues = itemObject || {};
    if(loading){
        return(
                <Loading />
        )
    }

    if(error){
        return(
            
                <div className={"h-40 mt-auto flex items-center justify-center"}>
                    <Button
                        onClick={() => refetch && refetch()} 
                    >
                       Try Again
                    </Button>
                </div>
        )
    }


    return(
        <div className={"max-w-3xl mx-auto px-3 mt-3 pb-12 flex flex-col"}>
            
            <Formik
                innerRef={formRef}
                validationSchema={ValidationSchema}
                initialValues={initialValues}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables, formikBag) => {
                    console.log({variables})
                    updateProduct(variables);
                }}>
            {({handleSubmit, values, isValid, isSubmitting}) => {
                console.log({values})
                return(
                    
                    <Form onSubmit={handleSubmit}>
                        <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                            <div className="w-full">
                                <p className={"text-xs font-semibold uppercase text-black"}>{"Name"}</p>

                                <InputField 
                                    name={'name'}
                                    placeholder={"Required"}

                                />
                               
                            </div>
                            <div className={"mt-2"}>
                                <p className={"text-xs mb-2 uppercase text-black"}>{"Description"}</p>

                                <TextAreaField 
                                    name={"description"}
                                    placeholder={"Describe your product."}
                                />
                            </div>

                            <div className={"mt-4"}>
                                <ChoiceField
                                        label={'CATEGORY'}
                                        name={'category'}
                                        placeholder={'Required'}
                                        labelProp={'name'}
                                        valueProp={'code'}
                                        options={filteredCategories}
                                        // format={formatCategoryName}
                                        
                                />
                            </div>
                            <div className={"mb-5"}>
                                <p className={"text-xs font-semibold text-black"}>{"Pricing and availability"}</p>

                                <p className={"text-xs font-semibold text-textGrey"}>{"Declare the pricing information and availability for this product. If it needs to go on sale, also declare the actual price."}</p>
                            </div>
                            

                             <div className={"grid grid-cols-2 gap-3"}>
                                    <div className="w-full col-span-1">
                                        <p className={"text-xs text-textGrey"}>{"PRICE(NGN)"}</p>

                                        <InputField
                                    
                                            name={'price'}
                                            placeholder={"Required"}
                                            // format={(val) => `${formatNumberString(val, '0,0.[00]')}`}
                                        />
                                    
                                    </div>
                                    <div className="w-full col-span-1">
                                        <p className={"text-xs text-textGrey"}>{"STOCK"}</p>
                                        <InputField
                                            
                                            name={'stock'}
                                            placeholder={"Required"}

                                        />
                                        
                                    </div>
                            </div>                          
                            <div >
                                <p className={"text-xs font-semibold text-black"}>{"Shipping configuration"}</p>

                                <p className={"text-xs font-semibold text-textGrey"}>{"If shipping is required for this product, please fill out the in information below"}</p>
                            </div>   
                            <div className={"grid mt-4 grid-cols-2 md:grid-cols-4 gap-2 md:gap-4"}>
                                <div className={"flex-1"}>
                                    <p className={"text-xs text-textGrey"}>{"WEIGHT(KG)"}</p>

                                    <InputField
                                        name={'weight'}
                                        placeholder={"Required"}
                                        format={(val) => `${formatNumberString(val, '0.[00]')}`}
                                    />
                                </div>
                                <div className={"flex-1"}>
                                    <p className={"text-xs text-textGrey"}>{"LENGTH (CM)"}</p>

                                    <InputField
                                        name={'length'}
                                        placeholder={"Optional"}
                                        type={"number"}
                                    />
                                </div>
                                <div className={"flex-1"}>
                                    <p className={"text-xs text-textGrey"}>{"WIDTH (CM)"}</p>

                                    <InputField
                                        name={'width'}
                                        placeholder={"Optional"}
                                        type={"number"}
                                    />
                                </div>
                                <div className={"flex-1"}>
                                <p className={"text-xs text-textGrey"}>{"HEIGHT (CM)"}</p>

                                    <InputField
                                        name={'height'}
                                        placeholder={"Optional"}
                                        type={"number"}
                                    />
                                </div>
                            </div>
                            
                            
                            
                            <div className={"fixed bottom-1 w-full px-3 -ml-3 mx-auto md:relative md:flex-col md:flex md:items-end"}>

                                <Button
                                    type={"submit"}
                                    disabled={!isValid || isSubmitting ? 1 : undefined}
                                    uclasses={"rounded-3xl w-full md:px-4 md:w-auto text-black border-0 focus:outline-none focus:border-opacity-0 outline-none px-2"}
                                >
                                    {"Update Product"}
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