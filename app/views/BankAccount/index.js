import React, { Fragment, useState, useCallback } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { ACCOUNTS } from "./modules/queries";
import { DELETE_BANK } from "./modules/mutations";
import _ from "lodash";
import { useRouter } from "next/router";
import Modal from "app/services/modal";
import AddBank from "./form";
import { CloseIcon, ArrowLeft } from "app/components/icons";
import { Button } from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import AlertModal from "app/components/alertModal";
import DialogModal from "app/services/dialog";
import { PublicLayout as Layout } from "app/views/Layout";
import SimpleModal from "app/components/simpleModal";
import {TrashIcon} from  "@heroicons/react/outline";

const Page = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [pluginModalVisible, setPluginModalVisible] = React.useState(false);

  const [cardID, setCardID] = useState(null);
  const [modalData, setModalData] = useState({});

  const closeModal = () => {
    setPluginModalVisible(false);
  };

  const { loading, error, data, refetch, networkStatus } = useQuery(ACCOUNTS, {
    fetchPolicy: "cache-and-network",
  });

  const [deleteBankAccount, { loading: deleteLoading }] = useMutation(
    DELETE_BANK,
    {
      onCompleted: (data) => {
        const { deleteBankAccount: payload } = data;
        refetch && refetch();
        // alert(payload.title)
        console.log("some text to show it called deletebankAccount:", data)
        //setShowDelete(null)
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  if (loading) {
    return (
      <div className={"flex h-screen justify-center items-center"}>
        <Loading />
      </div>
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

  const { results } = data.bankAccounts;

  const openModal = (data) => {
    console.log("clicked!!!!");
    setModalVisible(true);
    // setTimeout(() => {
    //     setModalVisible(true);
    // }, 20);
  };

  /*  const closeModal = () => {
        setModalVisible(false);
    }; */

  const deleteBank = (id) => {
    const variables = {
      id,
    };
    // console.log({variables});
    deleteBankAccount({ variables });
    console.log(variables , "text to show deletBank got called");
  };
 

  if (results.length === 0) {
    return (
     
        <div
          className={
            "flex flex-col max-w-lg mx-auto h-screen justify-center items-center space-y-2"
          }
        >
          <div>
            <p className={"text-center"}>{"No Bank Accounts added"}</p>
          </div>
          <div>
            <Button
              onClick={() => setPluginModalVisible(true)}
              uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
            >
              {"Add Bank Account"}
            </Button>
          </div>
        </div>

    );
  }

  return (
       

      <div className="m-4">
        <div className = " border-b border-gray-300 px-2 py-3">
       <button
                onClick={() => setPluginModalVisible(true)}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-black  focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {"ADD BANK ACCOUNT"}
              </button>
              </div>
        <div>
          {results.length > 0 && (
            <Fragment>
              {results.map((opt, idx) => {
                const { account_name, account_number, bank = {}, pk } = opt;
                const titleText = account_name;
                const subText = _.compact([
                  account_number || "",
                  bank?.name || "",
                ]).join(" \u2022 ");

                return (
                  <Fragment key={idx}>
                    <div
                      className={
                        "bg-transluscent-primary flex flex-col py-3 border-b border-textGrey border-opacity-10"
                      }
                    >
                      <div className={"flex justify-between items-center"}>
                        <div>
                          <p
                            className={"text-sm uppercase tracking-wider mb-2"}
                          >{`${titleText}`}</p>
                          <p
                            className={
                              "text-xs text-textGrey uppercase tracking-wider"
                            }
                          >{`${subText}`}</p>
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setDialogVisible(true);
                            setCardID(pk);
                          }}
                        >
                          <div className={"items-center"}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg> 
                       {/* <TrashIcon /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    {dialogVisible ? (
                      <DialogModal
                        open={dialogVisible}
                        onClose={setDialogVisible}
                        action={"Delete"}
                        dialogAction={() => {deleteBank(pk)}} 

                       
                        title={"Delete Bank"}
                        description={
                          "Are you sure you want to delete this Bank?"
                        }
                      />
                    ) : null}
                    {/* {showDelete === idx && (<div className={"bg-transluscent-primary flex flex-col py-3 border-b border-textGrey border-opacity-10"}>
                                      <div className={"w-full p-4 flex justify-center items-center"}>
                                                <p className={"uppercase text-xs font-semibold"}>{"Are you sure you want to delete?"}</p>
                                            </div> 
                                            <div className={"flex flex-row justify-center"}>
                                            <div className={""}>
                                                    <Button
                                                        onClick={() => deleteBank(pk)}
                                                        uclasses={"bg-primary border-primary px-4 tracking-wide"}
                                                        showLoading={deleteLoading}
                                                        disabled={deleteLoading}
                                                    >
                                                        {"DELETE"}
                                                    </Button>
                                                </div>
                                                <Spacer className={"block w-3"} />
                                                <div>
                                                    <Button
                                                        onClick={() => setShowDelete(null)}
                                                        uclasses={"px-4 tracking-wide"}
                                                    >
                                                        {"CANCEL"}
                                                    </Button>
                                                </div>
                                            </div>
                                      </div>
                                      )}
 */}
                  </Fragment>
                );
              })}
            </Fragment>
          )}
        </div>

        <SimpleModal title="" onClose={closeModal} open={pluginModalVisible}>
          <AddBank
            onClose={closeModal}
            onCompleted={closeModal}
            onRefresh={() => refetch()}
          />
        </SimpleModal>
        {/* 
                  {modalVisible && (
                <Modal open={modalVisible} onClose={closeModal} wizard={true}>
                    <AddBank onClose={closeModal} onCompleted={closeModal} onRefresh={() => refetch()} />
                </Modal>
            )} */}
      </div>
   
    /*   <div className={"flex flex-col"}>
            <div className={"flex flex-row p-4 border-b border-textGrey border-opacity-20"}>
                <div className={"flex justify-start items-center"}>
                    <Button
                        className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                        onClick={() => router.push("/settings")}
                    >
                        <ArrowLeft size={20} color={"rgba(6,15,33, 1)"}/>
                    </Button>
                </div>
            </div>
            <div className={"flex flex-col max-w-lg mx-auto px-4"}>
                <Spacer className={"block h-12"} />
                <div>
                    <p className={"text-2xl font-semibold"}>{'Bank Accounts'}</p>
                    <Spacer className={"block h-2"} />
                    <p className={"text-sm text-textGrey"}>{'Add and manage your bank accounts here. You can withdraw or transfer money to any of the account numbers below.'}</p>
                </div>
                <Spacer className={"block h-6"} />
                <div>
                    <Button
                        onClick={() => openModal()}
                        uclasses={"rounded-3xl md:font-normal px-5 tracking-wider"}
                    >
                        {"ADD BANK ACCOUNT"}
                    </Button>
                </div>
                {results.length > 0 && (
                    <Fragment>
                        <Spacer className={"block h-12"} />
                        <div>
                            <div className={"pt-4 pb-2 border-b border-textGrey border-opacity-20"}>
                                <p className={"text-textGrey text-xs tracking-wider"}>{'SAVED ACCOUNTS'}</p>
                            </div>
                            <Spacer className={"block h-3"} />
                            {results.map((opt, idx) => {
                                const { account_name, account_number, bank = {}, pk } = opt;
                                const titleText = account_name;
                                const subText = _.compact([account_number || '', bank?.name || '']).join(' \u2022 ');
                                return (
                                <Fragment key={idx}>
                                    {showDelete !== idx && (<div
                                        className={"flex justify-between py-3 border-b border-textGrey border-opacity-10 mb-3"}
                                    >
                                        <div
                                            onClick={() => console.log("CLICKED!!!")}
                                            className={"w-3/4"}
                                        >
                                            <p className={"text-sm uppercase tracking-wider mb-2"}>{`${titleText}`}</p>
                                            <p className={"text-xs text-textGrey uppercase tracking-wider"}>{`${subText}`}</p>
                                        </div>
                                        <div 
                                            onClick={() => setShowDelete(idx)}
                                            className={"flex justify-end w-1/4 cursor-pointer"}
                                        >
                                            <div className={"flex justify-center items-center"}>
                                                <CloseIcon />
                                            </div>
                                        </div>
                                    </div>)}
                                    {showDelete === idx && (
                                        <div className={"bg-transluscent-primary flex flex-col py-3 border-b border-textGrey border-opacity-10"}>
                                            <div className={"w-full p-4 flex justify-center items-center"}>
                                                <p className={"uppercase text-xs font-semibold"}>{"Are you sure you want to delete?"}</p>
                                            </div>
                                            <div className={"flex flex-row justify-center"}>
                                                <div className={""}>
                                                    <Button
                                                        onClick={() => deleteBank(pk)}
                                                        uclasses={"bg-primary border-primary px-4 tracking-wide"}
                                                        showLoading={deleteLoading}
                                                        disabled={deleteLoading}
                                                    >
                                                        {"DELETE"}
                                                    </Button>
                                                </div>
                                                <Spacer className={"block w-3"} />
                                                <div>
                                                    <Button
                                                        onClick={() => setShowDelete(null)}
                                                        uclasses={"px-4 tracking-wide"}
                                                    >
                                                        {"CANCEL"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Fragment>
                            )
                            })}
                        </div>
                    </Fragment>
                )}
            </div> 


            {modalVisible && (
                <Modal open={modalVisible} onClose={closeModal}>
                    <AddBank onClose={closeModal} onCompleted={closeModal} onRefresh={() => refetch()} />
                </Modal>
            )}

        </div> */
  );
};
export default Page;
