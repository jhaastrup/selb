import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import {useQuery, useMutation} from "@apollo/client";
import { LOAD_SOCIAL_MEDIA } from '../../../modules/queries';


const ImageItem = ({image, onItemSelected}) => {
    const [selected, setSelected] = React.useState(false);

    const handleClick = () => {
        setSelected(!selected);
        setTimeout(() => {
            selected && onItemSelected(image)
        }, 100)
        
    }
    return(
        <div key={idx} style={{borderBottom: "1px solid black"}}>
        <div style={selected ? {backgroundColor: "blue"} : undefined}   onClick={handleClick}>
            <div style={{width: "40%"}}>
                    <img style={{width:"100%"}} src={image.uri} />
            </div>
            <p>{`${image?.name ?? ''}`}</p>
        </div>
        </div>
    )
}


const Page = ({onChangePage, pageData, onClose, onTransition}) => {
    const [selectedList, setselectedList] = React.useState([]);
    const dataLabel = 'loadMediaForDiscovery';
    const { page_id } = pageData;

    

    const { loading, data, error, refetch, networkStatus, fetchMore } = useQuery(LOAD_SOCIAL_MEDIA, {
        variables: { page_id },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log('social data===>', { data });
            const { results } = data.loadMediaForDiscovery;
        },
        onError: (error) => {
            console.log({ error });
        },
    });

    const [discoveryExternalOrders, { loading: importingOrders }] = useMutation(IMPORT_ORDERS_FROM_STORE, {
        onCompleted: (data) => {
            console.log({ data });
            onChangePage('success', {});
        },
        onError: (err) => {
            console.log({ err });
            onChangePage('error', {});
        },
    });

   
    // const addImage = (item) => {
    //     const items = selectedList || [];
    //     setselectedList([...items, item]);
    // };

    // const removeImage = (item) => {
    //     const items = selectedList || [];
    //     const arr = items.filter(function (it) {
    //         return it.pk !== item.pk;
    //     });
    //     setselectedList([...arr]);
    // };

    const transition = React.useCallback(() => {
        onTransition({images: selectedList})
        onClose();
    },[selectedList])



    const onItemSelected =React.useCallback( (item) => {
        const items = selectedList || [];
        const arr = items.filter(function (it) {
            return it.pk === item.pk;
        });
        if(arr.length){
            const _arr = items.filter(function (it) {
                return it.pk !== item.pk;
            });
            setselectedList([..._arr]);
            
        }else{
            setselectedList([...items, item]);
        }
        
    }, [selectedList, setselectedList])

    if(loading){
        return(
            <div style={{width: "60%", margin:"10rem auto"}}>
                Loading...
            </div>
        )
    }

    if(error){
        return(
            <div style={{width: "60%", margin:"10rem auto"}}>
                <p>An error occurred</p>
                <button 
                    onClick={() => refetch && refetch()} 
                    style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                >
                Refetch
             </button>
            </div>
        )
    }

   
    const { results, metadata = {} } = data[dataLabel];
    const listOfImages = results.map((item) => item.media).reduce((acc, it) => [...acc, ...it]);    return(
        <div>  
            <div style={{margin: "1rem auto", width: "50%"}}>
                
                <p>{"Connect a store type"}</p>
               
                <div>
                   
                    <div style={{width: "60%", margin:"1rem auto"}}>
                        <div style={{display: "flex"}}>
                            {listOfImages.length ? listOfImages.map((item) => {
                               <ImageItem image={item} onItemSelected={onItemSelected} />
                                
                            }): <p>No Records Found</p>}
                            <button 
                                onClick={transition} 
                                style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                            >
                                Continue
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;