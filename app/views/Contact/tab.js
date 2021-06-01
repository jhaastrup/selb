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
                {/* <div className={"text-black bg-white z-50 h-14 flex items-center flex-row inset-0 sticky shadow overflow-hidden"}>
                    <div className={"h-full items-center flex justify-center pl-3"}>                        
                        <Button
                            className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft size={20} color={"rgba(6,15,33, 1)"}/>
                        </Button>
                    </div>
                </div> */}
                <main className={"z-0 relative overflowY-scroll"}>
                    <div>
                        {children}
                    </div>
                </main>
            </div>
        </Fragment>
    )
}

export default Page;