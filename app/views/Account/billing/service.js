import React, { Fragment, useState, useEffect, useCallback } from 'react';
import _ from "lodash";
import { formatNumber } from "app/lib/formatters";

const Page = ({onChangePage, pageData = {}, dependencies}) => {
    console.log(pageData)
    const { category } = pageData;
    const { billingServices } = dependencies;

    return (
        <div style={{display: "block", overflow: "auto"}}>
            <div style={{height:"2rem"}}></div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <div style={{padding: "1.5rem", alignSelf: "center", width: "440px", maxWidth: "100%"}}>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        <div style={{padding: "1rem 0rem"}}>
                            <p>{category}</p>
                            <p>
                                {
                                    'What are you buying?'
                                }
                            </p>
                        </div>
                        <div style={{height:"2rem"}}></div>
                        <div>
                            {_.filter(billingServices.results, (el) => el?.category?.pk === category).map((opt, idx) => {
                                console.log('===> i am opt', { opt });
                                const { name, group, code, pk } = opt;

                                return (
                                    <Fragment key={idx}>
                                        <div
                                            style={{cursor:"pointer"}}
                                            onClick={() => onChangePage('customer', { payment_code: code, service_id: pk })}
                                        >
                                            <div>
                                                <p>{group?.name}</p>
                                                {opt.category?.has_groups && (
                                                    <p>{name}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{height:"1rem"}}></div>
                                    </Fragment>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;