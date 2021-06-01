import React, { Fragment, useState, useCallback, useEffect } from 'react'
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import { FOREIGN_WAREHOUSES, GET_IMPORT_ADDRESS } from './modules/queries';
import _ from 'lodash';
import { formatString } from 'app/lib/formatters';
import { useRouter } from "next/router";
import Modal from "app/services/modal";
import { CloseIcon, ArrowLeft, ChevronForward } from "app/components/icons";
import { Button } from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"

const Page = ({ onChangePage, dependencies, setState }) => {
    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);
    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-2xl font-semibold"}>{'Import addresses'}</p>
                <Spacer className={"block h-2"} />
                <p className={"text-sm text-gray-400"}>{'Import packages and your e-commerce orders from other countries using your personalized overseas addresses.'}</p>
            </div>
            <Spacer className={"block h-8"} />
            {dependencies && dependencies.length > 0 && (
                <Fragment>
                    <div className={"py-3"}>
                        <div className={"pt-4 pb-2 border-b border-gray-400 border-opacity-10"}>
                            <p className={"text-red-500 text-xs tracking-wider"}>{'SUPPORTED COUNTRIES'}</p>
                        </div>
                        {/* <Spacer className={"block h-3"} /> */}
                        {dependencies.map((opt, idx) => {
                            const { country, city, state } = opt;
                            const subText = _.compact([
                                formatString(city || '', 'uppercase'),
                                formatString(state || '', 'uppercase') || '',
                            ]).join(' \u2022 ');
                            return (
                                <Fragment key={idx}>
                                    <div
                                        onClick={() => onChangePage && onChangePage('detail', opt)}
                                        className={"flex justify-between py-3 border-b border-gray-400 border-opacity-10 mb-3 cursor-pointer"}
                                    >
                                        <div className={"w-3/4"}>
                                            <p className={"text-sm tracking-wider mb-2"}>{`${formatString(country?.name || '', 'capitalize')}`}</p>
                                            <p className={"text-xs text-gray-400 uppercase tracking-wider"}>{`${subText}`}</p>
                                        </div>
                                        <div className={"flex justify-end w-1/4 cursor-pointer"}>
                                            <div className={"flex justify-center items-center"}>
                                                <ChevronForward />
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            )
                        })}
                    </div>
                </Fragment>
            )}
        </div>
    )
}

export default Page;