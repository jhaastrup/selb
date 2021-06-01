import * as React from "react";
import {useMutation} from "@apollo/client";
import {CREATE_ADDRESS  } from "../modules/mutations";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, RadioButton, Button, AutoCompleteInput, ChoiceField} from "app/components/forms";
import {formatNumber, formatString, toNumber} from "app/lib/formatters";

const Page = ({onCompleted, initialData, pageData}) => {
   
    const formRef = React.useRef();
    const { section, addresses = [] } = initialData;
    const { origin = {} } = pageData;
    const [filteredOptions, setFilteredOptions] = React.useState(addresses);
  
    console.log(onCompleted)

    const onItemSelected = (item) => {
        const { street, city, state, name, country, lat, lng, post_code, pk } = item;
        const hubName = _.compact([
            `${formatString(city || '', 'capitalize')}`,
            `${formatString(name || '', 'capitalize')}`,
        ]).join(', ')
        formRef &&
            formRef.current &&
            formRef.current.setValues({
                ...formRef.current.values,
                street,
                city,
                state,
                country: country?.code,
                lat,
                lng,
                hub: hubName,
                post_code,
            });

        
    };

    const ValidationSchema = Yup.object().shape({
        street: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        name: Yup.string().required('Provide a first and last name'),
        phone: Yup.string().required('Valid phone number required'),
        email: Yup.string().email().notRequired().nullable(),
        post_code: Yup.string().notRequired().nullable(),
    });

    const initialValues = origin || {};

    

   
    return(
        <div className={"max-w-3xl mx-auto border border-lightGrey px-3 mt-3 pb-12 flex flex-col"}>
                <Formik
                    innerRef={formRef}
                    validationSchema={ValidationSchema}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={(variables, formikBag) => {
                        const payload = {
                        ...variables,
                    };
                    onCompleted && onCompleted(payload);
                    
                }}>
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    console.log({values})
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                               
                                <div className={"mt-5"}>
                                    <AutoCompleteInput
                                        name={'hub'}
                                        label={'Drop-off Centre'}
                                        placeholder={'Required'}
                                        options={filteredOptions}
                                        mainText={"street"}
                                        subText={"city"}
                                        valueProp={"pk"}
                                        onItemSelected={(item) => {
                                            onItemSelected(item)
                                        }}
                                    />
                                </div>
                                
                                <div className="w-full">
                                    <label htmlFor="name" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Shipper's name
                                    </label>
                                    <InputField 
                                        name={"name"}
                                        placeholder={"Required"}
                                    />
                                </div>
                               
                                <div className={"grid grid-cols-2 gap-2 md:gap-4"}>
                                    <div className={"flex-1"}>
                                        <label htmlFor="phone" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                            phone number
                                        </label>
                                        <InputField
                                            name={"phone"}
                                            placeholder={"Required"}
                                        />
                                    </div>
                                    
                                    <div className={"flex-1"}>
                                        <label htmlFor="email" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                            Email
                                        </label>
                                        <InputField
                                            name={"email"}
                                            placeholder={"Required"}
                                        />
                                    </div>
                                </div>
                               
                              
                                <div className={"flex-col flex items-end"}>
                                    <Button
                                        disabled={!isValid || isSubmitting ? 1 : undefined} 
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