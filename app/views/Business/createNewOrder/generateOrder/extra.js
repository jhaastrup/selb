import * as React from "react";
import _ from "lodash";
import metadata from "./metadata";
import Modal from "app/components/simpleModal";
import {useLazyQuery} from "@apollo/client";
import {formatPhone, formatString, formatNumber, toNumber} from "app/lib/formatters";
import {Button} from "app/components/forms";
import ChargeFee from "./delivery";
import {GET_DELIVERY_QUOTE} from "../../modules/queries";

const Page = ({onChangePage, pageData, setState, dependencies, updatePageData}) => {
    const pageKey = 'extra';
    const shippingKey = 'selectedKey';
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const [shippingFee, setShippingFee] = React.useState();
    const [priceModal, setPriceModal] = React.useState(false);
    const [selectedRate, setSelectedRate] = React.useState('');
    const { [shippingKey]: initialKey = undefined, customer_charge = undefined } = pageData;
    const { destination = {}, items = [] } = pageData;
    const { default_address: origin = {} } = dependencies.me;


    const closePriceModal = () => {
        setPriceModal(false);
    };
    
    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "destination",
        }))
    }, []);

    React.useEffect(() => {
        selectedItem('sendbox');
    }, [selectedItem]);

    const buildVariables = React.useCallback(() => {
        const { city = '', state = '', country = {}, post_code = '', lat = '', lng = '' } = origin || {};

        const formattedItems = items.map((item) => ({
            ...item,
            weight: parseFloat(item.weight),
            quantity: parseInt(item.quantity, 10),
            value: parseFloat(toNumber(item.value)),
            amount: parseFloat(toNumber(item.value)),
        }));

        const originInput = {
            city,
            state,
            post_code,
            lat,
            lng,
            country: country.code,
        };
        const destinationInput = _.pick(destination, ['city', 'state', 'country', 'post_code', 'lat', 'lng']);
        const weight = parseFloat(_.sumBy(formattedItems, 'weight'));
        const variables = {
            origin: originInput,
            destination: destinationInput,
            weight: parseFloat(weight),
            items: formattedItems,
            rate_code: 'standard',
        };


        return variables;
    }, [destination, items, origin]);

    const [getDeliveryQuote, { loading: loadingQuote, data, error }] = useLazyQuery(GET_DELIVERY_QUOTE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (resp) => {
            const { getDeliveryQuote: quote } = resp;
            if (quote.rates && quote.rates.length === 1) {
                const fee = quote.rates[0].fee;
                updatePageData({ customer_charge: String(fee), quoteData: quote, [shippingKey]: 'sendbox' });
                setShippingFee(`NGN ${String(fee)}`);
            }
        },
        onError: (e) => {
            console.log('error fetching quotes', { e });
        },
    });
   

    const selectedItem = React.useCallback(
        (type) => {
            const variables = buildVariables();
            if (type === 'sendbox') {
                updatePageData({ customer_charge: undefined, [shippingKey]: "sendbox"});
                setSelectedRate('sendbox');
                getDeliveryQuote({ variables });
            } else if (type === 'manual') {
                updatePageData({ [shippingKey]: 'manual', customer_charge: undefined });
                setSelectedRate('manual');
            }
        },
        [buildVariables, getDeliveryQuote, updatePageData],
    );

    const total_weight = formatNumber(
        _.reduce(items, (p, c) => p + parseFloat(c.weight), 0),
        '0,0.00',
    );

   
    return (
        <div className={"px-4  mx-auto"}>  
             
            <div className={"my-4"}>
                    <p className={"text-red-500 text-xs md:text-sm font-semibold"}>{caption}</p> 
                    <p className={"text-black text-sm md:text-base font-bold"}>{title}</p>
                    <p className={"text-sm text-gray-500"}>{description}</p>
            </div>

            <div className={"my-4"}>
                        
                {selectedRate === "sendbox" ? (<Button
                    onClick={() => {
                        selectedItem('manual')
                        setPriceModal(true);
                    }} 

                    className={"rounded-3xl text-xs capitalize py-2 px-3 font-semibold text-white bg-black border  focus:outline-none focus:border-opacity-0 outline-none "}
                >
                    {"Shipping by sendbox"}
                </Button>): (<Button
                    onClick={() => {
                        selectedItem('sendbox');
                        
                    }}            
                    className={"rounded-3xl capitalize text-xs py-2 px-3 font-semibold text-black bg-white border-black border  focus:outline-none focus:border-opacity-0 outline-none"}
                >
                    {"Shipping by yourself"}
                </Button>)}
                
            </div>
             

                <div>

                    
                    <div className={"my-6"}>
                        <p className={"text-primary text-xs md:text-sm font-semibold"}>{"SUMMARY"}</p> 

                        <div className={"flex justify-between my-4 py-2 border-b border-gray-300"}>
                            <p className={"text-gray-500 font-semibold text-xs uppercase"}>{"WEIGHT"}</p>
                            <p className={"text-gray-500 text-sm font-semibold"}>{`${formatNumber(total_weight, '0.0')}Kg`}</p>
                        </div>
                        
                        <div className={"flex justify-between my-4 border-b py-2 border-gray-300"}>
                            <p className={"text-gray-500 font-semibold text-xs uppercase"}>{"Value(NGN)"}</p>
                            <p className={"text-black text-sm font-semibold"}>{`${formatNumber(
                                    _.reduce(items, (p, c) => p + toNumber(c.value), 0),
                                    '0,0.00',
                                )}`}</p>
                        </div>
                        <div className={"flex justify-between my-4 border-b py-2 border-gray-300"}>
                            <p className={"text-gray-500 font-semibold text-xs uppercase"}>{"Shipping"}</p>
                            <div>
                                <p className={"text-black text-sm font-semibold"}>{`${formatNumber(customer_charge, '0.0')}`}</p>
                                <p className={"text-gray-500 text-sm font-semibold"}>{formatString(selectedRate, 'uppercase')}</p>

                            </div>
                        </div>
                        {selectedRate === "sendbox" && (
                            <div className={"flex justify-between my-4 border-b py-2 border-gray-300"}>
                                <p className={"text-gray-500 font-semibold text-xs uppercase"}>{'PICKUP WINDOW'}</p>
                                <div>
                                    <p className={"text-black text-sm font-semibold"}>{`${'12 - 24 Hours'}`}</p>
                                    <p className={"text-gray-500 text-xs font-semibold"}>{'Weekends or holidays not included'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                   
                    

                        <div className={"w-full mx-auto md:relative flex-col flex items-end"}>

                        <Button
                            onClick={() => onChangePage("review")} 
                        >
                            {"Continue"}
                        </Button>
                    </div>
            </div>
             {priceModal && (
                 <Modal open={priceModal} onClose={closePriceModal}>
                     <ChargeFee
                        onCompleted={(fee) => {
                            updatePageData({ customer_charge: fee });
                            setShippingFee(`NGN ${String(fee)}`);
                            closePriceModal();
                        }}
                      />
                 </Modal>
             )}
        
        </div>
    )

}

export default Page;