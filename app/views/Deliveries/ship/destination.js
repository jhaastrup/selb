import * as React from "react";
import _ from "lodash";
import metadata from "./metadata";
import {formatPhone, formatString} from "app/lib/formatters";
import AddressPlugin from "app/services/address";
import Addresses from "./addresses";
import Modal from "app/services/modal";
import {Button} from "app/components/forms";
import {classNames} from "app/lib/utils";
import ListItem from "./listItem";

const Page = ({onChangePage, pageData, setState, dependencies, updatePageData}) => {

    const [pluginModalVisible, setPluginModalVisible] = React.useState(false);
    const [addressModalVisible, setAdressModalVisible] = React.useState(false);


    const pageKey = 'destination';
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const { [pageKey]: initialValues = {} } = pageData;
    const { dependencies: shippingOptions } = dependencies;
    const nextPage = "items";

    const setPageData = (payload) => {
        updatePageData(payload)
    }
    const closeModal = () => {
        setPluginModalVisible(false);
        setAdressModalVisible(false)
    }

    const onItemSelected = (item) => {
        closeModal();
        onChangePage(nextPage, { [pageKey]: item });
    };

    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "default",
        }))
    }, []);

   

    const isEmpty = _.isEmpty(initialValues);
    const mainTitleText = isEmpty
        ? 'Enter your delivery address here'
        : _.compact([initialValues?.street || '', initialValues?.city || '']).join(', ');
    const mainSubText = isEmpty
        ? 'Tap to add new address'
        : _.compact([initialValues?.name || '', formatPhone(initialValues?.phone, 'NATIONAL') || '']).join(' \u2022 ');



    return(
        <div className={"p-4 max-h-screen mx-auto"}> 
            <div className={"my-4"}>
                <p className={"text-red-500 text-sm  font-semibold"}>{caption}</p> 
                <p className={"text-black text-sm md:text-base font-bold"}>{title}</p>
                <p className={"text-sm text-gray-500"}>{description}</p>
            </div>
            <div className={"w-full"}>
                    
                <div 
                    role={"button"} 
                    className={classNames("p-3 my-4", isEmpty ? "bg-gray-50": "bg-red-50")}
                    onClick={() => setPluginModalVisible(true)}
                >
                    <p className={"text-black text-xs md:text-sm font-bold"}>{mainTitleText}</p>
                    <p className={"text-xs text-black opacity-70"}>{mainSubText}</p>                        
                </div>

                <div className={"my-4"}>
                    <h4 className={"text-red-500 text-sm font-semibold mb-3"}>Saved Locations</h4>
                    <ul className="divide-y divide-gray-100 ">
                        {_.take(shippingOptions.addresses, 3).map((opt, idx) => {
                            const { name, email, phone, street, city, state, country, post_code, lat, lng, pk } = opt;
                            const titleText = _.compact([street || '', city || '']).join(', ');
                            const subText = _.compact([name || '', formatPhone(phone, 'NATIONAL') || '']).join(
                                ' \u2022 ',
                            );
                            const item = {
                                titleText,
                                subText
                            }
                            const payload = {
                                name,
                                email,
                                phone,
                                street,
                                city,
                                state,
                                country: country?.code,
                                post_code,
                                lat,
                                lng,
                                pk,
                            };
                            return(
                                <ListItem key={`${idx}- ${name}`} item={item} onItemSelected={() => onChangePage(nextPage, {[pageKey]: payload})} />

                            )
                        })}
                    </ul>
                </div>
                <div className={"my-4"}>
                    
                    <Button
                        onClick={() => setAdressModalVisible(true)}            
                        className={"rounded-3xl font-semibold text-black w-20 focus:outline-none focus:border-opacity-0 border border-gray-400 outline-none py-2 px-2"}
                    >
                        {"More"}
                    </Button>
                </div>
                    
                {!isEmpty && (<div className={"w-full px-5 mx-auto md:relative flex-col flex items-end"}>
                    
                    <Button
                        onClick={() => onChangePage(nextPage)}
                    >           
                        {"Continue"}
                    </Button>
                </div>)}
                {pluginModalVisible ? (
                    <Modal
                        onClose={closeModal}
                        open={pluginModalVisible}
                        title={"Add An Address"}
                    >
                        <AddressPlugin                               
                            onItemSelected={onItemSelected}
                            dependencies={shippingOptions.origin_countries}
                            initialData={_.isEmpty(initialValues) ? { country: 'NG' } : initialValues}
                            options={shippingOptions.addresses}
                        />
                    </Modal>
                ):null} 

                {addressModalVisible ? (
                    <Modal
                        onClose={closeModal}
                        open={addressModalVisible}
                        title={"Add An Address"}
                    >
                        <Addresses                              
                            onItemSelected={onItemSelected}
                            dependencies={shippingOptions}
                        />
                    </Modal>
                ):null} 
                </div>
        </div>
    )
}

export default Page;