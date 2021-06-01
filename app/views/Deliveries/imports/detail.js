import React, { Fragment, useState, useCallback } from 'react'
import TabLayout from './tab';
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import { IMPORT } from '../modules/queries';
import _ from 'lodash';
import { useRouter } from "next/router";
import { formatDate, formatString, formatNumber, formatPhone } from 'app/lib/formatters';
import { CloseIcon, ArrowLeft, ArrowRight } from "app/components/icons";
import { Button } from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import Modal from "app/services/modal";
import ImportsPayment from "../importsPayment"

const Page = ({ obj }) => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const { loading, data, error, refetch } = useQuery(IMPORT, {
        fetchPolicy: 'cache-and-network',
        variables: { id: obj.pk },
        notifyOnNetworkStatusChange: true,
    });

    if (loading && !data) {
        return (
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

    const openModal = () => {
        setModalVisible(true);
    }

    const closeModal = () => {
        // window.location.reload();
        setModalVisible(false);
    }

    const {
        pk,
        code,
        origin,
        destination,
        date_created,
        status,
        description,
        dimension = {},
        items = [],
        fee,
        volumetric_weight,
        total_value,
        import_fee,
        import_currency_fee,
        source,
        weight,
        paid,
        currency,
    } = data.delivery;

    const dimensionList = [
        `${formatNumber(dimension.length, '0,0.[00]')} CM`,
        `${formatNumber(dimension.width, '0,0.[00]')} CM`,
        `${formatNumber(dimension.height, '0,0.[00]')} CM`,
    ];

    const dimensionString = dimensionList.join(' \u00D7 ');

    const originMain = _.compact([
        origin?.street || '',
        origin?.city || '',
        formatString(origin?.state || '', 'capitalize'),
        origin?.country?.name || '',
        origin.post_code || '',
    ]).join(', ');
    const originSub = _.compact([origin?.name || '', formatPhone(origin?.phone, 'NATIONAL') || '']).join(' \u2022 ');

    const destinationMain = _.compact([
        destination?.street || '',
        destination?.city || '',
        formatString(destination?.state || '', 'capitalize'),
        destination?.country?.name || '',
        destination.post_code || '',
    ]).join(', ');
    const destinationSub = _.compact([destination?.name || '', formatPhone(destination?.phone, 'NATIONAL') || '']).join(
        ' \u2022 ',
    );

    const toTracking = (code) => {
        router.push({
            pathname: '/tracking',
            query: { code },
        })
    }

    return (
        <div className={"flex flex-col max-w-lg mx-auto"}>
            <Spacer className={"block h-4"} />
            <div className={"border-b pb-4 border-textGrey border-opacity-10"}>
                <p className={"text-red-600 uppercase text-sm mb-1 tracking-wider"}>{`${formatString('FROM', 'uppercase')}`}</p>
                <p className={"tracking-wide text-left text-xl font-semibold"}>{`${source}`}</p>
                <p className={"text-xs text-gray-400 tracking-wider"}>{`${formatString(origin?.country?.name || '', 'uppercase',)}`}</p>
            </div>
            <div className={"border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-left tracking-wider text-gray-400"}>{`${formatString(description || 'Content description not provided', 'sentence',)}`}</p>
            </div>
            <div className={"border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-gray-400 uppercase text-xs mb-1 tracking-wider"}>{'DELIVERING TO'}</p>
                <p className={"tracking-wide text-left text-sm font-medium"}>{`${destinationMain}`}</p>
                <p className={"text-xs text-gray-400 tracking-wider"}>{`${destinationSub}`}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-gray-400 tracking-wider"}>{'TRACKING CODE'}</p>
                <p className={"text-xs font-medium tracking-wider"}>{`${formatString(code || '-', 'uppercase',)}`}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <div className={"flex flex-col"}>
                    <p className={"text-xs text-gray-400 tracking-wider mb-2"}>{'STATUS'}</p>
                    <p className={"text-xs font-bold tracking-wider overflow-ellipsis text-left"}>{`${formatString(status?.name, 'uppercase')}`}</p>
                </div>
                <div className={"flex items-center justify-center"}>
                    <Button
                        onClick={() => toTracking(code)}
                        className={"flex rounded-full py-2 tracking-wider text-xs appearance-none text-white uppercase px-4 outline-none focus:outline-none bg-black"}
                        type={"button"}
                    >
                        {"Tracking History"} <ArrowRight size={14} />
                    </Button>
                </div>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-right text-gray-400 tracking-wider"}>{'DECLARED WEIGHT (KG)'}</p>
                <p className={"text-xs text-left font-semibold tracking-wider"}>{`${formatNumber(weight, '0.0')}`}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-right text-gray-400 tracking-wider"}>{`DECLARED VALUE (${currency})` || `DECLARED VALUE (NGN)`}</p>
                <p className={"text-xs text-left font-semibold tracking-wider"}>{`${formatNumber(total_value, '0,0.00')}` || '-'}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-right text-gray-400 tracking-wider"}>{'IMPORT FEE'}</p>
                <p className={"text-xs text-left font-semibold tracking-wider"}>{`${formatNumber(import_fee, '0,0.00')}`}</p>
            </div>
            <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                <p className={"text-xs text-right text-gray-400 tracking-wider"}>{'AMOUNT PAID'}</p>
                <p className={"text-xs text-left font-semibold tracking-wider"}>{`\u20a6${formatNumber(fee, '0,0.00')}`}</p>
            </div>
            {status && ['pending'].includes(status.code) && (
                <Fragment>
                    <Spacer className={"block h-10"} />
                    <div className={"flex flex-col"}>
                        <Button
                            onClick={() => openModal()}
                            type={"button"}
                            uclasses={"uppercase tracking-widest md:font-normal"}
                        >
                            {"Pay"}
                        </Button>
                    </div>
                </Fragment>
            )}
            <Spacer className={"block h-3"} />
            {modalVisible && (
                <Modal open={modalVisible} onClose={closeModal}>
                    <ImportsPayment obj={data.delivery} onClose={closeModal} onRefresh={() => refetch && refetch()} />
                </Modal>
            )}
        </div>
    )
}

export default Page;