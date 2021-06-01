import * as React from "react";
import {useQuery, useMutation, useLazyQuery} from "@apollo/client";
import {GET_RESOLUTION_THREADS, GET_THREAD} from "./modules/queries";
import { PublicLayout as Layout } from "app/views/Layout";
import Link from "next/link";
import Complaint from "./complain";
import Modal from "app/services/modal";
import { ChevronRightIcon, MailIcon } from '@heroicons/react/solid'
import { useRouter } from "next/router";
import {formatDate, formatPhone, formatString, formatNumber} from "app/lib/formatters";
import Loading from "app/components/loading"
import {Button} from "app/components/forms";
import Tabs from "app/components/tabs";
import SlideOver from "app/components/slideOver";
import {classNames} from "app/lib/utils";
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    ArchiveIcon as ArchiveIconSolid,
    ChevronDownIcon,
    ChevronUpIcon,
    DotsVerticalIcon,
    FolderDownloadIcon,
    PencilIcon,
    ReplyIcon,
    SearchIcon,
    UserAddIcon,
  } from '@heroicons/react/solid'
  
import Reply from './reply';

const tabs = [
    {name: "all"},
    {name: "pending"},
    {name: "resolved"},    
]

const SupportItem = ({item, isSelected, onItemSelected}) => {
    const {
        last_read_time_stamp,
        sender_profile,
        participants,
        closed,
        subject,
        resolver,
        _id,
        responder,
        read,
        messages,
        date_created,
        last_updated,
    } = item;
    return (
        <>
            <li>
                
                <div  onClick={onItemSelected} className={classNames("block cursor-pointer", isSelected ? "bg-gray-100 " : "bg-white hover:bg-gray-100")}>
                    <div className="flex items-center px-4 py-4 md:px-8">
                        <div className="min-w-0 flex-1 flex items-center">
                
                            <div className="min-w-0 flex-1 md:grid md:grid-cols-2 md:gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-black truncate">{formatString(subject ?? '', 'capitalize')}</p>
                                    <p className="text-sm text-gray-400">
                                        {messages[0].body ? `${ messages[0].body.substr(0, 40)}...`: ""}
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <div>
                                        {/* <p className={classNames("flex items-center uppercase font-semibold text-sm ", isSelected ? "text-gray-600": "text-black")}>{`${codeWeightString}KG`}</p> */}
                                        <p className="flex text-gray-400 items-center text-sm ">
                                            {formatDate(date_created, 'll')}
                                        </p>
                                        
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
        </>
    )
}

