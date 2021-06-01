import * as React from "react";
import {useMutation, useQuery} from "@apollo/client";
import {GET_DELIVERY_QUOTE} from "../modules/queries";
import metadata from "./metadata";
import _ from "lodash";
import Loading from "app/components/loading"
import cx from "classnames";
import {ChevronForward} from "app/components/icons";
import {formatNumber, formatString, toNumber} from "app/lib/formatters";
import {Button} from "app/components/forms";


const Page = ({
    
    pageData = {},
    onChangePage,
    updatePageData
   
}) => {
    const [quoteData, setQuoteData] = React.useState();
    const pageKey = 'rate_key';
    const nextPage = "insurance";

    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const { [pageKey]: initialValue = undefined } = pageData;
    console.log("from rates",{pageData})

    const skipCondition = () => {
        const { origin = {}, destination = {}, items } = pageData;
        const a = _.isEmpty(_.omit(origin, ['name', 'email', 'phone']));
        const b = _.isEmpty(_.omit(destination, ['name', 'email', 'phone']));
        const c = _.isEmpty(items);
        const skip = a || b || c;

        return skip;
    };

    const buildVariables = () => {
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
        console.log({variables})
        return variables;
    };

    const { loading, data, error } = useQuery(GET_DELIVERY_QUOTE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (resp) => {
            const { getDeliveryQuote: quote } = resp;
            setQuoteData(quote);
            console.log(quote);
            if (quote.rates && quote.rates.length === 1) {
                onChangePage('insurance', { rate_key: quote.rates[0].key, quoteData: quote });
            }
        },
        onError: (e) => {
            console.log(e);
        },
        variables: buildVariables(),
        skip: skipCondition(),
    });

    if(!quoteData){
        return(
            
            <Loading />
        )
    }

    if(error){
        return(
            <div className={"flex items-center justify-center"}>
                <p className={"text-xs text-black"}> {"Fetching delivery quotes..."}</p>
            </div>
        )
    }

    return(
        <div className={"max-w-3xl mx-auto px-3 mt-3 pb-12 flex flex-col"}>
                <div className={"mt-8 mb-4"}>
                    <p className={"text-primary text-xs md:text-sm font-semibold"}>{caption}</p> 
                    <p className={"text-black text-sm md:text-base font-bold"}>{title}</p>
                    <p className={"text-xs md:text-sm text-textGrey"}>{description}</p>
                </div>
             {_.sortBy(quoteData.rates, 'name').map((opt, idx) => {
                const { name, fee, key } = opt;
                const titleText = name;
                const subText = `NGN ${formatNumber(fee, '0,0.00')}`;
                const isSelected = initialValue === key;

                return(
                    <div 
                        key={idx}
                        onClick={() => updatePageData({[pageKey]:key})}
                        className={`grid mb-4 py-3 cursor-pointer px-1 grid-cols-4 border border-r-0 border-l-0 border-t-0 border-backgroundGrey ${cx({"bg-transluscent-primary": isSelected})}`}
                    >
                        <div className={"col-span-3"}>
                            <p className={"text-black text-xs md:text-sm font-bold"}> {formatString(`${titleText}`, 'uppercase')}</p>
                            <p className={"text-xs text-black opacity-70"}>{subText}</p>
                        </div>
                        <div className={"col-span-1  flex-col justify-center flex items-end"}>
                            <ChevronForward />
                        </div>
                    </div>
                )
             })}
             <div className={"w-full px-3 -ml-3 mx-auto md:relative md:flex-col md:flex md:items-end"}>
                        
                <Button
                    disable={pageData[pageKey] ? 0 : 1}
                    onClick={() => onChangePage(nextPage, {quoteData})}            
                    uclasses={"rounded-3xl w-full md:w-auto px-2 focus:border-opacity-0 outline-none w-24"}
                >
                    {"Continue"}
                </Button>
            </div>
        </div>

    )
}

export default Page;