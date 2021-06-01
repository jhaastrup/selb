import * as React from "react";
import _ from "lodash";
import {formatPhone, formatString} from "app/lib/formatters";
import metadata from "./metadata";
import {domainIssues} from "./domainTypes";
const Page = ({onChangePage,
    updatePageData, pageData}) => {
    const pageKey = 'type';
    const nextPage = 'form'
    const { caption = '', title = '', description = '' } = metadata[pageKey] || {};
    const { [pageKey]: initialValue = undefined, channel } = pageData;
    const domainComplaints = domainIssues(channel.domain);

    return(
        <div>  
            <div style={{margin: "1rem auto", width: "50%", }}>
                
                <p>{caption}</p> 
                <p>{title}</p>
                <p style={{fontSize: "14px", color:"lightslategray"}}>{description}</p>
               
                
                <div>
                    {domainComplaints.map((opt) => {
                        const { name, id } = opt;
                        const isSelected = initialValue === name;
                        const selectedStyle = isSelected ? "lightgrey" : undefined;
                        
                        return(
                            <div 
                                key={id} 
                                onClick={() => onChangePage(nextPage, {[pageKey]: opt})} 
                                role="button"
                                style={{
                                    fontSize: "14px", 
                                    marginBottom:"1rem", 
                                    padding:"5px", 
                                    border: "1px solid lightgrey", 
                                    cursor:"pointer",
                                    backgroundColor: selectedStyle
                                    }}
                            >
                                <p>{formatString(`${name}`, 'uppercase')}</p>
                            </div>
                        );
                    })}
                    {/* {initialValue && (
                        <div>
                            <button 
                            onClick={() => onChangePage(nextPage)}
                                type={"button"} 
                                style={{color: "#fff", backgroundColor:"black", padding: "5px",}}
                            >
                                {"continue"}
                            </button>
                        </div>
                    )} */}
                </div>
              
            </div>
        </div>
    )
}

export default Page;