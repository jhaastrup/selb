import React from "react";
import {ErrorText } from "./base";
import { Field, ErrorMessage } from "formik";

const FieldComponent =  ({ 
    field: { name, value = "", onChange, onBlur }, 
    form: { touched, errors },
    type = "radio",
    className,
    showLabel = true,
    format,
    label = "",
    labelColor,
    onInputChanged,
    ...props 
}) => {
   
        

    // Highlight input field because of errors.
    const hasErrors = touched[name] && errors[name];

    const handleInputChanged = (e) => {
        const v = e.target.value;
        onChange(e);
        onInputChanged && onInputChanged(v);
    };
     
        
    return (
        <div className={"relative flex flex-col items-start"}>                    
                <div className={"relative mt-2 flex flex-row"}>
                    <input 
                        name={name}
                        value={value}
                        onChange={handleInputChanged}
                        type={type}
                        className={"radioButton"}
                    />
                    <label className={"cursor-pointer pl-6"}>
                        {label}
                    </label>
                </div>
                
            {hasErrors && <ErrorMessage name={name} component={ErrorText} />}
        </div>
    );
};

const RadioButton = ({ name, ...props }) => {
    return <Field name={name} component={FieldComponent} {...props} />;
};

export default RadioButton;
