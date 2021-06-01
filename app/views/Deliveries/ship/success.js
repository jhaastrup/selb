import * as React from "react";
import {CheckCircleIcon} from "app/components/icons"
const Page = () => {
    
    return(
        <div className={"max-w-3xl p-2  md:p-0 mx-auto"}>
            <div className={"my-4 "}>
                    <div className={"flex item-center py-2 justify-center"}>
                        <CheckCircleIcon color={"rgba(0,190,0,1)"} size={40} />
                    </div>
                    {/* <div className={"flex item-center py-2 justify-center"}>
                        <p className={"text-black text-base md:text-sm font-semibold"}>{"Thank You!"}</p> 
                    </div> */}
                    <p className={"text-xs md:text-sm text-center font-semibold text-black"}>{
                        'Shipment Booked Sucessfully'
                    }</p>
            </div>
        </div>
    )

}

export default Page;