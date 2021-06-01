import React, { Fragment, useCallback, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { APPLICATION_DETAIL } from "./modules/queries";
import { RESET_SECRET, GENERATE_TOKEN, DELETE_APPLICATION } from "./modules/mutations";
import { useRouter } from "next/router";
import Modal from "app/services/modal";
import EditApp from "./edit";
import { Button } from "app/components/forms";
import { Spacer } from "app/components/assets";
import Loading from "app/components/loading";
import DialogModal from "./dialogModal";

const SnackBar = ({ snackMessage, isError, onClick }) => {
    return (
        <div className={`max-w-lg left-0 sticky  ${isError ? "bg-red-400" : "bg-green-400"} right-0 rounded-lg bottom-16 h-12 flex shadow-lg`}>
            <div className={"w-full px-2 pt-2"}>
                {isError ? (
                    <div className={"flex justify-between"}>
                        <p className={"flex justify-center items-center uppercase tracking-wide text-white text-xs md:text-sm font-semibold"}>
                            {snackMessage}
                        </p>
                        <div>
                            <Button
                                onClick={onClick}
                                className={"text-sm py-1 px-3 text-white uppercase border border-white rounded"}
                            >{"Okay"}</Button>
                        </div>
                    </div>
                ) : (
                    <div className={"flex justify-between"}>
                        <p className={"flex justify-center items-center uppercase tracking-wide text-white text-xs md:text-sm font-semibold"}>
                            {snackMessage}
                        </p>
                        <div>
                            <Button
                                onClick={onClick}
                                className={"text-sm py-1 px-3 text-white uppercase border border-white rounded"}
                            >{"Okay"}</Button>
                        </div>
                    </div>
                )
                }
            </div>
        </div>
    )
}

const Dialog = ({ toggleDialog, item, onCancel, onDelete }) => {
    return (
        <div className={"bg-white w-3/4 md:w-1/4 rounded shadow-lg"}>
            {toggleDialog ? (
                <div className={"p-4"}>
                    <p className={"text-xs tracking-wider text-gray-400 uppercase mb-1"}>{"Confirm Deletion"}</p>
                    <p className={"text-sm capitalize font-semibold tracking-wider"}>{item}</p>
                    <div className={"flex justify-end"}>
                        <Button
                            onClick={onDelete}
                            className={"uppercase bg-transparent focus:outline-none outline-none text-primary text-sm p-2"}
                        >
                            {"Proceed"}
                        </Button>
                        <Button
                            onClick={onCancel}
                            className={"uppercase bg-transparent focus:outline-none outline-none text-primary text-sm p-2"}
                        >
                            {"Cancel"}
                        </Button>
                    </div>

                </div>
            ) : null}
        </div>
    )
}

const Page = ({ obj }) => {
    const [showSecret, setShowSecret] = useState(false);
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackVisible, setSnackVisible] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    const [disableResetButton, setDisableResetButton] = useState(false);
    const [disableGenerateButton, setDisableGenerateButton] = useState(false);
    const [disableDeleteButton, setDisableDeleteButton] = useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const router = useRouter();

    const toggleSecret = useCallback(() => {
        setShowSecret(!showSecret);
    }, [showSecret]);

    const { loading, error, data, refetch } = useQuery(APPLICATION_DETAIL, {
        fetchPolicy: "cache-and-network",
        variables: { id: obj.pk },
        onError: (errors) => {
            console.log({ errors });
        },
    });

    const [resetExternalApplicationSecret] = useMutation(RESET_SECRET, {
        onCompleted: () => {
            refetch && refetch();
            setSnackVisible(true);
            setIsError(false)
            setSnackMessage("Your secret has been successfully reset");
            setDisableResetButton(false);
        },
        onError: (errors) => {
            console.log({ errors });
            setSnackVisible(true);
            setIsError(true)
            setSnackMessage('Unable to Reset');
            setDisableResetButton(false);
        }
    });

    const [createExternalApplicationToken] = useMutation(GENERATE_TOKEN, {
        onCompleted: () => {
            refetch && refetch();
            setIsError(false);
            setSnackMessage("Successful");
            setSnackVisible(true);
            setDisableGenerateButton(false);
        },
        onError: (errors) => {
            console.log({ errors });
            setSnackVisible(true);
            setIsError(true)
            setSnackMessage('Encountered an Error');
            setDisableGenerateButton(false)
        }
    });

    const [deleteExternalApplication] = useMutation(DELETE_APPLICATION, {
        onCompleted: () => {
            window.location = "/developers";
            setDisableDeleteButton(false);
        },
        onError: (errors) => {
            console.log({ errors });
        }
    });

    const resetSecret = useCallback((id) => {
        const variables = { id };

        setDisableResetButton(true);
        resetExternalApplicationSecret({ variables });
    }, [resetExternalApplicationSecret]);

    const generateToken = useCallback((app_id) => {
        const variables = { app_id };

        setDisableGenerateButton(true);
        createExternalApplicationToken({ variables });
    }, [createExternalApplicationToken]);

    const deleteApp = useCallback((id) => {
        const variables = { id };

        setDisableDeleteButton(true);
        deleteExternalApplication({ variables });
    }, [deleteExternalApplication]);

    if (loading && !data) {
        return (
            <div className={"flex h-screen justify-center items-center"}>
                <Loading />
            </div>
        )
    }

    if (error) {
        return (
            <div className={"flex flex-col max-w-lg mx-auto h-screen justify-center items-center"}>
                <div>
                    <p className={"text-center"}>{'unknown error occurred'}</p>
                    {/* <p className={"text-center text-gray-400"}>{'We could not find any tracking information for the reference code provided'}</p> */}
                </div>
                <Spacer className={"block h-5"} />
                <div>
                    <Button
                        onClick={() => refetch && refetch()}
                        uclasses={`rounded-full uppercase tracking-widest font-medium md:font-medium py-4 px-8`}
                    >
                        {'Try Again'}
                    </Button>
                </div>
            </div>
        )
    }

    const { application = {} } = data;
    const { pk, name, description, status, website_url, client_secret, application_token, web_hooks, logo_url, privacy_url, terms_and_conditions_url, last_updated } = application

    return (
        <div className={"flex flex-col max-w-lg mx-auto"}>
            <div>
                <p className={"text-red-400 uppercase text-xs mb-2"}>{'Application Details'}</p>
                <p className={"text-2xl capitalize font-semibold"}>{name}</p>
                {/* <Spacer className={"block h-2"} />
                <p className={"text-sm text-gray-400"}>{description}</p> */}
                <div className={"my-2 py-2 text-xs font-semibold px-2 gap-6 md:flex grid grid-cols-2 md:justify-start"}>
                    <Button
                        onClick={() => setModalVisible(true)}
                        className={"rounded focus:outline-none py-2 md:w-40 text-white appearance-none shadow-none uppercase px-2 focus:border-opacity-0 outline-none bg-black"}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => setDialogVisible(true)}
                        className={"rounded focus:outline-none py-2 md:w-40 appearance-none text-red-400 border border-red-400 uppercase px-2 outline-none bg-white"}
                    >
                        Delete
                    </Button>
                </div>
                <div className={"p-2 border-b border-textGrey border-opacity-10"}></div>
                {description && (
                    <div className={"flex flex-col py-3 border-b border-textGrey border-opacity-10"}>
                        <p className={"text-gray-400 text-xs uppercase tracking-wider mb-1"}>{"Description"}</p>
                        <p className={"tracking-wider text-sm text-left"}>{description}</p>
                    </div>
                )}
                {status && (
                    <div className={"flex justify-between py-4 border-b border-textGrey border-opacity-10"}>
                        <p className={"text-gray-400 text-xs uppercase tracking-wider"}>{"Status"}</p>
                        <p className={"tracking-wider text-xs font-semibold uppercase"}>{status.name}</p>
                    </div>
                )}
                {pk && (
                    <div className={"flex justify-between py-4 border-b border-textGrey border-opacity-10"}>
                        <p className={"text-gray-400 text-xs uppercase tracking-wider"}>{"App-ID"}</p>
                        <p className={"tracking-wider text-xs font-semibold uppercase"}>{pk}</p>
                    </div>
                )}
                {client_secret && (
                    <div className={"flex flex-col py-4 border-b border-textGrey border-opacity-10"}>
                        <div className={"w-full flex justify-between"}>
                            <div className={"flex justify-start items-center"}>
                                <p className={"text-gray-400 text-xs uppercase tracking-wider"}>{"Client Secret"}</p>
                            </div>
                            <div>
                                <Button
                                    onClick={toggleSecret}
                                    className={"uppercase text-xs font-semibold text-red-400 tracking-wider outline-none focus:outline-none"}>
                                    {showSecret ? "Hide" : "Show"}
                                </Button>
                            </div>
                        </div>
                        {showSecret && (
                            <Fragment>
                                <Spacer className={"block h-2"} />
                                <div className={"flex flex-wrap bg-backgroundGrey py-4 px-2 rounded"}>
                                    <p className={"text-left tracking-wider text-xs uppercase break-all"}>{client_secret}</p>
                                </div>
                                <Spacer className={"block h-2"} />
                                <div className={"flex"}>
                                    <Button
                                        onClick={() => resetSecret(pk)}
                                        className={"uppercase tracking-wider font-normal bg-black text-white text-xs py-2 px-4 rounded"}
                                        disabled={disableResetButton}
                                    >
                                        {"Reset Secret"}
                                    </Button>
                                </div>
                            </Fragment>
                        )}
                    </div>
                )}
                <div className={"flex flex-col py-4 border-b border-textGrey border-opacity-10"}>
                    <div className={"flex justify-end items-end"}>
                        <Button
                            onClick={() => generateToken(pk)}
                            className={"uppercase tracking-wider font-normal bg-black text-white text-xs py-2 px-4 rounded"}
                            disabled={disableGenerateButton}
                        >
                            {application_token ? "Regenerate Token" : "Generate Token"}
                        </Button>
                    </div>
                    <Spacer className={"block h-2"} />
                    <div className={"flex flex-col"}>
                        <p className={"text-gray-400 text-xs uppercase tracking-wider"}>{"Access Token"}</p>
                        <Spacer className={"block h-2"} />
                        {application_token ? (
                            <Fragment>
                                <div className={"flex flex-wrap bg-backgroundGrey py-4 px-2 rounded"}>
                                    <p className={"text-left tracking-wider text-xs uppercase break-all"}>{application_token.access_token}</p>
                                </div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <div className={"flex justify-center items-center"}>
                                    <p className={"text-center font-semibold text-sm tracking-wider"}>{"Please generate your access and refresh token."}</p>
                                </div>
                            </Fragment>
                        )}
                    </div>
                    <Spacer className={"block h-4"} />
                    <div className={"flex flex-col"}>
                        <p className={"text-gray-400 text-xs uppercase tracking-wider"}>{"Refresh Token"}</p>
                        <Spacer className={"block h-2"} />
                        {application_token ? (
                            <Fragment>
                                <div className={"flex flex-wrap bg-backgroundGrey py-4 px-2 rounded"}>
                                    <p className={"text-left tracking-wider text-xs uppercase break-all"}>{application_token.refresh_token}</p>
                                </div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <div className={"flex justify-center items-center"}>
                                    <p className={"text-center font-semibold text-sm tracking-wider"}>{"Please generate your access and refresh token."}</p>
                                </div>
                            </Fragment>
                        )}
                    </div>
                </div>
                {website_url && (
                    <div className={"flex flex-col py-4 border-b border-textGrey border-opacity-10"}>
                        <p className={"text-gray-400 text-xs uppercase tracking-wider"}>{"website Url"}</p>
                        <Spacer className={"block h-2"} />
                        <div className={"flex flex-wrap bg-backgroundGrey py-4 px-2 rounded"}>
                            <p className={"text-left tracking-wider text-xs break-all"}>
                                <a href={website_url} target="_blank">{website_url}</a>
                            </p>
                        </div>
                    </div>
                )}
                {web_hooks && (
                    <div className={"flex flex-col py-4 border-b border-textGrey border-opacity-10"}>
                        <p className={"text-gray-400 text-xs uppercase tracking-wider"}>{"Redirect Url"}</p>
                        <Spacer className={"block h-2"} />
                        {web_hooks.map((opt, idx) => {
                            return (
                                <Fragment key={idx}>
                                    <div className={"flex flex-wrap bg-backgroundGrey py-4 px-2 rounded"}>
                                        <p className={"text-left tracking-wider text-xs break-all"}>
                                            <a href={opt} target="_blank">{opt}</a>
                                        </p>
                                    </div>
                                    <Spacer className={"block h-2"} />
                                </Fragment>
                            )
                        })}
                    </div>
                )}
                {logo_url && (
                    <div className={"flex flex-col py-4 border-b border-textGrey border-opacity-10"}>
                        <p className={"text-gray-400 text-xs uppercase tracking-wider"}>{"Logo Url"}</p>
                        <Spacer className={"block h-2"} />
                        <div className={"flex flex-wrap bg-backgroundGrey py-4 px-2 rounded"}>
                            <p className={"text-left tracking-wider text-xs break-all"}>
                                <a href={logo_url} target="_blank">{logo_url}</a>
                            </p>
                        </div>
                    </div>
                )}
                {privacy_url && (
                    <div className={"flex flex-col py-4 border-b border-textGrey border-opacity-10"}>
                        <p className={"text-gray-400 text-xs uppercase tracking-wider"}>{"privacy Url"}</p>
                        <Spacer className={"block h-2"} />
                        <div className={"flex flex-wrap bg-backgroundGrey py-4 px-2 rounded"}>
                            <p className={"text-left tracking-wider text-xs break-all"}>
                                <a href={privacy_url} target="_blank">{privacy_url}</a>
                            </p>
                        </div>
                    </div>
                )}
                {terms_and_conditions_url && (
                    <div className={"flex flex-col py-4 border-b border-textGrey border-opacity-10"}>
                        <p className={"text-gray-400 text-xs uppercase tracking-wider"}>{"terms & conditions Url"}</p>
                        <Spacer className={"block h-2"} />
                        <div className={"flex flex-wrap bg-backgroundGrey py-4 px-2 rounded"}>
                            <p className={"text-left tracking-wider text-xs break-all"}>
                                <a href={terms_and_conditions_url} target="_blank">{terms_and_conditions_url}</a>
                            </p>
                        </div>
                    </div>
                )}
                {snackVisible && (
                    <SnackBar snackMessage={snackMessage} isError={isError} onClick={() => setSnackVisible(false)} />
                )}
            </div>
            <Spacer className={"block h-10"} />
            {dialogVisible ? (
                <DialogModal open={dialogVisible} >
                    <Dialog
                        onCancel={() => setDialogVisible(false)}
                        toggleDialog={dialogVisible}
                        item={name}
                        onDelete={() => deleteApp(pk)}

                    />
                </DialogModal>
            ) : null}
            {modalVisible ? (
                <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
                    <EditApp obj={application} onClose={() => setModalVisible(false)} onRefresh={() => refetch()} />
                </Modal>
            ) : null}
        </div>
    )

}

export default Page;