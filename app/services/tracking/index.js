import React, { useState, useRef, Fragment, useCallback, useEffect } from 'react';
import _ from 'lodash';
import Loading from "app/components/loading"
import {useRouter} from "next/router";


import Wizard from "app/services/pagewizard";
import Form from './form';
import Detail from './detail';

const Page = ({query={}}) => {
    const router = useRouter();
    const open = true;
    const {code} = query;
    const onCancel = () => {
        // router.push("/");
        window.history.back()
    };

    const pages = [
        {name: "default", page: Form},
        {name: "detail", page: Detail},
    ];

    return (
        <Wizard 
            open={open}
            onClose={onCancel}
            pageClose={onCancel}
            initialData={{code}}
            pages={pages}
        />
    )
}

export default Page;