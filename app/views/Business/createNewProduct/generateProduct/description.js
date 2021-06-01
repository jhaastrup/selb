import * as React from "react";
import {useMutation} from "@apollo/client";
import { ADD_NEW_PRODUCT } from '../../modules/mutations';
import Fuse from "fuse.js";
import {toBase64, uuid} from "app/lib/utils";
import Modal from "app/components/simpleModal";
import Social from "./socialComponent";
import {CloseIcon, ChevronForward} from "app/components/icons";
import { ChevronRightIcon, MailIcon } from '@heroicons/react/solid'

import { Button} from "app/components/forms";
import {ItemModal, PriceModal, ShipModal} from "./modals";
import {formatDate, formatNumber, formatString} from "app/lib/formatters";



const Page = ({
    dependencies, 
    onChangePage, 
    pageData, 
    updatePageData,
    onTransition,
    setState
}) => {
   
    const { dependencies: shippingOptions } = dependencies;
    const [descriptionModal, setDescriptionModal] = React.useState(false);
    const [pricingModal, setPricingModal] = React.useState(false);
    const [shippingModal, setShippingModal] = React.useState(false);
    const fileRef = React.useRef();


    const {
        itemDescription = undefined,
        itemPricing = undefined,
        itemShipping = undefined,
        images = [],
    } = pageData;

    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);

    const { discoveryDependencies } = dependencies;


    const [createDiscoveryPost, {loading}] = useMutation(ADD_NEW_PRODUCT, {
        onCompleted: (data) => {
            console.log({ data });
            onChangePage('success', {});
        },
        onError: (err) => {
            console.log({ err });
            onChangePage('error', {});
        },
    });

    
    const buildVariables = () => {
        const formattedImages = images.map((item) => ({
            name: uuid().toString(),
            data: item?.data ?? '',
            id: '',
            media_type: item.media_type
        }));

        const pricing = {
            ...itemPricing,
            price: parseFloat(itemPricing?.standard_price ?? 0),
            stock: parseFloat(itemPricing?.stock ?? 0),
        };
        const shipping = {
            ...itemShipping,
            width: parseFloat(itemShipping?.width ?? 0),
            length: parseFloat(itemShipping?.length ?? 0),
            height: parseFloat(itemShipping?.height ?? 0),
            weight: parseFloat(itemShipping?.weight ?? 0),
            category: itemShipping.category,
        };

        const variables = {
            ...itemDescription,
            ...pricing,
            ...shipping,
            images: formattedImages,
        };

        return variables;
    };

    const createProduct = (e) => {
        e.preventDefault();
        const variables = buildVariables();
        createDiscoveryPost({variables});
    };

    const shippingData = itemShipping
        ? _.compact([
              formatNumber(itemShipping.weight) + 'KG' || '',
              formatNumber(itemShipping.width) + 'CM' || '',
              formatNumber(itemShipping.length) + 'CM' || '',
              formatNumber(itemShipping.height) + 'CM' || '',
          ])
              .join(' \u2022 ')
              .trim()
    : '';


    const onUploadClicked = () => {
        fileRef.current.click();
    };

    const onFileChanged = async (e) => {
        const payload = e.target.files[0];
        if(payload){
            await addFiles(payload);
        }
        return;
    };

    const addFiles = async (file) => {
        const attachments = pageData && pageData.images && pageData.images.length ? pageData.images : []
        const base64 = await toBase64(file);
        const processedFile = { data: base64, name: file.name, media_type: file.type };
        updatePageData({images: attachments.concat([processedFile])});
    };
   

    
    const removeImage = (id) => {
        const items = images;
        const arr = items.filter(function (item) {
            return item.id !== id;
        });

        updatePageData({ images: [...arr] });
    };


    return(
        
        <div className={"px-4 mx-auto"}> 
            <div className={"mt-6"}>
                <Button
                    onClick={onUploadClicked}
                    className={"appearance-none font-semibold text-xs rounded border py-2 px-2 border-gray-500 md:w-24 outline-none focus:outline-none bg-white text-black"}>
                    <input 
                        ref={fileRef} 
                        type="file" 
                        onChange={onFileChanged} 
                        style={{display: "none"}} 

                    />
                    {"ADD PHOTOS"}
                </Button>
            </div>
            {images && images.length > 0 ? (
                <div className={"flex flex-wrap  mt-2"}>
                    {images.map((elem, idx) => {
                        return(
                            <div className={"col-span-1 relative mr-1 w-12 h-12 bg-backgroundGrey"}>                                    
                                <img className={"w-full h-full object-cover"} src={`data:image/gif;base64,${elem.data}`} alt={`image${idx}`} />
                                <div 
                                    onClick={() => removeImage(elem.id)}
                                    className={"col-span-1 top-0 right-0 absolute justify-center flex w-4 h-4 items-center rounded-full bg-primary"}>
                                    <CloseIcon size={20} />
                                </div>
                            </div>
                        
                    )})}
                </div>
            ): null}

            <div 
                onClick={() => setDescriptionModal(true)} 
                className={"grid mt-4 grid-cols-5 cursor-pointer gap-2 py-2 text-xs border-b border-gray-100"}
            >
                <div className={"col-span-4 py-3 flex flex-col items-start  justify-end"}>
                    <p className={"font-semibold text-sm text-gray-500"}>{itemDescription?.name ?? 'Name & Description'}</p>
                    <p className={"font-semibold text-gray-500"} >{itemDescription?.description ?? ''}</p>
                </div>
                
                <div className={"col-span-1 flex justify-end items-center"}>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                                        
            </div>
            <div
                onClick={() => {setPricingModal(true)}}
                className={"grid grid-cols-5 cursor-pointer gap-2 py-2 text-xs border-b border-gray-100"}
            >
                
                <div className={"col-span-4 py-2 flex flex-col items-start  justify-end"}>
                    <p className={"font-semibold text-sm text-gray-500"}>{itemPricing
                                        ? `NGN ${itemPricing?.standard_price ?? ''}`
                        : 'Pricing & Availability'}</p>
                    <p className={"font-semibold text-gray-500"} >
                        {itemPricing ? `${itemPricing?.stock ?? ''} Available` : ''}
                    </p>
                </div>
                
                <div className={"col-span-1 flex justify-end items-center"}>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />

                </div>
                                        
            </div>
            <div 
                onClick={() => setShippingModal(true)}
                className={"grid grid-cols-5 cursor-pointer gap-2 py-2 text-xs border-b border-gray-100"}>
                
                <div className={"col-span-4 py-2 flex flex-col items-start  justify-end"}>
                    <p className={"font-semibold text-sm text-gray-500"}>{itemShipping
                                        ? `${formatString(itemShipping?.shipping_category ?? '', 'capitalize')}`
                                        : 'Shipping Configuration'}
                    </p>
                    <p className={"font-semibold text-gray-500"} >
                        {shippingData}
                    </p>
                </div>
                
                <div className={"col-span-1 flex justify-end items-center"}>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />

                </div>
                                        
            </div>
            <div className={"w-full mt-6 mx-auto md:relative md:mt-4 flex-col flex items-end"}>
                <Button
                    disabled={
                        !itemDescription || !itemPricing || !itemShipping || !images || images.length < 1 || loading
                            ? 1
                            : 0
                    }
                    onClick={(e) => createProduct(e)}
                >
                    CREATE PRODUCT
                </Button>
            </div>
            {descriptionModal ? (
                <Modal open={descriptionModal} title={"Product description"} onClose={() => setDescriptionModal(false)}>
                    <ItemModal 
                        options={discoveryDependencies}
                        refetchDependencies={onTransition}
                        setDescriptionModal={setDescriptionModal}
                        onCompleted={(data) => {
                            updatePageData({ itemDescription: data });
                            setDescriptionModal(false)
                        }}
                    />
                </Modal>

            ): null}
            {pricingModal ? (
                <Modal open={pricingModal} title={"product price and Availability"} onClose={() => setPricingModal(false)}>
                    <PriceModal
                        onCompleted={(data) => {
                            updatePageData({ itemPricing: data });
                            setPricingModal(false);
                        }}
                    />
                </Modal>

            ): null}
            {shippingModal ? (
                <Modal open={shippingModal} title={"Shipping Configuration"} onClose={() => setShippingModal(false)}>
                    <ShipModal 
                        options={shippingOptions.item_types}
                        onCompleted={(data) => {                         
                            updatePageData({ itemShipping: data });
                            setShippingModal(false);
                        }}
                    />
                </Modal>

            ): null}
           
        </div>
    )
}
export default Page;