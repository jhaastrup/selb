import * as React from "react";
import {useMutation, useQuery, useLazyQuery} from "@apollo/client";
import {GET_DELIVERY_QUOTE} from "../modules/queries";
import metadata from "./metadata";
import _ from "lodash";
import Modal from "app/components/simpleModal";
import {formatNumber, formatPhone, toNumber, formatString} from "app/lib/formatters";
import CouponForm from "./coupon";
import {Button, RadioButton} from "app/components/forms";
import Link from "next/link";
import Loading from "app/components/loading"


const Page = ({onChangePage, pageData, setState, dependencies, updatePageData}) => {
    const [couponVisible, setCouponVisible] = React.useState(false);

    const {
        origin = {},
        quoteData={},
        destination = {},
        items = [],
        incoming_option_code,
        insurance_option_code,
        coupon_code,
        rate_key,
        weight,
        length,
        width,
        height,
    } = pageData;

    const pageKey = "review";
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};

    const { dependencies: shippingOptions } = dependencies;
    const insuranceOption = insurance_option_code
        ? shippingOptions.insurance_options.find((elem) => elem.code === insurance_option_code)
        : undefined;

    const originMain = _.compact([
        origin?.street || '',
        origin?.city || '',
        formatString(origin?.state || '', 'capitalize'),
        shippingOptions.destination_countries.find((elem) => elem.code === origin.country)?.name || '',
        origin.post_code || '',
    ]).join(', ');
    const originSub = _.compact([origin?.name || '', formatPhone(origin?.phone, 'NATIONAL') || '']).join(' \u2022 ');

    const destinationMain = _.compact([
        destination?.street || '',
        destination?.city || '',
        formatString(destination?.state || '', 'capitalize'),
        shippingOptions.destination_countries.find((elem) => elem.code === destination.country)?.name || '',
        destination.post_code || '',
    ]).join(', ');
    const destinationSub = _.compact([destination?.name || '', formatPhone(destination?.phone, 'NATIONAL') || '']).join(
        ' \u2022 ',
    );
    

    
    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "insurance",
        }))
    }, []);

    const skipCondition = () => {
        const { origin = {}, destination = {}, items } = pageData;
        const a = _.isEmpty(_.omit(origin, ['name', 'email', 'phone']));
        const b = _.isEmpty(_.omit(destination, ['name', 'email', 'phone']));
        const c = _.isEmpty(items);
        const skip = a || b || c;

        return skip;
    };

    const buildVariables = () => {
       

        const formattedItems = items.map((item) => ({
            ...item,
            quantity: parseInt(item.quantity, 10),
            value: parseFloat(toNumber(item.value)),
            amount: parseFloat(toNumber(item.value)),
        }));

        const originInput = _.pick(origin, ['city', 'state', 'country', 'post_code', 'lat', 'lng']);
        const destinationInput = _.pick(destination, ['city', 'state', 'country', 'post_code', 'lat', 'lng']);
        const parsedWeight = parseFloat(weight);
        const parsedLength = parseFloat(length);
        const parsedWidth = parseFloat(width);
        const parsedHeight = parseFloat(height);
        const variables = {
            origin: originInput,
            destination: destinationInput,
            weight: parsedWeight,
            length: parsedLength,
            width: parsedWidth,
            height: parsedHeight,
            items: formattedItems,
            incoming_option_code,
            rate_key,
            insurance_option_code,
            coupon_code,
        };
        return variables;
    };

    const { loading, data, error } = useQuery(GET_DELIVERY_QUOTE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (resp) => {
            const { getDeliveryQuote: quote } = resp;
            updatePageData({ quoteData: quote });
            
        },
        onError: (e) => {
            console.log(e);
        },
        variables: buildVariables(),
        skip: skipCondition(),
    });

    const [getCouponQuote, {loading: couponQuoteLoading}] = useLazyQuery(GET_DELIVERY_QUOTE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (resp) => {
            const { getDeliveryQuote: quote } = resp;
            updatePageData({ quoteData: quote });
            
        },
        onError: (e) => {
            console.log(e);
        },
       
    });
   

    
    const openCouponModal = () => {
        setCouponVisible(true);
    }
    const closeModal = () => {
        setCouponVisible(false);
    }

    const onCompleted = (code) => {
        closeModal();
        updatePageData({ ['coupon']: code });
        setTimeout(() => {
            const variables = buildVariables();
            getCouponQuote({variables})
        }, 10);
    };
   

    if(error){
        return(
            <div className={"flex items-center justify-center"}>
                <p className={"text-xs text-black"}> {" Error fetching delivery quotes..."}</p>
            </div>
        )
    }

    

    return(
        
        <div className={"relative mx-auto px-4 mt-3 flex flex-col"}>
            <div className={"mt-4"}>
                <p className={"text-red-500 text-sm font-semibold"}>{caption}</p> 
                <p className={"text-black text-sm md:text-base font-bold"}>{`\u20a6${formatNumber(quoteData.fee, '0,0.00')}`}</p>
            </div>

            <div className={"mt-4 pb-4 border-b border-lightGrey"}>
                <p className={"text-black font-semibold uppercase text-sm md:text-base"}>{"origin"}</p>
                <p className={"text-black font-medium text-sm"}>{`${originMain}`}</p>
                <p className={"text-gray-500 text-sm"}>{`${originSub}`}</p>
            </div>
            <div className={"mt-4 pb-4 border-b border-transluscent-grey"}>
                <p className={"text-black font-semibold  uppercase text-xs md:text-sm"}>{"destination"}</p>
                <p className={"text-black font-medium text-sm"}>{`${destinationMain}`}</p>
                <p className={"text-gray-500 text-sm"}>{`${destinationSub}`}</p>
            </div>
            {items.map((opt, idx) => {
                const { name, item_type_code, quantity, weight, value } = opt;
                const titleText = name;
                const subText =
                    shippingOptions.item_types.find((elem) => elem.code === item_type_code)?.name || '';

                const qty = parseInt(quantity, 10);
                const qtyString = qty > 9 ? '9+' : qty;

                return(
                    <div key={`${idx}-name`} className={"grid grid-cols-6 gap-2 py-2 text-sm border-b border-gray-100"}>
                        <div className={"col-span-1 h-8 w-8 rounded-full flex bg-gray-200 justify-center items-center"}>
                            {qtyString}
                        </div>
                        <div className={"col-span-4 flex flex-col items-start  justify-end"}>
                            <p className={"font-semibold "}>{titleText}</p>
                            <span className={"font-semibold  text-gray-500"} >{subText}</span>
                        </div>
                        <div className={"col-span-1 flex justify-center items-center"}>
                            <p className="font-semibold text-sm text-black">{`${formatNumber(value, '0,0.00')}`}</p>
                        </div>
                    </div>
                )
            })}

            <div className={"mt-4 pb-4 border-b border-gray-100"}>    
                <Button
                    onClick={openCouponModal}
                    className={"rounded-3xl font-semibold w-auto  text-xs text-primary focus:outline-none focus:border-opacity-0 border border-gray-300 outline-none py-3 px-4"}
                >
                    {couponQuoteLoading ? "fetching Quote" : "ADD DISCOUNT COUPON"}
                </Button>
            </div>

            <div className={"my-2"}>
                <div className={"flex justify-between my-4 py-2 border-b border-transluscent-grey"}>
                    <p className={"text-gray-500 font-semibold uppercase text-xs"}>{"weight"}</p>
                    <p className={"text-black text-sm font-semibold"}>{`${formatNumber(
                                quoteData.weight,
                                '0.0',
                            )}Kg`}
                    </p>
                </div>
                
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"dimension"}</p>
                    <p className={"text-black text-sm font-semibold"}>{`${quoteData.length || 1}cm \u00D7 ${
                                quoteData.width || 1
                            }cm \u00D7 ${quoteData.height || 1}cm`}</p>
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"value(ngn)"}</p>
                    <p className={"text-black text-sm font-semibold"}>{`${formatNumber(
                            _.reduce(items, (p, c) => p + toNumber(c.value), 0),
                            '0,0.00',
                        )}`}
                    </p>
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"pickup window"}</p>
                    <div>
                        <p className={"text-black text-sm font-semibold"}>{"12 - 24 Hours"}</p>
                        <p className={"text-gray-500 text-xs font-semibold"}>{"Weekends or holidays not included"}</p>
                    </div>
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"delivery eta"}</p>
                    <div>
                        <p className={"text-black text-sm font-semibold"}>{`${'3 - 5 Working Days'}`}</p>
                        <p className={"text-gray-500 text-xs font-semibold"}>{`${'Excluding public holidays'}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs "}>{"insurance"}</p>
                    <div>
                        <p className={"text-black text-sm font-semibold"}>{`${formatNumber(
                            quoteData.insurance_fee,
                            '0,0.00',
                        )}`}</p>
                        <p className={"text-gray-500 text-xs font-semibold"}>{`${formatString(
                                insuranceOption?.name || '-',
                                'uppercase',
                            )}`}</p>
                    </div>
                    
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"shipping"}</p>
                    <p className={"text-black text-xs font-semibold"}>{`${formatNumber(
                        quoteData.min_quoted_fee,
                        '0,0.00',
                    )}`}</p>
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"discount"}</p>
                    <p className={"text-black text-sm font-semibold"}>{`${formatNumber(
                        quoteData.discount,
                        '0,0.00',
                    )}`}</p>
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"total"}</p>
                    <p className={"text-black text-sm font-semibold"}>{`\u20a6${formatNumber(
                        quoteData.fee,
                        '0,0.00',
                    )}`}</p>
                </div>
            </div>
            <div className={"mt-2"}>
                <p className={"text-sm"}>
                 <span>
                    {"By completing this transaction, I represent I have read, understand, and agree to the Sendbox"}
                 </span>
                 {" "}
                 
                 <Link href={"/legal/privacy"} passHref={true}>
                    <a className={"text-primary"}>Privacy Policy</a>
                 </Link>
                 {" "}
                 <span>{"and"}</span>
                 {" "}
                 <Link href={"/legal/terms"} passHref={true}>
                    <a className={"text-red-500 underline"}>Terms of Service</a>
                 </Link>
                 </p>
             </div>
       
            <div className={"w-full px-5 py-5 mx-auto md:relative flex-col flex items-end"}>

                <Button
                    onClick={() => onChangePage("options")}  
                    // uclasses={"rounded-3xl w-full md:w-auto text-black border-0 focus:outline-none focus:border-opacity-0 outline-none px-2"}
                >
                     {`PAY \u20a6${formatNumber(quoteData.fee, '0,0.00')}`}
                </Button>
            </div>

            {couponVisible ? (
                        <Modal
                            onClose={closeModal}
                            open={couponVisible}
                            title={"Add Coupon Code"}
                        >
                            <CouponForm                             
                                onCompleted={onCompleted}
                                
                            />
                        </Modal>
                   ):null} 

        </div>
    )
}
export default Page;