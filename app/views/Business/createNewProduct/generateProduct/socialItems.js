import * as React from "react";
import _ from "lodash";
import {ChevronForward} from "app/components/icons";
import {formatPhone, formatString} from "app/lib/formatters";
import { useQuery} from '@apollo/client';
import { LOAD_SOCIAL_MEDIA  } from '../../modules/queries';
import Loading from "app/components/loading"
import { Button} from "app/components/forms";


const Page = ({onChangePage, dependencies}) => {
    const formRef = useRef();
    const dataLabel = 'loadMediaForDiscovery';
    const [imageList, setImageList] = useState([]);
    const [currentImage, setcurrentImage] = useState();
    const isFocused = useIsFocused();
    const { page_id } = pageData;
    const pageKey = 'media';
    const { caption = '', title = '', description = '' } = dictionaryData[pageKey] || {};

    const { loading, data, error, refetch, networkStatus, fetchMore } = useQuery(LOAD_SOCIAL_MEDIA, {
        variables: { page_id },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache',
        onCompleted: (data) => {
            console.log('social data===>', { data });
            const { results } = data.loadMediaForDiscovery;
            setcurrentImage({ item: results[0].media[0], index: 0 });
        },
        onError: (error) => {
            console.log({ error });
        },
    });

    const addImageCode = (url, id) => {
        const items = formRef.current.values.images || [];
        formRef.current.setFieldValue('images', [...items, { url, id }], true);
        const { images } = formRef.current.values;
        console.log({ images });
    };

    const removeImageCode = (id) => {
        const items = formRef.current.values.images || [];
        const arr = items.filter(function (item) {
            return item.id !== id;
        });
        formRef.current.setFieldValue('images', [...arr], true);
        const { images } = formRef.current.values;
        console.log('removed===>', { images });
    };

    const ValidationSchema = Yup.object().shape({
        images: Yup.array().required(),
    });

    const initialValues = {
        images: [],
    };

    


    const onItemSelected = (item) => {
        onChangePage && onChangePage('socialItems', { page_id: item.social_id });
    };

    const onRefresh = () => {
        refetch({});
    };
    // const onSocialConnect = () => {
    //     setDialogVisible(false);
    //     navigation.navigate('business', { screen: 'business.connect.social' });
    // };

    if(loading){
        return(
            
             <Loading />
        )
    }

    if(error){
        return(
           
            <div className={"h-40 mt-auto flex items-center justify-center"}>
                <Button
                    onClick={() => refetch && refetch()} 
                >
                    Try Again
                </Button>
            </div>
        )
    }

    const { results, metadata = {} } = data[dataLabel];
    const listOfImages = results.map((item) => item.media).reduce((acc, it) => [...acc, ...it]);

    return (
        <div className={"max-w-3xl mx-auto border border-lightGrey px-3 mt-3 pb-12 flex flex-col"}>
            <Formik
                innerRef={formRef}
                validationSchema={ValidationSchema}
                initialValues={initialValues}
                enableReinitialize={true}
                validateOnMount={true}
                onSubmit={(variables, formikBag) => {
                    onChangePage && onChangePage('description', { image });
                
                }}>
            {({handleSubmit, values, isValid, isSubmitting}) => {
                return(
                
                    <Form onSubmit={handleSubmit}>
                        <div className={"w-full grid grid-cols-1 gap-4 mt-4 min-h-full"}>
                            <div className={"my-2"}>
                                <p className={"text-black text-base font-semibold"}>{"Add Custom Category"}</p> 
                                <p className={"text-textGrey text-sm "}> {'Create your own category'}</p>
                        
                            </div>
                        
                            {currentImage ? (
                                <div className={"flex flex-wrap  mt-2"}>
                                    
                                        
                                    <div className={"col-span-1 relative mr-1 w-12 h-12 bg-backgroundGrey"}>                                    
                                        <img className={"w-full h-full object-cover"} src={currentImage.item.url} alt={"current selected image"} />
                                    </div>
                                        
                                    
                                </div>
                            ): null}
                            <div className={"fixed bottom-1 w-full px-3 -ml-3 mx-auto md:relative md:flex-col md:flex md:items-end"}>
                                    <Button
                                        disable={!isValid || isSubmitting} 
                                        uclasses={"w-full py-2 md:w-1/6"}
                                        type={"submit"}
                                    >
                                        Confirm
                                    </Button>
                            </div>
                        </div>
                        
                        
                    </Form>
                    
                )
            }}

            </Formik>
        </div>
    )
}

export default Page;