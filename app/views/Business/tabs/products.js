import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import {formatDate, formatString, formatNumber} from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import { MERCHANT_PRODUCTS } from '../modules/queries';
import {DELETE_POST} from "../modules/mutations";
import {Button} from "app/components/forms";
import EditPost from '../details/edit';
import DialogModal from "app/services/dialog";
import Alert from "app/services/alerts/simpleAlert";
import Modal from "app/services/modal";
import Tabs from "app/components/tabs";
import SlideOver from "app/components/slideOver";
import {classNames} from "app/lib/utils";
import Toolbar from "app/components/toolbar";



const ProductItem = ({item, isSelected, onItemSelected}) => {
    // function classNames(...classes) {
    //     return classes.filter(Boolean).join(' ')
    //   }
    const {
        pk,
        code,
        name,
        stock,
        weight,
        height,
        width,
        length,
        order_count,
        units_sold,
        on_sale,
        price,
        regular_price,
        description = '',
        images,
        published,
        views,
        unique_views,
        interaction,
        social_id,
        social_url,
        visible,
        date_created,
    } = item;
    const uri = images && images.length > 0 && images[0].url ? images[0].url : undefined;
    const handleClick = () => {
        onItemSelected();
    }
    return(
        
        
        <React.Fragment>
            
            <li className="relative">
                <div
                onClick={handleClick}
                className={classNames(
                    isSelected
                    ? 'ring-2 ring-offset-2 ring-indigo-500'
                    : 'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500',
                    'group cursor-pointer block w-full 2xl:h-60 h-36 aspect-w-10 aspect-h-7 rounded-lg overflow-hidden'
                )}
                >
                    <img
                        src={uri}
                        alt="product-photo"
                        className={classNames(
                        isSelected ? '' : 'group-hover:opacity-75',
                        'object-cover pointer-events-none  h-full w-full'
                        )}
                    />
                    <button type="button" className="absolute inset-0">
                        <span className="sr-only">View details for {name}</span>
                    </button>
                </div>
                <p className="mt-2 block text-sm xl:text-base font-medium text-gray-900 truncate pointer-events-none">
                    {name}
                </p>
                <p className="block text-sm xl:text-base font-medium text-gray-500 pointer-events-none">{`\u20a6 ${formatNumber(price, '0,0.00')}`}</p>
            </li>
        </React.Fragment>

    )
}

const tabs = [
    {name: "all"},
    {name: "available"},
    {name: "recent"},
]

