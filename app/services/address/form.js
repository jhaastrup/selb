import * as React from "react";
import {useMutation} from "@apollo/client";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {CREATE_ADDRESS  } from "./modules/mutations";
import {InputField, AutoCompleteInput, Button, ChoiceField} from "app/components/forms";
import {useDebounce, uuid} from "app/lib/hooks";
import  {formatAutocompleteAddress, formatGeocodeAddress} from "app/lib/geocoding";

let autocomplete;
let geocoder;
const isBrowser = typeof window !== "undefined";
if (isBrowser) {
    autocomplete = window.google ? new window.google.maps.places.AutocompleteService() : null;
    geocoder = window.google ? new window.google.maps.Geocoder() : null;
}


const Page = ({dependencies, onTransition, setDefault=false, includeContactInfo = true, initialData={}}) => {
    const formRef = React.useRef();
    const [filteredCountries, setFilteredCountries] = React.useState(dependencies);
    const [filteredOptions, setFilteredOptions] = React.useState([]);
    const [searchInput, setSearchInput] = React.useState('');
    const debouncedSearchInput = useDebounce(searchInput, 100);
    const [isEnabled, setIsEnabled] = React.useState(false);

    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
    console.log("dep", filteredCountries)

    const [createAddress, { loading, error, data }] = useMutation(CREATE_ADDRESS, {
        onCompleted: (data) => {
            formRef.current.setSubmitting(false);
            const address = data.createAddress;
            onTransition && onTransition({...address})
        },
        onError: (error) => {
            console.log('err==>', { error });
            // onChangePage && onChangePage('error');
        },
    });

  
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
    
    const countryComponents = React.useMemo(() => dependencies.map((c) => `country:${c.code}`).join('|'), [dependencies]);


    
    const onAddressSelected = React.useCallback((address) => {
        if (address && geocoder) {
            const { place_id } = address;
            if (place_id) {
                geocoder.geocode({ placeId: place_id }, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        const addr = formatGeocodeAddress(results, address);
                        const {country} = addr;
                        const setCountry = _.isObject(country) ? country.code : country;
                        setFilteredCountries([country]);
                        formRef.current.setValues({
                            ...formRef.current.values,
                            ...addr,
                            country: setCountry,
                            formatted_address: undefined,
                            formatted: undefined,
                            place_id: undefined,
                            ___typename: undefined,
                        });
                    }
                });
            } 
            else {
                formRef.current.setValues({
                    ...formRef.current.values,
                    ...address,
                    country: address.country.pk,
                    formatted_address: undefined,
                    formatted: undefined,
                    place_id: undefined,
                    ___typename: undefined,
                });
            }
        }
    }, []);

    const formatCountryName = (code) => {
        if (_.isEmpty(code)) {
            return;
        }
        const country = _.find(countries, { code });
        return country ? country.name : undefined;
    };

    const getOptions = ({ input = '', searchKeys = ['name', 'code'] }) => {
        const fuse = new Fuse(countries, {
            keys: searchKeys,
            includeScore: true,
            useExtendedSearch: true,
        });

        if (_.isEmpty(input)) {
            setFilteredCountries(countries);
            return countries;
        }

        const res = fuse.search(`'${input}`).map((elem) => elem.item); // items that include the particular phrase
        setFilteredCountries(res);
        return res;
    };
   
   

    const shape = {
        street: Yup.string().required('Address is required'),
        street_line_2: Yup.string().notRequired('').nullable(),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        post_code: Yup.string().notRequired().nullable(),
    };

    let contactShape = {};

    if (includeContactInfo) {
        contactShape = {
            name: Yup.string().required('Provide a first and last name'),
            phone: Yup.string().required('Valid phone number required'),
            email: Yup.string().email().notRequired().nullable(),
        };
    }

    const ValidationSchema = Yup.object().shape({
        ...shape,
        ...contactShape,
    });
    const initialValues = initialData || {};
    console.log("fil",filteredCountries)
    return(
        <div className={"max-w-3xl mx-auto border border-lightGrey px-3 mt-3 pb-12 flex flex-col"}>
                <Formik
                    innerRef={formRef}
                    validationSchema={ValidationSchema}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={(variables, formikBag) => {
                        if(isEnabled && setDefault){
                            createAddress({ variables });
                            onTransition && onTransition(variables);                        }
                        else if (isEnabled) {
                            createAddress({ variables });
                        }
                        else {
                            onTransition && onTransition(variables);
                            
                        }
                        formikBag.setSubmitting(false);
                }}>
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    console.log({values})
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                                <div className="w-full">
                                    <p className={"text-xs font-semibold uppercase text-black"}>{"Street"}</p>

                                    <AutoCompleteInput
                                        name={'street'}                
                                        placeholder={'Required'}
                                        onInputChanged={(val) => {
                                            setSearchInput(val);
                                        }}
                                        options={filteredOptions}
                                        mainText={"main_text"}
                                        subText={"secondary_text"}
                                        valueProp={"street"}
                                        onItemSelected={(item) => {
                                            onAddressSelected(item)
                                        }}
                                    />
                                </div>                                
                                
                                
                                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
                                    <div className="col-span-1">
                                        <div className="flex justify-between">
                                            <label htmlFor="street_2" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                                Apartment, suite, flat etc.
                                            </label>
                                            <span className="text-xs text-gray-400 tracking-wide" id="email-required">
                                                Optional
                                            </span>
                                        </div>
                                        <div className="mt-1 flex">
                                            <InputField
                                                type="text"
                                                name="street_line_2"
                                                value={values.street_2}
                                                id="street_2"
                                                // onInputChanged={(val) => {
                                                //     setSearchInput(val);
                                                // }}
                                                autoComplete="address-line-2"
                                                placeholder=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={"grid grid-cols-2 gap-2"}>
                                    <div className={"cols-span-1"}>
                                        <label htmlFor="city" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                            City
                                        </label>
                                        <InputField
                                            name={"city"}
                                            label={"City"}
                                            onInputChanged={(val) => {
                                                setSearchInput(val);
                                            }}
                                            placeholder={"Required"}
                                        />
                                    </div>
                                    <div className={"col-span-1"}>
                                        <label htmlFor="state" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                            state
                                        </label>
                                        <InputField
                                            name={"state"}
                                            // label={"State"}
                                            autoComplete={"state-name"}
                                            onInputChanged={(val) => {
                                                setSearchInput(val);
                                            }}
                                            placeholder={"Required"}
                                        />
                                    </div>
                                </div>
                                    
                                
                                
                                <div>
                                    <ChoiceField
                                        label={'Country'}
                                        name={'country'}
                                        placeholder={'Required'}
                                        mode={'outline'}
                                        labelProp={'name'}
                                        valueProp={'code'}
                                        options={filteredCountries}
                                    />
                                </div>
                                
                                {values && values.post_code && (
                                    <React.Fragment>
                                        <div className={"h-6"}/>
                                        <div className={"flex-1"}>
                                            <InputField
                                                name={"post_code"}
                                                label={"Post Code"}
                                                placeholder={"Required"}
                                            />
                                        </div>
                                    </React.Fragment>
                                )}
                                {includeContactInfo && (
                                    <React.Fragment>
                                        <div className={"flex-1"}>
                                            <label htmlFor="email" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                                Name
                                            </label>
                                            <InputField
                                                name={"name"}
                                                // label={"Name"}
                                                autoComplete={"given-name"}
                                                placeholder={"Required"}
                                            />
                                        </div>
                                        <div className={"flex"}>
                                            <div className={"flex-1"}>
                                                <label htmlFor="email" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                                    phone number
                                                </label>
                                                <InputField
                                                    name={"phone"}
                                                    label={"Phone"}
                                                    placeholder={"Required"}
                                                />
                                            </div>
                                            <div className={"w-4"}/>
                                            <div className={"flex-1"}>
                                                <label htmlFor="email" className="block text-xs uppercase tracking-wide font-medium text-gray-900">
                                                    email
                                                </label>
                                                <InputField
                                                    autoComplete={"email"}
                                                    name={"email"}
                                                    label={"Email"}
                                                    placeholder={"Required"}
                                                />
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}
                               
                               


                                <div className={"md:flex-col md:flex md:items-end"}>
                                    <Button
                                        disabled={!isValid || isSubmitting}
                                        showLoading={isSubmitting} 
                                        // uclasses={"w-full py-2 md:w-1/6"}
                                        type={"submit"}
                                    >
                                        Continue
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