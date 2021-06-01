import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useLazyQuery} from "@apollo/client";
import {DISCOVERY_CONNECTED_STORES} from "../modules/queries";
import Loading from "app/components/loading"
import { Spacer } from "app/components/assets";
import { Button } from "app/components/forms";
import {AlertIcon} from "app/components/icons";


const Page = ({onChangePage, pageData, updatePageData}) => {
    const url = pageData.url.trim();
    const store_url = pageData.store_url.trim();
   
   

    return(
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-20"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-3"}>{'STORE SETTINGS'}</p>
                <p className={"text-2xl font-semibold mb-3"}>{'Sync orders and products for this store'}</p>
                {/* <p className={"text-sm text-textGrey tracking-wide mb-3"}>{'Sendbox will connect via this link to your store.'}</p> */}
            </div>
            <Spacer className={"block h-10"} />
        </div>
    )
}

export default Page;