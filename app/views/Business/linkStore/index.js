import * as React from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from '@apollo/client';
import { DELIVERY_DEPENDENCIES } from '../modules/queries';

import Wizard from "app/services/pagewizard";
import URL from './url';
import Validate from './validate';
import Success from './success';
import Error from './error';
import Channel from './channel';
import Sync from './sync';


const pages = [
    {name: "default", page: Channel},
    {name: "url", page: URL},
    {name: "validate", page: Validate},
    {name: "sync", page: Sync},
    {name: "success", page: Success},
    {name: "error", page: Error},

]
const Page = () => {
    const router = useRouter();

    const onClose = () => {
        router.push("/settings");
    }


    return( 
        <Wizard
            open={true}
            onClose={onClose}
            title={"Connect Store"}
            pageClose={onClose}
            pages={pages}
        />
    )
}
export default Page;