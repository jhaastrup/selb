import React, { Fragment, useState, useEffect, useCallback } from 'react'
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import { FOREIGN_WAREHOUSES, GET_IMPORT_ADDRESS } from './modules/queries';
import _ from 'lodash';
import { formatString } from 'app/lib/formatters';
import { useRouter } from "next/router";
import Modal from "app/services/modal";
import ImportQuote from './importQuote';
import { CloseIcon, ArrowLeft, ChevronForward } from "app/components/icons";
import { Button } from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import * as copy from "copy-to-clipboard";


const Page = ({ pageData, setState, }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [currentObj, setCurrentObj] = useState(pageData);

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    const {
        country,
        street,
        city,
        state,
        post_code,
        name,
        email,
        phone,
        forwarding_id,
        import_fee = 0,
        import_currency = '',
        import_description = '',
        inc_weight = 0,
        delivery_timeline = '',
    } = pageData;

    const copyNumber = useCallback((value) => {
        copy(value);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }, []);

    const openModal = (data) => {
        console.log("clicked!!!!")
        setModalVisible(true);
        currentObj
        // setTimeout(() => {
        //     setModalVisible(true);
        // }, 20);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const address_info = `${city},${state},${post_code}`;

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-2xl font-semibold"}>{country?.name}</p>
                <Spacer className={"block h-2"} />
                <p className={"text-sm text-gray-400"}>{`Use this address to as your delivery location for packages you want to ship from ${country.name}.`}</p>
            </div>
            <Spacer className={"block h-8"} />
            <div className={"flex flex-col bg-red-500 rounded py-4 px-2"}>
                <div>
                    <p className={"text-xs text-white opacity-70 mb-1"}>{'ADDRESS LINE 1'}</p>
                    <p className={"text-sm text-white font-semibold"}>{street}</p>
                </div>
                <Spacer className={"block h-6"} />
                <div>
                    <p className={"text-xs text-white opacity-70 mb-1"}>{'ADDRESS LINE 2'}</p>
                    <p className={"text-sm text-white font-semibold"}>{`SBX ${forwarding_id}`}</p>
                </div>
                <Spacer className={"block h-6"} />
                <div className={"flex flex-row"}>
                    <div className={"mr-4"}>
                        <p className={"text-xs text-white opacity-70 mb-1"}>{'CITY'}</p>
                        <p className={"text-sm text-white font-semibold"}>{formatString(city, 'capitalize')}</p>
                    </div>
                    <Spacer className={"block w-6"} />
                    <div className={"mr-4"}>
                        <p className={"text-xs text-white opacity-70 mb-1"}>{'STATE'}</p>
                        <p className={"text-sm text-white font-semibold"}>{formatString(state, 'capitalize')}</p>
                    </div>
                    <Spacer className={"block w-6"} />
                    <div className={"mr-4"}>
                        <p className={"text-xs text-white opacity-70 mb-1"}>{'POST CODE'}</p>
                        <p className={"text-sm text-white font-semibold"}>{formatString(post_code, 'uppercase')}</p>
                    </div>
                </div>
                <Spacer className={"block h-6"} />
                <div>
                    <p className={"text-xs text-white opacity-70 mb-1"}>{'RECIPIENT NAME'}</p>
                    <p className={"text-sm text-white font-semibold"}>{name}</p>
                </div>
            </div>
            <Spacer className={"block h-4"} />
            <div>
                <p className={"text-gray-400 text-sm"}>All international imports are subject to our terms and conditions. To learn more about them,{' '}
                    <a className={"text-red-500"} href={"https://sendbox.co/legal/terms"} target={"_blank"}> Click Here</a>
                </p>
            </div>
            <Spacer className={"block h-8"} />
            <div className={"pt-4 pb-2 border-b border-gray-400 border-opacity-10"}>
                <p className={"text-red-500 text-sm tracking-wider"}>{'PRICING'}</p>
            </div>
            <div className={"flex flex-col"}>
                <div className={"flex justify-between py-3 border-b border-gray-400 border-opacity-10"}>
                    <p className={"text-xs text-gray-400 tracking-widest"}>{'IMPORT FEE'}</p>
                    <div className={"text-right"}>
                        <p className={"text-xs font-semibold tracking-widest"}>{`${import_description}`}</p>
                        <p className={"text-xs text-gray-400 tracking-widest"}>{`${'Minimum of 2kg'}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between py-3 border-b border-gray-400 border-opacity-10"}>
                    <p className={"text-xs text-gray-400 tracking-widest"}>{'DELIVERY ETA'}</p>
                    <div className={"text-right"}>
                        <p className={"text-xs font-semibold tracking-widest"}>{`${delivery_timeline} Working Days`}</p>
                        <p className={"text-xs text-gray-400 tracking-widest"}>{'Excluding public holidays'}</p>
                    </div>
                </div>
            </div>
            <Spacer className={"block h-4"} />
            <div className={"flex flex-col"}>
                <Spacer className={"block h-4"} />
                <Button
                    onClick={() => openModal()}
                    type={"button"}
                    uclasses={"uppercase tracking-widest md:font-normal"}
                >
                    {"Get Import Quote"}
                </Button>
            </div>
            <Spacer className={"block h-12"} />
            {modalVisible && (
                <Modal open={modalVisible} onClose={closeModal}>
                    <ImportQuote onClose={closeModal} obj={currentObj} />
                </Modal>
            )}
        </div>
    )
}

export default Page;