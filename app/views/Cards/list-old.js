import React, {Fragment, useCallback, useState} from "react";
import {useQuery, useMutation} from "@apollo/client";
import {CARDS} from "./modules/queries";
import {DELETE_CARD} from "./modules/mutations";
import { useRouter } from "next/router";
import {getUpdatedList} from "app/utils";
import Link from "next/link";
import Modal from "app/services/modal";
import AddCard from "./form"
import { formatString } from 'app/lib/formatters';
import {CloseIcon, ArrowLeft} from "app/components/icons";
import {Button} from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import getCardImage from 'app/lib/cardImages';
import { PublicLayout as Layout } from "app/views/Layout";
import SimpleModal from "app/components/simpleModal";
import DialogModal from "app/services/dialog";
import {TrashIcon} from  "@heroicons/react/outline";




const Page = () => {
    const router = useRouter();
    const [cards, setCard] = useState([]);
    const [showDelete, setShowDelete] = useState(null)
    const [modalVisible, setModalVisible] = useState(false); 
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [cardID, setCardID] = useState(null);
    const [pluginModalVisible, setPluginModalVisible] = React.useState(false);
    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(CARDS, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        // variables: { filter_by, sort_by, page_by, query },
        onError: (errors) => {
            console.log({ errors });
        },
        onCompleted: (data) => {
            const { results } = data.cards;
            setCard(results);
        },
    });

    const closeModal = () => {
        setPluginModalVisible(false);
      };

    const [deleteCard, {loading: deleteLoading}] = useMutation(DELETE_CARD, {
        onCompleted: (data) => {
            console.log({"sometext": data });
            const {deleteCard: payload} = data;
            refetch && refetch()
            // alert(payload.title)
            setShowDelete(null)
        },
        onError: (errors) => {
            console.log({ errors });
        },
    });

    const openModal = (data) => {
        console.log("clicked!!!!")
        setModalVisible(true);
        // setTimeout(() => {
        //     setModalVisible(true);
        // }, 20);
    };

   /*  const closeModal = () => {
        setModalVisible(false);
    }; */ 

    const myFun = () =>{
        console.log("it works")
    }


    const removeCard = useCallback((id) => {
        
        console.log(id, "sometext to show it deleted"); 
        deleteCard({variables: {id:id}})

        refetch && refetch();

    }, [deleteCard])

    if(loading || !data){
        return(
            <div className={"flex h-screen justify-center items-center"}>
                <Loading />
            </div>
        )
    }

    if (error) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <div>
                    <p className={"text-center"}>{'unknown error occurred'}</p>
                    {/* <p className={"text-center text-textGrey"}>{'We could not find any tracking information for the reference code provided'}</p> */}
                </div>
                <Spacer className={"block h-5"} />
                <div>
                    <Button
                        onClick={() => refetch && refetch()}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Try Again'}
                    </Button>
                </div>
            </div>
        )
    }

    const {results=[]} = data.cards;

    const addCardPayData = {
        action: 'account.topup',
        amount: 10,
        currency: 'NGN',
        domain: 'sendbox.payments',
        fee: null,
        narration: 'Card linking by user',
        payable: 10,
        // name: 'Emotu Balogun',
        // payment_source_code: 'card',
        // card_key: 'crd_qjxV8eS4x5rviLQJQg4lsw',
        // reference_code: '998112',
    }; 


    if (results.length === 0) {
        return (
          
                <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center space-y-2"}>
                    <div>
                        <p className={"text-center"}>{'No Debit Card Added'}</p>
                    </div>
                    <div>
                        <Button
                          onClick={() => setPluginModalVisible(true)}
                            uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                        >
                            {'Add a Debit Card'}
                        </Button>
                    </div>
                </div>
          
        )
    }

    return(
    
                 <div className ="m-4"> 
                 <div className = " border-b border-gray-300 px-2 py-3">
       <button
                onClick={() => setPluginModalVisible(true)}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-black  focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {"Add a Debit Card"}
              </button>
              </div>

                    <div>
                    {results.length > 0 && (
                        <Fragment>
                             {results.map((opt, idx) => {
                                 const { last4, expiry_year, expiry_month, brand, pk } = opt;
                                 const subText = _.compact([`${expiry_month} / ${expiry_year}` || '']).join(' \u2022 ');
                                 const uri = getCardImage(brand);

                                  return(
                                  <Fragment key={idx}>
                                      <div className={"bg-transluscent-primary flex flex-col py-3 border-b border-textGrey border-opacity-10"}>
                                          <div className={"flex justify-between items-center"}>
                                            <div>
                                            <p className={"text-sm uppercase tracking-wider mb-2"}>
                                                {formatString(`${brand} \u2022 \u2022 \u2022 \u2022 ${last4}`,'uppercase',)}
                                            </p>
                                             <p className={"text-xs text-textGrey uppercase tracking-wider"}>{`${subText}`}</p>
                                            </div> 

                                            <div className="cursor-pointer"
                                             onClick={() => {
                                                setDialogVisible(true);
                                                setCardID(pk);
                                              }}
                                            //onClick={() => setShowDelete(idx)}
                                            >
                                                   <div className={"items-center"}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg> 
                       {/* <TrashIcon /> */}
                          </div>
                                            {/* <div className={"w-10 h-10"}>
                                                  <img src={uri} alt="Card-Logo"/>
                                                 </div> */}
                                            </div>
                                          </div>
                                      </div>

                                      {dialogVisible ? (
                                          
                                          <DialogModal
                                           open={dialogVisible}
                                           onClose={setDialogVisible}
                                           action={"Delete"}
                                           dialogAction={() => {
                                               removeCard(pk);
                                           }}
                                           title={"Delete Card"}
                                       
                                           description={
                                             "Are you sure you want to delete this card?"
                                           } 
                                         
                                         /> 
                                       ) : null}

                                     
                                     {/*  {showDelete === idx && (<div className={"bg-transluscent-primary flex flex-col py-3 border-b border-textGrey border-opacity-10"}>
                                      <div className={"w-full p-4 flex justify-center items-center"}>
                                                <p className={"uppercase text-xs font-semibold"}>{"Are you sure you want to delete?"}</p>
                                            </div> 
                                            <div className={"flex flex-row justify-center"}>
                                            <div className={""}>
                                                    <Button
                                                        onClick={() => removeCard(pk)}
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
                                  )
                             })
                             
                             }

                        </Fragment>
                    )}
                  </div> 

                  

                  <SimpleModal title="" onClose={closeModal} open={pluginModalVisible}>
                  <AddCard onClose={closeModal}/>
                 </SimpleModal>

               {/*    {modalVisible && (
                <Modal open={modalVisible} onClose={closeModal} wizard={true}>
                     <AddCard onClose={closeModal}/>
                 </Modal>
             )}
 */}
        </div>
       



        
        // <div className={"flex flex-col"}>
        //     <div className={"flex flex-row p-4 border-b border-textGrey border-opacity-20"}>
        //         <div className={"flex justify-start items-center"}>
        //             <Button
        //                 className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
        //                 onClick={() => router.push("/settings")}
        //             >
        //                 <ArrowLeft size={20} color={"rgba(6,15,33, 1)"}/>
        //             </Button>
        //         </div>
        //     </div>
        //     <div className={"flex flex-col max-w-lg mx-auto px-4"}>
        //         <Spacer className={"block h-12"} />
        //         <div>
        //             <p className={"text-2xl font-semibold"}>{'Credit & Debit Cards'}</p>
        //             <Spacer className={"block h-2"} />
        //             <p className={"text-sm text-textGrey"}>{'Manage your credit and debit cards here. These cards are available to you when you want to make a purchase.'}</p>
        //         </div>
        //         <Spacer className={"block h-6"} />
        //         <div>
        //             <Button
        //                 onClick={() => openModal()}
        //                 uclasses={"rounded-3xl md:font-normal px-5 tracking-wider"}
        //             >
        //                 {"ADD A Debit Card"}
        //             </Button>
        //         </div>
        //         {results.length > 0 && (
        //             <Fragment>
        //                 <Spacer className={"block h-12"} />
        //                 <div>
        //                     <div className={"pt-4 pb-2 border-b border-textGrey border-opacity-20"}>
                               
        //                     </div>
        //                     <Spacer className={"block h-3"} />
        //                     {results.map((opt, idx) => {
        //                         const { last4, expiry_year, expiry_month, brand, pk } = opt;
        //                         const subText = _.compact([`${expiry_month} / ${expiry_year}` || '']).join(' \u2022 ');
        //                         const uri = getCardImage(brand);
        //                         return (
        //                         <Fragment key={idx}>
        //                             {showDelete !== idx && (
        //                                 <div
        //                                     onClick={() => setShowDelete(idx)}
        //                                     className={"flex justify-between py-3 border-b border-textGrey border-opacity-10 mb-3 cursor-pointer"}
        //                             >
        //                                 <div
        //                                     className={"w-3/4"}
        //                                 >
        //                                     <p className={"text-sm uppercase tracking-wider mb-2"}>
        //                                         {formatString(`${brand} \u2022 \u2022 \u2022 \u2022 ${last4}`,'uppercase',)}
        //                                     </p>
        //                                     <p className={"text-xs text-textGrey uppercase tracking-wider"}>{`${subText}`}</p>
        //                                 </div>
        //                                 <div 
        //                                     // onClick={() => setShowDelete(idx)}
        //                                     className={"flex justify-end w-1/4"}
        //                                 >
        //                                     <div className={"flex justify-center items-center"}>
        //                                         {/* <CloseIcon /> */}
        //                                         <div className={"w-10 h-10"}>
        //                                             <img src={uri} alt="Card-Logo"/>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>)}
        //                             {showDelete === idx && (
        //                                 <div className={"bg-transluscent-primary flex flex-col py-3 border-b border-textGrey border-opacity-10"}>
        //                                     <div className={"w-full p-4 flex justify-center items-center"}>
        //                                         <p className={"uppercase text-xs font-semibold"}>{"Are you sure you want to delete?"}</p>
        //                                     </div>
        //                                     <div className={"flex flex-row justify-center"}>
        //                                         <div className={""}>
        //                                             <Button
        //                                                 onClick={() => removeCard(pk)}
        //                                                 uclasses={"bg-primary border-primary px-4 tracking-wide"}
        //                                                 showLoading={deleteLoading}
        //                                                 disabled={deleteLoading}
        //                                             >
        //                                                 {"DELETE"}
        //                                             </Button>
        //                                         </div>
        //                                         <Spacer className={"block w-3"} />
        //                                         <div>
        //                                             <Button
        //                                                 onClick={() => setShowDelete(null)}
        //                                                 uclasses={"px-4 tracking-wide"}
        //                                             >
        //                                                 {"CANCEL"}
        //                                             </Button>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             )}
        //                         </Fragment>
        //                     )
        //                     })}
        //                 </div>
        //             </Fragment>
        //         )}
        //     </div>
        //     {modalVisible && (
        //         <Modal open={modalVisible} onClose={closeModal}>
        //             <AddCard onClose={closeModal}/>
        //         </Modal>
        //     )}
        // </div>


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
        //                     <p>{'Credit & Debit Cards'}</p>
        //                     <p>{'Manage your credit and debit cards here. These cards are available to you when you want to make a purchase.'}</p>
        //                     <div>
        //                         <button
        //                             type={"button"}
        //                             onClick={() => {
        //                                 // console.log("clicked!!!!")
        //                                 openModal()
        //                             }}
        //                             style={{color: "#fff", backgroundColor:"black", padding: "5px", marginTop: "10px", width: "50%"}}

        //                         >
        //                             {"Add A Debit Card"}
        //                         </button>
        //                     </div>
        //                 </div>
        //                 <div style={{height:"4rem"}}></div>
        //                 {results.length > 0 && (
        //                     <Fragment>
        //                         <div style={{height:"0.5rem"}}></div>
        //                         <div>
        //                             <p>{'SAVED CARDS'}</p>
        //                             {/* <div style={{height:"0.5rem"}}></div> */}
        //                             {results.map((opt, idx) => {
        //                                 const { last4, expiry_year, expiry_month, brand, pk } = opt;
        //                                 const subText = _.compact([`${expiry_month} / ${expiry_year}` || '']).join(' \u2022 ');
        //                                 {/* const uri = getCardImage(brand); */}
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
        //                                                     {formatString(
        //                                                         `${brand} \u2022 \u2022 \u2022 \u2022 ${last4}`,
        //                                                         'uppercase',
        //                                                     )}
        //                                                 </p>
        //                                                 <p>{`${subText}`}</p>
        //                                             </div>
        //                                             <div
        //                                                 onClick={() => removeCard(pk)}
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
        //                 <Modal title={"Add Debit Card"} open={modalVisible} onClose={closeModal}>
        //                     <AddCard onClose={closeModal}/>
        //                 </Modal>
        //             )}
        //         </div>
        //     </div>
        // </div>
    )
}
export default Page;