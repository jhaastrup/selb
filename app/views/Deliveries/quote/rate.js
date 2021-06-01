import * as React from "react";
import _ from "lodash";
import {useMutation, useQuery} from "@apollo/client";
import { GET_DELIVERY_QUOTE } from '../modules/queries';
import {formatNumber, formatPhone, formatString} from "app/lib/formatters";
import {Button, RadioButton} from "app/components/forms";
import Loading from "app/components/loading"
import { useRouter } from "next/router";


const Page = ({pageData}) => {
    const router = useRouter();
    const [quoteData, setQuoteData] = React.useState();
    

    const skipCondition = () => {
        const { origin = {}, destination = {}, items = [] } = pageData;
        const a = _.isEmpty(_.omit(origin, ['name', 'email', 'phone']));
        const b = _.isEmpty(_.omit(destination, ['name', 'email', 'phone']));
        const skip = a || b;

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
            insurance_option_code,
            coupon_code,
        };
        return variables;
    };

    const { loading, data, error } = useQuery(GET_DELIVERY_QUOTE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (resp) => {
            const { getDeliveryQuote: quote } = resp;
            console.log({ quote });
            setQuoteData(quote);
        },
        onError: (e) => {
            console.log(e);
        },
        variables: buildVariables(),
        // skip: skipCondition(),
    });

    if(!quoteData){
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
    console.log({quoteData})
    return(
        <div className={"max-w-3xl relative mx-auto px-3 mt-3 pb-12 flex flex-col"}>
            <div className={"mt-4 pb-4"}>
                <p className={"text-primary text-xs md:text-sm font-semibold"}>{"ESTIMATE"}</p> 
                <p className={"text-black text-sm md:text-base font-bold"}>{`\u20a6${formatNumber(
                        quoteData.max_quoted_fee,
                        '0,0.00',
                    )}`}</p>
            </div>

            <div className={"mt-4 bg-red-500"}>
                <p className={"text-gray-500 p-2 text-sm"}>
                    {"Please consider this pricing an estimate, as actual delivery fees may vary depending on verified shipping information"}
                </p>
            </div>

            {/* <div className={"mt-4 pb-4 border-b border-lightGrey"}>
                <p className={"text-black font-semibold uppercase text-sm md:text-base"}>{"origin"}</p>
                <p className={"text-black font-medium text-xs md:text-sm"}>{`${originMain}`}</p>
                <p className={"text-gray-500 text-xs md:text-sm"}>{`${originSub}`}</p>
            </div>
            <div className={"mt-4 pb-4 border-b border-transluscent-grey"}>
                <p className={"text-black font-semibold  uppercase text-xs md:text-sm"}>{"destination"}</p>
                <p className={"text-black font-medium text-xs md:text-sm"}>{`${destinationMain}`}</p>
                <p className={"text-textGrey text-xs md:text-sm"}>{`${destinationSub}`}</p>
            </div> */}
            

            <div className={"my-2"}>
                <div className={"flex justify-between my-4 py-2 border-b border-transluscent-grey"}>
                    <p className={"text-gray-500 font-semibold uppercase text-xs"}>{"weight"}</p>
                    <p className={"text-black text-xs font-semibold"}>{`${formatNumber(
                                quoteData.weight,
                                '0.0',
                            )}Kg`}
                    </p>
                </div>
                
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"total"}</p>
                    <p className={"text-black text-xs font-semibold"}>{`${quoteData.length || 1}cm \u00D7 ${
                        quoteData.width || 1
                        }cm \u00D7 ${quoteData.height || 1}cm`}
                    </p>
                </div>
                
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"pickup window"}</p>
                    <div>
                        <p className={"text-black text-xs font-semibold"}>{"12 - 24 Hours"}</p>
                        <p className={"text-gray-500 text-xs font-semibold"}>{"Weekends or holidays not included"}</p>
                    </div>
                </div>
                <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                    <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"delivery eta"}</p>
                    <div>
                        <p className={"text-black text-xs font-semibold"}>{`${'3 - 5 Working Days'}`}</p>
                        <p className={"text-gray-500 text-xs font-semibold"}>{`${'Excluding public holidays'}`}</p>
                    </div>
                </div>
                
                
                
                
               
            </div>
         
    
            <div className={"fixed bottom-1 w-full px-3 -ml-3 mx-auto md:relative md:flex-col md:flex md:items-end"}>

                <Button
                    onClick={() => router.push('/deliveries/create')}  
                    uclasses={"rounded-3xl w-full md:px-4 md:w-auto text-black border-0 focus:outline-none focus:border-opacity-0 outline-none px-2"}
                >
                    {"BOOK DELIVERY"}
                </Button>
            </div>

        </div>
    )
}

export default Page;



