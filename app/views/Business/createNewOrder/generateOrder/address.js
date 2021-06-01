import * as React from "react";
import cx from "classnames";
import _ from "lodash";
import {ChevronForward} from "app/components/icons";
import {formatPhone, formatString} from "app/lib/formatters";

const Page = ({onItemSelected, dependencies}) => {

    return (
        <div className={"max-w-3xl px-2 mx-auto"}>
            {dependencies.addresses.map((opt, idx) => {
                const { name, email, phone, street, city, state, country, post_code, lat, lng, pk } = opt;
                const titleText = _.compact([street || '', city || '']).join(', ');
                const subText = _.compact([name || '', formatPhone(phone, 'NATIONAL') || '']).join(
                    ' \u2022 ',
                );
                const payload = {
                    name,
                    email,
                    phone,
                    street,
                    city,
                    state,
                    country: country?.code,
                    post_code,
                    lat,
                    lng,
                    pk,
                };
                return(
                    <div 
                        key={idx}
                        onClick={() => onItemSelected(opt)}
                        className={"grid py-3 cursor-pointer grid-cols-4 border border-r-0 border-l-0 border-t-0 border-backgroundGrey"}
                        >
                        <div className={"col-span-3"}>
                            <p className={"text-black text-xs md:text-sm font-bold"}>{titleText}</p>
                            <p className={"text-xs text-black opacity-70"}>{subText}</p>
                        </div>
                        <div className={"col-span-1 flex-col justify-center flex items-end"}>
                            <ChevronForward />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Page;