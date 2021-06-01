import React, { useState, useCallback, useEffect, Fragment, useRef } from 'react';
import { formatPhone, formatString } from 'app/lib/formatters';
import _ from 'lodash';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { Formik } from 'formik';
import { SENDBOX_USERS } from './modules/queries';
import { useDebounce } from 'app/lib/hooks';
import {InputField, TextAreaField, Button, ChoiceField} from "app/components/forms";
import ActivityIndicator from "app/components/activityIndicator";
import { Spacer } from "app/components/assets";
import {CloseIcon, SearchIcon} from "app/components/icons"


const Page = ({onItemSelected}) => {
    const inputRef= useRef()
    const [contacts, setContacts] = useState([]);
    const [permitted, setPermitted] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearchInput = useDebounce(searchInput.user, 100);
    // const [filteredContacts, setFilteredContacts] = useState(contacts);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const searchKeys = ['name', 'value', 'raw'];

    const [getUsernames, { data, loading: searchLoading }] = useLazyQuery(SENDBOX_USERS, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
        onCompleted: ({ getUsernames: resp }) => {
            console.log('done fetching', { data });
            const { results } = resp;
            const payload = results.map((item) => ({
                name: item.user?.name || item.username,
                value: item.value,
                id: item.pk,
                type: 'user',
            }));
            console.log('users in payload ===>', { payload });
            setFilteredUsers(payload);
        },
        onError: (errors) => {},
    });

    useEffect(() => {
        if (debouncedSearchInput) {
            getUsernames({
                variables: {
                    filter_by: {
                        value: {
                            op: '$contains',
                            value: debouncedSearchInput,
                        },
                    },
                    page_by: {
                        per_page: '6',
                    },
                },
            });
        } else {
            setFilteredUsers([]);
        }
    }, [debouncedSearchInput, getUsernames, setFilteredUsers]);

    const handleOnchange = (e) => {
        setSearchInput((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
        
    }

    const clearText = () => {
        inputRef.current.value = ""
        setSearchInput('')
    }

    console.log({searchInput});

    return (
        <Fragment>
            <div className={"relative flex w-full flex-wrap items-stretch"}>
                <span className={"z-10 h-full leading-snug font-normal absolute text-center bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3"}>
                    <SearchIcon />
                </span>
                <input
                    ref={inputRef}
                    type={"text"}
                    name={"user"}
                    onChange={handleOnchange}
                    placeholder={"Search by name, email or phone"}
                    className={`appearance-none relative block w-full px-2 py-3 pl-12 border-0 border-b border-transluscent-grey placeholder-transluscent-textGrey text-black outline-none focus:outline-none focus:ring-0 focus:border-primary md:text-sm`}
                />
                {searchInput && (
                    <span 
                        onClick={() => clearText()}
                        className={"z-10 h-full leading-snug font-normal absolute text-center bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3 cursor-pointer"}>
                        <CloseIcon />
                    </span>
                )}
            </div>
            <Spacer className={"block h-10"} />
            {searchLoading && (
                <div className={"h-screen"}>
                    <div className={"flex h-1/2 justify-center items-center"}>
                        <ActivityIndicator />
                    </div>
                </div>
            )}
            {!searchLoading && filteredUsers.length > 0 && (
                <Fragment>
                    <Spacer className={"block h-2"} />
                    <div>
                        <p className={"font-medium text-sm uppercase tracking-wider"}>{"People on Sendbox"}</p>
                        <Spacer className={"block h-2"} />
                        {filteredUsers.map((opt, idx) => {
                            const { name, value, type} = opt;
                            const firstLetter = name.charAt(0);
                            const titleText = name;
                            const subText = _.compact([value || "" || ""]).join(' \u2022 ');
                            const payload = {
                                name,
                                value
                            }

                            return (
                                <Fragment key={idx}>
                                    <div
                                        onClick={() => onItemSelected && onItemSelected(payload)}
                                        className={"flex justify-between py-3 border-b border-textGrey border-opacity-10 cursor-pointer"}
                                    >
                                        <div className={"flex"}>
                                            <div className={"flex justify-center items-center"}>
                                                <div className={"flex justify-center items-center w-1/2 h-1/2 uppercase text-xl font-semibold bg-transluscent-primary p-6 rounded-full "}>
                                                    <p>{firstLetter}</p>
                                                </div>
                                            </div>
                                            <Spacer className={"block w-4"} />
                                            <div className={"flex flex-col justify-center items-start"}>
                                                <p className={"capitalize text-sm tracking-wider mb-1"}>{`${titleText}`}</p>
                                                <p className={"text-xs text-textGrey tracking-wider"}>{`${subText}`}</p>    
                                            </div>
                                        </div>
                                    </div>
                                    {/* <Spacer className={"block h-2"} /> */}
                                </Fragment>
                            )
                        })}
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Page;