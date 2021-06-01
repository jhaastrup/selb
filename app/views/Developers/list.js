import React, { Fragment, useCallback, useState } from "react";
import { PublicLayout as Layout } from "app/views/Layout";
import { useQuery, useMutation } from "@apollo/client";
import { EXTERNAL_APPLICATIONS } from "./modules/queries";
import { useRouter } from "next/router";
import Modal from "app/services/modal";
import CreateApp from "./create";
import { Button } from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import SlideOver from "app/components/slideOver";
import Detail from "./detail";
import { ChevronRightIcon, MailIcon } from '@heroicons/react/solid'


const ItemComponent = ({ item, isSelected, onItemSelected }) => {
    const { pk, name, description, status } = item;
    return (
        <Fragment>
            {/* Mobile View */}
            <li className="lg:hidden" onClick={onItemSelected}>
                <a className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-black truncate">{name}</p>
                                    {description && (<p className="text-sm text-gray-400">{description}</p>)}
                                </div>
                                {/* <div className="hidden md:block">
                                    <div>
                                        <p className="mt-2 flex items-center text-sm text-black">{`\u20a6 ${formatNumber(import_fee, '0,0.00')}`}</p>
                                        <p className="mt-2 flex items-center text-sm text-400">{`${status?.name}` || ""}</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div>
                            <p className="mt-2 flex items-center text-sm text-400">{`${status?.name}` || ""}</p>
                        </div>
                    </div>
                </a>
            </li>

            {/* Desktop View */}
            <li className="hidden lg:block">
                <div onClick={onItemSelected} className={`block cursor-pointer ${isSelected ? "bg-gray-100" : "bg-white hover:bg-gray-100"}`}>
                    <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-black truncate">{name}</p>
                                    {description && (<p className="text-sm text-gray-400">{description}</p>)}
                                </div>
                                <div>
                                    <div>
                                        <p className={`flex items-center text-sm " ${isSelected ? "text-gray-600" : "text-black"}`}>{`${status?.name}` || ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </li>
        </Fragment>
    )
}

// slide-Over Detail
const SideDetail = ({ obj }) => {
    return (
        <div className="max-h-screen">
            <div className="mt-6 relative flex-1">
                {/* Replace with your content */}
                <div className="absolute inset-0">
                    {/* <div className="h-full border-2 border-dashed border-gray-200" aria-hidden="true" /> */}
                    <Detail obj={obj} />
                </div>
                {/* /End replace */}
            </div>
        </div>
    )
}

const Page = () => {
    const router = useRouter();
    const [current, setCurrent] = useState(null);
    const [slideVisible, setSlideVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(EXTERNAL_APPLICATIONS, {
        fetchPolicy: 'cache-and-network',
        // variables: { filter_by, sort_by, page_by, query },
        onError: (errors) => {
            console.log({ errors });
        },
    });

    if (loading) {
        return (
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

    const openDetail = (pk) => {
        const id = pk;
        router.push({
            pathname: "/developers/[id]",
            query: { id }
        })
    };

    const openModal = () => {
        console.log("clicked!!!!")
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const onItemSelected = (item) => {
        setCurrent(item);
        setSlideVisible(true);
    }

    const { results = [], metadata = {} } = data.applications;
    // console.log("FROM DEVELOPERS!!!!", {results});

    if (results.length === 0) {
        return (
            <Layout pageTitle={"Applications"} pathname={router.pathname}>
                <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center space-y-2"}>
                    <div>
                        <p className={"text-center"}>{'No Application(s) found'}</p>
                    </div>
                    <div>
                        <Button
                            onClick={() => openModal()}
                            uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                        >
                            {'Create application'}
                        </Button>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout pageTitle={"Applications"} pathname={router.pathname}>
            <div className="bg-white sticky inset-0 z-30 shadow">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="py-6 flex justify-between items-center">
                        <div className={"text-sm lg:text-lg uppercase tracking-wider text-black font-semibold"}>
                            <p>{"Saved Appilcations"}</p>
                        </div>
                        <div className=" flex space-x-3 md:mt-0 md:ml-4">
                            <button onClick={() => openModal()} type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-black  focus:outline-none focus:ring-2 focus:ring-offset-2">
                                {"CREATE APPLICATION"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"overflow-y-auto pb-20 max-h-screen lg:hidden p-2 "}>
                <ul className="divide-y divide-gray-200">
                    {results.map((item, idx) => {
                        return (
                            <ItemComponent key={item.pk} item={item} onItemSelected={() => onItemSelected(item)} />
                        );
                    })}
                </ul>
            </div>
            <div className={"lg:grid lg:grid-cols-5 xl:grid-cols-7 hidden "}>
                <div className=" col-span-5 xl:col-span-7 bg-gray-50 shadow pb-20 min-h-screen">
                    <div className="overflow-y-auto  max-h-screen ">
                        <ul className="divide-y divide-gray-100 ">
                            {results.map((item, idx) => {
                                return (
                                    <ItemComponent key={item.pk} item={item} isSelected={current?.pk === item.pk} onItemSelected={() => onItemSelected(item)} />
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            {current && (
                <SlideOver setOpen={setSlideVisible} open={slideVisible}>
                    <SideDetail obj={current} />
                </SlideOver>
            )}
            {modalVisible && (
                <Modal open={modalVisible} onClose={closeModal}>
                    <CreateApp onClose={closeModal} onRefresh={() => refetch && refetch()} />
                </Modal>
            )}
        </Layout>
        // <Layout pageTitle={"Developers"} pathname={router.pathname}>
        //     <div className={"flex flex-col max-w-lg mx-auto px-4"}>
        //         <Spacer className={"block h-12"} />
        //         <div>
        //             <p className={"text-2xl font-semibold"}>{'Saved Applications'}</p>
        //             <Spacer className={"block h-2"} />
        //             <p className={"text-sm text-textGrey"}>{'Manage your saved applications here.'}</p>
        //         </div>
        //         <Spacer className={"block h-6"} />
        //         <div>
        //             <Button
        //                 onClick={() => openModal()}
        //                 uclasses={"rounded-3xl md:font-normal px-5 tracking-wider"}
        //             >
        //                 {"ADD APPLICATION"}
        //             </Button>
        //         </div>
        //         {results.length > 0 && (
        //             <Fragment>
        //                 <Spacer className={"block h-12"} />
        //                 <div>
        //                     <div className={"pt-4 pb-2 border-b border-textGrey border-opacity-10"}></div>
        //                     <Spacer className={"block h-3"} />
        //                     {results.map((opt, idx) => {
        //                         const { name, description, pk, status } = opt

        //                         return (
        //                             <Fragment key={idx}>
        //                                 <div
        //                                     onClick={() => openDetail(pk)}
        //                                     className={"flex justify-between py-3 border-b border-textGrey border-opacity-10 mb-2 cursor-pointer"}
        //                                 >
        //                                     <div className={"w-full"} >
        //                                         <p className={"text-sm text-left uppercase tracking-wider mb-2"}>{`${name}`}</p>
        //                                         <p className={"text-xs text-left overflow-ellipsis text-textGrey uppercase tracking-wider mb-2"}>{`${description}`}</p>
        //                                         <p className={"text-xs text-left text-textGrey uppercase tracking-wider"}>{`${pk}`}</p>
        //                                     </div>
        //                                     {status && (<div className={"flex justify-end w-1/4"}>
        //                                         <div className={"flex justify-start items-start"}>
        //                                             <p className={"text-xs text-right uppercase tracking-wide mb-2"}>{`${status.name}`}</p>
        //                                         </div>
        //                                     </div>)}
        //                                 </div>
        //                             </Fragment>
        //                         )
        //                     })}
        //                 </div>
        //             </Fragment>
        //         )}
        //     </div>
        //     <Spacer className={"block h-4"} />
        //     {modalVisible && (
        //         <Modal open={modalVisible} onClose={closeModal}>
        //             <CreateApp onClose={closeModal} onRefresh={() => refetch && refetch()} />
        //         </Modal>
        //     )}
        // </Layout>
    )
}

export default Page;