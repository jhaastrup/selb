import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { formatNumber, formatPhone, formatString, toNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_IMPORT_PAYMENT } from '../modules/queries';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";

const Page = ({
    dependencies,
    pageData={},
    onChangePage,
    updatePageData,
    nextPage='options',
    setState
}) => {
    const [obj, setObj] = useState(pageData);
    const { pk, destination = {}, delivery_option_code = 'home' } = pageData;
    const { name = '', phone = '', email = '', street = '', city = '', state = '', country = {} } = destination;
    const { dependencies: shippingOptions } = dependencies;

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    console.log("FROM REVIEW!!!!",{pageData, dependencies})

    const buildVariables = () => {
        const { destination = {} } = pageData;
        const destinationInput = _.pick(destination, [
            'city',
            'state',
            'country',
            'post_code',
            'lat',
            'lng',
            'name',
            'phone',
        ]);
        const variables = {
            destination: destinationInput,
            id: pk,
            delivery_option_code,
        };
        console.log({ variables });
        return variables;
    };

    const { loading, data, error, refetch } = useQuery(CREATE_IMPORT_PAYMENT, {
        onCompleted: (data) => {
            console.log(data);
            const { fetchImportQuote: payload } = data;
            console.log('i am quotes===>', { payload });
            setObj(payload);
        },
        onError: (error) => {
            console.log({ error });
        },
        variables: buildVariables(),
    });

    if(loading && !data){
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

    const {
        weight = 0,
        fee = 0,
        currency,
        service_charge = 0,
        total_value = 0,
        origin,
        dimension,
        import_currency,
        import_currency_fee = 0,
        import_payment_description,
        exchange_rate_value,
        discount = 0,
        delivery_fee = 0,
        import_fee,
    } = obj || {};

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

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div className={"border-b pb-4 border-textGrey border-opacity-10"}>
                <p className={"text-primary uppercase text-xs mb-2 tracking-wider"}>{'DELIVERY FEE'}</p>
                <div className={"flex"}>
                    <p className={"text-3xl font-semibold"}>{`\u20a6${formatNumber(fee, '0,0.00')}`}</p>
                </div>
            </div>
            <div className={"border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"uppercase text-xs mb-1 tracking-wider"}>{'Destination'}</p>
                <p className={"tracking-wide text-left text-sm font-medium mb-1"}>{`${destinationMain}`}</p>
                <p className={"text-xs text-textGrey tracking-wider"}>{`${destinationSub}`}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-right text-textGrey tracking-wider"}>{'WEIGHT'}</p>
                <p className={"text-xs text-left font-medium tracking-wider"}>{`${formatNumber(weight, '0.0')}Kg`}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-right text-textGrey tracking-wider"}>{'DIMENSIONS'}</p>
                <p className={"text-xs text-left font-medium tracking-wider"}>{`${dimension.length || 1}cm \u00D7 ${dimension.width || 1}cm \u00D7 ${dimension.height || 1}cm`}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-right text-textGrey tracking-wider"}>{`VALUE (${currency})` || `VALUE (NGN)`}</p>
                <p className={"text-xs text-left font-medium tracking-wider"}>{`${formatNumber(total_value, '0,0.00')}`}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <div>
                    <p className={"uppercase text-textGrey text-xs tracking-wider"}>{'IMPORT FEE'}</p>
                </div>
                <div>
                    <p className={"text-xs text-right font-medium tracking-wider"}>{`${import_currency}${import_currency_fee}`}</p>
                    <p className={"text-xs text-right text-textGrey font-medium tracking-wider"}>{`${import_payment_description}`}</p>
                </div>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <div>
                    <p className={"uppercase text-textGrey text-xs tracking-wider"}>{'DELIVERY ETA'}</p>
                </div>
                <div>
                    <p className={"text-xs text-right font-medium tracking-wider"}>{`${'10 - 15 Working Days'}`}</p>
                    <p className={"text-xs text-right text-textGrey font-medium tracking-wider"}>{'Excluding public holidays'}</p>
                </div>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-right text-textGrey tracking-wider"}>{'DISCOUNT'}</p>
                <p className={"text-xs text-left font-medium tracking-wider"}>{`${formatNumber(discount, '0,0.00')}`}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <div>
                    <p className={"uppercase text-textGrey text-xs tracking-wider"}>{'SUB TOTAL'}</p>
                </div>
                <div>
                    <p className={"text-xs text-right font-semibold tracking-wider"}>{`\u20a6${formatNumber(import_fee,'0,0.00',)}`}</p>
                    <p className={"text-xs text-right text-textGrey font-medium tracking-wider"}>{`\u20a6${exchange_rate_value ?? '0'} to ${import_currency}1`}</p>
                </div>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-right text-textGrey tracking-wider"}>{'DELIVERY FEE'}</p>
                <p className={"text-xs text-left font-medium tracking-wider"}>{`\u20a6${formatNumber(delivery_fee, '0,0.00')}`}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-right text-textGrey tracking-wider"}>{'TOTAL'}</p>
                <p className={"text-xs text-left font-semibold tracking-wider"}>{`\u20a6${formatNumber(fee, '0,0.00')}`}</p>
            </div>
            <Spacer className={"block h-4"} />
            <div className={"flex flex-col"}>
                <p className={"text-textGrey text-xs"}>By completing this transaction, I represent that I have read, understand, and agree to the Sendbox{' '}
                    <a className={"text-primary"} href={'https://sendbox.co/legal/privacy'} target={"_blank"}>
                            Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a className={"text-primary"} href={'https://sendbox.co/legal/terms'} target={"_blank"}>
                        Terms of Service
                    </a>
                </p>
                <Spacer className={"block h-4"}/>
                <Button
                    onClick={() => onChangePage(nextPage, obj)}
                    type={"button"}
                    uclasses={"uppercase bg-primary border-primary tracking-wider md:font-normal"}
                >
                    {`PAY \u20a6${formatNumber(fee, '0,0.00')}`}
                </Button>
            </div>
            <Spacer className={"block h-3"} />
        </div>

    )
}

export default Page;