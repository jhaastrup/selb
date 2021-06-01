import * as React from "react";
import _ from "lodash";
import metadata from "./metadata";
import {useMutation, useQuery} from "@apollo/client";
import Modal from "app/services/modal";
import { MERCHANT_GENERATE_ORDER } from '../../modules/mutations';
import { GET_DELIVERY_QUOTE } from '../../modules/queries';

import {formatNumber, formatPhone, formatString} from "app/lib/formatters";
import {Button, RadioButton} from "app/components/forms";
import Link from "next/link";


const Page = ({onChangePage, pageData, setState, dependencies, updatePageData}) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [isSelected, setisSelected] = React.useState(false);
    const { default_address: origin = {} } = dependencies.me;
    const pageKey = 'review';
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const { quoteData = {}, destination = {}, items = [], extra, selectedKey, customer_charge = 0} = pageData;
    const { name = '', phone = '', email = '', street = '', city = '', state = '',  } = destination;
    const { dependencies: shippingOptions } = dependencies;
    
    console.log({origin});

    const skipCondition = () => {
        let skip = true;
        if (selectedKey === 'sendbox') {
            skip = false;
        }
        return skip;
    };

    
    const buildQuoteVariables = () => {
        const { city = '', state = '', country = {}, post_code = '' } = origin || {};

        const formattedItems = items.map((item) => ({
            ...item,
            weight: parseFloat(item.weight),
            quantity: parseInt(item.quantity, 10),
            value: parseFloat(item.value),
            amount: parseFloat(item.value),
        }));

        const originInput = {
            city,
            state,
            post_code,
            country: country.code,
        };
        const destinationInput = _.pick(destination, ['city', 'state', 'country', 'post_code']);
        const destinationCountry =
            shippingOptions.destination_countries.find((elem) => elem.code === destination?.country)?.name || '';
        const weight = parseFloat(_.sumBy(formattedItems, 'weight'));
        const variables = {
            origin: originInput,
            destination: {
                ...destinationInput,
                country: destinationCountry,
            },
            weight: parseFloat(weight),
            items: formattedItems,
            rate_code: 'standard',
        };


        return variables;
    };

    const { loading: fetchingQuote, data: quotes, error: quoteError } = useQuery(GET_DELIVERY_QUOTE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (resp) => {
            const { getDeliveryQuote: quote } = resp;
            updatePageData({ quoteData: quote });
        },
        onError: (e) => {
            console.log(e);
        },
        variables: buildQuoteVariables(),
        skip: skipCondition(),
    });

    const [merchantGenerateOrder, { loading, data, error }] = useMutation(MERCHANT_GENERATE_ORDER, {
        onCompleted: (data) => {
            const { merchantGenerateOrder: orderPayload } = data;
            onChangePage && onChangePage('success', { orderPayload });
        },
        
    });

    const buildVariables = () => {
        const formattedItems = items.map((item) => ({
            post: item.post,
            quantity: parseInt(item.quantity, 10),
        }));

        const destinationInput = _.pick(destination, [
            'city',
            'state',
            'country',
            'post_code',
            'lat',
            'lng',
            'name',
            'phone',
            'street',
        ]);
        const destCountry =
            shippingOptions.destination_countries.find((elem) => elem.code === destination?.country)?.name || '';
        const variables = {
            delivery_address: {
                ...destinationInput,
                country: destCountry,
            },
            items: formattedItems,
            customer_name: name || '',
            customer_phone: phone || '',
            customer_email: email || '',
            customer_ships: selectedKey === 'manual' ? true : false,
            shipment_fee: parseFloat(customer_charge),
        };


        return variables;
    };

    const generateOrder = () => {
        const variables = buildVariables();
        merchantGenerateOrder({ variables });
    };

   

    const destinationMain = _.compact([
        destination?.street || '',
        destination?.city || '',
        formatString(destination?.state || '', 'capitalize'),
        shippingOptions.destination_countries.find((elem) => elem.code === destination.country)?.name || '',
        destination.post_code || '',
    ]).join(', ');
    const destinationSub = _.compact([
        formatPhone(destination?.phone, 'NATIONAL') || '',
        destination?.email || '',
    ]).join(' \u2022 ');

    const originMain = _.compact([
        origin?.street || '',
        origin?.city || '',
        formatString(origin?.state || '', 'capitalize'),
        shippingOptions.destination_countries.find((elem) => elem.code === origin?.country)?.name || '',
        origin?.post_code || '',
    ]).join(', ');
    const originSub = _.compact([origin?.name || '', formatPhone(origin?.phone, 'NATIONAL') || '']).join(' \u2022 ');

    const total_weight = formatNumber(
        _.reduce(items, (p, c) => p + parseFloat(c.weight), 0),
        '0,0.00',
    );
    const total_amount = parseFloat(_.reduce(items, (p, c) => p + parseFloat(c.value), 0) + parseFloat(customer_charge));

    return(
        <div className={"relative mx-auto px-4 mt-3 pb-12 flex flex-col"}>
            <div className={"mt-4 pb-4"}>
                <p className={"text-red-500 text-xs md:text-sm font-semibold"}>{caption}</p> 
                <p className={"text-gray-500 text-sm md:text-base font-bold"}>{`\u20a6${formatNumber(total_amount ?? 0, '0,0.00')}`}</p>
            </div>

            <div className={"mt-4 pb-4 border-b border-gray-200"}>
                <p className={"text-black font-semibold uppercase text-sm md:text-base"}>{"origin"}</p>
                <p className={"text-black font-medium text-xs md:text-sm"}>{`${originMain}`}</p>
                <p className={"text-gray-500 text-xs md:text-sm"}>{`${originSub}`}</p>
            </div>
            <div className={"mt-4 pb-4 border-b border-gray-200"}>
                <p className={"text-black font-semibold  uppercase text-xs md:text-sm"}>{"destination"}</p>
                <p className={"text-black font-medium text-xs md:text-sm"}>{`${destinationMain}`}</p>
                <p className={"text-gray-500 text-xs md:text-sm"}>{`${destinationSub}`}</p>
            </div>
            {items.map((opt, idx) => {
                const { name, item_type_code, quantity, weight, value } = opt;
                const titleText = name;
                const subText =
                    shippingOptions.item_types.find((elem) => elem.code === item_type_code)?.name || '';

                const qty = parseInt(quantity, 10);
                const qtyString = qty > 9 ? '9+' : qty;

                return(
                    <div key={`${idx}-name`} className={"grid grid-cols-6 gap-2 py-2 text-xs border-b border-gray-200"}>
                        <div className={"col-span-1 h-8 w-8 rounded-full flex bg-gray-200 justify-center items-center"}>
                            {qtyString}
                        </div>
                        <div className={"col-span-4 flex flex-col items-start  justify-center"}>
                            <p className={"font-semibold "}>{titleText}</p>
                            <span className={"font-semibold  text-gray-500"} >{subText}</span>
                        </div>
                        <div className={"col-span-1 flex justify-center items-center"}>
                            <p className="text-sm font-semibold">{`${formatNumber(value, '0,0.00')}`}</p>
                        </div>
                    </div>
                )
            })}

        

            <div className={"my-2"}>
                <div className={"flex justify-between my-4 py-2 border-b border-gray-200"}>
                    <p className={"text-gray-500 font-semibold uppercase text-xs"}>{"weight"}</p>
                    <p className={"text-black text-sm font-semibold"}>{`${formatNumber(total_weight, '0.0')}Kg`}
                    </p>
                </div>
                
                
                <div className={"flex justify-between my-4 border-b py-2 border-gray-200"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"value(ngn)"}</p>
                    <p className={"text-black text-sm font-semibold"}>{`${formatNumber(
                            _.reduce(items, (p, c) => p + parseFloat(c.value), 0),
                            '0,0.00',
                        )}`}
                    </p>
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-gray-200"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"pickup window"}</p>
                    <div>
                        <p className={"text-black text-sm font-semibold"}>{"12 - 24 Hours"}</p>
                        <p className={"text-gray-500 text-xs font-semibold"}>{"Weekends or holidays not included"}</p>
                    </div>
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-gray-200"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"delivery eta"}</p>
                    <div>
                        <p className={"text-black text-sm font-semibold"}>{`${'3 - 5 Working Days'}`}</p>
                        <p className={"text-gray-500 text-xs font-semibold"}>{`${'Excluding public holidays'}`}</p>
                    </div>
                </div>
                
                <div className={"flex justify-between my-4 border-b py-2 border-gray-200"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs "}>{"shipping"}</p>
                    <div>
                        <p className={"text-black text-sm font-semibold"}>{`\u20a6${formatNumber(customer_charge, '0,0.00')}`}</p>
                         <p className={"text-gray-500 text-xs font-semibold"}>{`${formatString(selectedKey, 'capitalize')}`}</p>
                    </div>
                    
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-gray-200"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"total"}</p>
                    <p className={"text-black text-sm font-semibold"}>{`\u20a6${formatNumber(
                                total_amount,
                                '0,0.00',
                            )}`}</p>
                </div>
                
               
            </div>
            <div className={"my-4"}>
                <p className={"text-sm"}>
                <span>
                    {"By completing this transaction, I represent I have read, understand, and agree to the Sendbox"}
                </span>
                {" "}
                
                <Link href={"/legal/privacy"} passHref={true}>
                    <a className={"text-red-500 underline"}>Privacy Policy</a>
                </Link>
                {" "}
                <span>{"and"}</span>
                {" "}
                <Link href={"/legal/terms"} passHref={true}>
                    <a className={"text-red-500 underline"}>Terms of Service</a>
                </Link>
                </p>
            </div>
    
            <div className={"w-full mx-auto md:relative flex-col flex items-end"}>

                <Button
                    onClick={() => generateOrder()}  
                >
                    {"CREATE ORDER"}
                </Button>
            </div>

        </div>
    )
}

export default Page;



