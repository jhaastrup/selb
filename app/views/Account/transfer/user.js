import React, { useEffect } from 'react';
import _ from 'lodash';
import ContactPlugin from 'app/services/contacts';
import { Spacer } from "app/components/assets";



const Page = ({ onChangePage, setState }) => {
    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    const onItemSelected = (item) => {
        console.log({ item });
        onChangePage('review', { contact: item });
    };


    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-10"} />
            <ContactPlugin onItemSelected={onItemSelected} />
        </div>
    )
}

export default Page