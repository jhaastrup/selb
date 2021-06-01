import * as React from "react";
import _ from "lodash";
import metadata from "./metadata";
import {formatPhone, formatString} from "app/lib/formatters";
import Modal from "app/components/simpleModal";
import Locations from "./locations";
import {ChevronForward} from "app/components/icons"
import {Button} from "app/components/forms";


const Page = ({onChangePage, pageData, setState, dependencies, updatePageData}) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalData, setModalData] = React.useState({});
    const pageKey = 'drop_off';
    const nextPage = "destination";
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const { origin: initialValues = {}, quoteData = {} } = pageData;
    const { dependencies: shippingOptions } = dependencies;

    const groupedLocations = _.groupBy(shippingOptions.drop_off_locations, (elem) => elem.state);

    const isEmpty = _.isEmpty(initialValues);
    const mainTitleText = isEmpty
        ? 'Enter your pickup address here'
        : _.compact([initialValues?.street || '', initialValues?.city || '']).join(', ');
    const mainSubText = isEmpty
        ? 'tap here to continue'
        : _.compact([initialValues?.name || '', formatPhone(initialValues?.phone, 'NATIONAL') || '']).join(' \u2022 ');



    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

    const openModal = (data = {}) => {
        setModalData(data);
        setTimeout(() => {
            setModalVisible(true);
        }, 20);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalData({});
    };

    const onCompleted = (item) => {
        updatePageData({ ['origin']: item });
        closeModal();
        
    };

    return(
        
        <div className={"max-w-3xl p-2 md:p-0 mx-auto"}>  
             
            <div className={"my-4"}>
                    <p className={"text-red-500 text-sm font-semibold"}>{caption}</p> 
                    <p className={"text-black text-sm md:text-base font-bold"}>{title}</p>
                    <p className={"text-sm text-gray-500"}>{description}</p>
            </div>
            <div className={"my-4"}>
                        
                <Button
                   onClick={() => onChangePage("default")}         
                    className={"rounded-3xl text-xs uppercase py-2 px-3 font-semibold text-white bg-black border  focus:outline-none focus:border-opacity-0 outline-none "}
                >
                    {"pick from me"}
                </Button> 
            </div>

            <div className={"my-4"}>
                {isEmpty ? (<div>
                    <p className={"text-red-500 uppercase text-sm font-semibold"}>{"Locations"}</p>
                    {Object.entries(groupedLocations).map((opt, idx) => {
                        const [section, addresses] = opt;
            
                        const iconName = addresses.length > 10 ? '10+' : `${addresses.length}`;
                        return(
                            <div 
                                    key={idx}
                                    onClick={() => openModal({ section, addresses })}
                                    className={"grid py-3 grid-cols-5 cursor-pointer border border-r-0 border-l-0 border-t-0 border-gray-100"}
                                 >

                                    <div className={"col-span-3 flex-col justify-center flex items-start"}>
                                        <p className={"text-black text-xs md:text-sm font-semibold"}> {formatString(`${section}`, 'uppercase')}</p>
                                    </div>
                                    <div className={"col-span-1 h-8 w-8 flex bg-gray-200 flex-col rounded-full justify-center items-center"}>
                                        {iconName}
                                    </div>
                                    <div className={"col-span-1  flex-col justify-center flex items-end"}>
                                        <ChevronForward />
                                    </div>
                                </div>
                        )
                    })}
                    </div>): (
                        <div 
                            role={"button"} 
                            className={"p-3 bg-transluscent-primary my-4"} 
                            onClick={() => updatePageData({origin: undefined})}
                        >
                        <p className={"text-black text-xs md:text-sm font-bold"}>{mainTitleText}</p>
                        <p className={"text-xs text-black opacity-70"}>{mainSubText}</p>                        
                    </div>
                    )}
            </div>
            {!isEmpty &&(<div className={"w-full px-4 -ml-2 mx-auto md:relative flex-col flex items-end"}>

                        
                <Button
                    onClick={() => onChangePage(nextPage)}            
                >
                    {"Continue"}
                </Button>
            </div>)}

            {modalVisible && (
                 <Modal title={"Select A Hub"} open={modalVisible} onClose={closeModal}>
                    <Locations 
                            onCompleted={onCompleted} 
                            initialData={modalData}
                            pageData={pageData}
                        />
                 </Modal>
             )}
        </div>

    )
}

export default Page;