const Page = () => {
    const dataLabel = 'getDiscoveryAdminPosts';
    const router = useRouter();
    const [current, setCurrent] = React.useState();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [updateError, setUpdateError] = React.useState(false);
    const [slideVisible, setSlideVisible] = React.useState(false);

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(MERCHANT_PRODUCTS, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
        onError: (errors) => {
            console.log({ errors });
        },
        
    });

    
   

    const onItemSelected = (item) => {
        setCurrent(item);
        setSlideVisible(true)
    };


    const dimensionList = [
        `${formatNumber(current?.length, '0,0.[00]')} CM`,
        `${formatNumber(current?.width, '0,0.[00]')} CM`,
        `${formatNumber(current?.height, '0,0.[00]')} CM`,
    ];

    const dimensionString = dimensionList.join(' \u00D7 ');
    const strippedString = current?.description ? current?.description.replace(/(<([^>]+)>)/gi, '') : '';
   

    // methods for larger screens
    const [deleteDiscoveryPost, { loading: deletingPost }] = useMutation(DELETE_POST, {
        onCompleted: (data) => {
            setCurrent(undefined);
        },
        onError: (err) => {
            console.log({ err });
        },
        refetchQueries: [{query: MERCHANT_PRODUCTS}]
    });

    const handleDelete = (id) => {
        deleteDiscoveryPost({
            variables: {
                id,
            },
        });
    };

    const _onUpdateCompleted = () => {
        setModalVisible(false);
        setAlertVisible(true);
        setUpdateError(true);
        setAlertMessage("Product updated successfully")
    };
    const _onUpdateError = () => {
        setModalVisible(false);
        setAlertVisible(true);
        setAlertMessage('Product update failed');
        setUpdateError(true);
    };

    if(loading){
        return(
            <Layout pathname={router.pathname}>
                <Loading />
            </Layout>
        )
    }

    if(error){
        return(
            <Layout pathname={router.pathname}>
            
            <div className="md:flex md:items-center md:justify-between p-4 md:px-6 md:py-8 md:sticky md:top-0 bg-white z-20">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Products</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/e-commerce/create/product")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            List Product
                        </button>
                        
                    </div>
                </div>
                <div className={"max-w-3xl w-full p-2 min-h-full  m-auto justify-center items-center flex flex-col md:p-0 mx-auto"}>
                    <div className={"my-4"}>
                        <p className={"text-black text-center text-base font-semibold"}>{"An error ocurred"}</p> 
                        <p className={"text-textGrey text-center text-sm "}>{"Your products will appear here"}</p>
                        
                    </div>
                    <button
                        className="uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        
                        onClick={() => refetch && refetch()} 
                    >
                       Try Again
                    </button>
                </div>
            </Layout>
        )
    }
    const { results, metadata = {} } = data[dataLabel];

    if(results.length === 0){
        return(
            <Layout pathname={router.pathname}>
                <div className="md:flex md:items-center md:justify-between p-4 md:px-6 md:py-8 md:sticky md:top-0 bg-white z-20">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Products</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/e-commerce/create/product")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                           List Product
                        </button>
                       
                    </div>
                </div>
                <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                    <div className={"my-4"}>
                        <p className={"text-black text-center text-base font-semibold"}>{"No product listed"}</p> 
                        <p className={"text-textGrey text-center text-sm "}>{"Your Products will appear here"}</p>
                        
                    </div>
                    
                    
                </div>
            </Layout>
        )
    }
    return(
        <React.Fragment>
            <Layout pathname={router.pathname}>
                <div className="md:flex md:items-center md:justify-between p-4 md:px-6 md:py-8 md:sticky md:top-0 bg-white z-20">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-4xl font-bold tracking-tight leading-7 text-gray-900 sm:text-3xl sm:truncate">Products</h2>
                    </div>
                    <div className="mt-8 flex space-x-2 md:mt-0 md:ml-4">
                        <button
                            onClick={() =>  router.push("/e-commerce/create/product")}
                            type="button"
                            className="inline-flex flex-1 uppercase justify-center whitespace-nowrap items-center px-4 py-3 border border-gray-300 rounded-sm shadow-sm text-xs tracking-wide font-bold text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            List Product
                        </button>
                       
                    </div>
                </div>
                <Toolbar />
                <div className={"overflow-hidden max-w-max "}>
                    <div className="bg-gray-50 min-h-screen">
                        <div className="overflow-y-auto  max-h-screen ">
                            <section className="mt-0 pb-16 p-4" aria-labelledby="gallery-heading">
                                <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 pb-10 sm:grid-cols-3  sm:gap-x-6 md:grid-cols-4  xl:grid-cols-5 2xl:grid-cols-6 xl:gap-x-8 2xl:gap-y-10">

                                    {results.map((item, idx) => {
                                        return(
                                            <ProductItem key={`${item.sku}-${idx}`} isSelected={current?.pk === item.pk} item={item} onItemSelected={() => onItemSelected(item)} />
                                        );
                                    })}
                                </ul>
                            
                            </section>
                        </div>
                    </div>
                    {current && (<SlideOver setOpen={setSlideVisible} open={slideVisible}>
                        <div className="pb-16 space-y-6">
                                <div>
                                    <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                                        <img src={current?.images?.length > 0 && current.images[0].url ? current.images[0].url : undefined} alt={`${current?.name}`} className="object-cover" />
                                    </div>
                                    <div className="mt-4 flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-medium text-gray-900">
                                            <span className="sr-only">Details for </span>
                                            {current?.name}
                                            </h2>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className={"flex justify-start flex-wrap border-b py-4 border-transluscent-grey items-center"}>
                                    <div className={"mr-4"}>
                                        <span className={"text-black text-sm mr-1"}>{formatNumber(current?.unique_views, '0,0')}</span> 
                                        <span className={"text-gray-500 text-sm md:text-sm capitalize"}>views</span> 

                                    </div>
                                    <div className={"mr-4"}>
                                        <span className={"text-black text-sm mr-1"}>{formatNumber(current?.order_count, '0,0')}</span> 
                                        <span className={"text-gray-500 text-sm md:text-sm capitalize"}>orders</span> 

                                    </div>
                                    <div>
                                        <span className={"text-black text-sm mr-1 capitalize "}>{formatNumber(current?.units_sold, '0,0')}</span> 
                                        <span className={"text-gray-500 text-sm  capitalize"}>units sold</span> 

                                    </div>
                            
                                </div>
                                <div className="flex">
                                    <button
                                    onClick={() => setModalVisible(true)}
                                        type="button"
                                        className="lg:w-32 bg-indigo-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDialogVisible(!dialogVisible)}
                                        type="button"
                                        className="ml-3 lg:w-32 bg-red-600 py-2 px-4 border border-red-500 rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                    Delete
                                    </button>
                                </div>
                                <div>
                                    <dl className="mt-2 border-t border-b border-textGrey divide-y divide-textGrey">
                                    
                                        <div className="py-3 flex justify-between flex-wrap text-sm font-medium">
                                            <dt className="text-textGrey">{"Description"}</dt>
                                            <dd className="text-black">{strippedString}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between  text-sm font-medium">
                                            <dt className="text-textGrey">{"Sku"}</dt>
                                            <dd className="text-black truncate">{`${formatString(
                                                current?.code ?? '-',
                                                'uppercase',
                                            )}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-textGrey">{"Category"}</dt>
                                            <dd className="text-black truncate">{`${formatString(
                                                current?.custom_category?.name ?? '-',
                                                'uppercase',
                                            )}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-textGrey">{"Quantity Available"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(
                                                current?.stock ?? 0,
                                                '0,0',
                                            )}`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-textGrey">{"Weight"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(
                                                current?.weight ?? 0,
                                                '0,0.[00]',
                                            )}KG`}</dd>
                                        </div>
                                        <div className="py-3 flex justify-between text-sm font-medium">
                                            <dt className="text-textGrey">{"Price"}</dt>
                                            <dd className="text-black truncate">{`${formatNumber(
                                                current?.price ?? 0,
                                                '0,0.[00]',
                                            )}`}</dd>
                                        </div>
                                    </dl>
                                </div>
                                
                            </div>
                    </SlideOver>)}
                    
                </div>
                {modalVisible ? (
                    <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
                        <EditPost 
                            itemObject={current}
                            onUpdateCompleted={_onUpdateCompleted}
                            onUpdateError={_onUpdateError}
                        />
                    </Modal>

                ): null}
                {dialogVisible ? (
                    <DialogModal
                        open={dialogVisible}
                        onClose={setDialogVisible}
                        action={"Delete"}
                        dialogAction={() => handleDelete(current.pk)}
                        title={"Delete Product"}
                        description={"Are you sure you want to delete this product?"}
                    />
                ): null}
                {alertVisible && <Alert updateError={updateError} description={alertMessage} show={alertVisible} onClose={setAlertVisible}/>}
            </Layout>
        </React.Fragment>
        
    )
}

export default Page;