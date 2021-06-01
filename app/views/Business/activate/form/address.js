
import * as React from "react";
import _ from "lodash";
import {useQuery, useMutation} from "@apollo/client";
import {SET_DEFAULT_ADDRESS} from "../../modules/mutations";
import {formatPhone, formatString} from "app/lib/formatters";
import AddressPlugin from "app/services/address";
import Modal from "app/services/modal";
import {Button} from "app/components/forms";
import cx from "classnames";
import {ChevronForward} from "app/components/icons"

const Page = ({onChangePage, pageData, setState, dependencies, updatePageData}) => {

    const [modalVisible, setModalVisible] = React.useState(false);
    const [addressesVisible, setAddressesVisible] = React.useState(false);
    const nextPage = "description";
    const pageKey = 'address';
    const { [pageKey]: initialValues = {} } = pageData;
    const { shippingDependencies: shippingOptions } = dependencies;

    const setPageData = (payload) => {
        updatePageData(payload)
    }
    const [setDefaultAddress, { loading }] = useMutation(SET_DEFAULT_ADDRESS, {
        onCompleted: ({ usernameUpdate: resp }) => {
            changePage('description', {});
        },
        onError: (errors) => {},
    });

    const closeModal = () => {
        setModalVisible(false);
        setAddressesVisible(false);
    };
    const onItemSelected = (item) => {
        
        const variables = _.pick(item, [
            'city',
            'state',
            'country',
            'post_code',
            'lat',
            'lng',
            'name',
            'email',
            'phone',
            'street',
        ]);
        setPageData({ [pageKey]: variables });
        setDefaultAddress({variables:{id: item.pk}})
        closeModal();
    };


    React.useEffect(() => {
        setState((prevState) =>({
            ...prevState,
            previousPage: "username",
        }))
    }, []);

   

    const isEmpty = _.isEmpty(initialValues);
    const mainTitleText = isEmpty
        ? 'Provide your pickup location'
        : _.compact([initialValues?.street || '', initialValues?.city || '']).join(', ');
    const mainSubText = isEmpty
        ? 'tap to add new address'
        : _.compact([initialValues?.name || '', formatPhone(initialValues?.phone, 'NATIONAL') || '']).join(' \u2022 ');



    return(
        <div className={"max-w-3xl p-2 md:p-0 mx-auto"}> 
                <div className={"mt-8 mb-4"}>
                    <p className={"text-primary text-xs md:text-sm font-semibold"}>{'SHIPPING LOCATION'}</p> 
                    <p className={"text-black text-sm md:text-base font-bold"}>{'Provide your business address'}</p>
                    <p className={"text-xs md:text-sm text-black opacity-70"}>{'Select an address that will be used as your default business location'}</p>
                </div>
                <div className={"w-full"}>
                    
                    <div 
                        role={"button"} 
                        className={`p-3 my-4 ${cx({
                            "bg-transluscent-grey": isEmpty,
                            "bg-transluscent-primary": !isEmpty
                        })}`} 
                        onClick={() => setModalVisible(true)}
                    >
                        <p className={"text-black text-xs md:text-sm font-bold"}>{mainTitleText}</p>
                        <p className={"text-xs text-black opacity-70"}>{mainSubText}</p>                        
                    </div>

                    <div className={"my-4"}>
                        <h4 className={"text-primary text-xs md:text-sm font-semibold mb-3"}>Saved Locations</h4>
                        {_.take(shippingOptions.addresses, 3).map((opt, idx) => {
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
                                    onClick={() => onItemSelected(payload)}
                                    className={"grid py-3 grid-cols-4 border cursor-pointer border-r-0 border-l-0 border-t-0 border-backgroundGrey"}
                                 >
                                    <div className={"col-span-3"}>
                                        <p className={"text-black text-xs md:text-sm font-bold"}>{titleText}</p>
                                        <p className={"text-xs text-black opacity-70"}>{subText}</p>
                                    </div>
                                    <div className={"col-span-1  flex-col justify-center flex items-end"}>
                                        <ChevronForward />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    
                    {!isEmpty &&(<div className={"fixed bottom-1 w-full px-3 -ml-2 mx-auto md:relative md:flex-col md:flex md:items-end"}>

                        
                        <Button
                            onClick={() => onChangePage(nextPage)}            
                            uclasses={"rounded-3xl w-full md:px-4 md:w-auto text-black border-0 focus:outline-none focus:border-opacity-0 outline-none px-2"}
                        >
                            {"Continue"}
                        </Button>
                    </div>)}
                   {modalVisible ? (
                        <Modal
                            onClose={closeModal}
                            open={modalVisible}
                            title={"Add An Address"}
                        >
                            <AddressPlugin                               
                                onItemSelected={onItemSelected}
                                setDefault={true}
                                dependencies={shippingOptions.origin_countries}
                                initialData={_.isEmpty(initialValues) ? { country: 'NG' } : initialValues}
                                options={shippingOptions.addresses}
                            />
                        </Modal>
                   ):null} 

                   {/* {addressModalVisible ? (
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
                   ):null}  */}
                </div>
        </div>
    )
}

export default Page;