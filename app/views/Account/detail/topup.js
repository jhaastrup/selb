import React, { Fragment, useState, useCallback } from 'react';
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import _ from 'lodash';
import { useRouter } from "next/router";
import { formatDate, formatString, formatNumber, formatPhone } from 'app/lib/formatters';
import { CloseIcon, ArrowLeft } from "app/components/icons";
import { Button } from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"

const Page = ({ obj }) => {
    const { source, status, code, pk, comment, amount, date_created } = obj

    return (
        <div className={"flex flex-col max-w-lg mx-auto"}>
            <Spacer className={"block h-4"} />
            <div className={"flex flex-col justify-start items-start py-4 border-b border-textGrey border-opacity-20"}>
                <p className={"w-full text-2xl font-semibold"}>
                    {`\u20a6${formatNumber(amount, '0,0.00',)}`}
                </p>
                <Spacer className={"block h-1"} />
                <p className={"w-full text-sm text-textGrey"}>
                    {`${formatString(comment || '', 'uppercase',)}`}
                </p>
            </div>
            <div className={"py-4"}>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Date"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${formatDate(date_created, 'lll')}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Code"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${formatString(code || '', 'uppercase',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{"Source"}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${formatString(source || '-', 'uppercase',)}`}</p>
                    </div>
                </div>
                <div className={"flex justify-between border-b py-4 border-textGrey border-opacity-10"}>
                    <div>
                        <p className={"uppercase text-textGrey text-xs tracking-wider"}>{'Status'}</p>
                    </div>
                    <div>
                        <p className={"text-xs font-medium tracking-wider"}>{`${formatString(status?.name, 'uppercase',)}`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;