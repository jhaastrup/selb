import React, { Fragment, useState, useRef, useCallback, useEffect } from 'react';
import { formatNumberString, formatPhone, formatString, formatDate } from 'app/lib/formatters';
import _ from 'lodash';
import { Spacer } from "app/components/assets";
import { InputField, TextAreaField, Button, ChoiceField } from "app/components/forms";
import { useQuery, useMutation } from '@apollo/client';
import { TRACK_DELIVERY } from './modules/mutations';
import Loading from "app/components/loading"

const Page = ({ onChangePage, setState, pageData }) => {
    const { code = '' } = pageData;

    const [getDeliveryTracking, { data, loading, error }] = useMutation(TRACK_DELIVERY, {
        onCompleted: (data) => {
            console.log('===> tracking', { data });
        },
        onError: (err) => {
            console.log({ err });
        },
    });

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    useEffect(() => {
        getDeliveryTracking({
            variables: { code },
        });
    }, [code, getDeliveryTracking]);

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
                    <p className={"text-center"}>{'Record not found.'}</p>
                    <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p>
                </div>
                <Spacer className={"block h-5"} />
                <div>
                    <Button
                        onClick={() => onChangePage("default", {})}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Try Again'}
                    </Button>
                </div>
            </div>
        )
    }

    const { origin = {}, destination = {}, events = [], estimated_delivery_date } = data?.tracking ?? {};
    const groupedEvents = _.groupBy(events, (elem) => formatDate(elem.date_created, 'LL'));
    const len = events && events.length > 0 && events?.length - 1;
    const status = events && !_.isEmpty(events) ? events[len]?.status : {};
    const grouping = Object.keys(groupedEvents).map((key) => [key, groupedEvents[key]]);

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-10"} />
            <div className={"flex flex-row justify-between"}>
                <div className={"flex justify-center items-center"}>
                    <p className={"text-2xl font-semibold"}>{`${code}`}</p>
                </div>
                <div>
                    <Button
                        onClick={() => onChangePage("default", {})}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-2 px-4`}
                    >
                        {"Change"}
                    </Button>
                </div>
            </div>
            <Spacer className={"block h-5"} />
            <div className={"flex flex-col bg-red-100 py-8 px-2"}>
                <div className={"flex flex-col"}>
                    <p className={"text-xs uppercase text-gray-400 tracking-widest mb-2"}>{'ORIGIN'}</p>
                    <p className={"text-xs overflow-ellipsis overflow-hidden uppercase font-semibold tracking-widest"}>{`${formatString(origin?.street ?? '', 'uppercase')}`}</p>
                </div>
                <Spacer className={"block h-8"} />
                <div className={"flex flex-col"}>
                    <p className={"text-xs uppercase text-gray-400 tracking-widest mb-2"}>{'DESTINATION'}</p>
                    <p className={"text-xs overflow-ellipsis overflow-hidden uppercase font-semibold tracking-widest"}>{`${formatString(destination?.street ?? '', 'uppercase')}`}</p>
                </div>
                <Spacer className={"block h-8"} />
                <div className={"flex flex-col"}>
                    <p className={"text-xs uppercase text-gray-400 tracking-widest mb-2"}>{'STATUS'}</p>
                    <p className={"text-xs overflow-ellipsis overflow-hidden uppercase font-semibold tracking-widest"}>{`${formatString(status?.name ?? '-', 'uppercase')}`}</p>
                </div>
            </div>
            <Spacer className={"block h-8"} />
            <div>
                {grouping.map((values, gid) => {
                    const [sect, entries] = values;
                    return (
                        <div key={gid}>
                            <div>
                                <Spacer className={"block h-4"} />
                                <p className={"text-xs text-red-500 tracking-widest"}>{formatString(sect, 'uppercase')}</p>
                                <div className={"pb-2 border-b-2 border-red-500 border-opacity-20"}></div>
                                {entries.map((opt, idx) => {
                                    const { date_created, description, location_description, status: stat } = opt || {};
                                    {/* const extraColor = stat.code === 'delivered' ? styles.successCaption : {}; */ }

                                    return (
                                        <Fragment key={idx}>
                                            <div className={"flex flex-row justify-between pl-2 pt-4 pb-2"}>
                                                <div className={"flex flex-col"}>
                                                    <p className={"text-left text-sm font-semibold tracking-wider"}>{`${description}`}</p>
                                                    <p className={"text-left text-sm text-gray-400 tracking-wider"}>{`${formatString(location_description, 'uppercase',)}`}</p>
                                                </div>
                                                <div className={"flex flex-col"}>
                                                    <p className={"text-right text-xs tracking-wider"}>{`${formatString(stat?.name, 'uppercase')}`}</p>
                                                    <p className={"text-right text-sm text-gray-400 tracking-wider"}>{`${formatDate(date_created, 'HH:MM A',)}`}</p>
                                                </div>
                                            </div>
                                            {idx < entries.length - 1 && (
                                                <div className={"pb-2 border-b border-gray-400 border-opacity-20"}></div>
                                            )}
                                        </Fragment>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            <Spacer className={"block h-10"} />
        </div>
    )
}

export default Page;