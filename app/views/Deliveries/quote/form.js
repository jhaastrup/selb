import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {InputField, Button, AutoCompleteInput} from "app/components/forms";
import _ from 'lodash';
import { useDebounce, uuid } from 'app/lib/hooks';
import { formatNumberString, formatString} from "app/lib/formatters";
import settings from 'app/config/settings';
import { formatAutocompleteAddress, formatGeocodeAddress } from 'app/lib/geocoding';

let autocomplete;
let geocoder;
const isBrowser = typeof window !== "undefined";
if (isBrowser) {
    autocomplete = window.google ? new window.google.maps.places.AutocompleteService() : null;
    geocoder = window.google ? new window.google.maps.Geocoder() : null;
}

const ItemComponent = ({onItemSelected, title, description}) => {
    return(
        <div 
            onClick={onItemSelected}
            className={"grid py-3 cursor-pointer border border-r-0 border-l-0 border-t-0 border-backgroundGrey"}
        >
            <div>
                <p className={"text-black text-xs md:text-sm font-bold"}>{title}</p>
                <p className={"text-xs text-textGrey"}>{description}</p>
            </div>
        </div>
    )
}

const Page = ({onChangePage, pageData, setState, dependencies, updatePageData}) => {
    const formRef = React.useRef();
    const [activeInput, setActiveInput] = React.useState();
    const [filteredOptions, setFilteredOptions] = React.useState([]);
    const [searchInput, setSearchInput] = React.useState('');
    const debouncedSearchInput = useDebounce(searchInput, 100);

    const { dependencies: shippingOptions } = dependencies;


    const countryComponents =
        activeInput === 'origin' ? shippingOptions.origin_countries.map((c) => `country:${c.code}`).join('|') : [];

    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);
    

    React.useEffect(
        () => {
            // setSearching(true);
            if (debouncedSearchInput && autocomplete) {
                // const componentRestrictions = formRef && formRef.current && formRef.current.values ? { country: formRef.current.values.country || "" } : {};
                autocomplete.getPlacePredictions({ input: debouncedSearchInput}, (predictions, status) => {
                    console.log({ predictions, status });
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        const choices = predictions.map((address) => formatAutocompleteAddress(address));
                        setFilteredOptions(choices);
                        // setSearching(false);
                    } else {
                        setFilteredOptions([]);
                    }
                });
            }
        },
        [debouncedSearchInput], // Only call effect if debounced search term changes
    );
    
   
    const ValidationSchema = Yup.object().shape({
        origin: Yup.object()
            .shape({
                country: Yup.string().required(''),
                state: Yup.string().required(''),
                street: Yup.string().required('Required'),
                street_line_2: Yup.string().notRequired('').nullable(),
                city: Yup.string().required('City is required'),
                post_code: Yup.string().notRequired().nullable(),
            })
            .required(),
        destination: Yup.object()
            .shape({
                country: Yup.string().required(''),
                state: Yup.string().required(''),
                street: Yup.string().required('Required'),
                city: Yup.string().required('City is required'),
                post_code: Yup.string().notRequired().nullable(),
            })
            .required(),
        weight: Yup.string().required(),
        length: Yup.string().notRequired('').nullable(),
        width: Yup.string().notRequired('').nullable(),
        height: Yup.string().notRequired('').nullable(),
        value: Yup.string().required(''),
        insurance_option_code: Yup.string().notRequired().nullable(),
    });

    const clearSearch = React.useCallback(() => {
        setSearchInput('');
        setFilteredOptions([]);
    }, []);

    const onAddressSelected = React.useCallback((key, address) => {
        if (address && geocoder) {
            const { place_id } = address;
            if (place_id) {
                geocoder.geocode({ placeId: place_id }, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        const addr = formatGeocodeAddress(results, address);
                        const {country} = addr;
                        const setCountry = _.isObject(country) ? country.code : country;
                        formRef.current.setValues({
                            ...formRef.current.values,
                            [key]: {
                                ...addr,
                                country: setCountry
                            },
                            originStreet: addr.street,
                            formatted_address: undefined,
                            formatted: undefined,
                            place_id: undefined,
                            ___typename: undefined,
                        });
                    }
                });
            } 
            // else {
            //     formRef.current.setValues({
            //         ...formRef.current.values,
            //         ...address,
            //         country: address.country.pk,
            //         formatted_address: undefined,
            //         formatted: undefined,
            //         place_id: undefined,
            //         ___typename: undefined,
            //     });
            // }
        }
        clearSearch()
    }, []);
    
    const initialValues = {...pageData};


    return(
        <div className={"max-w-3xl mx-auto px-3 mt-3 pb-12 border border-gray-200 flex flex-col"}>
            
            <Formik
                innerRef={formRef}
                validationSchema={ValidationSchema}
                initialValues={initialValues}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables, formikBag) => {
                    formikBag.setSubmitting(false);
                    onChangePage && onChangePage('rate', { ...variables });
                }}>
            {({handleSubmit, values, isValid, isSubmitting}) => {
                return(
                    
                    <Form onSubmit={handleSubmit}>
                        <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                            
                            <div className={"mt-5"}>
                                <label htmlFor="city" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                    origin address
                                </label>

                                <AutoCompleteInput
                                    name={'origin.street'}                
                                    placeholder={'Required'}
                                    onInputChanged={(val) => {
                                        setSearchInput(val);
                                    }}
                                    options={filteredOptions}
                                    mainText={"main_text"}
                                    subText={"secondary_text"}
                                    valueProp={"pk"}
                                    onItemSelected={(item) => {
                                        onAddressSelected("origin", item)
                                    }}
                                />
                            </div>
                           

                            <div className={"mt-5"}>
                                <label htmlFor="destination.street" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                    destination address
                                </label>
                                <AutoCompleteInput
                                    id={"destination.street"}
                                    name={'destination.street'}
                                    placeholder={'Required'}
                                    onInputChanged={(val) => {
                                        setSearchInput(val);
                                    }}
                                    options={filteredOptions}
                                    mainText={"main_text"}
                                    subText={"secondary_text"}
                                    valueProp={"pk"}
                                    onItemSelected={(item) => {
                                        onAddressSelected("destination", item)
                                    }}
                                />
                            </div>
                           

                            <div className={"grid mt-4 grid-cols-2 md:grid-cols-4 gap-2 md:gap-4"}>
                                <div className={"flex-1"}>
                                    <label htmlFor="weight" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Weight(KG)
                                    </label>
                                    <InputField
                                        id={"weight"}
                                        name={'weight'}
                                        placeholder={"Required"}
                                        showLabel={false}
                                    />
                                </div>
                                <div className={"flex-1"}>
                                    <label htmlFor="length" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Length(CM)
                                    </label>

                                    <InputField
                                        id={"length"}
                                        name={'length'}
                                        placeholder={"Optional"}
                                        showLabel={false}
                                    />
                                </div>
                                <div className={"flex-1"}>
                                    <label htmlFor="width" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        Width(CM)
                                    </label>
                                    <InputField
                                        id={"width"}
                                        name={'width'}
                                        placeholder={"Optional"}
                                        showLabel={false}
                                    />
                                </div>
                                <div className={"flex-1"}>
                                    <label htmlFor="weight" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                        height(CM)
                                    </label>
                                    <InputField
                                        id={"height"}
                                        name={'height'}
                                        placeholder={"Optional"}
                                        showLabel={false}
                                    />
                                </div>
                            </div>
                            
                            <div className={"mb-5"}>
                                <p className={"text-sm text-gray-500"}>{"The weight and dimensions for your package are used to calculate your shipping fees."}</p>
                            </div>
                            
                            <div className={"fixed bottom-1 w-full px-3 -ml-3 mx-auto md:relative md:flex-col md:flex md:items-end"}>

                                <Button
                                    type={"submit"}
                                    disabled={!isValid || isSubmitting}
                                    showLoading={isSubmitting}
                                >
                                    {"Confirm"}
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