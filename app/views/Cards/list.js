import React, { Fragment, useCallback, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { CARDS } from "./modules/queries";
import { DELETE_CARD } from "./modules/mutations";
import { useRouter } from "next/router";
import { getUpdatedList } from "app/utils";
import Link from "next/link";
import Modal from "app/services/modal";
import AddCard from "./form";
import { formatString } from "app/lib/formatters";
import { CloseIcon, ArrowLeft } from "app/components/icons";
import { Button } from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import getCardImage from "app/lib/cardImages";
import { PublicLayout as Layout } from "app/views/Layout";
import SimpleModal from "app/components/simpleModal";
import DialogModal from "app/services/dialog";
import { TrashIcon } from "@heroicons/react/outline";

const Page = () => {
  const router = useRouter();
  const [cards, setCard] = useState([]);
  const [showDelete, setShowDelete] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [cardID, setCardID] = useState(null);
  const [pluginModalVisible, setPluginModalVisible] = React.useState(false);
  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    CARDS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      // variables: { filter_by, sort_by, page_by, query },
      onError: (errors) => {
        console.log({ errors });
      },
      onCompleted: (data) => {
        const { results } = data.cards;
        setCard(results);
      },
    }
  );

  const closeModal = () => {
    setPluginModalVisible(false);
  };

  const [deleteCard, { loading: deleteLoading }] = useMutation(DELETE_CARD, {
    onCompleted: (data) => {
      console.log({ sometext: data });
      const { deleteCard: payload } = data;
      refetch && refetch();
      // alert(payload.title)
      setShowDelete(null);
    },
    onError: (errors) => {
      console.log({ errors });
    },
  });

  const openModal = (data) => {
    console.log("clicked!!!!");
    setModalVisible(true);
  };

  const removeCard = useCallback(
    (id) => {
      console.log(id, "sometext to show it deleted");
      deleteCard({ variables: { id: id } });

      refetch && refetch();
    },
    [deleteCard]
  );

  if (loading || !data) {
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

  const { results = [] } = data.cards;

  const addCardPayData = {
    action: "account.topup",
    amount: 10,
    currency: "NGN",
    domain: "sendbox.payments",
    fee: null,
    narration: "Card linking by user",
    payable: 10,
    // name: 'Emotu Balogun',
    // payment_source_code: 'card',
    // card_key: 'crd_qjxV8eS4x5rviLQJQg4lsw',
    // reference_code: '998112',
  };

  if (results.length === 0) {
    return (
      <div
        className={
          "flex flex-col max-w-lg mx-auto h-screen justify-center items-center space-y-2"
        }
      >
        <div>
          <p className={"text-center"}>{"No Debit Card Added"}</p>
        </div>
        <div>
          <Button
            onClick={() => setPluginModalVisible(true)}
            uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
          >
            {"Add a Debit Card"}
          </Button>
        </div>
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
          {"Add a Debit Card"}
        </button>
      </div>

      <div>
        {results.length > 0 && (
          <Fragment>
            {results.map((opt, idx) => {
              const { last4, expiry_year, expiry_month, brand, pk } = opt;
              const subText = _.compact([
                `${expiry_month} / ${expiry_year}` || "",
              ]).join(" \u2022 ");
              const uri = getCardImage(brand);

              return (
                <Fragment key={idx}>
                  <div
                    className={
                      "bg-transluscent-primary flex flex-col py-3 border-b border-textGrey border-opacity-10"
                    }
                  >
                    <div className={"flex justify-between items-center"}>
                      <div>
                        <p className={"text-sm uppercase tracking-wider mb-2"}>
                          {formatString(
                            `${brand} \u2022 \u2022 \u2022 \u2022 ${last4}`,
                            "uppercase"
                          )}
                        </p>
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </div>
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
                      description={"Are you sure you want to delete this card?"}
                    />
                  ) : null}
                </Fragment>
              );
            })}
          </Fragment>
        )}
      </div>
      <SimpleModal title="" onClose={closeModal} open={pluginModalVisible}>
        <AddCard onClose={closeModal} />
      </SimpleModal>
    </div>
  );
};
export default Page;
