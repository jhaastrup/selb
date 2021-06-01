import React, { useState, Fragment, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router"
import cx from "classnames";
import {Button} from "app/components/forms";
import {ArrowLeft} from "app/components/icons";

const Page = (props) => {
    const router = useRouter()
    const {children, pageTitle = "", pathname, query} = props

    return (
        <Fragment>
            <Head>
                <title>Sendbox - {pageTitle || "Web App"}</title>
            </Head>
            <div className={"relative min-h-screen w-full bg-white"}>
                <div className={"text-black bg-white z-50 h-14 flex items-center flex-row inset-0 sticky shadow overflow-hidden"}>
                    <div className={"h-full items-center flex justify-center pl-3"}>                        
                        <Button
                            className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                            onClick={() => router.push("/account")}
                        >
                            <ArrowLeft size={20} color={"rgba(6,15,33, 1)"}/>
                        </Button>
                    </div>
                    <div className={"flex overflow-auto"}>
                        <div
                            onClick={() => router.push("/account/activities/transfers")} 
                            className={"mr-4 ml-1 cursor-pointer"}>
                            <p className={`font-semibold ${pathname === "/account/activities/transfers" ? "text-black" : "text-textGrey"}`}>
                                {"Transfers"}
                            </p>
                        </div>
                        <div
                            onClick={() => router.push("/account/activities/purchases")}
                            className={"mr-4 cursor-pointer"}
                        >
                            <p className={`font-semibold ${pathname === "/account/activities/purchases" ? "text-black" : "text-textGrey"}`}>
                                {"Purchases"}
                            </p>
                        </div>
                        <div 
                            onClick={() => router.push("/account/activities/topups")} 
                            className={"mr-4 cursor-pointer"}
                        >
                            <p className={`font-semibold ${pathname === "/account/activities/topups" ? "text-black" : "text-textGrey"}`}>
                                {"Topups"}
                            </p>
                        </div>
                        <div 
                            onClick={() => router.push("/account/activities/withdrawals")} 
                            className={"mr-4 cursor-pointer"}
                        >
                            <p className={`font-semibold ${pathname === "/account/activities/withdrawals" ? "text-black" : "text-textGrey"}`}>
                                {"Withdrawals"}
                            </p>
                        </div>
                        <div 
                            onClick={() => router.push("/account/activities/requests")} 
                            className={"mr-4 pr-4 cursor-pointer"}
                        >
                            <p className={`font-semibold ${pathname === "/account/activities/requests" ? "text-black" : "text-textGrey"}`}>
                                {"Requests"}
                            </p>
                        </div>
                    </div>
                </div>
                <main className={"z-0 relative min-h-screen overflowY-scroll"}>
                    <div>
                        {children}
                    </div>
                </main>
            </div>
        </Fragment>
    )
}

export default Page;