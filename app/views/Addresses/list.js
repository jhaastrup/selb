import React, { Fragment, useCallback, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ADDRESSES } from "./modules/queries";
import { DELETE_ADDRESS, SET_DEFAULT_ADDRESS } from "./modules/mutations";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "app/services/modal";
import AddAddress from "./form";
import { CloseIcon, ArrowLeft } from "app/components/icons";
import { Button } from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import { formatNumber, formatPhone } from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
//import { Wizard } from 'app/services/pagewizard';
import AddressModal from "app/components/addressModal";

const Page = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [showDelete, setShowDelete] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pluginModalVisible, setPluginModalVisible] = React.useState(false);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    ADDRESSES,
    {
      fetchPolicy: "cache-and-network",
      // variables: { filter_by, sort_by, page_by, query },
      onError: (errors) => {
        console.log({ errors });
      },
      onCompleted: (data) => {
        const { results } = data.addresses;
        setAddresses(results);
      },
    }
  );

  const openModal = (data) => {
    console.log("clicked!!!!");
    setModalVisible(true);
  };

  /* const closeModal = () => {
        setModalVisible(false);
        refetch && refetch();
    }; */

  const closeModal = () => {
    setPluginModalVisible(false);
  };

  const [deleteAddress, { loading: deleteLoading }] = useMutation(
    DELETE_ADDRESS,
    {
      onCompleted: (data) => {
        console.log({ data });
        const { deleteAddress: payload } = data;
        refetch && refetch();
        // alert(payload.title)
        setShowDelete(null);
      },
      onError: (errors) => {
        console.log({ errors });
      },
    }
  );

  const [setDefaultAddress, { loading: updating }] = useMutation(
    SET_DEFAULT_ADDRESS,
    {
      onCompleted: (data) => {
        console.log({ data });
        alert("Address updated successfully");
        setShowDelete(null);
      },
      onError: (errors) => {
        console.log({ errors });
      },
    }
  );

  const getUpdatedList = (list, value) =>
    list.filter((item) => item.pk !== value);

  const removeAddress = useCallback(
    (id) => {
      deleteAddress({ variables: { id } });
      refetch && refetch();
    },
    [deleteAddress]
  );

  const confirmDefaultAddress = useCallback(
    (id) => {
      setDefaultAddress({ variables: { id } });
    },
    [setDefaultAddress]
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

  const { results = [] } = data.addresses;

  if (results.length === 0) {
    return (
      <div
        className={
          "flex flex-col max-w-lg mx-auto h-screen justify-center items-center space-y-2"
        }
      >
        <div>
          <p className={"text-center"}>{"No Saved Address"}</p>
        </div>
        <div>
          <Button
            onClick={() => setPluginModalVisible(true)}
            uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
          >
            {"Add Address"}
          </Button>
        </div>
        <AddressModal title="" onClose={closeModal} open={pluginModalVisible}>
          <AddAddress onClose={closeModal} onRefresh={() => refetch()} />
        </AddressModal>
      </div>
    );
  }

  return (
    <div className="m-4">
      <div className=" border-b border-gray-300 px-2 py-3">
        <button
          onClick={() => setPluginModalVisible(true)}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-black  focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          {"ADD ADDRESS"}
        </button>
      </div>
      <div>
        {results.length > 0 && (
          <Fragment>
            {results.map((opt, idx) => {
              const {
                pk,
                name,
                email,
                phone,
                street,
                city,
                state,
                country,
                post_code,
                lat,
                lng,
              } = opt;
              const titleText = _.compact([street || "", city || ""]).join(
                ", "
              );
              const subText = _.compact([
                name || "",
                formatPhone(phone, "NATIONAL") || "",
              ]).join(" \u2022 ");

              return (
                <Fragment key={idx}>
                  {showDelete !== idx && (
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
                          onClick={() => setShowDelete(idx)}
                        >
                          <div className={"items-center"}>
                            <CloseIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {showDelete === idx && (
                    <div
                      className={
                        "bg-transluscent-primary flex flex-col py-3 border-b border-textGrey border-opacity-10"
                      }
                    >
                      <div
                        className={
                          "w-full p-4 flex justify-center items-center"
                        }
                      >
                        <p className={"uppercase text-xs font-semibold"}>
                          {"What would you like to do?"}
                        </p>
                      </div>
                      <div className={"flex flex-col px-4"}>
                        <div className={"w-full"}>
                          <Button
                            type={"button"}
                            onClick={() => confirmDefaultAddress(pk)}
                            uclasses={
                              "w-full bg-primary border-primary px-4 tracking-wide uppercase"
                            }
                            showLoading={updating}
                            disabled={updating}
                          >
                            {"Set as default address"}
                          </Button>
                        </div>
                        <Spacer className={"block h-3"} />
                        <div>
                          <Button
                            type={"button"}
                            onClick={() => removeAddress(pk)}
                            uclasses={
                              "w-full px-4 tracking-wide uppercase bg-white border-white text-primary"
                            }
                            showLoading={deleteLoading}
                            disabled={deleteLoading}
                          >
                            {"Delete"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </Fragment>
        )}
      </div>

      {/*      {modalVisible && (
                <Modal open={modalVisible} onClose={closeModal} wizard={true}>
                    <AddAddress onClose={closeModal} onRefresh={() => refetch()}/>
                </Modal>
            )} */}

      <AddressModal title="" onClose={closeModal} open={pluginModalVisible}>
        <AddAddress onClose={closeModal} onRefresh={() => refetch()} />
      </AddressModal>
    </div>

    /* <div className={"flex flex-col"}>
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
                    <p className={"text-2xl font-semibold"}>{'Saved Addresses'}</p>
                    <Spacer className={"block h-2"} />
                    <p className={"text-sm text-textGrey"}>{'Manage your addresses here. These addresses can be used when booking deliveries.'}</p>
                </div>
                <Spacer className={"block h-6"} />
                <div>
                    <Button
                        onClick={() => openModal()}
                        uclasses={"rounded-3xl md:font-normal px-5 tracking-wider"}
                    >
                        {"ADD ADDRESS"}
                    </Button>
                </div>
                {results.length > 0 && (
                    <Fragment>
                        <Spacer className={"block h-12"} />
                        <div>
                            <div className={"pt-4 pb-2 border-b border-textGrey border-opacity-20"}>
                            
                            </div>
                            <Spacer className={"block h-3"} />
                            {results.map((opt, idx) => {
                                const { pk, name, email, phone, street, city, state, country, post_code, lat, lng } = opt;
                                const titleText = _.compact([street || '', city || '']).join(', ');
                                const subText = _.compact([name || '', formatPhone(phone, 'NATIONAL') || '']).join(
                                    ' \u2022 ',
                                );
                                return (
                                    <Fragment key={idx}>
                                        <div
                                            className={"flex justify-between py-3 border-b border-textGrey border-opacity-10 mb-3"}
                                        >
                                            <div
                                                onClick={() => setShowDelete(idx)}
                                               className={"w-full cursor-pointer"}
                                            >
                                                <p className={"text-sm uppercase tracking-wider mb-2"}>{`${titleText}`}</p>
                                                <p className={"text-xs text-textGrey uppercase tracking-wider"}>{`${subText}`}</p>
                                            </div>
                                           
                                        </div>
                                        {showDelete === idx && (
                                        <Fragment>
                                            <div className={"bg-transluscent-primary flex flex-col py-3 border-b border-textGrey border-opacity-10"}>
                                                <div className={"w-full p-4 flex justify-center items-center"}>
                                                    <p className={"uppercase text-xs font-semibold"}>{"What would you like to do?"}</p>
                                                </div>
                                                <div className={"flex flex-col px-4"}>
                                                    <div className={"w-full"}>
                                                        <Button
                                                            type={"button"}
                                                            onClick={() => confirmDefaultAddress(pk)}
                                                            uclasses={"w-full bg-primary border-primary px-4 tracking-wide uppercase"}
                                                            showLoading={updating}
                                                            disabled={updating}
                                                        >
                                                            {"Set as default address"}
                                                        </Button>
                                                    </div>
                                                    <Spacer className={"block h-3"} />
                                                    <div>
                                                        <Button
                                                            type={"button"}
                                                            onClick={() => removeAddress(pk)}
                                                            uclasses={"w-full px-4 tracking-wide uppercase bg-white border-white text-primary"}
                                                            showLoading={deleteLoading}
                                                            disabled={deleteLoading}
                                                        >
                                                            {"Delete"}
                                                        </Button>
                                                    </div>
                                                   
                                                </div>
                                            </div>
                                        </Fragment>
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
                    <AddAddress onClose={closeModal} onRefresh={() => refetch()}/>
                </Modal>
            )}
        </div> */

    // <div style={{display: "block", overflow: "auto"}}>
    //     <div>
    //         <button
    //             onClick={() => router.push("/settings")}
    //             style={{color: "black", backgroundColor:"#fff", padding: "5px", marginTop: "10px"}}

    //         >
    //             {"Back"}
    //         </button>
    //     </div>
    //     <div style={{height:"2rem"}}></div>
    //     <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
    //         <div style={{padding: "1.5rem", alignSelf: "center", width: "440px", maxWidth: "100%"}}>
    //             <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
    //                 <div>
    //                     <p>{'Addresses'}</p>
    //                     <p>{'Manage your addresses here. These addresses can be used when booking deliveries.'}</p>
    //                     <div>
    //                         <button
    //                             type={"button"}
    //                             onClick={() => {
    //                                 // console.log("clicked!!!!")
    //                                 openModal()
    //                             }}
    //                             style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px", width: "50%"}}

    //                         >
    //                             {"Add New Address"}
    //                         </button>
    //                     </div>
    //                 </div>
    //                 <div style={{height:"4rem"}}></div>
    //                 {results.length > 0 && (
    //                     <Fragment>
    //                         <div style={{height:"0.5rem"}}></div>
    //                         <div>
    //                             <p>{'SAVED ADDRESSES'}</p>
    //                             {results.map((opt, idx) => {
    //                                 const { name, street, state, pk } = opt;
    //                                 return (
    //                                     <Fragment key={idx}>
    //                                         <div
    //                                             style={{
    //                                                 display: "flex",
    //                                                 padding: "0.5rem 0rem",
    //                                                 flexDirection: "row",
    //                                                 justifyContent: "space-between",
    //                                                 alignItems: "center",

    //                                             }}
    //                                         >
    //                                             <div
    //                                                 onClick={() => console.log("CLICKED!!!")}
    //                                                 style={{
    //                                                     cursor: "pointer",
    //                                                     width: "80%"
    //                                                 }}
    //                                             >
    //                                                 <p>
    //                                                     {name}
    //                                                 </p>
    //                                                 <p>{`${street}, ${state}`}</p>
    //                                             </div>
    //                                             <div
    //                                                 onClick={() => removeAddress(pk)}
    //                                                 style={{
    //                                                     cursor: "pointer",
    //                                                 }}
    //                                             >
    //                                                 <p>X</p>
    //                                             </div>
    //                                         </div>
    //                                         <div style={{height:"0.5rem"}}></div>
    //                                     </Fragment>
    //                                 )
    //                             })}
    //                         </div>
    //                     </Fragment>
    //                 )}
    //             </div>
    //             {modalVisible && (
    //                 <Modal onClose={closeModal}>
    //                     <AddAddress onClose={closeModal}/>
    //                 </Modal>
    //             )}
    //         </div>
    //     </div>
    // </div>
  );
};
export default Page;
