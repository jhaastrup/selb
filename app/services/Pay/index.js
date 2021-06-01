import React, {useState} from 'react';
import {useRouter} from "next/router";
import {PAYMENT_DEPENDENCIES} from "./modules/queries";
import {useQuery} from "@apollo/client";
import _ from "lodash";
import Modal from "app/services/modal";
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";

import Card from './card';
import Fail from './failed';
import Otp from './otp';
import Pin from './pin';
import Success from './success';
import Virtual from './virtual';
import Offline from './offline';
import Inject from './inject';
import Pending from './pending';
import Url from './url';

const Page = ({ payData, onSuccess, onFailure, onError, onCancel, withFunds, excludeOptions = [] }) => {
    const [currentPage, setCurrentPage] = useState('card');
    const [transData, setTransData] = useState({});

    // console.log("FROM PAY COMPONENT....",{payData});

    const { data, loading, error, refetch } = useQuery(PAYMENT_DEPENDENCIES, {
        fetchPolicy: 'no-cache', // required
        onCompleted: () => {
            console.log(' data fetch completed');
            const nextPage = payData.payment_source_code ? 'inject' : 'card';
            setCurrentPage(nextPage);
        },
    });

    if(loading){
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

    const { dependencies = {} } = data;

    const _onSuccess = (payload) => {
        console.log('i am calling on success', payload);
        onSuccess && onSuccess(payload);
    };

    const _onFailure = (payload) => {
        onFailure && onFailure(payload);
    };

    const _onError = (payload) => {
        onError && onError(payload);
    };

    const _onCancel = () => {
        onCancel && onCancel();
    };

    const _onProceed = (payload) => {
        console.log({ mutation: payload });
        setTransData(payload);
        setCurrentPage(payload.page);
    };

    const _onRestart = () => {
        const { payment_source_code = 'card' } = payData;
        const updatedPayload = { page: 'inject', payment_source_code };
        _onProceed(updatedPayload);
    };

    let PageComponent;

    switch (currentPage) {
        case 'inject':
            PageComponent = Inject;
            break;
        case 'card':
            PageComponent = Card;
            break;
        case 'send_pin':
            PageComponent = Pin;
            break;
        case 'send_otp':
            PageComponent = Otp;
            break;
        case 'open_url':
            PageComponent = Url;
            break;
        case 'pending':
        case 'ongoing':
            PageComponent = Pending;
            break;
        case 'virtual':
        case 'virtual_bank':
            PageComponent = Virtual;
            break;
        case 'offline':
        case 'offline_bank':
            PageComponent = Offline;
            break;
        case 'success':
        case 'successful':
            PageComponent = Success;
            break;
        case 'failed':
        case 'fail':
        case 'error':
            PageComponent = Fail;
            break;
        case 'off':
            PageComponent = Loading;
            break;
        default:
            PageComponent = null;
            break;
    }

    console.log({ currentPage, PageComponent });

    return (
        <PageComponent
            initialData={payData}
            transData={transData}
            onSuccess={_onSuccess}
            onFailure={_onFailure}
            onRestart={_onRestart}
            onError={_onError}
            onCancel={_onCancel}
            withFunds={withFunds}
            excludeOption={excludeOptions}
            dependencies={dependencies}
            onProceed={_onProceed}
        />
    )
}

export default Page;