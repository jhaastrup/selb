import React, { useState, Fragment, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import cx from "classnames";
import BusinessIcon from 'public/images/tabs/disabled/business.svg';
import HomeIcon from 'public/images/tabs/disabled/home.svg';
import PaymentIcon from 'public/images/tabs/disabled/payments.svg';
import SupportIcon from 'public/images/tabs/disabled/messages.svg';
import SettingsIcon from 'public/images/tabs/disabled/security.svg';
import {ArrowLeft} from "app/components/icons";
import {Button} from "app/components/forms";


const Page = (props) => {
    
    const { children, pageTitle = "", back, pathname, query, frameMaxWidth, framePadding, hideHeader, isDynamic=false, homePageURL = "/" } = props;
    return (
        <Fragment>
            <Head>
                <title>Sendbox - {pageTitle || "Web App"}</title>
            </Head>
            <div className={"relative min-h-screen w-full bg-white"}>
               {isDynamic ? (
                <div className={"text-black h-12 p-2 text-xs z-50 bg-white w-full md:hidden flex justify-between items-center font-semibold inset-0 sticky shadow"}>
                    <div className={"h-full items-center flex justify-center"}>                        <Button
                                className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                                onClick={() => back()}
                            >
                                <ArrowLeft size={20} color={"rgba(6,15,33, 1)"}/>
                            </Button>
                    </div>
                    <Link href={"/logout"} passHref={true}>
                        <div className={"cursor-pointer p-2 flex flex-col items-center w-20 bg-primary text-xs text-white font-semibold rounded"}>
                            <a>Logout</a>
                        </div>
                    </Link>
                </div>
               ):(
                <div className={"text-black h-12 p-2 text-xs z-50 bg-white w-full md:hidden flex justify-between items-center font-semibold inset-0 sticky shadow"}>
                    <div className={"h-full items-center flex justify-center"}>
                        <img className={"h-2/3 w-28"} src="/images/sendbox-logo.svg" alt="Sendbox Logo"/>
                    </div>
                    <Link href={"/business"} passHref={true}>
                        <div className={`cursor-pointer flex flex-col items-center py-2 px-4 xl:mr-20 hover:bg-transluscent-primary hover:text-primary ${cx({
                            "text-primary": pathname === "/business"
                            })}`}>
                            <a>Business</a>
                        </div>
                                
                    </Link>
                    <Link href={"/business/products"} passHref={true}>
                        <div className={`cursor-pointer flex flex-col items-center py-2 px-4 xl:mr-20 hover:bg-transluscent-primary hover:text-primary ${cx({
                            "text-primary": pathname === "/business/products"
                            })}`}>
                            <a>Products</a>
                        </div>
                        
                    </Link>
                    <Link href={"/business/orders"} passHref={true}>
                        <div className={`cursor-pointer flex flex-col items-center py-2 px-4 xl:mr-20 hover:bg-transluscent-primary hover:text-primary ${cx({
                            "text-primary":pathname === "/business/orders"
                            })}`}>
                            <a>Orders</a>
                        </div>
                        
                    </Link>
                    <Link href={"/logout"} passHref={true}>
                        <div className={"cursor-pointer p-2 flex flex-col items-center w-20 bg-primary text-xs text-white font-semibold rounded"}>
                            <a>Logout</a>
                        </div>
                    </Link>
                </div>
               )}
                <div className={"text-black bg-white z-50 h-16 hidden md:flex items-center flex-col inset-0 sticky shadow"}>
                    
                    <div className={"bg-white h-full w-full  grid grid-cols-6"}>
                        <div className={"items-center col-span-1 flex justify-center"}>
                            <img className={"h-2/3 w-20"} src="/images/sendbox-logo.svg" alt="Sendbox Logo"/>
                        </div>
                        
                        <nav className="flex col-span-4 h-16 items-center  font-semibold justify-items-center justify-between text-xs text-black md:text-sm capitalize">
                            <Link href={"/"} passHref={true}>
                                <div className={`mr-4 cursor-pointer flex flex-col items-center py-2 px-4 xl:mr-20 hover:bg-transluscent-primary hover:text-primary ${cx({
                                    "bg-transluscent-primary": pathname === "/",
                                    "text-primary": pathname === "/"
                                    })}`}>
                                    <div className={"w-6"}><HomeIcon /></div>
                                    <a>Home</a>
                                </div>
                                
                            </Link>
                            <Link href={"/account"} passHref={true}>
                                <div className={`mr-4 cursor-pointer flex flex-col py-2 px-4 items-center xl:mr-20 hover:bg-transluscent-primary hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/account",
                                "text-primary": pathname === "/account"
                                })}`}>
                                <div  className={"w-8"}><PaymentIcon /></div>
                                <a>Payments</a>
                            </div>
                            </Link>
                            <Link  href={"/business"} passHref={true}>
                                <div className={`mr-4 cursor-pointer flex flex-col items-center py-2 px-4 xl:mr-20 hover:bg-transluscent-primary  hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/business",
                                "text-primary": pathname === "/business"
                                })}`}>
                                <div  className={"w-8"}><BusinessIcon /></div>
                                <a>Business</a>
                            </div>
                            </Link>
                            <Link  href={"/support"} passHref={true}>
                                <div className={`mr-4 cursor-pointer flex flex-col items-center py-2 px-4 xl:mr-20 hover:bg-transluscent-primary  hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/support",
                                "text-primary": pathname === "/support"
                                })}`}>
                                <div  className={"w-8"}><SupportIcon /></div>
                                <a>Support</a>
                            </div>
                            </Link>
                            <Link  href={"/settings"} passHref={true}>
                                <div className={`cursor-pointer mr-4 xl:mr-20 flex flex-col items-center py-2 px-4  hover:text-primary hover:bg-transluscent-primary ${cx({
                                "bg-transluscent-primary": pathname === "/settings",
                                "text-primary": pathname === "/settings"
                                })}`}>
                                <div  className={"w-8"}><SettingsIcon /></div>
                                <a>Settings</a>
                            </div>
                            </Link>
                        </nav>
                        <div className={"col-span-1 flex items-center justify-center"}>
                            <Link href={"/logout"} passHref={true}>
                                <div className={"cursor-pointer  p-2 flex flex-col items-center w-20 bg-primary text-xs text-white font-semibold rounded"}>
                                    <a>Logout</a>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                
                <main className={"z-0 relative min-h-screen overflowY-scroll"}>
                    <div>
                        {children}
                    </div>
                </main>
                <div className={"text-black inset-0  md:hidden h-12 flex items-center flex-col sticky shadow"}>
                    <div className={"bg-white h-full w-full flex flex-col items-center"}>
                        <nav className="flex  w-full justify-between h-full items-center font-semibold p-2 text-xs text-black md:text-sm capitalize">
                            <Link href={"/"} passHref={true}>
                                <div className={`cursor-pointer flex flex-col items-center p-2 hover:bg-transluscent-primary hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/",
                                "text-primary": pathname === "/"
                                })}`}>
                                    <div className={"w-6"}><HomeIcon /></div>
                                    <a>Home</a>
                                </div>
                            </Link>
                            <Link href={"/account"} passHref={true}>
                                <div className={`p-2 cursor-pointer flex flex-col items-center hover:bg-transluscent-primary hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/account",
                                "text-primary": pathname === "/account"
                                })}`}>
                                    <div  className={"w-6"}><PaymentIcon /></div>
                                    <a>Payments</a>
                                </div>
                            </Link>
                            <Link  href={"/business"} passHref={true}>
                                <div className={`cursor-pointer flex flex-col items-center p-2 hover:bg-transluscent-primary  hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/business",
                                "text-primary": pathname === "/business"
                                })}`}>
                                    <div  className={"w-6"}><BusinessIcon /></div>
                                    <a>Business</a>
                                </div>
                            </Link>
                            <Link  href={"/support"} passHref={true}>
                                <div className={`cursor-pointer flex flex-col items-center hover:bg-transluscent-primary p-2 hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/support",
                                "text-primary": pathname === "/support"
                                })}`}>
                                    <div  className={"w-6"}><SupportIcon /></div>
                                    <a>Support</a>
                                </div>
                            </Link>
                            <Link  href={"/settings"} passHref={true}>
                                <div className={`cursor-pointer flex flex-col items-center hover:bg-transluscent-primary p-2 hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/settings",
                                "text-primary": pathname === "/settings"
                                })}`}>
                                    <div  className={"w-6"}><SettingsIcon /></div>
                                    <a>Settings</a>
                                </div>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Page;