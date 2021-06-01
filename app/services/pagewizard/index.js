import * as React from "react";
import Modal from "app/services/modal";
import {CloseIcon, ArrowLeft} from "app/components/icons";
import {Button} from "app/components/forms";
import { PublicLayout as Layout } from "app/views/Layout";


/* 
    This is a page wizard implementation. This wizard receives props from its parent component.
    This wizard is open to extending its api according to the use Case.
    This is a general API for wizard based on our use cases so far.
    

    NOTE: IT IS REQUIRED THAT YOUR PAGES PROPS HAS A PAGE WITH name "default". SO AS TO KNOW THE STARTING
    PAGE OF THE WIZARD
*/

const Wrapper = ({open, isMulti, title="", goBack, onClose, children}) => {
    // const style = cx("fixed", "z-50", "bg-white", "top-0", "overflow-y-scroll", "translate-y-full", "left-0", "right-0", "bottom-0","transition-all");
    return(
        <div>
           {/*  <header className="text-black body-font sticky mb-30">
               
                    <div className="grid grid-cols-3 py-4">
                    <div className={"col-span-1 flex flex-col justify-center items-start px-5"}>
                        {isMulti ? (<Button
                            className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                            onClick={() => goBack && goBack()}
                        >
                            <ArrowLeft size={20} color={"rgba(6,15,33, 1)"}/>
                        </Button>):(<Button
                            className={"w-9 md:w-10 bg-transparent focus:outline-none outline-none border-0"}
                            onClick={() => onClose && onClose()}
                        >
                            <ArrowLeft size={20} color={"rgba(6,15,33, 1)"}/>
                        </Button>)}
                    </div>
                    <div className={"flex flex-col items-center justify-center col-span-1"}>
                        <h3 className={"uppercase font-bold text-xs md:text-base"}>{title || ""}</h3>
                    </div>
                    <div className={"flex col-span-1 flex-col px-1 items-end justify-center"}>
                        
                        <Button
                            className={"w-9 md:w-10 bg-transparent focus:outline-none border-0 outline-none"}
                            onClick={() => onClose && onClose()}
                        >
                            <CloseIcon size={20} color={"rgba(6,15,33, 1)"}/>
                        </Button>
                    </div>
                </div>
            </header> */}
            <div className={"max-w-sm m-auto pb-24"}>
                {children}
            </div>
        </div>
    )
}


const Page = ({ dependencies, pageClose, onClose, open, isModal, onTransition, initialData={}, pages=[], billingData, props, title, onRefresh}) => {
    const [{page, pageData, previousPage, PageComponent},  setState] = React.useState( {
        page: "default",
        previousPage: undefined,
        pageData: initialData,
        title: "",
        PageComponent: null,
    });

    React.useEffect(() => {
        pages.forEach(pg => {
         if(page === pg.name){
             setState((prevState) => ({
                ...prevState,
                PageComponent: pg.page
            }))             
         }
        })
    }, [page, pages, PageComponent])

    const changePage = React.useCallback(
        (nextPage, data = null) => {
            const updatedPageData = Object.assign({}, pageData, data);
            setState((prevState) => ({
                ...prevState,
                pageData: updatedPageData,
                page: nextPage,
            }))

        },
        [setState, pageData]
    );

    const updatePageData = React.useCallback(
        (data) => {
            const updatedPageData = Object.assign({}, pageData, data);
            setState((prevState) => ({
                ...prevState,
                pageData: updatedPageData
            }))
        },
        [pageData],
    );

    const resetPage = React.useCallback(() => {
        setState({page: "default", pageData: initialData,})
    }, []);

    const verifyTransaction = React.useCallback(
        (payload) => {
            changePage('success', { payload });
        },
        [changePage],
    );

    const navigateBack = React.useCallback(()=> {
        changePage(previousPage)
     }, [changePage, previousPage]) 

    return (
                  
        <Wrapper onClose={pageClose}  isMulti={previousPage} goBack={navigateBack} title={title} open={open} >
            {PageComponent ? 
                (<PageComponent
                    onChangePage={changePage}
                    updatePageData={updatePageData}
                    onResetPage={resetPage}
                    pageData={pageData}
                    dependencies={dependencies}
                    billingData={billingData}
                    onClose={onClose}
                    onTransition={onTransition}
                    title={title}
                    setState={setState}
                    previousPage={previousPage}
                    onVerifyTransaction={verifyTransaction}
                    onRefresh={onRefresh}
                    {...props}
                /> ): 
            null}
        </Wrapper>                     
    );
};

export default Page;
