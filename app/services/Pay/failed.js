import * as React from "react";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";
import {AlertIcon} from "app/components/icons"

const Page = ({onFailure, onRestart, transData}) => {
    const { data: topData } = transData;
    const { message = 'Transaction failed', data } = topData || {};
    const { message: subMessage = '' } = data || {};

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-24"} />
            <div className={"flex justify-center items-center"}>
                <AlertIcon color={"rgba(237, 47, 89, 1)"} size={80} />
            </div>
            <Spacer className={"block h-14"} />
            <div className={"flex flex-col justify-center items-center"}>
                <p className={"text-lg text-center font-semibold tracking-wider"}>{`${message}`}</p>
                <Spacer className={"block h-2"} />
                <p className={"text-textGrey text-center tracking-wide"}>{`${subMessage}`}</p>
            </div>
            <Spacer className={"block h-20"} />
            <div className={"flex justify-center items-center"}>
                <Button
                    type={"button"}
                    onClick={() => onRestart && onRestart()}
                    uclasses={"rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8"}
                >
                    {"Retry"}
                </Button>
            </div>
        </div>
        // <>
        //     <div style={{padding: "1rem 0rem", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center"}}>
        //         <p>{message}</p>
        //         <p>{subMessage}</p>
        //     </div>
        //     <div style={{height:"1rem"}}></div>
        //     <div>
        //         <button
        //             onClick={() => onRestart && onRestart()}
        //             type={"button"}
        //             style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px", width: "100%"}}
        //         >
        //             {"TRY AGAIN"}
        //         </button>
        //     </div>
        // </>
    )
}

export default Page;