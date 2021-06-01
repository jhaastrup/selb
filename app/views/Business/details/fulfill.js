import * as React from "react";
import {Formik, Form} from "formik";
import * as Yup from "yup";
import {Button, ChoiceField} from "app/components/forms";
import _ from "lodash";
import { GET_DELIVERY_QUOTE, DISCOVERY_ADDRESSES } from '../modules/queries';
import {RadioCheckedIcon, RadioUncheckedIcon,} from "app/components/icons";
import { FULFIL_DELIVERY_ORDER } from '../modules/mutations';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { BusinessLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import {formatNumber,formatPhone, formatString} from "app/lib/formatters";
import { useRouter } from "next/router";
import cx from "classnames";


const Page = ({ orderObject, onSuccess, onError}) => {
    const formRef = React.useRef();
    const dataLabel = 'getDiscoveryOriginAddresses';
    const [shipmentQuote, setshipmentQuote] = React.useState(null);
    const [selectedRate, setselectedRate] = React.useState();
    const router = useRouter();

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(DISCOVERY_ADDRESSES, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',   
    });

    const [getDeliveryQuote] = useLazyQuery(GET_DELIVERY_QUOTE, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            const { getDeliveryQuote: quote } = data;
            setshipmentQuote(quote);
        },
    });

    const [bookDiscoveryDelivery] = useMutation(FULFIL_DELIVERY_ORDER, {
        onCompleted: (data) => {
            formRef.current.setSubmitting(false);
            onSuccess && onSuccess();
        },
        onError: (error) => {
            formRef.current.setSubmitting(false);
            onError && onError()
        },
    });

    const onItemSelected = (origin) => {
        formRef.current.setFieldValue('origin', origin.pk);
        const { delivery_address: destination, items } = orderObject;

        const originInput = {
            city: origin?.city ?? '',
            post_code: origin?.post_code ?? '',
            state: origin?.state ?? '',
            street: origin?.street ?? '',
            country: origin?.country.code ?? '',
        };

        const destinationInput = {
            city: destination?.city ?? '',
            post_code: destination?.post_code ?? '',
            state: destination?.state ?? '',
            street: destination?.street ?? '',
            country: destination?.country?.code ?? 'NG',
        };

        const weight = parseFloat(_.sumBy(items, 'weight'));
        const variables = {
            origin: originInput,
            destination: destinationInput,
            weight,
            items: items.map((item) => ({
                ...item,
                weight: parseFloat(item.weight),
                quantity: parseInt(item.quantity, 10),
                value: parseFloat(item.value),
            })),
        };
        getDeliveryQuote({
            variables,
        });
    };

    
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

    const formatName = (pk) => {
        if (_.isEmpty(pk)) {
            return;
        }
        const origin = _.find(results, { pk });
        const addressList = [
            formatString(origin?.street ?? '', 'capitalize'),
            formatString(origin?.city ?? '', 'capitalize'),
            formatString(origin?.state ?? '', 'capitalize'),
            formatString(origin?.country?.name ?? '', 'capitalize'),
            formatString(origin?.post_code ?? '', 'uppercase'),
        ];
        const addressString = _.compact(addressList).join(', ');
        return origin ? addressString : undefined;
    };

    const loadRate = (rate) => {
        setselectedRate(rate);
        formRef.current.setFieldValue('rate_key', rate.key);
    };

    const ValidationSchema = Yup.object().shape({
        origin: Yup.string().required('This field is required').default(''),
        rate_key: Yup.string().required('This field is required').default(''),
    });

    const initialValues = { order: orderObject.pk, origin: '', rate_key: '' };
    const { delivery_address, items } = orderObject;
    const addressList = [
        formatString(delivery_address?.street ?? '', 'capitalize'),
        formatString(delivery_address?.city ?? '', 'capitalize'),
        formatString(delivery_address?.state ?? '', 'capitalize'),
        formatString(delivery_address?.country?.name ?? '', 'capitalize'),
        formatString(delivery_address?.post_code ?? '', 'uppercase'),
    ];

    const addressString = _.compact(addressList).join(', ');
    const subInfo = _.compact([
        delivery_address?.email ?? '',
        formatPhone(delivery_address?.phone, 'NATIONAL') || '',
    ]).join(' \u2022 ');

    const { results, metadata = {} } = data[dataLabel];
    
   
    return(
        
        <div className={"max-w-3xl mx-auto border border-lightGrey px-3 mt-3 pb-12 flex flex-col"}>
                <Formik
                    innerRef={formRef}
                    validationSchema={ValidationSchema}
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnMount={true}
                    onSubmit={(variables, formikBag) => {
                        bookDiscoveryDelivery({ variables });

                }}>
                {({handleSubmit, values, isValid, isSubmitting}) => {
                    return(
                       
                        <Form onSubmit={handleSubmit}>
                            <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                                <div className={"my-4"}>
                                    <p className={"text-primary text-xs md:text-sm font-semibold"}>{`${delivery_address?.name ?? '-'}`}</p> 
                                    <p className={"text-black text-sm md:text-base font-bold"}>{`${addressString}`}</p>
                                    <p className={"text-xs md:text-sm text-textGrey"}>{`${subInfo}`}</p>
                                </div>
                                <div className={"mt-2"}>
                                    <p className={"text-black text-xs uppercase md:sm font-bold"}>{"Order Detail"}</p>
                                    {items.map((elem, idx) => {
                                        const img =
                                            elem &&
                                            elem.post &&
                                            elem.post.images &&
                                            elem.post.images.length > 0 &&
                                            elem.post.images[0].url
                                                ? elem.post.images[0].url
                                                : undefined;

                                        const { name, item_type_code, quantity, amount } = elem;
                                        const titleText = name;

                                        const qty = parseInt(quantity, 10);
                                        const qtyString = qty > 9 ? '9+' : qty;
                                        return (
                                            <div
                                            key={`item${idx}`}
                                                onClick={() => onItemSelected(item)}
                                                className={"grid py-3 grid-cols-4 cursor-pointer border border-r-0 border-l-0 border-t-0 border-backgroundGrey"}
                                            >
                                                <div className={"col-span-1 relative w-12 h-12 bg-backgroundGrey  flex-col justify-center flex items-start"}>
                                                    <img className={"w-full h-full object-cover"} src={img} alt={name} />
                                                    
                                                </div>
                                                <div className={"col-span-2 flex justify-center flex-col items-start"}>
                                                    <p className={"text-black text-sm font-bold"}>{titleText}</p>

                                                </div>
                                                <div className={"col-span-1  flex-col justify-center flex items-end"}>
                                                    <div className={"col-span-1 w-8 h-8 rounded-full flex justify-center items-center bg-transluscent-grey"}>
                                                        {qtyString}
                                                    </div>
                                                    <p className={"text-black text-sm font-bold"}>{`\u20a6 ${formatNumber(amount, '0,0.00')}`}</p>
                                                    
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            
                                

                                <div className={"mt-2"}>
                                    <ChoiceField
                                        label={'PickUp Adress'}
                                        name={'origin'}
                                        placeholder={'Select Origin Address'}
                                        labelProp={'street'}
                                        valueProp={'pk'}
                                        options={results}
                                        onItemSelected={onItemSelected}                                        
                                    />
                                </div>
                                {shipmentQuote && (
                                    <div className={"mt-2"}>
                                        <p className={"text-black text-sm font-bold"}>{`RATES`}</p>

                                        {_.sortBy(shipmentQuote.rates, 'name').map((opt, idx) => {
                                            const { name, fee, key } = opt;
                                            const titleText = name;
                                            const subText = `NGN ${formatNumber(fee, '0,0.00')}`;
                                            const isSelected = selectedRate && selectedRate.key === key;

                                            return(
                                                <div 
                                                    key={idx}
                                                    onClick={() => loadRate(opt)}
                                                    className={`grid mb-4 py-3 cursor-pointer px-1 grid-cols-4 border border-r-0 border-l-0 border-t-0 border-backgroundGrey ${cx({"bg-transluscent-primary": isSelected})}`}
                                                >
                                                    <div className={"col-span-3"}>
                                                        <p className={"text-black text-xs md:text-sm font-bold"}> {formatString(`${titleText}`, 'uppercase')}</p>
                                                        <p className={"text-xs text-black opacity-70"}>{subText}</p>
                                                    </div>
                                                    <div className={"col-span-1  flex-col justify-center flex items-end"}>
                                                    {isSelected ? <RadioCheckedIcon color={"rgba(217,48,37,1)"} />: <RadioUncheckedIcon /> } 
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    </div>
                                )}
                                
                                <div className={"fixed bottom-1 w-full px-3 -ml-3 mx-auto md:relative md:flex-col md:flex md:items-end"}>
                                        <Button
                                            disabled={!isValid || isSubmitting ? 1 : undefined} 
                                            uclasses={"w-full uppercase py-2 md:w-auto"}
                                            type={"submit"}
                                        >
                                            {"FulFill Order"}
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