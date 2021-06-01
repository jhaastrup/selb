import * as React from "react";
import {CheckCircleIcon} from "app/components/icons";
const Page = () => {
    
    return(
        <div className={"max-w-3xl p-2  md:p-0 mx-auto"}>
            <div className={"my-4 "}>
                    <div className={"flex item-center py-2 justify-center"}>
                        <CheckCircleIcon color={"rgba(0,190,0,1)"} size={40} />
                    </div>
                    <div className={"flex item-center py-2 justify-center"}>
                        <p className={"text-black text-base md:text-sm font-semibold"}>{"Thank You for your order!"}</p> 
                    </div>
                    <p className={"text-xs md:text-sm font-semibold text-center text-black"}>
                        {'A confirmation email and text message with additional information will be sent you shortly.'}
                    </p>
            </div>
        </div>
    )

}

export default Page;