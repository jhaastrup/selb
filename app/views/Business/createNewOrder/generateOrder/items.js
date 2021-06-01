import * as React from "react";
import metadata from "./metadata";
import ItemPlugin from "./itemPlugin";
import Modal from "app/components/simpleModal";
import {formatPhone, formatString, formatNumber, toNumber} from "app/lib/formatters";
import {Button, RadioButton} from "app/components/forms";
import {CloseIcon, ArrowLeft, ChevronDown} from "app/components/icons";


const Page = ({onChangePage, dependencies, setState, pageData, updatePageData}) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [editPos, setEditPos] = React.useState();
    const [modalData, setModalData] = React.useState({});

    const pageKey = 'items';
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const { [pageKey]: initialValues = [] } = pageData;
    const { dependencies: shippingOptions } = dependencies;
    const { merchantProducts: storeItems } = dependencies;


    const isEmpty = _.isEmpty(initialValues);
    const mainTitleText = initialValues && initialValues.length > 0 ? 'Add another item' : 'Add an item';


    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: undefined,
        }))
    }, []);
    
    const openModal = (data = {}, pos) => {
        setEditPos(pos);
        setModalData(data);
        setTimeout(() => {
            setModalVisible(true);
        }, 20);
    };

    const closeModal = () => {
        setModalVisible(false);
    }

    const onCompleted = (item, pos = undefined) => {
        closeModal();
        const updatedPageData = initialValues;
        pos !== undefined ? updatedPageData.splice(pos, 1, item) : updatedPageData.push(item);
        updatePageData({ [pageKey]: updatedPageData });
    };

    const removeItem = (pos) => {
        const updatedPageData = initialValues;
        updatedPageData.splice(pos, 1);
        updatePageData({ [pageKey]: updatedPageData });
    };


    return(
        <div className={"px-4 mx-auto"}>  
             
            <div className={"my-4"}>
                    <p className={"text-red-500 text-sm font-semibold"}>{caption}</p> 
                    <p className={"text-black text-sm md:text-base font-bold"}>{title}</p>
                    <p className={"text-sm text-gray-500"}>{description}</p>
            </div>

            <div className={"my-4"}>
                        
                {!initialValues.length ? (<Button
                    onClick={() => openModal({}, undefined)}            
                    className={"rounded-3xl text-xs capitalize py-2 px-3 font-semibold text-white bg-black border  focus:outline-none focus:border-opacity-0 outline-none "}
                >
                    {mainTitleText}
                </Button>): (<Button
                    onClick={() => openModal({}, undefined)}            
                    className={"rounded-3xl capitalize text-sm py-2 px-3 font-semibold text-black bg-white border-black border  focus:outline-none focus:border-opacity-0 outline-none"}
                >
                    {mainTitleText}
                </Button>)}
                
            </div>
             

             {initialValues && initialValues.length > 0 && (
                <div>
                    <div>

                        {initialValues.map((opt, idx) => {
                            const { name, item_type_code, quantity, weight, value } = opt;
                                        const titleText = name;
                                        const subText =
                                            shippingOptions.item_types.find((elem) => elem.code === item_type_code)?.name || '';

                                        const qty = parseInt(quantity, 10);
                                        const iconName = qty > 10 ? '10+' : `${quantity}`;

                            return(
                                    <div key={`${idx}-name`} className={"grid grid-cols-7 gap-2 py-2 text-xs border-b border-transluscent-grey"}>
                                        <div className={"col-span-1 flex justify-center h-8 w-8 items-center bg-gray-200 rounded-full"}>
                                           {iconName}
                                        </div>
                                        <div className={"col-span-4 flex flex-col items-start  justify-center"}>
                                            <p className={"font-semibold "}>{titleText}</p>
                                            <span className={"font-semibold  text-gray-500"} >{subText}</span>
                                        </div>
                                        <div className={"col-span-1 flex justify-center flex-col items-center"}>
                                            <div className={"flex justify-center h-8 w-8 items-center bg-gray-200 rounded-full"}>
                                                <Button 
                                                    title={"Delete item"}
                                                    onClick={() =>removeItem(idx)}
                                                    className={"flex flex-col px-2 py-2 items-center rounded-full md:py-3 md:px-3 focus:border-opacity-0 focus:outline-none border-0 outline-none"}

                                                >
                                                    <CloseIcon size={15} color={"rgba(6,15,33, 1)"}/>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className={"col-span-1 flex justify-end items-center"}>
                                            <div className={"flex justify-center h-8 w-8 items-center bg-gray-200 rounded-full"}>

                                                <Button
                                                    title={"Edit item"}
                                                    onClick={() => openModal(opt, idx)}  
                                                    className={"flex flex-col md:py-3 md:px-3 px-2 py-2 focus:border-opacity-0 focus:outline-none border-0 outline-none"}
                                                >
                                                    <ChevronDown size={15} color={"rgba(6,15,33, 1)"}/>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                
                            )
                        })}
                        <div className={"my-6"}>
                            <p className={"text-red-600 text-xs md:text-sm font-semibold"}>{"SUMMARY"}</p> 

                            <div className={"flex justify-between my-4 py-2 border-b border-transluscent-grey"}>
                                <p className={"text-gray-500 font-semibold text-xs"}>{"Number of Items"}</p>
                                <p className={"text-black text-sm font-semibold"}>{`${formatNumber(
                                        _.reduce(initialValues, (p, c) => p + parseInt(c.quantity, 10), 0),
                                        '0,0',
                                    )}`}</p>
                            </div>
                           
                            <div className={"flex justify-between my-4 border-b py-2 border-transluscent-grey"}>
                                <p className={"text-gray-500 font-semibold text-xs"}>{"Total Value(NGN)"}</p>
                                <p className={"text-black text-sm font-semibold"}>{`${formatNumber(
                                        _.reduce(initialValues, (p, c) => p + parseInt(c.value, 10), 0),
                                        '0,0',
                                    )}`}</p>
                            </div>
                        </div>
                        {!isEmpty && (<div className={"mb-4"}>
                            <p className={"text-gray-500  text-sm"}>
                                {"  By continuing this transaction, I represent that my declaration is a true and accurate representation of the items i intend to ship."}
                            </p>
                        </div>)}
                        

                            <div className={"w-full mx-auto md:relative flex-col flex items-end"}>

                            <Button
                                onClick={() => onChangePage("destination")}           
                            >
                                {"Continue"}
                            </Button>
                        </div>
                    </div>       
                </div>
             )}
             {modalVisible && (
                 <Modal title={"Add An Item"} open={modalVisible} onClose={closeModal}>
                     <ItemPlugin
                        products={storeItems.results}
                        initialData={modalData}
                        initialPos={editPos}
                        onCompleted={(data) => {
                            onCompleted(data);
                        }}
                        optionName={'post'}
                        options={shippingOptions.item_types}
                      />
                 </Modal>
             )}
        
        </div>
    )
}
export default Page;