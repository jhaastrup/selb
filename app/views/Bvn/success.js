import * as React from "react";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";
import {CheckCircleIcon} from "app/components/icons"

const Page = ({onClose}) => {
    const [counter, setCounter] = React.useState(10);

    // React.useEffect(() => {
    //     const timer =
    //     counter > 0 &&
    //     setInterval(() => {
    //         if (counter === 1) {
    //             // onClose && onClose();
    //             window.history.back()
    //         }
    //         setCounter(counter - 1);
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, [counter, onClose]);

    const close = () => {
        onClose && onClose();
        // onRefresh && onRefresh();
    }

    return(
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-24"} />
            <div className={"flex justify-center items-center"}>
                <CheckCircleIcon color={"rgba(0,190,0,1)"} size={80} />
            </div>
            <Spacer className={"block h-14"} />
            <div className={"flex flex-col justify-center items-center"}>
                <p className={"text-lg text-center font-semibold tracking-wider"}>{"Bvn Verified Successfully"}</p>
                <Spacer className={"block h-2"} />
                {/* <p className={"text-textGrey text-center tracking-wide"}>{'Your recipient will get notified shortly.'}</p> */}
            </div>
            <Spacer className={"block h-20"} />
            <div className={"flex justify-center items-center"}>
                <Button
                    type={"button"}
                    onClick={() => close()}
                    uclasses={"rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8"}
                >
                    {"Done"}
                </Button>
            </div>
        </div>
    )

}

export default Page;