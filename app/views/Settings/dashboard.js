import React, { Fragment, useState } from "react";
import { PublicLayout as Layout } from "app/views/Layout";
import { useQuery, useMutation } from "@apollo/client";
import { DEPENDENCIES } from "./modules/queries";
import { formatPhone } from "app/lib/formatters";
import { useRouter } from "next/router";
import { Button } from "app/components/forms";
import Card from "app/components/homeCard";
import generateLogos from "./logos";
import Loading from "app/components/loading";
import { Spacer } from "app/components/assets";
import { PersonIcon, ProfileIcon, ChevronForward } from "app/components/icons";
import Profile from "./editProfile";
import BankAccount from "app/views/BankAccount";
import { List } from "app/views/Cards";
import Addresses from "app/views/Addresses/list";
import Bvn from "app/views/Bvn";
import ConnectStore from "app/views/Business/linkStore";
//import { ListLayout } from "app/views/Legal";
//import { ContactList } from "app/views/Contact";

const tabs = [
  { name: "Profile", value: "editProfile" },
  { name: "Bank Account", value: "BankAccount" },
  { name: "Debit Cards", value: "Cards" },
  { name: "Saved Addresses", value: "list" },
  { name: "Account Verification", value: "Bvn" },
  //{ name: "Legal", value: "Legal" },
  //{ name: "Contact", value: "Contact" },
];

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("editProfile");
  const handeleSelectTab = (e) => {
    setCurrentPage(e.target.value);
  };

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    DEPENDENCIES,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      onError: (errors) => {
        console.log({ errors });
      },
    }
  );

  if (loading) {
    return (
      <Layout pageTitle={"Settings"} pathname={router.pathname}>
        <Loading />
      </Layout>
    );
  }

  if (error) {
    return (
      <div
        className={
          "flex flex-col max-w-lg mx-auto h-screen justify-center items-center"
        }
      >
        <div>
          <p className={"text-center"}>{"unknown error occurred"}</p>
          {/* <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p> */}
        </div>
        <Spacer className={"block h-5"} />
        <div>
          <Button
            onClick={() => refetch && refetch()}
            uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
          >
            {"Try Again"}
          </Button>
        </div>
      </div>
    );
  }

  let PageComponent;

  switch (currentPage) {
    case "editProfile":
      PageComponent = Profile;
      break;
    case "BankAccount":
      PageComponent = BankAccount;
      break;
    case "Cards":
      PageComponent = List;
      break;
    case "list":
      PageComponent = Addresses;
      break;
    case "Bvn":
      PageComponent = Bvn;
      break;
    case "linkStore":
      PageComponent = ConnectStore;
      break;
  
    default:
      PageComponent = null;
      break;
  }

  const { me = {} } = data;
  const { name, phone } = me;
  const serviceLogos = generateLogos();

  return (
    <Layout pageTitle={"Settings"} pathname={router.pathname}>
      <div className="bg-white sticky inset-0 z-30 shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div className={"flex flex-col space-y-1"}>
              <p
                className={
                  "text-xl uppercase tracking-wider text-black font-bold"
                }
              >
                {name || ""}
              </p>
              <p className={"text-gray-400 text-sm"}>
                {formatPhone(phone, "NATIONAL") || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}

      <div className="px-6">
        <div>
           <div className={"lg:hidden block"}>
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              value={currentPage}
              onChange={handeleSelectTab}
              className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              // defaultValue={tabs[0].name}
            >
              {tabs.map((tab) => (
                <option key={tab.name} value={tab.value}>
                  {tab.name}
                </option>
              ))}
            </select>
          </div>

          <div className={"hidden lg:block"}>
            <div className="border-b border-gray-200">
              <nav
                className="mt-2 -mb-px flex space-x-8 cursor-pointer"
                aria-label="Tabs"
              >
                <a
                  onClick={() => setCurrentPage("editProfile")}
                  className={`${
                    currentPage === "editProfile"
                      ? "border-red-400 text-red-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {"Your Profile"}
                </a>

                <a
                  onClick={() => setCurrentPage("BankAccount")}
                  className={`${
                    currentPage === "BankAccount"
                      ? "border-red-400 text-red-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {"Bank Account"}
                </a>

                <a
                  onClick={() => setCurrentPage("Cards")}
                  className={`${
                    currentPage === "Cards"
                      ? "border-red-400 text-red-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {"Debit Cards"}
                </a>

                <a
                  onClick={() => setCurrentPage("list")}
                  className={`${
                    currentPage === "list"
                      ? "border-red-400 text-red-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {"Saved Addresses"}
                </a>

                <a
                  onClick={() => setCurrentPage("Bvn")}
                  className={`${
                    currentPage === "Bvn"
                      ? "border-red-400 text-red-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {"Account Verification"}
                </a>

               {/*  <a
                  onClick={() => setCurrentPage("Legal")}
                  className={`${
                    currentPage === "Legal"
                      ? "border-red-400 text-red-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {"Legal"}
                </a>

                <a
                  onClick={() => setCurrentPage("Contact")}
                  className={`${
                    currentPage === "Contact"
                      ? "border-red-400 text-red-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {"Contact Us"}
                </a>  

                 {serviceLogos.map((opt, idx) =>{
                    const {title, onClick} = opt;
                    return(
                    <Fragment key={idx}>
                      <a onClick={onClick} className= "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200" >
                          {title}
                          </a>
                    </Fragment>)
                })} */}
            
              </nav>
            </div>
          </div> 
        </div>
      </div>
      <div className={"h-screen"}>
        <PageComponent dependencies={data} />
      </div>
      {/*  <div className="border-b border-gray-200">
            <nav className="mt-2 -mb-px flex space-x-8" aria-label="Tabs">

                 {serviceLogos.map((opt, idx) =>{
                    const {title, onClick} = opt;
                    return(
                    <Fragment key={idx}>
                      <div onClick={onClick} className={"cursor-pointer text-sm"}>
                          {title}
                      </div>
                    </Fragment>)
                })} 
            </nav>
            </div> */}

      {/* <div className={"container mx-auto"}>
                 <div  className={"flex flex-col"}>
                    <div>
                        <div className={"flex flex-col items-center pt-4 mt-11 mb-11"}>
                            <div className={"py-2"}>
                                <ProfileIcon size={80} />
                            </div>
                            <div className={"text-2xl font-medium"}>
                                <p >{name || ""}</p>
                            </div>
                            <div className={"text-textGrey text-sm"}>
                                <p>{formatPhone(phone, 'NATIONAL') || '-'}</p>   
                            </div>
                        </div>
                    </div>
                    <div>
                        {serviceLogos.map((opt, idx) => {
                            const {title, onClick} = opt;
                            return (
                                <Fragment key={idx}>
                                     <div onClick={onClick} className={"max-w-lg mx-auto cursor-pointer"}>
                                        <div className={"mb-1 px-4 pt-4 flex flex-row items-center justify-center"}>
                                            <div className={"flex flex-row w-full justify-between border-b border-textGrey border-opacity-10 pb-4"}>
                                                <div className={"uppercase text-sm"}>
                                                    <p>{title}</p>
                                                </div>
                                                <div>
                                                    <ChevronForward size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div> 

                                </Fragment>
                            )
                        })}
                        <Spacer className={"block h-20"} />
                    </div>
                </div> 
            </div> */}
    </Layout>
  );
};

export default Page;
