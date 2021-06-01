import * as React from "react";
import { Field} from 'formik';
import cx from "classnames";
import {Label, ErrorText} from "./base";



const FieldComponent = ({
    field: { name, value, onChange, onBlur, },
    form: { errors, touched },
    format,
    type="text",
    onInputChanged,
    innerRef,
    placeholder,
    autoComplete,
    label,
    resizeLabel=true,
    htmlfor,
    showLabel= true,
    showRightIcon= false,
    showLeftIcon= false,
    image,
    classnames="",
    ...props
}) => {
    // const [labelResize, setLabelResize] = React.useState(false);
    const handleChange = onChange(name);
    const handleBlur = onBlur(name);
    const hasErrors = touched[name] && errors[name];

    const _formatValue = (val) => {
        return format ? format(val) : val;
    };
    const _handleBlur = (e) => {
        // if(value){
        //     setLabelResize(true)
        // }else{
        //     setLabelResize(false)
        // }
        handleBlur(e);
    }
    const _handleChange = (val) => {
    //    setLabelResize(true);
        handleChange(val);
        onInputChanged && onInputChanged(val);
    };
    // const isResize = React.useMemo(() =>  labelResize || value, [value, labelResize]);
    // const statePlaceHolder = showLabel && !labelResize ? label : placeholder
    return(
        <div className={"relative w-full flex flex-col items-start"}>
                {/* {showLabel && labelResize && (<Label htmlfor={htmlfor} labelText={label} resize={resizeLabel ? isResize: false } />)} */}
                {/* <div className={"relative flex w-full flex-wrap items-stretch"}> */}
                    <input
                        ref={innerRef}
                        className="flex-1 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none shadow-sm border-gray-300"
                        type={type}
                        name={name}
                        autoComplete={autoComplete}
                        value={_formatValue(value)}
                        onChange={_handleChange}
                        onBlur={(e) => _handleBlur(e)}
                        placeholder={placeholder}
                        // onClick={() => setLabelResize(true)}
                        {...props}
                    />
                    {showRightIcon && (
                        <span className={"z-10 h-full leading-snug font-normal absolute text-center bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3"}>
                            <img src={image}/>
                        </span>
                    )}
                {/* </div> */}
                {hasErrors && touched[name] ? (
                    <ErrorText errorText={errors[name]}/> 
                ): null}
            
        </div>
        
    )
    
}

const InputField = ({ name, ...props }) => {
    return <Field name={name} component={FieldComponent} {...props} />;
};

export default InputField;