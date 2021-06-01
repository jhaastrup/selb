import React, { Fragment, useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import Modal from "app/services/modal";
import AddBank from "app/views/BankAccount/form"
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading"
import { Button } from "app/components/forms";
import { ChevronForward } from "app/components/icons"



const Page = ({dependencies, pageData, onChangePage, setState, onRefresh}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { me = {}, banks = { results: [] } } = dependencies;

    useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    const { paymentProfile = {} } = me;

    const { bank_account_id } = pageData;

    console.log({ dependencies });

    const openModal = (data) => {
        console.log("clicked!!!!")
        setModalVisible(true);
        // setTimeout(() => {
        //     setModalVisible(true);
        // }, 20);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const onItemSelected = (item) => {
        console.log({ item });
        onChangePage('review', { ...item });
    };

    const isEmpty = _.isEmpty(bank_account_id);
    const selectedAccount = isEmpty
        ? { account_name: 'Add new bank account' }
        : banks.results.find((elem) => elem.pk === bank_account_id);
    const mainTitleText = selectedAccount ? selectedAccount.account_name : '';
    const mainSubText = isEmpty
        ? ''
        : [selectedAccount.account_number, selectedAccount.bank?.name || ''].join(' \u2022 ');

    return (
        <div className={"flex flex-col max-w-lg mx-auto px-4"}>
            <Spacer className={"block h-12"} />
            <div>
                <p className={"text-primary uppercase text-xs mb-2"}>{'Select Recipient'}</p>
                <p className={"text-2xl font-semibold"}>{'Where should we send your money?'}</p>
                <Spacer className={"block h-2"} />
                <p className={"text-sm text-textGrey"}>{'Please provide a bank account to receive the funds you are about to withdraw'}</p>
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
            {banks.results.length > 0 && (
                <Fragment>
                    <Spacer className={"block h-6"} />
                    <div className={"py-3"}>
                        <p className={"text-textGrey text-sm tracking-wider"}>{'YOUR BANK ACCOUNTS'}</p>
                        <Spacer className={"block h-3"} />
                        {banks.results.map ((opt, idx) => {
                            const { account_name, account_number, bank = {}, pk } = opt;
                            const titleText = account_name;
                            const subText = _.compact([account_number || '', bank?.name || '']).join(' \u2022 ');
                            const payload = {
                                bank_account_id: pk,
                                bank,
                                account_name,
                                account_number
                            };

                            console.log({ payload });

                            return (
                                <Fragment key={idx}>
                                    <div
                                        onClick={() => onItemSelected(payload)}
                                        className={"flex justify-between py-3 border-b border-textGrey border-opacity-10 cursor-pointer"}
                                    >
                                        <div>
                                            <p className={"text-sm uppercase tracking-wider mb-2"}>{`${titleText}`}</p>
                                            <p className={"text-xs text-textGrey uppercase tracking-wider"}>{`${subText}`}</p>
                                        </div>
                                        <div className={"flex justify-center items-center"}>
                                            <ChevronForward />
                                        </div>
                                    </div>
                                </Fragment>
                            )
                        })}
                    </div>
                </Fragment>
            )}
            {modalVisible && (
                    <Modal title={"ADD BANK ACCOUNT"} open={modalVisible} onClose={closeModal}>
                        <AddBank onClose={closeModal} onCompleted={closeModal} onRefresh={onRefresh} />
                    </Modal>
                )}
        </div>
    );
}

export default Page;