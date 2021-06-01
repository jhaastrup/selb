import * as React from "react";
import {useMutation, useQuery} from "@apollo/client";
import {GET_DELIVERY_QUOTE} from "../modules/queries";
import metadata from "./metadata";
import _ from "lodash";
import cx from "classnames";
import {RadioCheckedIcon, RadioUncheckedIcon} from "app/components/icons";
import {formatNumber, formatString, toNumber} from "app/lib/formatters";
import {Button} from "app/components/forms";
import Link from "next/link";


const Page = ({
    
    pageData = {},
    onChangePage,
    updatePageData,
    dependencies,
   setState
}) => {

    const nextPage = "review";
    const pageKey = 'insurance_option_code';
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const { [pageKey]: initialValue = undefined, quoteData = {}, items = [] } = pageData;
    const { dependencies: shippingOptions } = dependencies;
    const insuranceOption = initialValue
        ? shippingOptions.insurance_options.find((elem) => elem.code === initialValue)
        : undefined;

    const extendedInsuranceFee = formatNumber(quoteData?.extended_insurance_fee, '0,0.00');
    const shipmentValue = _.reduce(items, (p, c) => p + toNumber(c.value), 0);
    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "weight",
        }))
    }, []);

    return(
        <div className={"mx-auto px-4 mt-3 flex flex-col"}>
                <div className={"mt-4 mb-4"}>
                    <p className={"text-red-500 text-sm font-semibold"}>{caption}</p> 
                    <p className={"text-black text-sm md:text-base font-bold"}>{title}</p>
                    <p className={"text-sm text-gray-500"}>{description}</p>
                </div>
             {shippingOptions.insurance_options.map((opt, idx) => {
                const { name, code } = opt;
                const titleText = _.compact([name, '']).join(' ');
                const subText = code === 'extended' ? `\u20a6${extendedInsuranceFee}` : '\u20a60.00';
                const isSelected = initialValue === code;

                return(
                    <div 
                        key={idx}
                        onClick={() => updatePageData({[pageKey]:code})}
                        className={`grid mb-2 py-3 cursor-pointer px-1 grid-cols-4 border border-r-0 border-l-0 border-t-0 border-backgroundGrey ${cx({"bg-transluscent-primary": isSelected})}`}
                    >
                        <div className={"col-span-3"}>
                            <p className={"text-black text-xs md:text-sm font-bold"}> {formatString(`${titleText}`, 'uppercase')}</p>
                            <p className={"text-sm text-gray-500"}>{subText}</p>
                        </div>
                        <div className={"col-span-1  flex-col justify-center flex items-end"}>
                           {isSelected ? <RadioCheckedIcon color={"rgba(217,48,37,1)"} />: <RadioUncheckedIcon /> } 
                        </div>
                    </div>
                )
             })}

             {initialValue && insuranceOption && (
                <div className={"my-4"}>
                    <p className={"text-red-500 text-sm font-semibold"}>{formatString(`${insuranceOption?.name}`, 'uppercase')}</p> 

                    <div className={"flex justify-between my-4 py-2 border-b border-gray-100"}>
                        <p className={"text-gray-500 font-semibold uppercase text-xs"}>{"Packaged Value"}</p>
                        <p className={"text-black text-sm font-semibold"}>{`\u20a6${formatNumber(
                                    shipmentValue,
                                    '0,0.00',
                            )}`}</p>
                    </div>
                           
                    <div className={"flex justify-between my-4 border-b py-2 border-gray-100"}>
                        <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"Insurance Fee"}</p>
                        <p className={"text-black text-sm font-semibold"}>
                            {insuranceOption.code === 'extended' ? `\u20a6${extendedInsuranceFee}` : '0.00'}
                        </p>
                    </div>
                    <div className={"flex justify-between my-4 border-b py-2 border-gray-100"}>
                        <p className={"text-gray-500 uppercase font-semibold text-xs"}>{"Compensation"}</p>
                        <p className={"text-black text-sm font-semibold"}>
                            {`\u20a6${formatNumber(
                                insuranceOption.code === 'extended'
                                    ? _.min([shipmentValue, 200000])
                                    : _.min([shipmentValue, 10000]),
                                '0,0.00',
                            )}`}
                        </p>
                    </div>
                </div>
             )}
             <div className={"my-4"}>
                <p className={"text-sm"}>
                 <span>
                     {"To Learn about how the terms and conditions, eligibility and compensation process and structure of our insurance, please read our"}
                 </span>
                 <span>{" "}</span>
                 <Link href={"/legal"} passHref={true}>
                    <a className={"text-red-500 underline"}>Insurance Policy</a>
                 </Link>
                 {" "}
                 {"here."}
                 </p>
             </div>
            
            <div className={"w-full px-4 mx-auto md:relative flex-col flex items-end"}>

                <Button
                    disable={pageData[pageKey] ? 0 : 1}
                    onClick={() => onChangePage(nextPage)} 
                    // uclasses={"rounded-3xl w-full md:px-4  md:w-auto text-black border-0 focus:outline-none focus:border-opacity-0 outline-none px-2"}
                >
                    {"Continue"}
                </Button>
            </div>
        </div>

    )
}

export default Page;