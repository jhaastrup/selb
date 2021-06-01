import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import { Spacer } from "app/components/assets";
import {ChevronForward} from "app/components/icons"

const Page = ({onChangePage, pageData, updatePageData, setState }) => {
    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);

    return(
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-3"}>{'CONNECT YOUR E-COMMERCE STORE'}</p>
                <p className={"text-2xl font-semibold tracking-wide mb-3"}>{'Which store would you like to connect with?'}</p>
            </div>
            <Spacer className={"block h-10"} />
            <div className={"pt-4 pb-2 border-b border-textGrey border-opacity-10"}></div>
            <div 
                onClick={() => onChangePage("url", { channelName: 'shopify' })} 
                className={"w-full mx-auto cursor-pointer"}
            >
                <div className={"mb-1 pt-4 flex flex-row items-center justify-center"}>
                    <div className={"flex flex-row w-full justify-between border-b border-textGrey border-opacity-10 pb-4"}>
                        <div className={"uppercase text-sm"}>
                            <p>{"Shopify"}</p>
                        </div>
                        <div>
                            <ChevronForward size={20} />
                        </div>
                    </div>
                </div>
            </div>
            <div 
                onClick={() => onChangePage("url", { channelName: 'woocommerce' })} 
                className={"w-full mx-auto cursor-pointer"}
            >
                <div className={"mb-1 pt-4 flex flex-row items-center justify-center"}>
                    <div className={"flex flex-row w-full justify-between border-b border-textGrey border-opacity-10 pb-4"}>
                        <div className={"uppercase text-sm"}>
                            <p>{"Woocommerce"}</p>
                        </div>
                        <div>
                            <ChevronForward size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <div>  
        //     <div style={{margin: "1rem auto", width: "50%"}}>
                
        //         <p>{"Connect a store type"}</p>
               
        //         <div>
                   
                       
        //             <div  onClick={() => onChangePage("url", { channelName: 'shopify' })} style={{backgroundColor: "#ccc", border: "1px solid black"}}>
        //                 <p>{"SHOPIFY"}</p>

        //             </div>
        //             <div onClick={() => onChangePage("url", { channelName: 'woocommerce' })} style={{backgroundColor: "#ccc", border: "1px solid black"}}>
        //                 <p>{"WOOCOMMERCE"}</p>

        //             </div>
                    
        //         </div>
        //     </div>
        // </div>
    )
}

export default Page;