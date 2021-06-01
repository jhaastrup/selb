import * as React from "react";
import { Label, ErrorText } from "./base";
import { Field, ErrorMessage } from "formik";
import { LocationIcon } from "app/components/icons";
import cx from "classnames";


const AutoCompleteChoice = ({children}) => (
    <div className={"z-50 bg-white border border-lightGrey shadow-sm px-2 max-h-96  mt-2 overflow-y-auto"}>
        {children}
    </div>
)

const AutoCompleteItem = ({ item, onClick, setShowOptions,  mainText, subText, IconComponent = LocationIcon, ...props }) => {
    const main_text = item[mainText];
    const secondary_text = item[subText];
    const handleOnclick = () => {
        onClick(item)
        setShowOptions(false);
    }
    return (
        <div
            className={"hover:bg-lightGrey cursor-pointer flex flex-row py-3 px-2 justify-start items-start"}
            onClick={handleOnclick}
        >
            {IconComponent && (
                <div className={"flex flex-col justify-center items-center mr-2"} >
                    <IconComponent size={20} color={"rgba(6,15,33, 1)"} />
                </div>
            )}
            <div>
                <p className={"text-sm font-medium"}>
                    {main_text || ""}
                </p>
                <p className={"text-xs font-normal text-textGrey"}>
                    {secondary_text || ""}
                </p>
            </div>
        </div>
    );
};

const FieldComponent = ({
    field: { name, value = "", onChange, onBlur }, 
    form: { touched, errors, setFieldValue },
    type = "text",
    uClasses = '',
    showLabel = true,
    autoFocus = false,
    label = "",
    format,
    IconComponent = null,
    onInputChanged,
    onItemSelected,
    showError=true,
    placeholder,
    mainText,
    valueProp,
    subText,
    ItemComponent = AutoCompleteItem,
    ItemIconComponent = LocationIcon,
    options = [],
    ...props
}) => {
    const [showOptions, setShowOptions] = React.useState(false);
    const fieldRef = React.useRef();

    const windowEventListener = (event) => {
        if (fieldRef && fieldRef.current && !fieldRef.current.contains(event.target)) {
            // alert("You clicked outside of me!");
            console.log("click window event")
            setShowOptions(false);
        }
        if (fieldRef && fieldRef.current && fieldRef.current.contains(event.target)) {
            // alert("You clicked outside of me!");
            setShowOptions(true);
        }
    };

    React.useState(() => {
        document.addEventListener("mousedown", windowEventListener);
        return () =>  document.removeEventListener("mousedown", windowEventListener);
    },[])

   
        

    // Highlight input field because of errors.
    const hasErrors = touched[name] && errors[name];

    const _formatValue = (val) => {
        return format ? format(val) : val;
    };

    const handleInputChanged = (e) => {
        const v = e.target.value;
        onChange(e);
        onInputChanged && onInputChanged(v);
    };

    const handleFocus = (e) => {
        setShowOptions(true);
    };

    const handleBlur = (e) => {
        onBlur(e);
    };

    

    return (
        <div ref={fieldRef} id={"autocomplete-box"} className={`w-full relative flex flex-col`} >
            {showLabel ? (
                <Label labelText={label} />
          
            ) : null}
            <input
                name={name}
                value={_formatValue(value)}
                onChange={handleInputChanged}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                type={type}
                // onClick={() => setShowOptions(true)}
                className="flex-1 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none shadow-sm border-gray-300"
            />
            {IconComponent && <IconComponent />}
            {showError && <ErrorMessage name={name} component={ErrorText} />}
            {showOptions && options && options.length > 0 && (
                <AutoCompleteChoice>
                    {options.map((item, idx) => (
                        <ItemComponent key={idx} mainText={mainText} subText={subText} setShowOptions={setShowOptions} item={item} onClick={(elem) => onItemSelected(elem)}/>
                    ))}
                </AutoCompleteChoice>
            )}
        </div>
    );
    

}
const AutoInput = ({ name, type, validate, ...props }) => {
    return <Field name={name} component={FieldComponent}  type={type} validate={validate} {...props}  />;
};

export default AutoInput;