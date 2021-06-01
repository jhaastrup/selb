import * as React from "react";
import _ from "lodash";
import {useMutation, useQuery} from "@apollo/client";
import {CREATE_DELIVERY} from "../modules/mutations";
import metadata from "./metadata";
import Modal from "app/services/modal";
import {RadioCheckedIcon, RadioUncheckedIcon} from "app/components/icons";
import {formatNumber, formatString, toNumber} from "app/lib/formatters";
import getCardImage from 'app/lib/cardImages';
import Link from "next/link";
import {Button, RadioButton} from "app/components/forms";
import cx from "classnames";


const Page = ({onChangePage, pageData, setState, dependencies, updatePageData}) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const pageKey = 'payment_source_code';
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const { payment_source_code, card_key, quoteData = {} } = pageData;
    const { paymentOptions } = dependencies;


    const [createDelivery, { loading }] = useMutation(CREATE_DELIVERY, {
        onCompleted: (data) => {
            const { createDelivery: payload } = data;
            const { status } = payload;
            console.log({ payload });
            const updatedPayData = { ...payload.payment_data, payment_source_code, card_key };
            console.log({ updatedPayData });
            if (['drafted', 'on_hold', ''].includes(status.code)) {
                onChangePage('pay', { payData: updatedPayData });
            }
        },
        onError: (error) => {
            console.log({error})
            onChangePage('failed');
        },
    });
   
    const isAccount = payment_source_code &&
    payment_source_code === paymentOptions.account.payment_source_code;

    const buildVariables = React.useCallback(() => {
        const {
            origin = {},
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

        const formattedItems = items.map((item) => ({
            ...item,
            quantity: parseInt(item.quantity, 10),
            value: parseFloat(toNumber(item.value)),
            amount: parseFloat(toNumber(item.value)),
        }));

        const originInput = _.pick(origin, [
            'name',
            'email',
            'phone',
            'street',
            'street_line_2',
            'city',
            'state',
            'country',
            'post_code',
            'lat',
            'lng',
        ]);
        const destinationInput = _.pick(destination, [
            'name',
            'email',
            'phone',
            'street',
            'street_line_2',
            'city',
            'state',
            'country',
            'post_code',
            'lat',
            'lng',
        ]);
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
            // rate_code: 'same_day',
        };

        console.log({ variables });

        return variables;
    }, [pageData]);


    const initiateTransaction = React.useCallback(() => {
        const variables = buildVariables();
        createDelivery({ variables });
    }, [buildVariables, createDelivery]);

   
    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "review",
        }))
    }, []);

   
    return(
        
        <div className={"relative mx-auto px-3 mt-3 pb-8 flex flex-col"}>
            <div className={"mt-4"}>
                <p className={"text-red-500 text-sm font-semibold"}>{caption}</p> 
                <p className={"text-black text-sm md:text-base font-bold"}>{title}</p>
                <p className={"text-sm text-gray-500"}>{description}</p>
            </div>
            <div 
                onClick={() => updatePageData({
                    payment_source_code: paymentOptions.account.payment_source_code,
                    card_key: paymentOptions.account.card_key,
                })}
                
                className={`mt-5 grid  cursor-pointer px-1 grid-cols-4 border border-r-0 border-l-0 border-t-0 border-backgroundGrey ${cx({"bg-transluscent-primary": isAccount})}`}
            >
                <div className={"col-span-3"}>
                    <p className={"text-black text-xs md:text-sm font-bold"}>  {`${formatString('USE YOUR BALANCE', 'uppercase')}`}</p>
                    <p className={"text-sm text-gray-500"}>
                        {`NGN ${formatNumber(
                            paymentOptions.profile?.funds,
                            '0,0.00',
                        )}`}
                    </p>
                </div>
                <div className={"col-span-1  flex-col justify-center flex items-end"}>
                    {isAccount ? <RadioCheckedIcon color={"rgba(217,48,37,1)"} />: <RadioUncheckedIcon /> } 
                </div>
            </div>
            <div className={"mt-2 mb-4"}>
                <p className={"text-red-500 text-xs uppercase md:text-sm font-semibold"}>{"Saved Cards"}</p> 
                {paymentOptions.cards.map((opt) => {
                    const { brand, payment_source_code: source, card_key: key, last4 } = opt;

                    const imageSrc = getCardImage(brand);
                    const name = `${brand} \u2022 \u2022 \u2022 \u2022 ${last4}`;
                    const selected = card_key && card_key === key;

                    return(
                        <div 
                            key={last4}
                            onClick={() => updatePageData({ payment_source_code: source, card_key: key })}
                            
                            className={`mt-2 grid py-3 cursor-pointer px-1 grid-cols-4 border border-r-0 border-l-0 border-t-0 border-backgroundGrey ${cx({"bg-transluscent-primary": selected})}`}
                        >
                            <div className={"col-span-3"}>
                                {/* <p className={"text-black text-xs md:text-sm font-bold"}>  {`${formatString('USE YOUR BALANCE', 'uppercase')}`}</p> */}
                                <p className={"text-sm text-gray-800"}>
                                {formatString(name, 'uppercase')}
                                </p>
                            </div>
                            <div className={"col-span-1  flex-col justify-center flex items-end"}>
                                {selected ? <RadioCheckedIcon color={"rgba(217,48,37,1)"} />: <RadioUncheckedIcon /> } 
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className={"mb-4"}>
                {_.filter(paymentOptions.topup_options, (elem) =>
                            ['card', 'virtual'].includes(elem.payment_source_code),
                        ).map((opt, idx) => {
                            const { name, payment_source_code: source, card_key: key } = opt;
                            const selected = payment_source_code && payment_source_code === source && !card_key;
                            return(
                                <div 
                                    key={`${key}-${idx}`}
                                    onClick={() => updatePageData({ payment_source_code: source, card_key: key })}
                                    
                                    className={`mt-2 grid mb-2 py-3 cursor-pointer px-1 grid-cols-4 border border-r-0 border-l-0 border-t-0 border-backgroundGrey ${cx({"bg-transluscent-primary": selected})}`}
                                >
                                    <div className={"col-span-3 flex items-center"}>
                                        <p className={"text-sm font-semibold text-black"}>
                                        {formatString(name, 'uppercase')}
                                        </p>
                                    </div>
                                    <div className={"col-span-1  flex-col justify-center flex items-end"}>
                                        {selected ? <RadioCheckedIcon color={"rgba(217,48,37,1)"} />: <RadioUncheckedIcon /> } 
                                    </div>
                                 </div>
                            )
                })}
            </div>
            <div className={"my-2"}>
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
            
            <div className={"w-full px-4 pt-8 mx-auto md:relative flex-col flex items-end"}>

                <Button
                    disabled={!payment_source_code}
                    onClick={() => initiateTransaction()} 
                    showLoading={loading}
                >
                    {`PAY \u20a6${formatNumber(quoteData.fee, '0,0.00')}`}
                </Button>
            </div>
        </div>
    )
}
export default Page;