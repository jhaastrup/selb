import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { formatNumber } from 'app/lib/formatters';
import _ from 'lodash';
import { useQuery, useMutation } from '@apollo/client';
import { WALLET_DEPENDENCIES, VERIFY_TOPUP } from '../modules/queries';
import { CREATE_TOPUP, VALIDATE_TOPUP } from '../modules/mutations';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";

const Page = ({}) => {
    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary tracking-wider uppercase text-xs mb-2"}>{'AIRTIME & ELECTRICITY'}</p>
                <p className={"text-xl md:text-2xl font-semibold"}>{'Service is currently unavailable'}</p>
                <Spacer className={"block h-6"} />
                <p className={"text-sm md:text-lg font-medium tracking-wide"}>{'This service is currently disabled and will be back shortly and Thank you for your patience. '}</p>
            </div>
        </div>
    )
}

export default Page;