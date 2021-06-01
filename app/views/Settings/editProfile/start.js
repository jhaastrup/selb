import React, { Fragment, useEffect } from 'react'
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import _ from 'lodash';
import metadata from './metadata';
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";
import {ChevronForward} from "app/components/icons"



const Page = ({onChangePage, dependencies, setState}) => {
    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);
    
    const { caption = '', title = '', description = '' } = metadata.start || {};

    const results = [
        {
            name: 'Name',
            onClick: () => {
                onChangePage('name', {});
            },
        },
        {
            name: 'Email',
            onClick: () => {
                onChangePage('email', {});
            },
        },
        {
            name: 'Username',
            onClick: () => {
                onChangePage('username', {});
            },
        },
        {
            name: 'Phone',
            onClick: () => {
                onChangePage('phone', {});
            },
        },
        {
            name: 'Password',
            onClick: () => {
                onChangePage('password', {});
            },
        },
    ];

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-3"}>{caption}</p>
                <p className={"text-2xl font-semibold tracking-wide mb-3"}>{title}</p>
                <p className={"text-sm text-textGrey tracking-wide mb-3"}>{description}</p>
            </div>
            <Spacer className={"block h-10"} />
            {results && results.map((elem, idx) => {
                const {onClick, name} = elem;
                return (
                    <Fragment key={idx}>
                        <div onClick={onClick} className={"w-full mx-auto cursor-pointer"}>
                            <div className={"mb-1 pt-4 flex flex-row items-center justify-center"}>
                                <div className={"flex flex-row w-full justify-between border-b border-textGrey border-opacity-20 pb-4"}>
                                    <div className={"uppercase text-sm"}>
                                        <p>{name}</p>
                                    </div>
                                    <div>
                                        <ChevronForward size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                )
            })}
        </div>
    )
}

export default Page

