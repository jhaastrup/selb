import React, { useState, Fragment, useCallback, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import useRouter from "next/router"
import { GET_PROFILE } from "./modules/queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import cx from "classnames";
import BusinessIcon from 'public/images/tabs/business.svg';
import HomeIcon from 'public/images/tabs/home.svg';
import PaymentIcon from 'public/images/tabs/payments.svg';
import SupportIcon from 'public/images/tabs/messages.svg';
import SettingsIcon from 'public/images/tabs/security.svg';
import ImportIcon from 'public/images/tabs/import.svg';
import DeliveryIcon from 'public/images/tabs/delivery.svg';
import ProductIcon from 'public/images/icons/dashboard/add-products.svg';
import OrderIcon from 'public/images/tabs/purchases.svg';
import QuoteIcon from "public/images/tabs/quote.svg"
import SecurityIcon from "public/images/tabs/security.svg"
import {Button} from "app/components/forms";
import {ArrowLeft, PersonIcon, CloseIcon, MenuIcon} from "app/components/icons";



const MenuPop = ({setShowMenu}) => {
    const ref = useRef();
    
    const polyHandleShow = useCallback((e) => {
        // if(ref.current?.contains(e.target))
        if(!ref.current || !ref.current?.contains(e.target) || ref.current?.contains(e.target)){
            return setShowMenu(false);
        }
    }, [setShowMenu]);

    const handleClose = () => {
        setShowMenu(false);
    }
    
    useEffect(() => {
        // add when mounted
        console.log("from useeffect",ref)
        document.addEventListener("mousedown", polyHandleShow);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown",polyHandleShow);
        };
    }, [polyHandleShow]);
    return(
        <div ref={ref}  className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-transluscent-black focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="py-1" role="none">
              <Link href={'#'} passHref={true}>
                <a className="block px-4 py-2 text-sm text-textGrey hover:bg-transluscent-grey" role="menuitem">View profile</a>
              </Link>
              <Link href={'/settings'} passHref={true}>
                <a className="block px-4 py-2 text-sm text-textGrey hover:bg-transluscent-grey" role="menuitem">Settings</a>
              </Link>
              <Link href={"#"} passHref={true}>
                <a className="block px-4 py-2 text-sm text-textGrey hover:bg-transluscent-grey" role="menuitem">Notifications</a>
              </Link>
            </div>
            
            <div className="py-1" role="none">
            <Link href="#">
              <a  className="block px-4 py-2 text-sm text-textGrey hover:bg-transluscent-grey" role="menuitem">Logout</a>

            </Link>
            </div>
          </div>
    )
}

