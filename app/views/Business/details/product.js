import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, useMutation } from '@apollo/client';
import {formatDate, formatString, formatNumber} from "app/lib/formatters";
import { PublicLayout as Layout } from "app/views/Layout";
import Loading from "app/components/loading"
import _ from "lodash";
import Modal from "app/services/modal";
import { MERCHANT_PRODUCT } from '../modules/queries';
import { DELETE_POST } from '../modules/mutations';
import {Button} from "app/components/forms";
import EditPost from './edit';
import DialogModal from "app/services/dialog";
import Alert from "app/services/alerts/simpleAlert";




const Page = ({query}) => {

    const [dialogVisible, setDialogVisible] = React.useState(false); 
    const [modalVisible, setModalVisible] = React.useState(false);
    const [obj, setObj] = React.useState();
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [updateError, setUpdateError] = React.useState(false);

    const router = useRouter();
    const { refetch, loading, error, data } = useQuery(MERCHANT_PRODUCT, {
        fetchPolicy: 'cache-and-network',
        variables: { id: query.pid },
        onCompleted: (payload) => {
            const { getDiscoveryAdminPost } = payload;
            setObj(getDiscoveryAdminPost);
        },
    });

    const [deleteDiscoveryPost, { loading: deletingPost }] = useMutation(DELETE_POST, {
        onCompleted: (data) => {
            
        },
        onError: (err) => {
            console.log({ err });
            
        },
    });

    const handleDelete = (id) => {
        deleteDiscoveryPost({
            variables: {
                id,
            },
        });
        router.push("/business/products")
    };

    

    const _onUpdateCompleted = () => {
        setModalVisible(false);
        setAlertVisible(true);
        setUpdateError(true);
        setAlertMessage("Product updated successfully")
        refetch && refetch();
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
                <div className={"h-40 mt-auto flex items-center justify-center"}>
                    <Button
                        onClick={() => refetch && refetch()} 
                    >
                       Try Again
                    </Button>
                </div>
            </Layout>
        )
    }

    const {
        pk,
        name,
        weight = 0.5,
        height = 0,
        width = 0,
        length = 0,
        order_count = 0,
        units_sold = 0,
        price = 0,
        regular_price = 0,
        description = '',
        images = [],
        code,
        unique_views = 0,
        stock = 0,
        custom_category,
    } = data.getDiscoveryAdminPost;

    const dimensionList = [
        `${formatNumber(length, '0,0.[00]')} CM`,
        `${formatNumber(width, '0,0.[00]')} CM`,
        `${formatNumber(height, '0,0.[00]')} CM`,
    ];

    const dimensionString = dimensionList.join(' \u00D7 ');
    const strippedString = description ? description.replace(/(<([^>]+)>)/gi, '') : '';
    const imgUrl = images.length ? images[0].url : undefined
    return(
        <React.Fragment>
            <Layout back={router.back} isDynamic={true} pathname={router.pathname}>
                <div className={"max-w-3xl w-full relative p-2 md: mx-auto"}> 
                    <div className={"object-center w-full bg-backgroundGrey border md:h-64 h-36 border-textGrey"}>
                        <img className={"w-full h-full object-cover"} src={imgUrl} alt={name} />
                    </div>
                    <div className={"my-4 py-4 text-xs font-semibold px-2 gap-6 md:flex grid grid-cols-2 md:justify-start"}>
                        <Button
                            onClick={() => setModalVisible(true)}
                            className={"rounded focus:outline-none py-2 md:w-40   text-white appearance-none shadow-none uppercase px-2 focus:border-opacity-0 outline-none bg-black"}
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => setDialogVisible(!dialogVisible)}
                            className={"rounded focus:outline-none py-2 md:w-40  appearance-none text-black border border-textGrey uppercase px-2 outline-none  bg-white"}
                        >
                            Delete
                        </Button>
                    </div>
                    <div className={"my-4 flex flex-col justify-center items-start"}>
                        <p className={"text-black text-sm uppercase md:text-base font-semibold"}>{name}</p> 
                        
                    </div> 
                    <div className={"flex justify-start border-b py-4 border-transluscent-grey items-center"}>
                        <div className={"mr-4"}>
                            <span className={"text-black text-sm mr-1 font-semibold"}>{formatNumber(unique_views, '0,0')}</span> 
                            <span className={"text-textGrey text-sm md:text-sm capitalize font-semibold"}>views</span> 

                        </div>
                        <div className={"mr-4"}>
                            <span className={"text-black text-sm mr-1 font-semibold"}>{formatNumber(order_count, '0,0')}</span> 
                            <span className={"text-textGrey text-sm md:text-sm capitalize font-semibold"}>orders</span> 

                        </div>
                        <div>
                            <span className={"text-black text-sm mr-1 capitalize font-semibold"}>{formatNumber(units_sold, '0,0')}</span> 
                            <span className={"text-textGrey text-sm md:text-sm capitalize font-semibold"}>units sold</span> 

                        </div>
                        
                    </div>
                    <div className={"flex flex-col border-b py-3 border-transluscent-grey items-start"}>
                        <p className={"text-textGrey text-xs md:text-sm font-semibold uppercase"}>{"Description"}</p> 
                        <p className={"text-black mt-3 font-semibold text-sm"}>{strippedString}</p> 

                    </div>

                    <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                        <p className={"text-textGrey uppercase font-semibold text-xs"}>{"sku"}</p>
                        <p className={"text-black text-xs font-semibold"}>{`${formatString(
                                    code ?? '-',
                                    'uppercase',
                        )}`}</p>
                    </div>

                    <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                        <p className={"text-textGrey uppercase font-semibold text-xs"}>{"category"}</p>
                        <p className={"text-black text-xs font-semibold"}>{`${formatString(
                                    custom_category?.name ?? '-',
                                    'uppercase',
                                )}`}</p>
                    </div>
                    <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                        <p className={"text-textGrey uppercase font-semibold text-xs"}>{"Quantity Available"}</p>
                        <p className={"text-black text-xs font-semibold"}>{`${formatNumber(
                                    stock ?? 0,
                                    '0,0',
                                )}`}</p>
                    </div>

                    <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                        <p className={"text-textGrey uppercase font-semibold text-xs"}>{"weight"}</p>
                        <div>
                        <p className={"text-black text-xs font-semibold"}>{`${formatNumber(
                                    weight ?? 0,
                                    '0,0.[00]',
                                )}KG`}</p>
                                <p className={"text-textGrey uppercase font-semibold text-xs"}>{dimensionString}</p>

                        </div>
                        
                    </div>
                    <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                        <p className={"text-textGrey uppercase font-semibold text-xs"}>{"price"}</p>
                        <p className={"text-black text-xs font-semibold"}>{`NGN ${formatNumber(
                                    price ?? 0,
                                    '0,0.[00]',
                                )}`}</p>
                    </div>
                   

                </div>
                {modalVisible ? (
                    <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
                        <EditPost 
                            itemObject={obj}
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