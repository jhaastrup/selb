import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import metadata from "./metadata";
import {ChevronForward} from "app/components/icons"

const Page = ({onChangePage, setState, dependencies}) => {
    const pageKey = 'channel';
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const nextPage = 'reference';

    const { results: resp } = dependencies.getResolutionComplaintTypes;

    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);

    return(
        <div className={"max-w-3xl p-2 md:p-0 mx-auto"}>
            <div className={"my-4"}>
                    <p className={"text-red-500 text-sm font-semibold"}>{caption}</p> 
                    <p className={"text-black text-sm md:text-base font-bold"}>{title}</p>
                    <p className={"text-sm text-gray-400"}>{description}</p>
            </div>
           {resp.map((elem, idx) => {
               return(
                <div 
                    key={idx}
                    onClick={() => onChangePage(nextPage, {complaint:elem.pk})}
                    className={"grid py-3 grid-cols-4 cursor-pointer border border-r-0 border-l-0 border-t-0 border-gray-200"}
                >
                    <div className={"col-span-3"}>
                        <p className={"text-black text-sm font-bold"}>{formatString(`${elem?.name ?? ''}`, 'uppercase')}</p>
                        <p className={"text-sm text-gray-400"}>{`${
                            elem?.description ?? ''
                        }`}</p>
                    </div>
                    <div className={"col-span-1  flex-col justify-center flex items-end"}>
                        <ChevronForward />
                    </div>
                </div>
               
           )})}
        </div> 

    )
}

export default Page;