const SmallScreenNav = ({setMobileMenu}) => {
  return (
        <div className="fixed inset-0 z-40 lg:hidden" aria-modal="true"  role="dialog" >
            <div className="fixed inset-0 bg-textGrey bg-opacity-75" aria-hidden="true" />
            <div className="relative min-h-screen flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-black">
              
              <div className="absolute top-0 z-50 right-0 -mr-12 pt-2">
                  <button onClick={() => setMobileMenu(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  </button>
              </div>
              <div className="flex-shrink-0 flex items-center px-4">
                  <img className="h-8 w-auto" src="/images/sendbox-logo.svg" alt="Sendbox Logo" />
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
              
              <nav className="px-3 mt-6">
          <div className="space-y-1">
            <Link href={"/"} passHref={true}>
              <div className="cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary">
                  <div className={"w-8 mr-2"}><HomeIcon /></div>
                  <a>Home</a>
              </div>
                    
              </Link>
            
            <Link href={"/account"} passHref={true}>
                  <div className="cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary">
                  <div  className={"w-8 mr-2"}><PaymentIcon /></div>
                  <a>Account</a>
                </div>
            </Link>
            
            <Link href={"#"} passHref={true}>
              <div className="cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary">
                  <div className={"w-8 mr-2"}>
                    <svg className="text-primary group-hover:text-gray-500 ml-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <a>Recent</a>
              </div>
                
            </Link>
          </div>
          <div className="mt-8">
            {/* Secondary navigation */}
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="teams-headline">
              Shipping
            </h3>
            <div className="mt-1 space-y-1" role="group" aria-labelledby="teams-headline">
              <Link href={"/deliveries"} passHref={true}>
                  <a className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue">
                    <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                    <span className="truncate">
                      Deliveries
                    </span>
                  </a>
                </Link>
                <Link href={"/deliveries/imports"} passHref={true}>
                  <a className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue">
                    <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                    <span className="truncate">
                      Imports
                    </span>
                  </a>
                </Link>
                <Link href={"/quote"} passHref={true}>
                  <a className="group flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue">
                    <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                    <span className="truncate">
                      Check Rates
                    </span>
                  </a>
                </Link>
            </div>
            
          </div>
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="teams-headline">
              Business
            </h3>
            <div className="mt-1 space-y-1" role="group" aria-labelledby="teams-headline">
              <Link href={"/business"} passHref={true}>
                  <a className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue">
                    <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                    <span className="truncate">
                      Business Page
                    </span>
                  </a>
                </Link>
                <Link href={"/business/products"} passHref={true}>
                  <a className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue">
                    <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                    <span className="truncate">
                      Products
                    </span>
                  </a>
                </Link>
                <Link href={"/business/orders"} passHref={true}>
                  <a className="group flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue">
                    <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                    <span className="truncate">
                      Orders
                    </span>
                  </a>
                </Link>
            </div> 
            <div className={"w-full bg-transluscent-grey h-px"}></div>
                <Link href={"/developers"} passHref={true}>
                    <div className="cursor-pointer my-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary">
                    <div  className={"w-8 mr-2"}><SecurityIcon /></div>
                    <a>Developers</a>
                    </div>
                </Link>
                <div className={"w-full bg-transluscent-grey h-px"}></div>
                <Link  href={"/support"} passHref={true}>
                    <div className="cursor-pointer mb-2 flex rounded p-2 items-center hover:bg-transluscent-darkBlue  hover:text-primary">
                    <div  className={"w-8 mr-2"}><SupportIcon /></div>
                    <a>Support</a>
                </div>
                </Link>
                <Link  href={"/settings"} passHref={true}>
                    <div className="cursor-pointer mb-2 rounded flex p-2 items-center  hover:text-primary hover:bg-transluscent-darkBlue">
                    <div  className={"w-8 mr-2"}><SettingsIcon /></div>
                    <a>Settings</a>
                </div>
                </Link>
          </div>
        </nav>
            </div>
          </div>
          <div className="flex-shrink-0 w-14 bg-black" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
  )
}

const Layout = ({pathname, children, user, isDynamic}) => {
    const [showMenu, setShowMenu] = React.useState(false);
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);

    return(
        <div className="h-screen w-full text-white lg:grid lg:grid-cols-5 flex overflow-hidden bg-white">
          
          
            {showMobileMenu && ( <SmallScreenNav setMobileMenu={setShowMobileMenu} />)}
            
        
  {/* Static sidebar for desktop */}
  <div className="hidden lg:flex lg:col-span-1 bg-black overflow-y-scroll lg:flex-shrink-0 w-full">
    <div className="flex flex-col  pt-5 pb-4 w-full">
      {/* <div className="flex items-center flex-shrink-0 px-6">
        <img className="h-8 w-auto" src="/images/sendbox-logo.svg" alt="Sendbox Logo" />
      </div> */}
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="h-0 flex-1 flex flex-col">
        <div className={"h-full items-center flex justify-center"}>
          <img className={"h-full w-20"} src="/images/sendbox-logo.svg" alt="Sendbox Logo"/>
        </div>
        {/* User account dropdown */}
        <div className="px-3 mt-6 relative inline-block text-left">
          
          <div>
            <button onClick={() => setShowMenu(true)} type="button" className="group w-full bg-transluscent-grey rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500" id="options-menu" aria-expanded="false" aria-haspopup="true">
              <span className="flex w-full justify-between items-center">
                <span className="flex min-w-0 items-center justify-between space-x-3">
                  {user?.photo ?  <img className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" src={photo} alt="profile-photo" /> :
                    <PersonIcon size={40} />
                  }
                  <span className="flex-1 flex flex-col min-w-0">
                    <span className="text-gray-900 text-sm font-medium truncate">{user?.name}</span>
                    {/* <span className="text-gray-500 text-sm truncate">@jessyschwarz</span> */}
                  </span>
                </span>
                {/* Heroicon name: solid/selector */}
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
          </div>
          {/*
      Dropdown menu, show/hide based on menu state.

      Entering: "transition ease-out duration-100"
        From: "transform opacity-0 scale-95"
        To: "transform opacity-100 scale-100"
      Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95"
    */}
          {showMenu && <MenuPop setShowMenu={setShowMenu} />}
        </div>
        {/* Sidebar Action Button */}
        <div className="px-3 mt-5">
          <div className="flex flex-col">
            <button type="button" className="inline-flex font-semibold items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm rounded-md text-white bg-primary hover:bg-transluscent-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xl:w-full">
              Book Delivery
            </button>
            
          </div>
        </div>
        {/* Navigation */}

        <nav className="px-3 mt-6">
                <div className="space-y-1">
                  <Link href={"/"} passHref={true}>
                    <div className={`cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                        "bg-transluscent-darkBlue": pathname === "/",
                        "text-primary": pathname === "/"
                        })}`}>
                        <div className={"w-8 mr-2"}><HomeIcon /></div>
                        <a>Home</a>
                    </div>
                          
                    </Link>
                  
                  <Link href={"/account"} passHref={true}>
                          <div className={`cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                          "bg-transluscent-darkBlue": pathname === "/account",
                          "text-primary": pathname === "/account"
                          })}`}>
                          <div  className={"w-8 mr-2"}><PaymentIcon /></div>
                          <a>Account</a>
                      </div>
                  </Link>
                  
                  <Link href={"#"} passHref={true}>
                    <div className={`cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                        "bg-transluscent-darkBlue": pathname === "/recent",
                        "text-primary": pathname === "/recent"
                        })}`}>
                        <div className={"w-8 mr-2"}>
                          <svg className="text-primary group-hover:text-gray-500 ml-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <a>Recent</a>
                    </div>
                      
                  </Link>
                </div>
                <div className="mt-8">
                  {/* Secondary navigation */}
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="teams-headline">
                    Shipping
                  </h3>
                  <div className="mt-1 space-y-1" role="group" aria-labelledby="teams-headline">
                    <Link href={"/deliveries"} passHref={true}>
                        <a className={`group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue ${cx({
                            "bg-transluscent-darkBlue": pathname === "/deliveries",
                            "text-primary": pathname === "/deliveries"
                            })}`}>
                          <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                          <span className="truncate">
                            Deliveries
                          </span>
                        </a>
                      </Link>
                      <Link href={"/deliveries/imports"} passHref={true}>
                        <a className={`group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue ${cx({
                            "bg-transluscent-darkBlue": pathname === "/deliveries/imports",
                            "text-primary": pathname === "/deliveries/imports"
                            })}`}>
                          <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                          <span className="truncate">
                            Imports
                          </span>
                        </a>
                      </Link>
                      <Link href={"/quote"} passHref={true}>
                        <a className={`group flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue ${cx({
                            "bg-transluscent-darkBlue": pathname === "quote",
                            "text-primary": pathname === "/quote"
                            })}`}>
                          <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                          <span className="truncate">
                            Check Rates
                          </span>
                        </a>
                      </Link>
                  </div>
                  
                </div>
                <div className="mt-8">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider" id="teams-headline">
                    Business
                  </h3>
                  <div className="mt-1 space-y-1" role="group" aria-labelledby="teams-headline">
                    <Link href={"/business"} passHref={true}>
                        <a className={`group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue ${cx({
                            "bg-transluscent-darkBlue": pathname === "/business",
                            "text-primary": pathname === "/business"
                            })}`}>
                          <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                          <span className="truncate">
                            Business Page
                          </span>
                        </a>
                      </Link>
                      <Link href={"/business/products"} passHref={true}>
                        <a className={`group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue ${cx({
                            "bg-transluscent-darkBlue": pathname === "/business/products",
                            "text-primary": pathname === "/business/products"
                            })}`}>
                          <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                          <span className="truncate">
                            Products
                          </span>
                        </a>
                      </Link>
                      <Link href={"/business/orders"} passHref={true}>
                        <a className={`group flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:text-primary hover:bg-transluscent-darkBlue ${cx({
                            "bg-transluscent-darkBlue": pathname === "/business/orders",
                            "text-primary": pathname === "/business/orders"
                            })}`}>
                          <span className="w-2.5 h-2.5 mr-4 bg-primary rounded-full"  aria-hidden="true" />
                          <span className="truncate">
                            Orders
                          </span>
                        </a>
                      </Link>
                  </div> 
                  <div className={"w-full bg-transluscent-grey h-px"}></div>
                      <Link href={"/developers"} passHref={true}>
                          <div className={`cursor-pointer my-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                          "bg-transluscent-darkBlue": pathname === "/developers",
                          "text-primary": pathname === "/developers"
                          })}`}>
                          <div  className={"w-8 mr-2"}><SecurityIcon /></div>
                          <a>Developers</a>
                          </div>
                      </Link>
                      <div className={"w-full bg-transluscent-grey h-px"}></div>
                      <Link  href={"/support"} passHref={true}>
                          <div className={`cursor-pointer mb-2 flex rounded p-2 items-center hover:bg-transluscent-darkBlue  hover:text-primary ${cx({
                          "bg-transluscent-darkBlue": pathname === "/support",
                          "text-primary": pathname === "/support"
                          })}`}>
                          <div  className={"w-8 mr-2"}><SupportIcon /></div>
                          <a>Support</a>
                      </div>
                      </Link>
                      <Link  href={"/settings"} passHref={true}>
                          <div className={`cursor-pointer mb-2 rounded flex p-2 items-center  hover:text-primary hover:bg-transluscent-darkBlue ${cx({
                          "bg-transluscent-darkBlue": pathname === "/settings",
                          "text-primary": pathname === "/settings"
                          })}`}>
                          <div  className={"w-8 mr-2"}><SettingsIcon /></div>
                          <a>Settings</a>
                      </div>
                      </Link>
                </div>
              </nav>
      </div>
    </div>
  </div>
  {/* Main column */}
  <div className="flex flex-col lg:col-span-4 w-full flex-1 overflow-hidden">
    {/* Search header */}
    <div className="relative flex-shrink-0  flex h-16 bg-black border-b border-gray-200 lg:hidden">
      {/* Sidebar toggle, controls the 'sidebarOpen' sidebar state. */}
      <button 
        onClick={() => setShowMobileMenu(true)}
        className="px-4 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden">
        <span className="sr-only">Open sidebar</span>
        
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </button>
      <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex" >
          {/* Space between profile and hambuger button */}
        </div>
        <div className="flex items-center">
          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button 
               onClick={() => setShowMenu(true)}
                type="button" 
                className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" id="user-menu" aria-expanded="false" aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                {/* <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixqx=6wVWSfVq5c&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt /> */}
                {user?.photo ?  <img className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" src={photo} alt="profile-photo" /> :
                    <PersonIcon color={"#cccccc"} size={40} />
                  }
              </button>
            </div>
            {/*
        Dropdown menu, show/hide based on menu state.

        Entering: "transition ease-out duration-100"
          From: "transform opacity-0 scale-95"
          To: "transform opacity-100 scale-100"
        Leaving: "transition ease-in duration-75"
          From: "transform opacity-100 scale-100"
          To: "transform opacity-0 scale-95"
      */}
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
              
              {showMenu && <MenuPop setShowMenu={setShowMenu} />}
            </div>
            
          </div>
        </div>
      </div>
    </div>
    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
      {isDynamic ? (
          <div className={"hidden text-black h-16 p-2 text-xs z-40 bg-white w-full lg:flex justify-between  items-center font-semibold inset-0 sticky shadow"}>
              <div className={"h-full items-center flex justify-center"}>                  
                  <Button
                      className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                      onClick={() => back()}
                  >
                      <ArrowLeft size={20} color={"rgba(6,15,33, 1)"}/>
                  </Button>
              </div>
          </div>
        ):( <div className={" hidden text-black h-16 p-2 text-xs z-50 bg-white w-full lg:flex justify-between items-center font-semibold inset-0 sticky shadow"}>

            
            
        </div>)}
      {children}
    </main>
  </div>
</div>

    )
}

// const SmallerScreenNav = ({setShowMobileMenu, pathname, showBusiness}) => {
//     const ref = useRef();
    
//     const polyHandleShow = useCallback((e) => {
//         console.log("reff from small", ref)
//         if(e.target.id === "mobileNav"){
//             return setShowMobileMenu(true);

//         }
        
//         if(!ref.current.contains(e.target)){
//             return setShowMobileMenu((prevState) => (!prevState));
//         }
//     }, [setShowMobileMenu]);

//     const handleClose = () => {
//         setShowMobileMenu(false);
//     }
    
//     useEffect(() => {
//         // add when mounted
//         console.log("from useeffect",ref)
//         document.addEventListener("mousedown", polyHandleShow);
//         // return function to be called when unmounted
//         return () => {
//             document.removeEventListener("mousedown",polyHandleShow);
//         };
//     }, [polyHandleShow]);
//     return (
//         <nav 
//             ref={ref}  
//             className="fixed transition duration-1000 ease-in-out h-screen z-50 left-0 bottom-0 right-0 top-0 p-0 m-0 w-full bg-black"
//         >
//             <div className="w-full flex justify-end items-center">
//                 <Button 
//                     onClick={handleClose}
//                     className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}

//                 ><CloseIcon size={40} color={"#ffffff"} /></Button>
//             </div>
//             <ul className="flex flex-col text-white font-semibold m-0 p-0 list-none">
//                 <li className="p-4  border-b border-transluscent-white w-full"><Link href={"/"} passHref={true}>Home</Link></li>
//                 <li className="p-4 border-b border-transluscent-white w-full"><Link href={"/deliveries"} passHref={true}><div className={"w-full"}>Shipments</div></Link></li>
//                 {showBusiness &&(
//                     <React.Fragment>
//                         <li className="p-4 border-b border-transluscent-white"><Link href={"/business/products"} passHref={true}><div className={"w-full"}>Products</div></Link></li>
//                         <li className="p-4 border-b border-transluscent-white"><Link href={"/business/orders"} passHref={true}><div className={"w-full"}>Orders</div></Link></li>
//                     </React.Fragment>
//                 )}
                
                
//                 <li className="p-4 border-b border-transluscent-white"><Link  href={"/deliveries/imports"} passHref={true}><div className={"w-full"}>Imports</div></Link></li>
//                 <li className="p-4 border-b border-transluscent-white"><Link  href={"/developers"} passHref={true}><div className={"w-full"}>Developers</div></Link></li>
//                 <li className="p-4 border-b border-transluscent-white">
//                     <Link  href={"/quote"} passHref={true}><div className={"w-full"}>Check Rates</div></Link>
//                 </li>
//                 <li className="p-4">
//                     <Link href={"/logout"} passHref={true}>
//                         <div className={"cursor-pointer p-2 flex flex-col items-center w-20 bg-primary text-xs text-white font-semibold rounded"}>
//                             <a>Logout</a>
//                         </div>
//                     </Link>
//                 </li>


//             </ul>
        
//         </nav>
//     )
// }

const LargeScreenNav = ({pathname, showBusiness}) => {
    return (
        <div className={"h-full m-6 text-white w-full flex flex-col"}>
            {/* <div className={"items-center px-4 col-span-1 flex"}>
                <img className={"h-full w-20"} src="/images/sendbox-logo.svg" alt="Sendbox Logo"/>
            </div> */}
                        
            <nav className="flex flex-col p-2  font-semibold text-xs md:text-sm capitalize">
                <Link href={"/"} passHref={true}>
                    <div className={`cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                        "bg-transluscent-darkBlue": pathname === "/",
                        "text-primary": pathname === "/"
                        })}`}>
                        <div className={"w-8 mr-2"}><HomeIcon /></div>
                        <a>Home</a>
                    </div>
                    
                </Link>
                <Link href={"/account"} passHref={true}>
                    <div className={`cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                    "bg-transluscent-darkBlue": pathname === "/account",
                    "text-primary": pathname === "/account"
                    })}`}>
                    <div  className={"w-8 mr-2"}><PaymentIcon /></div>
                    <a>Payments</a>
                </div>
                </Link>
                <Link href={"/deliveries"} passHref={true}>
                    <div className={`cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                    "bg-transluscent-darkBlue": pathname === "/deliveries",
                    "text-primary": pathname === "/deliveries"
                    })}`}>
                    <div  className={"w-8 mr-2"}><DeliveryIcon /></div>
                    <a>Shipments</a>
                    </div>
                </Link>
                <Link href={"/deliveries/imports"} passHref={true}>
                    <div className={`cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                    "bg-transluscent-darkBlue": pathname === "/deliveries/imports",
                    "text-primary": pathname === "/deliveries/imports"
                    })}`}>
                    <div  className={"w-8 mr-2"}><ImportIcon /></div>
                    <a>Imports</a>
                    </div>
                </Link>
                <Link  href={"/business"} passHref={true}>
                    <div className={`cursor-pointer mb-2 p-2 rounded items-center flex  hover:bg-transluscent-darkBlue  hover:text-primary ${cx({
                    "bg-transluscent-darkBlue": pathname === "/business",
                    "text-primary": pathname === "/business"
                    })}`}>
                    <div  className={"w-8 mr-2"}><BusinessIcon /></div>
                    <a>Business</a>
                </div>
                </Link>
                {showBusiness && (
                    <React.Fragment>
                        <Link href={"/business/products"} passHref={true}>
                            <div className={`cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                            "bg-transluscent-darkBlue": pathname === "/business/products",
                            "text-primary": pathname === "/business/products"
                            })}`}>
                            <div  className={"w-8 mr-2"}><ProductIcon /></div>
                            <a>Products</a>
                            </div>
                        </Link>
                        <Link href={"/business/orders"} passHref={true}>
                            <div className={`cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                            "bg-transluscent-darkBlue": pathname === "/business/orders",
                            "text-primary": pathname === "/business/orders"
                            })}`}>
                            <div  className={"w-8 mr-2"}><OrderIcon /></div>
                            <a>Orders</a>
                            </div>
                        </Link>
                    </React.Fragment>
                )}
                <Link href={"/quote"} passHref={true}>
                    <div className={`cursor-pointer mb-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                    "bg-transluscent-darkBlue": pathname === "/quote",
                    "text-primary": pathname === "/quote"
                    })}`}>
                    <div  className={"w-8 mr-2"}><QuoteIcon /></div>
                    <a>Check Rates</a>
                    </div>
                </Link>
                <div className={"w-full bg-transluscent-grey h-px"}></div>
                <Link href={"/developers"} passHref={true}>
                    <div className={`cursor-pointer my-2 p-2 rounded items-center flex hover:bg-transluscent-darkBlue hover:text-primary ${cx({
                    "bg-transluscent-darkBlue": pathname === "/developers",
                    "text-primary": pathname === "/developers"
                    })}`}>
                    <div  className={"w-8 mr-2"}><SecurityIcon /></div>
                    <a>Developers</a>
                    </div>
                </Link>
                <div className={"w-full bg-transluscent-grey h-px"}></div>
                <Link  href={"/support"} passHref={true}>
                    <div className={`cursor-pointer mb-2 flex rounded p-2 items-center hover:bg-transluscent-darkBlue  hover:text-primary ${cx({
                    "bg-transluscent-darkBlue": pathname === "/support",
                    "text-primary": pathname === "/support"
                    })}`}>
                    <div  className={"w-8 mr-2"}><SupportIcon /></div>
                    <a>Support</a>
                </div>
                </Link>
                <Link  href={"/settings"} passHref={true}>
                    <div className={`cursor-pointer mb-2 rounded flex p-2 items-center  hover:text-primary hover:bg-transluscent-darkBlue ${cx({
                    "bg-transluscent-darkBlue": pathname === "/settings",
                    "text-primary": pathname === "/settings"
                    })}`}>
                    <div  className={"w-8 mr-2"}><SettingsIcon /></div>
                    <a>Settings</a>
                </div>
                </Link>
                <div className={"ml-2 flex p-2 justify-start"}>
                    <Link href={"/logout"} passHref={true}>
                        <div className={"cursor-pointer p-2 flex flex-col items-center w-20 bg-primary text-xs text-white font-semibold rounded"}>
                            <a>Logout</a>
                        </div>
                    </Link>
                </div> 
            </nav>
        </div>
    )
}


const Page = (props) => {
   const [showBusiness, setShowBusiness] = useState(false);
    const [user, setUser] = useState();
    const {data} = useQuery(GET_PROFILE, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            const {me} = data;
            const user = {
              name: me.name,
              photo: me.photo,
            }
            setUser(user);
            const isBusiness = me && me.account_type?.code === 'business';
            setShowBusiness(isBusiness)
        }
    })
    // const {}
    const { children, pageTitle = "", isDynamic= false, back, pathname, query, frameMaxWidth, framePadding, hideHeader, homePageURL = "/" } = props;
    // console.log("FROM LAYOUT!!!!", {pageTitle, pathname})
    return (
        <Fragment>
            <Head>
                <title>Sendbox - {pageTitle || "Web App"}</title>
            </Head>
            <div className={"relative min-h-screen w-full"}>
                {/* {isDynamic ? (
                    <div className={"text-black h-12 p-2 text-xs z-40 bg-white w-full flex justify-between md:hidden items-center font-semibold inset-0 sticky shadow"}>
                        <div className={"h-full items-center flex justify-center"}>                  
                            <Button
                                className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                                onClick={() => back()}
                            >
                                <ArrowLeft size={20} color={"rgba(6,15,33, 1)"}/>
                            </Button>
                        </div>
                        <div className="items-center">
                            <Button 
                                id="mobileNav"
                                onClick={handleShow}
                                className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                            >
                                <MenuIcon size={30} color={"rgba(6,15,33, 1)"}/>
                            </Button>
                        </div>
                        {showMobileMenu ? (<SmallerScreenNav showBusiness={showBusiness} setShowMobileMenu={setShowMobileMenu}/>): null}
                    </div>
                ):( <div className={"text-black h-12 p-2 text-xs z-50 bg-white w-full md:hidden flex justify-between items-center font-semibold inset-0 sticky shadow"}>

                    <div className={"h-full items-center flex justify-center"}>
                        <img className={"h-2/3 w-20"} src="/images/sendbox-logo.svg" alt="Sendbox Logo"/>
                    </div>
                    <div className="items-center">
                        <Button 
                            id="mobileNav"
                            onClick={handleShow}
                            className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                        >
                            <MenuIcon size={30} color={"rgba(6,15,33, 1)"}/>
                        </Button>
                    </div>
                    {showMobileMenu ? (<SmallerScreenNav showBusiness={showBusiness} setShowMobileMenu={setShowMobileMenu}/>): null}         
                </div>)} */}
                   
                
                
                {/* <main className={"z-0 relative  md:grid md:fixed md:top-0 md:bottom-0 md:left-0 md:right-0 md:grid-cols-5 "}> */}
                  {/* <div className={"md:flex items-center flex-col shadow"}> */}
                    <Layout user={user} isDynamic={isDynamic} pathname={pathname} >
                      <div className={"w-full"}>
                        {children}
                      </div>
                    </Layout>
                  {/* </div> */}

                    {/* <div className={"text-black col-span-1 overflow-y-auto bg-black z-50 min-h-screen hidden md:flex items-center flex-col shadow"}>
                        <LargeScreenNav showBusiness={showBusiness} pathname={pathname} />
                    </div> */}
                    {/* <div className={"flex z-50 col-span-4 flex-col  items-center overflow-y-auto"}>
                      {isDynamic ? (
                      <div className={"text-black hidden h-12 p-2 text-xs z-40 bg-white w-full md:flex justify-between items-center font-semibold inset-0 sticky shadow"}>
                          <div className={"h-full items-center flex justify-center"}>                  
                              <Button
                                  className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                                  onClick={() => back()}
                              >
                                  <ArrowLeft size={20} color={"rgba(6,15,33, 1)"}/>
                              </Button>
                          </div>
                          
                          
                      </div>
                    ):( <div className={"text-black hidden h-12 p-2 text-xs z-50 bg-white w-full md:flex justify-between items-center font-semibold inset-0 sticky shadow"}>

                        <div className={"h-full items-center flex justify-center"}>
                        <Link href={"/"} passHref={true}>
                            <div className={"h-full flex justify-center items-center cursor-pointer"}>
                                <img className={"h-2/3 w-20"} src="/images/sendbox-logo.svg" alt="Sendbox Logo"/>
                            </div>
                        </Link>
                        </div>
              
                    </div>)} */}
                        
                    {/* </div> */}
                {/* </main> */}
                <div className={"text-black left-0 right-0 md:hidden h-12 flex items-center flex-col bottom-0 fixed shadow"}>
                    <div className={"bg-white h-full w-full flex flex-col items-center"}>
                        <nav className="flex w-full justify-between h-full items-center font-semibold p-2 text-xs text-black md:text-sm capitalize">
                            <Link href={"/"} passHref={true}>
                                <div className={`cursor-pointer flex flex-col items-center px-3 py-1 hover:bg-transluscent-primary hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/",
                                "text-primary": pathname === "/"
                                })}`}>
                                    <div className={"w-6"}><HomeIcon /></div>
                                    <a>Home</a>
                                </div>
                            </Link>
                            <Link href={"/account"} passHref={true}>
                                <div className={`px-3 py-1 cursor-pointer flex flex-col items-center hover:bg-transluscent-primary hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/account",
                                "text-primary": pathname === "/account"
                                })}`}>
                                    <div  className={"w-6"}><PaymentIcon /></div>
                                    <a>Payments</a>
                                </div>
                            </Link>
                            <Link  href={"/business"} passHref={true}>
                                <div className={`cursor-pointer flex flex-col items-center px-3 py-1 hover:bg-transluscent-primary  hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/business",
                                "text-primary": pathname === "/business"
                                })}`}>
                                    <div  className={"w-6"}><BusinessIcon /></div>
                                    <a>Business</a>
                                </div>
                            </Link>
                            <Link  href={"/support"} passHref={true}>
                                <div className={`cursor-pointer flex flex-col items-center hover:bg-transluscent-primary px-3 py-1 hover:text-primary ${cx({
                                "bg-transluscent-primary": pathname === "/support",
                                "text-primary": pathname === "/support"
                                })}`}>
                                    <div  className={"w-6"}><SupportIcon /></div>
                                    <a>Support</a>
                                </div>
                            </Link>
                            <Link  href={"/settings"} passHref={true}>
                                <div className={`cursor-pointer flex flex-col items-center hover:bg-transluscent-primary px-3 py-1 hover:text-primary ${cx({
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