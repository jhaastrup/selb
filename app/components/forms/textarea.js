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
    label,
    cols="12",
    rows="5",
    resizeLabel=true,
    htmlfor,
    showLabel= true,
    uclasses="",
    ...props
}) => {
    const [labelResize, setLabelResize] = React.useState(false);
    const handleChange = onChange(name);
    const handleBlur = onBlur(name);
    const hasErrors = touched[name] && errors[name];

    const _formatValue = (val) => {
        return format ? format(val) : val;
    };
    const _handleBlur = (e) => {
        if(value){
            setLabelResize(true)
        }else{
            setLabelResize(false)
        }
        handleBlur(e);
    }
    const _handleChange = (val) => {
       setLabelResize(true);
        handleChange(val);
        onInputChanged && onInputChanged(val);
    };
    // const isResize = React.useMemo(() =>  labelResize || value, [value, labelResize]);
    // const statePlaceHolder = showLabel && !labelResize ? label : placeholder
    return(
        <React.Fragment>
            
            {/* {showLabel && labelResize && (<Label htmlfor={htmlfor} labelText={label} resize={resizeLabel ? isResize: false } />)} */}
                
                <textarea
                    className={`appearance-none text-xs relative bg-white bg block w-full px-3 py-2 border border-transluscent-grey placeholder-transluscent-textGrey text-black focus:outline-none focus:ring-0 focus:border-primary focus:z-10 sm:text-sm ${cx(uclasses)}`}
                    name={name}
                    cols={cols}
                    rows={rows}
                    value={_formatValue(value)}
                    onChange={_handleChange}
                    onBlur={(e) => _handleBlur(e)}
                    placeholder={placeholder}
                    onClick={() => setLabelResize(true)}
                    {...props}
                />
                {hasErrors && touched[name] ? (
                    <ErrorText errorText={errors[name]}/> 
                ): null}
            
        </React.Fragment>
        
    )
    
}

const InputField = ({ name, ...props }) => {
    return <Field name={name} component={FieldComponent} {...props} />;
};

export default InputField;