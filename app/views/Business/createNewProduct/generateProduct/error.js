import * as React from "react";
import {Button, RadioButton} from "app/components/forms";
import {useRouter} from "next/router";
import {CloseIcon} from "app/components/icons"

const Page = () => {
    const router = useRouter();
    return(
        <div className={"max-w-3xl p-2  md:p-0 mx-auto"}>
            <div className={"my-4 "}>
                    <div className={"flex item-center py-2 justify-center"}>
                        <CloseIcon color={"rgba(217,48,37,1)"} size={40} />
                    </div>
                    <div className={"flex item-center py-2 justify-center"}>
                        <p className={"text-black text-base md:text-sm font-semibold"}>{"Your product listing failed!"}</p>
                         
                    </div>
                    <Button
                        onClick={() => router.push('/business/create/product')}  
                        uclasses={"rounded-3xl w-full md:px-4 md:w-auto text-black border-0 focus:outline-none focus:border-opacity-0 outline-none px-2"}
                    >
                        {"CREATE ORDER"}
                    </Button>
            </div>
        </div>
    )

}

export default Page;