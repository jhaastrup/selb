import React from 'react';
import {useRouter} from "next/router";
import {useQuery, useMutation} from "@apollo/client";
import _ from "lodash";
import Loading from "app/components/loading"

import Wizard from "app/services/pagewizard";
import Card from './form';
import Success from './success';

const pages = [
    {name: "default", page: Card},
    {name: "success", page: Success},
];

const Page = ({onClose, onRefresh}) => {

    return (
        <Wizard 
            onClose={onClose}
            pageClose={onClose}
            pages={pages}
            onRefresh={onRefresh}
        />
    );
};

export default Page;

