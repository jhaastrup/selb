import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import AddressPlugin from "app/services/address";
import Addresses from "./addresses";
import Modal from "app/services/modal";
import {Button} from "app/components/forms";
import cx from "classnames";
import {ChevronForward} from "app/components/icons"
import { Spacer } from "app/components/assets";

const Page = ({onChangePage, pageData = {}, setState, dependencies, updatePageData}) => {

    const [pluginModalVisible, setPluginModalVisible] = React.useState(false);
    const [addressModalVisible, setAdressModalVisible] = React.useState(false);


    const pageKey = 'destination';
    const { [pageKey]: initialValues = {} } = pageData;
    const { dependencies: shippingOptions } = dependencies;
    const nextPage = "review";

    console.log({pageData, initialValues});

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
            previousPage: undefined,
        }))
    }, []);

   

    const isEmpty = _.isEmpty(initialValues);
    const mainTitleText = isEmpty
        ? 'Enter your delivery address here'
        : _.compact([initialValues?.street || '', initialValues?.city || '']).join(', ');
    const mainSubText = isEmpty
        ? 'Tap to add new address'
        : _.compact([initialValues?.name || '', formatPhone(initialValues?.phone, 'NATIONAL') || '']).join(' \u2022 ');

    const caption = 'DESTINATION';
    const title = 'Where will your package be delivered to?';
    const description =
        'Please detail this information as accurately as possible. It is used by the dispatch to complete your request.';

    const filteredAddresses = _.filter(shippingOptions.addresses, (address) => ["NG"].includes(address.country.code))

    return(
        <div className={"max-w-3xl p-2 md:p-0 mx-auto"}> 
                <Spacer className={"block h-6"} />
                <div className={"mt-8 mb-4"}>
                    <p className={"text-primary text-xs md:text-sm tracking-wider mb-2"}>{caption}</p> 
                    <p className={"text-black text-sm md:text-base font-bold tracking-wider mb-2"}>{title}</p>
                    <p className={"text-xs md:text-sm text-textGrey"}>{description}</p>
                </div>
                <div className={"w-full"}>
                    <Spacer className={"block h-4"} />
                    <div 
                        role={"button"} 
                        className={`p-3 ${cx({
                            "bg-transluscent-grey": isEmpty,
                            "bg-transluscent-primary": !isEmpty
                        })}`} 
                        onClick={() => setPluginModalVisible(true)}
                    >
                        <p className={"text-black text-xs md:text-sm font-semibold tracking-wider mb-1"}>{mainTitleText}</p>
                        <p className={"text-xs text-textGrey"}>{mainSubText}</p>                        
                    </div>
                    <Spacer className={"block h-4"} />
                    <div className={"my-4"}>
                        <h4 className={"text-primary text-xs md:text-sm font-semibold mb-2"}>Saved Locations</h4>
                        {_.take(filteredAddresses, 3).map((opt, idx) => {
                            const { name, email, phone, street, city, state, country, post_code, lat, lng, pk } = opt;
                            const titleText = _.compact([street || '', city || '']).join(', ');
                            const subText = _.compact([name || '', formatPhone(phone, 'NATIONAL') || '']).join(
                                ' \u2022 ',
                            );
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
                                <div 
                                    key={idx}
                                    onClick={() => onChangePage(nextPage, {[pageKey]:payload})}
                                    className={"grid py-3 grid-cols-4 border cursor-pointer border-r-0 border-l-0 border-t-0 border-backgroundGrey"}
                                 >
                                    <div className={"col-span-3"}>
                                        <p className={"text-black text-xs md:text-sm font-bold mb-1 tracking-wider"}>{titleText}</p>
                                        <p className={"text-xs text-textGrey tracking-wider"}>{subText}</p>
                                    </div>
                                    <div className={"col-span-1  flex-col justify-center flex items-end"}>
                                        <ChevronForward />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className={"my-4"}>
                        
                        <Button
                            onClick={() => setAdressModalVisible(true)}            
                            className={"rounded-3xl font-medium tracking-wider text-black w-20 focus:outline-none focus:border-opacity-0 border border-textGrey outline-none py-2 px-2"}
                        >
                            {"More"}
                        </Button>
                    </div>
                    
                    {!isEmpty && (<div className={"fixed bottom-1 w-full px-3 -ml-2 mx-auto md:relative md:flex-col md:flex md:items-end"}>
                        
                        <Button
                            onClick={() => onChangePage(nextPage)}            
                            uclasses={"rounded-3xl w-full md:w-auto px-2 focus:border-opacity-0 outline-none w-24"}                        >
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