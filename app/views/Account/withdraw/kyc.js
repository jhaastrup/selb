import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { useRouter } from "next/router";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";

import SecurityIcon from 'public/images/icons/security.svg';

const Page = ({setState}) => {
    const router = useRouter();

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);

    const verifyAccount = () => {
        router.push("/settings/bvn")
    }

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4 "}>
            <Spacer className={"block h-12"} />
            <div className={"flex justify-center items-center"}>
                <SecurityIcon className={"w-40 h-40"} />
            </div>
            <Spacer className={"block h-6"} />
            <div className={"flex flex-col justify-center items-center"}>
                <p className={"text-center text-sm md:text-lg font-medium tracking-wider mb-2"}>{'You need to verify your account to continue.'}</p>
                <p className={"text-center text-textGrey text-xs md:text-sm"}>{'Only verified users can transfer money to other users or withdraw money to bank accounts.'}</p>
            </div>
            <Spacer className={"block h-8"} />
            <div className={"flex flex-col"}>
                <Button
                    onClick={verifyAccount}
                    type={"button"}
                    uclasses={"uppercase tracking-wider md:font-normal rounded-3xl"}
                >
                    {"Verify my Account"}
                </Button>
            </div>
        </div>
    );
};

export default Page;

