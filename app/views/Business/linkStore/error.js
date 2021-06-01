import * as React from "react";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";
import {AlertIcon} from "app/components/icons"

const Page = ({onClose, onResetPage}) => {
    const [counter, setCounter] = React.useState(10);

    // React.useEffect(() => {
    //     const timer =
    //     counter > 0 &&
    //     setInterval(() => {
    //         if (counter === 1) {
    //             onClose && onClose();
    //         }
    //         setCounter(counter - 1);
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, [counter, onClose]);

    return(
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-24"} />
            <div className={"flex justify-center items-center"}>
                <AlertIcon color={"rgba(237, 47, 89, 1)"} size={80} />
            </div>
            <Spacer className={"block h-14"} />
            <div className={"flex flex-col justify-center items-center"}>
                <p className={"text-lg text-center font-semibold tracking-wider"}>{'Connection error!'}</p>
                <Spacer className={"block h-2"} />
                <p className={"text-textGrey text-center tracking-wide"}>{'Try connecting your store again shortly.'}</p>
            </div>
            <Spacer className={"block h-20"} />
            <div className={"flex justify-center items-center"}>
                <Button
                    type={"button"}
                    onClick={() => onResetPage && onResetPage()}
                    uclasses={"rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8"}
                >
                    {"Try Again"}
                </Button>
            </div>
            <Spacer className={"block h-20"} />
            <div className={"flex justify-center items-center"}>
                <Button
                    type={"button"}
                    onClick={() => onClose && onClose()}
                    uclasses={"bg-primary border-primary rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8"}
                >
                    {"Done"}
                </Button>
            </div>
        </div>
    )

}

export default Page;