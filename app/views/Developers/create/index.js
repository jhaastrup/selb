import React from 'react';
import { useQuery } from '@apollo/client';
import _ from 'lodash';
import { useRouter } from "next/router";
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";

import Wizard from "app/services/pagewizard";
import Start from "./form";
import Success from "./success";
import Failed from "./error";

const Page = ({open, isModal=false, onClose, onRefresh}) => {
    const router = useRouter();

    const onCancel = () => {
        router.push("/developers");
    };

    const pages = [
        {name: "default", page: Start},
        {name: "success", page: Success},
        {name: "error", page: Failed},
    ];

    // console.log("FROM INDEX!!!",{onRefresh})

    return (
        <Wizard 
            open={open}
            onClose={onClose}
            pageClose={onClose}
            isModal={isModal}
            pages={pages}
            onRefresh={onRefresh}
        />
    )
}

export default Page;