import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { formatNumber, formatPhone, formatString, toNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { useQuery, useMutation } from '@apollo/client';
import { GET_IMPORT_QUOTE } from '../modules/queries';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";

const Page = ({dependencies, pageData = {}, onChangePage, setState}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { weight, destination = {}, origin = {}, metric, total_cost } = pageData;
    const [quoteData, setQuoteData] = useState();
    const { dependencies: shippingOptions } = dependencies;


    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    console.log("FROM REVIEW!!!!",{pageData, dependencies})

    const buildVariables = () => {
        const { origin = {}, destination = {}, weight } = pageData;
        const franchise_id = origin?.pk ?? '';
        const originInput = {
            city: origin?.city ?? '',
            state: origin?.state ?? '',
            country: origin?.country?.code ?? '',
            post_code: origin?.post_code ?? '',
        };
        const destinationInput = _.pick(destination, ['city', 'state', 'country', 'post_code', 'lat', 'lng']);
        const parsedWeight = parseFloat(weight);

        if (_.isEmpty(destination)) {
            const variables = {
                origin: originInput,
                weight: parsedWeight,
                franchise_id,
            };
            console.log({ variables });
            return variables;
        }

        const variables = {
            origin: originInput,
            destination: destinationInput,
            weight: parsedWeight,
            franchise_id,
        };
        console.log({ variables });
        return variables;
    };

    const refetchVariables = () => {
        const { origin = {}, destination = {}, weight } = pageData;
        const franchise_id = origin?.pk ?? '';
        const originInput = {
            city: origin?.city ?? '',
            state: origin?.state ?? '',
            country: origin?.country?.code ?? '',
            post_code: origin?.post_code ?? '',
        };
        const destinationInput = _.pick(destination, ['city', 'state', 'country', 'post_code', 'lat', 'lng']);
        const parsedWeight = parseFloat(weight);
        const variables = {
            origin: originInput,
            destination: destinationInput,
            weight: parsedWeight,
            franchise_id,
        };

        console.log('i am called to retch');
        refetch({ variables });
    };

    const { loading, data, error, refetch } = useQuery(GET_IMPORT_QUOTE, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
        onCompleted: (resp) => {
            const { getQuoteForImport: quote } = resp;
            console.log('==> called again', { quote });
            setQuoteData(quote);
        },
        onError: (e) => {
            console.log({ e });
        },
        variables: buildVariables(),
    });

    if(!quoteData){
        return(
            <div className={"flex h-screen justify-center items-center"}>
                <Loading />
            </div>
        )
    }

    if (error) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <div>
                    <p className={"text-center"}>{'unknown error occurred'}</p>
                    {/* <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p> */}
                </div>
                <Spacer className={"block h-5"} />
                <div>
                    <Button
                        onClick={() => refetch && refetch()}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Try Again'}
                    </Button>
                </div>
            </div>
        )
    }

    const destinationTag = _.isEmpty(destination);
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

    const mainTitleText = destinationTag
        ? 'Provide your delivery location'
        : _.compact([destination?.street || '', destination?.city || '']).join(', ');

    const mainSubText = destinationTag
        ? 'optional'
        : _.compact([destination?.name || '', formatPhone(destination?.phone, 'NATIONAL') || '']).join(' \u2022 ');

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-2"}>{'WEIGHT'}</p>
                <div className={"flex"}>
                    <p className={"text-4xl font-semibold"}>{`${formatNumber(weight, '0.0')}`}</p>
                    <Spacer className={"block w-1"} />
                    <p className={"text-sm font-semibold"}>{`${metric}`}</p>
                </div>
            </div>
            <Spacer className={"block h-8"} />
            <div className={"py-4"}>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Import Fee"}</p>
                    </div>
                    <div>
                        <p className={"text-xs text-right font-medium"}>{` ${quoteData?.import_currency ?? ''}${quoteData?.import_currency_fee ?? ''}`}</p>
                        <p className={"text-xs text-right text-textGrey font-medium"}>{`${quoteData?.import_payment_description ?? ''}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Delivery ETA"}</p>
                    </div>
                    <div>
                        <p className={"text-xs text-right font-medium tracking-wider"}>{`${origin?.delivery_timeline ?? ''} Working Days`}</p>
                        <p className={"text-xs text-right text-textGrey font-medium tracking-wider"}>{'Excluding public holidays'}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{'SERVICE CHARGE'}</p>
                    </div>
                    <div>
                        <p className={"text-xs text-right font-medium tracking-wider"}>{`${formatNumber(quoteData?.service_charge ?? 0,'0,0.00',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{'IMPORT FEE'}</p>
                    </div>
                    <div>
                        <p className={"text-xs text-right font-medium tracking-wider"}>{`\u20a6${formatNumber(quoteData?.import_fee ?? 0,'0,0.00',)}`}</p>
                        <p className={"text-xs text-right text-textGrey font-medium tracking-wider"}>{`\u20a6${quoteData?.exchange_rate_value ?? ''} to ${quoteData?.import_currency ?? ''}1`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{'DELIVERY FEE'}</p>
                    </div>
                    <div>
                        <p className={"text-xs text-right font-medium"}>{`\u20a6${formatNumber(quoteData?.delivery_fee ?? 0,'0,0.00', )}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{'TOTAL'}</p>
                    </div>
                    <div>
                        <p className={"text-sm text-right font-semibold"}>{`\u20a6${formatNumber(quoteData?.fee ?? 0,'0,0.00',)}`}</p>
                    </div>
                </div>
            </div>
            <Spacer className={"block h-10"} />
        </div>
    )
}

export default Page