const Page = () => {
    // const [modalVisible, setModalVisible] = React.useState(false);
    const [current, setCurrent] = React.useState();
    const [threads, setThreads] = React.useState();
    const [slideVisible, setSlideVisible] = React.useState(false);
    const [showReply, setShowReply] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();

   
    const[ getThread, { loading: loadingThread }] = useLazyQuery(GET_THREAD, {
        fetchPolicy: 'cache-and-network',
        variables: { id: current?._id },
        onCompleted: (payload) => {
            const {
                getResolutionThread
            } = payload;
            setCurrent(getResolutionThread);
        },
    });

    const onItemSelected = (item) => {
        setCurrent(item);
        setSlideVisible(true)
    };

    

    const { error, data, fetchMore, refetch, networkStatus } = useQuery(GET_RESOLUTION_THREADS, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            setLoading(false)
            console.log({ errors });
        },
        onCompleted: (data) => {
            const {results} = data.getResolutionThreads;
            setLoading(false);
            setThreads(results)
        }
    });

    const openCreate = () => {
       router.push("/support/create")
    }

    if(error){
        return(
            <Layout pathname={router.pathname}>
                <div className={"h-40 mt-auto flex items-center justify-center"}>
                    <Button
                        onClick={() => {
                            setLoading(false)
                            refetch && refetch()
                        }} 
                    >
                       Try Again
                    </Button>
                </div>
            </Layout>
        )
    }

    if(loading || !threads){
        return(
            <Layout pathname={router.pathname}>
                <Loading />
            </Layout>
        )
    }

    
    
    
    if(threads.length === 0){
        return(
            <Layout pathname={router.pathname}>
                <div className="bg-white sticky inset-0 z-30 shadow">
                    <div className="px-4 sm:px-6  lg:px-8">
                        <div className="py-6 md:flex md:items-center md:justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                    
                                    <div>
                                        <div className="flex items-center">
                                            <h3 className="ml-3 text-2xl font-bold leading-7 text-black sm:leading-9 sm:truncate">
                                            {"Support"}  
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-items-end space-x-3 md:mt-0 md:ml-4">
                                
                                <button
                                    onClick={openCreate}
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500" 
                                >
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
    return(
        <Layout pathname={router.pathname}>
            <div className="bg-white sticky inset-0 z-30 shadow">
                <div className="px-4 sm:px-6  lg:px-8">
                    <div className="py-6 md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                    
                                    <div>
                                        <div className="flex items-center">
                                            <h3 className="ml-3 text-2xl font-bold leading-7 text-black sm:leading-9 sm:truncate">
                                            {"Support"}  
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className="mt-6 flex justify-items-end space-x-3 md:mt-0 md:ml-4">
                            
                            <button
                                onClick={openCreate}
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500" 
                            >
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <Tabs tabs={tabs} />
                </div>
                    
                <div className="shadow pb-20 min-h-screen">
                    <div className="overflow-y-auto  max-h-screen ">
                        <ul className="divide-y divide-gray-100 ">
                            {threads.map((item, idx) => {
                                return(
                                    <SupportItem key={item._id} item={item} isSelected={current?._id === item._id} onItemSelected={() => onItemSelected(item)} />
                                );
                            })}
                        </ul>
                    </div>
                </div>
                
                {current && (<SlideOver setOpen={setSlideVisible} open={slideVisible}>
                    <div className="flex-shrink-0 relative bg-white border-b border-gray-200">
                        {/* Toolbar*/}
                        <div className="h-16 flex flex-col">
                            <div>
                                <div className="py-3 flex justify-between">
                                        {/* Left buttons */}
                                    <div>
                                        <span className="relative z-0 inline-flex shadow-sm rounded-md sm:shadow-none sm:space-x-3">
                                            <span className="inline-flex sm:shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() =>setShowReply(!showReply)}
                                                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                                            >
                                                <ReplyIcon className="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                <span>Reply</span>
                                            </button>
                                            {/* <button
                                                type="button"
                                                className="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                                            >
                                                <PencilIcon className="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                <span>Note</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                                            >
                                                <UserAddIcon className="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                <span>Assign</span>
                                            </button> */}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <div className="bg-white pt-5 pb-6 shadow">
                                <div className="sm:flex sm:justify-between sm:items-baseline">
                                    <div className="sm:w-0 sm:flex-1">
                                        <h1 id="message-heading" className="text-lg font-medium text-gray-900">
                                        {current?.subject ?? ""}
                                        </h1>
                                        <p className="mt-1 text-sm text-gray-500 truncate">{current?.sender_profile?.name ?? ""}</p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
                                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                                            {current?.status ?? ""}
                                        </span>
                                    {/* <Menu as="div" className="ml-3 relative inline-block text-left">
                                        {({ open }) => (
                                        <>
                                            <div>
                                                <Menu.Button className="-my-2 p-2 rounded-full bg-white flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
                                                <span className="sr-only">Open options</span>
                                                <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
                                                </Menu.Button>
                                            </div>

                                                <Transition
                                                    show={open}
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                        <Menu.Items
                                                        static
                                                        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                                        >
                                                        <div className="py-1">
                                                            <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                type="button"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                    'w-full flex justify-between px-4 py-2 text-sm'
                                                                )}
                                                                >
                                                                <span>Copy email address</span>
                                                                </button>
                                                            )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                href="#"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                    'flex justify-between px-4 py-2 text-sm'
                                                                )}
                                                                >
                                                                <span>Previous conversations</span>
                                                                </a>
                                                            )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                href="#"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                    'flex justify-between px-4 py-2 text-sm'
                                                                )}
                                                                >
                                                                <span>View original</span>
                                                                </a>
                                                            )}
                                                            </Menu.Item>
                                                        </div>
                                                        </Menu.Items>
                                                    </Transition>
                                            </>
                                            )}
                                         </Menu> */}
                                        </div>
                                    </div>
                                </div>
                                <ul className="py-4 space-y-2  sm:space-y-4 ">
                                    {current?.messages?.map((item) => {
                                        const { body = '', sender = undefined, date_created } = item || {};
                                        const isMe = sender && sender.toLowerCase() !== "support@sendbox.ng" || false;
                                        return(
                                            <li key={item._id} className="bg-white p-4 py-6 shadow sm:rounded-lg s">
                                                <div className="sm:flex sm:justify-between sm:items-baseline">
                                                <h3 className="text-base font-medium">
                                                    <span className="text-gray-900">{formatString(isMe ? 'Me' : 'Support', 'capitalize')}</span>{' '}
                                                    <span className="text-gray-600">wrote</span>
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-600 whitespace-nowrap sm:mt-0 sm:ml-3">
                                                    <time dateTime={item.date_created}>{formatDate(date_created, 'LLL')}</time>
                                                </p>
                                                </div>
                                                <div
                                                className="mt-4 space-y-6 text-sm text-gray-800"
                                                dangerouslySetInnerHTML={{ __html: item.body }}
                                                />
                                            </li>
                                    )})}
                                </ul>
                        </div>
                     </div> 
                     {showReply ? <Reply messageId={current?._id} fetchMessage={getThread} showReply={showReply} setShowReply={setShowReply} />: null}
  
                </SlideOver>)}
            </div>
            

        </Layout>
    )
}
export default Page;

